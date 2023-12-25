use std::{sync::Arc, collections::HashMap};

use crate::{
    models::Transaction,
    utils::AppError, dto::{CategoryTransactionCount, TransactionRelation},
};
use async_trait::async_trait;
use sqlx::Error;


pub type DynTransactionRepository = Arc<dyn TransactionRepositoryTrait + Send + Sync>;
pub type DynTransactionService = Arc<dyn TransactionServiceTrait + Send + Sync>;


#[async_trait]
pub trait TransactionRepositoryTrait {
    async fn sum_transaction(&self, user_id: i64) -> Result<Option<f64>, Error>;
    async fn find_all(&self, user_id: i64) -> Result<Vec<TransactionRelation>, Error> ;
    async fn find_by_id(&self, user_id: i64,transaction_id: i64) -> Result<Option<Transaction>, Error>;
    async fn get_categories_with_transaction_counts(&self, user_id: i64) -> Result<Vec<CategoryTransactionCount>, Error>;
    async fn calculate_yearly_revenue(&self, user_id: i64) -> Result<HashMap<u32, f64>, Error>;
    async fn create(
        &self,
        user_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError>;
    async fn update(
        &self,
        transaction_id: i64,
        user_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError>;
    async fn delete(&self, user_id: i64,transaction_id: i64) -> Result<(), Error>;
}

#[async_trait]
pub trait TransactionServiceTrait {
    async fn sum_transaction(&self, user_id: i64) -> Result<Option<f64>, AppError>;
    async fn find_all(&self, user_id: i64) -> Result<Vec<TransactionRelation>, AppError> ;
    async fn find_by_id(
        &self,
        user_id: i64,
        transaction_id: i64,
    ) -> Result<Option<Transaction>, AppError>;
    async fn get_categories_with_transaction_counts(&self, user_id: i64) -> Result<Vec<CategoryTransactionCount>, AppError>;
    async fn calculate_yearly_revenue(&self, user_id: i64) -> Result<HashMap<u32, f64>, AppError>;
    async fn create(
        &self,
        user_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError>;
    async fn update(
        &self,
        transaction_id: i64,
        user_id: i64,
        account_id: i64,
        description: String,
        amount: f64,
        transaction_type: String,
        category_id: Option<i64>,
        location: Option<String>,
    ) -> Result<(), AppError>;
    async fn delete(&self, user_id: i64,transaction_id: i64) -> Result<(), AppError>;
}
