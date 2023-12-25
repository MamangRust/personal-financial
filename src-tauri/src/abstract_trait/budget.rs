use crate::{models::Budget, utils::AppError, dto::BudgetRelation};
use async_trait::async_trait;
use chrono::NaiveDate;
use sqlx::Error;
use std::sync::Arc;

pub type DynBudgetRepository = Arc<dyn BudgetRepositoryTrait + Send + Sync>;
pub type DynBudgetService = Arc<dyn BudgetServiceTrait + Send + Sync>;

#[async_trait]
pub trait BudgetRepositoryTrait {
    async fn sum_budget(&self, user_id: i64) -> Result<Option<f64>, Error>;
    async fn find_all(&self, user_id: i64) -> Result<Vec<BudgetRelation>, Error>;
    async fn find_by_id(&self, user_id: i64,budget_id: i64) -> Result<Option<Budget>, Error>;
    async fn create(
        &self,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), Error>;
    async fn update(
        &self,
        budget_id: i64,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), Error>;
    async fn delete(&self, user_id: i64,budget_id: i64) -> Result<(), Error>;
}

#[async_trait]
pub trait BudgetServiceTrait {
    async fn sum_budget(&self, user_id: i64) -> Result<Option<f64>, AppError>; 
    async fn find_all(&self, user_id: i64) -> Result<Vec<BudgetRelation>, AppError>;
    async fn find_by_id(&self, user_id: i64,budget_id: i64) -> Result<Option<Budget>, AppError>;
    async fn create(
        &self,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), AppError>;
    async fn update(
        &self,
        budget_id: i64,
        user_id: i64,
        category_id: i64,
        amount: f64,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<(), AppError>;
    async fn delete(&self, user_id: i64,budget_id: i64) -> Result<(), AppError>;
}
