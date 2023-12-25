use crate::{abstract_trait::{DynGoalRepository, GoalServiceTrait}, models::Goal, utils::AppError};
use async_trait::async_trait;
use anyhow::Result;
use chrono::NaiveDate;

pub struct GoalService{
    repository: DynGoalRepository,
}

impl GoalService{
    pub fn new(repository: DynGoalRepository) -> Self{
        Self { repository }
    }
}

#[async_trait]
impl GoalServiceTrait for GoalService{
    async fn sum_goal(&self, user_id: i64) -> Result<Option<f64>, AppError>{
        match self.repository.sum_goal(user_id).await{
            Ok(goals) => Ok(goals),
            Err(err) => Err(err.into())
        }
    }

    async fn find_all(&self, user_id: i64) -> Result<Vec<Goal>, AppError> {
        match self.repository.find_all(user_id).await {
            Ok(goals) => Ok(goals),
            Err(err) => Err(err.into()),
        }
    }

    async fn find_by_id(&self, user_id: i64,goal_id: i64) -> Result<Option<Goal>, AppError> {
        match self.repository.find_by_id(user_id,goal_id).await {
            Ok(goal) => Ok(goal),
            Err(err) => Err(err.into()),
        }
    }

    async fn create(
        &self,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<(), AppError> {
        match self
            .repository
            .create(user_id, goal_name, target_amount, start_date, end_date)
            .await
        {
            Ok(_) => Ok(()),
            Err(err) => Err(err.into()),
        }
    }

    async fn update(
        &self,
        goal_id: i64,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
        current_amount: Option<f64>,
    ) -> Result<(), AppError> {
        match self
            .repository
            .update(goal_id, user_id, goal_name, target_amount, start_date, end_date, current_amount)
            .await
        {
            Ok(_) => Ok(()),
            Err(err) => Err(err.into()),
        }
    }

    async fn delete(&self, user_id: i64,goal_id: i64) -> Result<(), AppError> {
        match self.repository.delete(user_id,goal_id).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err.into()),
        }
    }
}