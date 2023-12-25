use std::collections::HashMap;

use crate::{config::ConnectionPool, abstract_trait::TransactionRepositoryTrait, models::{Transaction, TransactionType}, utils::AppError, dto::{CategoryTransactionCount, TransactionRelation}};
use async_trait::async_trait;
use chrono::Utc;
use sqlx::{Error, Row};
use anyhow::Result;

use tracing::{error, info};

#[derive(Clone)]
pub struct TransactionRepository{
    pub db_pool: ConnectionPool
}


impl TransactionRepository{
    pub fn new(db_pool: ConnectionPool) -> Self{
        Self { db_pool }
    }
}


#[async_trait]
impl TransactionRepositoryTrait for TransactionRepository{

    async fn sum_transaction(&self, user_id: i64) -> Result<Option<f64>, Error> {
        let query = "
            SELECT CAST(SUM(amount) AS REAL) AS total_amount
            FROM `transaction`
            WHERE user_id = $1;
        ";
    
        let total_amount: (Option<f64>,) = sqlx::query_as(query)
            .bind(user_id)
            .fetch_optional(&self.db_pool)
            .await?
            .unwrap_or((None,));
    
        Ok(total_amount.0)
    }

    async fn calculate_yearly_revenue(&self, user_id: i64) -> Result<HashMap<u32, f64>, Error> {
        let mut yearly_revenue = HashMap::new();

        for month in 1..=12 {
            let query = "
                SELECT COALESCE(SUM(amount), 0) as total_revenue
                FROM `transaction`
                WHERE strftime('%m', created_at) = $1 AND user_id = $2;
            ";

            let query_result: (Option<i64>,) = sqlx::query_as(query)
                .bind(format!("{:02}", month))
                .bind(user_id)
                .fetch_optional(&self.db_pool)
                .await?
                .unwrap_or((None,));

            let total_revenue = query_result.0.map(|val| val as f64).unwrap_or(0.0);

            yearly_revenue.insert(month, total_revenue);
        }

        Ok(yearly_revenue)
    }
    

    async fn get_categories_with_transaction_counts(&self, user_id: i64) -> Result<Vec<CategoryTransactionCount>, Error> {
        let results = sqlx::query!(
            "SELECT c.category_name, COUNT(t.category_id) as total_transactions
            FROM categories c
            LEFT JOIN `transaction` t ON c.category_id = t.category_id
            WHERE t.user_id = ?
            GROUP BY c.category_id, c.category_name", user_id
        )
        .fetch_all(&self.db_pool)
        .await?;
        
        let mut categories_with_counts = Vec::new();
        
        for row in results {
            let category_name = row.category_name;
            let total_transactions = row.total_transactions;
        
            let category_transaction_count = CategoryTransactionCount {
                category_name,
                total_transactions,
            };
        
            categories_with_counts.push(category_transaction_count);
        }
        
        Ok(categories_with_counts)
    }

    async fn find_all(&self, user_id: i64) -> Result<Vec<TransactionRelation>, Error> {
        let transactions = sqlx::query(
            "SELECT t.*, c.category_name, a.account_name 
             FROM `transaction` t
             LEFT JOIN categories c ON t.category_id = c.category_id
             LEFT JOIN accounts a ON t.account_id = a.account_id
             WHERE t.user_id = ?"
        )
        .bind(user_id)
        .fetch_all(&self.db_pool)
        .await?;
    
        let mut result = Vec::new();
    
        for row in transactions {
            let transaction = TransactionRelation {
                transaction_id: row.get("transaction_id"),
                user_id: row.get("user_id"),
                transaction_date: row.get("transaction_date"),
                description: row.get("description"),
                amount: row.get("amount"),
                transaction_type: row.get("transaction_type"),
                category_name: row.get("category_name"),
                account_name: row.get("account_name"),
                location: row.get("location"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
    
            result.push(transaction);
        }

        info!("Mencoba: {:?}", result);
    
        Ok(result)
    }

    
    
    
    

    async fn find_by_id(&self, user_id: i64,transaction_id: i64) -> Result<Option<Transaction>, Error> {
        let transaction = sqlx::query_as::<_, Transaction>(
            "SELECT transaction_id, user_id, account_id, transaction_date, description, amount, transaction_type, category_id, location, created_at, updated_at 
             FROM `transaction` 
             WHERE transaction_id = ? AND user_id = ?"
        )
        .bind(transaction_id)
        .bind(user_id)
        .fetch_optional(&self.db_pool)
        .await?;
    
        Ok(transaction)
    }
    

    async fn create(
        &self,
        user_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError> {
        let created_at = Utc::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
        
        let transaction_date = Utc::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
        let updated_at = Utc::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
    
        let transaction = match parse_transaction_type(&transaction_type) {
            Some(transaction_type_) => transaction_type_.to_string(),
            None => return Err(AppError::InvalidTransactionType),
        };
    
        if let Err(err) = sqlx::query(
            "INSERT INTO `transaction` (user_id, account_id, transaction_date, description, amount, transaction_type, category_id, location, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(user_id)
        .bind(account_id)
        .bind(transaction_date)
        .bind(description)
        .bind(amount)
        .bind(&transaction)
        .bind(category_id)
        .bind(location)
        .bind(created_at)
        .bind(updated_at)
        .execute(&self.db_pool)
        .await
        {
            error!("Failed to insert transaction: {}", err);
            return Err(AppError::SqlxError(err.into()));
        }
    
        Ok(())
    }

   
    
    
    async fn update(
        &self,
        user_id: i64,
        transaction_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError> {
        let transaction_date = Utc::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
        let updated_at = Utc::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
    
        let parsed_transaction_type = match parse_transaction_type(&transaction_type) {
            Some(parsed_type) => parsed_type.to_string(),
            None => return Err(AppError::InvalidTransactionType),
        };
    
        sqlx::query(
            "UPDATE `transaction` SET user_id = ?, account_id = ?, transaction_date = ?, description = ?, amount = ?, transaction_type = ?, category_id = ?, location = ?, updated_at = ? WHERE transaction_id = ?"
        )
        .bind(user_id)
        .bind(account_id)
        .bind(transaction_date)
        .bind(description)
        .bind(amount)
        .bind(parsed_transaction_type) 
        .bind(category_id)
        .bind(location)
        .bind(updated_at)
        .bind(transaction_id)
        .execute(&self.db_pool)
        .await?;
    
        Ok(())
    }
    

    async fn delete(&self, user_id: i64,transaction_id: i64) -> Result<(), Error> {
        sqlx::query(
            "DELETE FROM `transaction` WHERE transaction_id = ? AND user_id = ?"
        )
        .bind(transaction_id)
        .bind(user_id)
        .execute(&self.db_pool)
        .await?;
    
        Ok(())
    }
}

fn parse_transaction_type(transaction_type: &str) -> Option<TransactionType> {
    match transaction_type {
        "income" => Some(TransactionType::Income),
        "expense" => Some(TransactionType::Expense),
        "transfer" => Some(TransactionType::Transfer),
        _ => None,
    }
}
