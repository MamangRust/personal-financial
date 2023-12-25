use std::collections::HashMap;

use crate::{abstract_trait::{DynTransactionRepository,  TransactionServiceTrait}, models::Transaction, utils::AppError, dto::{CategoryTransactionCount, TransactionRelation}};
use async_trait::async_trait;
use anyhow::Result;

pub struct TransactionService{
    repository: DynTransactionRepository,
}

impl TransactionService{
    pub fn new(repository: DynTransactionRepository) -> Self{
        Self { repository }
    }
}

#[async_trait]
impl TransactionServiceTrait for TransactionService {
    async fn sum_transaction(&self, user_id: i64) -> Result<Option<f64>, AppError>{
        match self.repository.sum_transaction(user_id).await{
            Ok(e) => Ok(e),
            Err(err) => Err(err.into())
        }
    }

    async fn get_categories_with_transaction_counts(&self, user_id: i64) -> Result<Vec<CategoryTransactionCount>, AppError>{
        match  self.repository.get_categories_with_transaction_counts(user_id).await{
            Ok(e) => Ok(e),
            Err(err) => Err(err.into())
        }
    }

    async fn calculate_yearly_revenue(&self, user_id: i64) -> Result<HashMap<u32, f64>, AppError>{
        match self.repository.calculate_yearly_revenue(user_id).await{
            Ok(e) => Ok(e),
            Err(err) => Err(err.into()),
        }
    }

    async fn find_all(&self, user_id: i64) -> Result<Vec<TransactionRelation>, AppError> {
        match self.repository.find_all(user_id).await {
            Ok(transactions) => Ok(transactions),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn find_by_id(&self, user_id: i64,transaction_id: i64) -> Result<Option<Transaction>, AppError>{
        match self.repository.find_by_id(user_id,transaction_id).await{
            Ok(e) => Ok(e),
            Err(err) => Err(AppError::SqlxError(err.into()))
        }
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
        match self.repository
            .create(user_id, account_id, description, amount, transaction_type, category_id, location)
            .await{
                Ok(()) => Ok(()),
                Err(_) => Err(AppError::TransactionNotCreate)
            }
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
        
        match self.repository
            .update(transaction_id, user_id, account_id, description, amount, transaction_type, category_id, location)
            .await{
            Ok(()) => Ok(()),
            Err(_) => Err(AppError::TransactionNotFound)

            
        }
    }

    async fn delete(&self, user_id: i64,transaction_id: i64) -> Result<(), AppError> {
        match self.repository.delete(user_id,transaction_id).await{
            Ok(()) => Ok(()),
            Err(err) => Err(AppError::SqlxError(err.into()))
        }
    }
}