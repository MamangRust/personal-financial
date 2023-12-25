use crate::{abstract_trait::GoalRepositoryTrait, config::ConnectionPool, models::Goal};
use anyhow::Result;
use async_trait::async_trait;
use chrono::NaiveDate;
use sqlx::Error;

#[derive(Clone)]
pub struct GoalRepository {
    pub db_pool: ConnectionPool,
}

impl GoalRepository {
    pub fn new(db_pool: ConnectionPool) -> Self {
        Self { db_pool }
    }
}

#[async_trait]
impl GoalRepositoryTrait for GoalRepository {
    async fn sum_goal(&self, user_id: i64) -> Result<Option<f64>, Error> {
        let query = "
            SELECT CAST(SUM(target_amount) AS REAL) AS total_amount
            FROM goals
            WHERE user_id = $1;
        ";

        let total_amount: (Option<f64>,) = sqlx::query_as(query)
            .bind(user_id)
            .fetch_optional(&self.db_pool)
            .await?
            .unwrap_or((None,));

        Ok(total_amount.0)
    }

    async fn find_all(&self, user_id: i64) -> Result<Vec<Goal>, Error> {
        let goals = sqlx::query_as::<_, Goal>(
            "SELECT * FROM goals WHERE user_id = ?"
        )
        .bind(user_id)
        .fetch_all(&self.db_pool)
        .await?;
    
        Ok(goals)
    }

    async fn find_by_id(&self, user_id: i64, goal_id: i64) -> Result<Option<Goal>, Error> {
        let goal =
            sqlx::query_as::<_, Goal>("SELECT * FROM goals WHERE goal_id = ? AND user_id = ?")
                .bind(goal_id)
                .bind(user_id)
                .fetch_optional(&self.db_pool)
                .await?;

        Ok(goal)
    }

    async fn create(
        &self,
        user_id: i64,
        goal_name: Option<String>,
        target_amount: Option<f64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<(), Error> {
        sqlx::query(
            "INSERT INTO goals (user_id, goal_name, target_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(user_id)
        .bind(goal_name)
        .bind(target_amount)
        .bind(start_date)
        .bind(end_date)
        .execute(&self.db_pool)
        .await?;

        Ok(())
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
    ) -> Result<(), Error> {
        sqlx::query(
            "UPDATE goals SET user_id = ?, goal_name = ?, target_amount = ?, start_date = ?, end_date = ?, current_amount = ? WHERE goal_id = ?",
        )
        .bind(user_id)
        .bind(goal_name)
        .bind(target_amount)
        .bind(start_date)
        .bind(end_date)
        .bind(current_amount)
        .bind(goal_id)
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn delete(&self, user_id: i64, goal_id: i64) -> Result<(), Error> {
        sqlx::query("DELETE FROM goals WHERE goal_id = ? AND user_id = ?")
            .bind(goal_id)
            .bind(user_id)
            .execute(&self.db_pool)
            .await?;

        Ok(())
    }
}
