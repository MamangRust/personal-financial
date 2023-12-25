use crate::{
    abstract_trait::BudgetRepositoryTrait, config::ConnectionPool, dto::BudgetRelation,
    models::Budget,
};
use anyhow::Result;
use async_trait::async_trait;
use chrono::NaiveDate;
use sqlx::{Error, Row};

#[derive(Clone)]
pub struct BudgetRepository {
    pub db_pool: ConnectionPool,
}

impl BudgetRepository {
    pub fn new(db_pool: ConnectionPool) -> Self {
        Self { db_pool }
    }
}

#[async_trait]
impl BudgetRepositoryTrait for BudgetRepository {
    async fn sum_budget(&self, user_id: i64) -> Result<Option<f64>, Error> {
        let query = "
            SELECT CAST(SUM(amount) AS REAL) AS total_amount
            FROM budgets
            WHERE user_id = $1;
        ";

        let total_amount: (Option<f64>,) = sqlx::query_as(query)
            .bind(user_id)
            .fetch_optional(&self.db_pool)
            .await?
            .unwrap_or((None,));

        Ok(total_amount.0)
    }

    async fn find_all(&self, user_id: i64) -> Result<Vec<BudgetRelation>, Error> {
        let budgets_with_categories = sqlx::query(
            "SELECT budgets.*, categories.category_name AS category_name
            FROM budgets
            INNER JOIN categories ON budgets.category_id = categories.category_id
            WHERE budgets.user_id = ?",
        )
        .bind(user_id)
        .fetch_all(&self.db_pool)
        .await?;
    
        let mut result = Vec::new();
    
        for row in budgets_with_categories {
            let budget_relation = BudgetRelation {
                budget_id: row.get("budget_id"),
                user_id: row.get("user_id"),
                category_name: row.get("category_name"),
                amount: row.get("amount"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
    
            result.push(budget_relation);
        }
    
        Ok(result)
    }

    async fn find_by_id(&self, user_id: i64, budget_id: i64) -> Result<Option<Budget>, Error> {
        let budget = sqlx::query_as::<_, Budget>(
            "SELECT * FROM budgets WHERE budget_id = ? AND user_id = ?",
        )
        .bind(budget_id)
        .bind(user_id)
        .fetch_optional(&self.db_pool)
        .await?;

        Ok(budget)
    }

    async fn create(
        &self,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), Error> {
        sqlx::query(
            "INSERT INTO budgets (user_id, category_id, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(user_id)
        .bind(category_id)
        .bind(amount)
        .bind(start_date)
        .bind(end_date)
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn update(
        &self,
        budget_id: i64,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), Error> {
        sqlx::query(
            "UPDATE budgets SET user_id = ?, category_id = ?, amount = ?, start_date = ?, end_date = ? WHERE budget_id = ?"
        )
        .bind(user_id)
        .bind(category_id)
        .bind(amount)
        .bind(start_date)
        .bind(end_date)
        .bind(budget_id)
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn delete(&self, user_id: i64, budget_id: i64) -> Result<(), Error> {
        sqlx::query("DELETE FROM budgets WHERE budget_id = ? AND user_id = ?")
            .bind(budget_id)
            .bind(user_id)
            .execute(&self.db_pool)
            .await?;

        Ok(())
    }
}
