use crate::{models::Account, utils::AppError};
use async_trait::async_trait;
use sqlx::Error;
use std::sync::Arc;

pub type DynAccountRepository = Arc<dyn AccountRepositoryTrait + Send + Sync>;
pub type DynAccountService = Arc<dyn AccountServiceTrait + Send + Sync>;




#[async_trait]
pub trait AccountRepositoryTrait {
    async fn find_all(&self, user_id: i64) -> Result<Vec<Account>, Error>;
    async fn create_account(
        &self,
        user_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), Error>;

    async fn get_account_by_id(&self, user_id:i64,account_id: i64) -> Result<Option<Account>, Error>;

    async fn update_account(
        &self,
        account_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), Error>;

    async fn delete_account(&self, user_id:i64,account_id: i64) -> Result<(), Error>;
}


#[async_trait]
pub trait AccountServiceTrait {
    async fn find_all(&self, user_id: i64) -> Result<Vec<Account>, AppError>;

    async fn create_account(
        &self,
        user_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), AppError>;

    async fn get_account_by_id(&self, user_id: i64,account_id: i64) -> Result<Option<Account>, AppError>;

    async fn update_account(
        &self,
        account_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), AppError>;

    async fn delete_account(&self, user_id:i64, account_id: i64) -> Result<(), AppError>;
}

