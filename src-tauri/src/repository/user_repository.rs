use crate::{config::ConnectionPool, abstract_trait::UserRepositoryTrait};
use async_trait::async_trait;
use chrono::Utc;
use sqlx::Error;
use anyhow::Result;
use tracing::info;
use crate::models::User;

#[derive(Clone)]
pub struct UserRepository{
    pub db_pool: ConnectionPool,
}

impl UserRepository{
    pub fn new(db_pool: ConnectionPool) -> Self{
        Self { db_pool }
    }
}

#[async_trait]
impl UserRepositoryTrait for UserRepository{
    async fn find_by_email_exists(&self, email: &str) -> Result<bool, Error> {
        let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM user WHERE email = $1)")
            .bind(email)
            .fetch_one(&self.db_pool)
            .await?;
        Ok(exists)
    }

    async fn find_all(&self) -> Result<Vec<User>, Error> {
        let users: Vec<User> = sqlx::query_as::<_, User>("SELECT * FROM user")
            .fetch_all(&self.db_pool)
            .await?;
        Ok(users)
    }

    async fn create_user(
        &self,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<User, Error> {
        let created_at = Utc::now().to_rfc3339();
        let updated_at = Utc::now().to_rfc3339();
        
        let query_result = sqlx::query_as::<_, User>(
            "INSERT INTO user (name, email, password, job, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(name)
        .bind(email)
        .bind(password)
        .bind(job)
        .bind(description)
        .bind(created_at)
        .bind(updated_at) 
        .fetch_one(&self.db_pool)
        .await?;
        
        Ok(query_result)
    }


    async fn find_by_email(&self, email: &str) -> Result<Option<User>, Error> {
        let query_result = sqlx::query_as::<_, User>("SELECT * FROM user WHERE email = $1")
            .bind(email)
            .fetch_optional(&self.db_pool)
            .await?;
        Ok(query_result)
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<User>, Error> {
        let query_result = sqlx::query_as::<_, User>("SELECT * FROM user WHERE user_id = $1")
            .bind(id)
            .fetch_optional(&self.db_pool)
            .await?;
        Ok(query_result)
    }

    async fn update_user(
        &self,
        user_id: i64,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<Option<User>, Error> {
        let updated_at = Utc::now().to_rfc3339();


        info!("User ID: {}, Email: {}, Name: {}, Password: {}, Job: {}, Description: {}", user_id, email, name, password, job, description);
    
        let query_result = sqlx::query_as::<_, User>(
            "UPDATE user SET name = $1, email = $2, password = $3, job = $4, description = $5, updated_at = $6 WHERE user_id = $7 RETURNING *",
        )
        .bind(name)
        .bind(email)
        .bind(password)
        .bind(job)
        .bind(description)
        .bind(updated_at)
        .bind(user_id)
        .fetch_optional(&self.db_pool)
        .await?;
    
        Ok(query_result)
    }
    

    async fn delete_user(&self, id: i64) -> Result<bool, Error> {
        let result = sqlx::query!("DELETE FROM user WHERE user_id = $1", id)
            .execute(&self.db_pool)
            .await?;
        Ok(result.rows_affected() > 0)
    }
}