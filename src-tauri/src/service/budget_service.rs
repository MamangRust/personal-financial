use crate::{abstract_trait::{DynBudgetRepository, BudgetServiceTrait}, models::Budget, utils::AppError, dto::BudgetRelation};
use async_trait::async_trait;
use anyhow::Result;
use chrono::NaiveDate;

pub struct BudgetService{
    repository: DynBudgetRepository
}

impl BudgetService{
    pub fn new(repository: DynBudgetRepository) -> Self{
        Self{
            repository
        }
    }
}


#[async_trait]
impl BudgetServiceTrait for BudgetService{
    async fn sum_budget(&self, user_id: i64) -> Result<Option<f64>, AppError> {
        match self.repository.sum_budget(user_id).await{
            Ok(e) => Ok(e),
            Err(err) => Err(err.into())
        }
    }
    async fn find_all(&self, user_id: i64) -> Result<Vec<BudgetRelation>, AppError> {
        match self.repository.find_all(user_id).await {
            Ok(budgets) => Ok(budgets),
            Err(err) => Err(err.into()),
        }
    }

    async fn find_by_id(&self, user_id: i64,budget_id: i64) -> Result<Option<Budget>, AppError> {
        match self.repository.find_by_id(user_id,budget_id).await {
            Ok(budget) => Ok(budget),
            Err(err) => Err(err.into()),
        }
    }

    async fn create(&self, user_id: i64, category_id: i64, amount: f64, start_date: NaiveDate, end_date: NaiveDate) -> Result<(), AppError> {
        match self.repository.create(user_id, category_id, amount, start_date, end_date).await{
            Ok(()) => Ok(()),
            Err(err) => Err(err.into())
        }
    }

    async fn update(&self, budget_id: i64 ,user_id: i64, category_id: i64, amount: f64, start_date: NaiveDate, end_date: NaiveDate) -> Result<(), AppError> {
        match self.repository.update(budget_id,user_id, category_id, amount, start_date, end_date).await{
            Ok(()) => Ok(()),
            Err(err) => Err(err.into())
        }
    }

    async fn delete(&self, user_id: i64,budget_id: i64) -> Result<(), AppError> {
       match self.repository.delete(user_id,budget_id).await{
            Ok(()) => Ok(()),
            Err(err) => Err(err.into())
       }
    }
}