use crate::{models::User, utils::AppError};
use anyhow::Result;
use async_trait::async_trait;
use sqlx::Error;

use std::sync::Arc;

pub type DynUserRepository = Arc<dyn UserRepositoryTrait + Send + Sync>;

pub type DynUserService = Arc<dyn UserServiceTrait + Send + Sync>;
pub type DynAuthService = Arc<dyn AuthServiceTrait + Send + Sync>;

#[async_trait]
pub trait UserRepositoryTrait {
    async fn find_by_email_exists(&self, email: &str) -> Result<bool, Error>;
    async fn find_all(&self) -> Result<Vec<User>, Error>;
    async fn create_user(
        &self,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<User, Error>;
    async fn find_by_email(&self, email: &str) -> Result<Option<User>, Error>;
    async fn find_by_id(&self, id: i32) -> Result<Option<User>, Error>;
    async fn update_user(
        &self,
        user_id: i64,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<Option<User>, Error>;
    async fn delete_user(&self, id: i64) -> Result<bool, Error>;
}

#[async_trait]
pub trait UserServiceTrait {
    async fn find_all(&self) -> Result<Vec<User>, AppError>;
    async fn create_user(
        &self,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<User, AppError>;
    async fn find_by_id(&self, id: i32) -> Result<Option<User>, AppError>;
    async fn update_user(
        &self,
        user_id: i64,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<Option<User>, AppError>;
    async fn delete_user(&self, id: i64) -> Result<bool, AppError>;
}

#[async_trait]
pub trait AuthServiceTrait {
    async fn register_user(
        &self,
        name: &str,
        email: &str,
        password: &str,
    ) -> Result<User, AppError>;
    async fn login_user(&self, email: &str, password: &str) -> Result<String, AppError>;
    fn verify_token(&self, token: &str) -> Result<i64, AppError>;
}
