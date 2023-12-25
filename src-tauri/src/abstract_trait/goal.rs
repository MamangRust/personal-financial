use crate::{models::Goal, utils::AppError};
use async_trait::async_trait;
use chrono::NaiveDate;
use sqlx::Error;
use std::sync::Arc;


pub type DynGoalRepository = Arc<dyn GoalRepositoryTrait + Send + Sync>;
pub type DynGoalService = Arc<dyn GoalServiceTrait + Send + Sync>;

#[async_trait]
pub trait GoalRepositoryTrait{
    async fn sum_goal(&self, user_id: i64) -> Result<Option<f64>, Error>;
    async fn find_all(&self, user_id: i64) ->  Result<Vec<Goal>, Error>;
    async fn find_by_id(&self, user_id: i64,goal_id: i64) -> Result<Option<Goal>, Error>;
    async fn create(
        &self,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<(), Error>;
    async fn update(
        &self,
        goal_id: i64,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
        current_amount: Option<f64>,
    ) -> Result<(), Error>;
    async fn delete(&self, user_id: i64,goal_id: i64) -> Result<(), Error>;

}

#[async_trait]
pub trait GoalServiceTrait{
    async fn sum_goal(&self, user_id: i64) -> Result<Option<f64>, AppError>;
    async fn find_all(&self, user_id: i64) ->  Result<Vec<Goal>, AppError>;
    async fn find_by_id(&self, user_id: i64,goal_id: i64) -> Result<Option<Goal>, AppError>;
    async fn create(
        &self,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<(), AppError>;
    async fn update(
        &self,
        goal_id: i64,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
        current_amount: Option<f64>,
    ) -> Result<(), AppError>;
    async fn delete(&self, user_id: i64,goal_id: i64) -> Result<(), AppError>;

}