use async_trait::async_trait;
use anyhow::Result;
use tracing::info;

use crate::{abstract_trait::{DynUserRepository, UserServiceTrait}, config::Hashing, models::User, utils::AppError};



pub struct UserService{
    repository: DynUserRepository,
    hashing: Hashing
}

impl UserService{
    pub fn new(repository: DynUserRepository, hashing: Hashing) -> Self{
        Self { repository, hashing }
    }
}

#[async_trait]
impl UserServiceTrait for UserService{
    async fn find_all(&self) -> Result<Vec<User>, AppError> {
        match self.repository.find_all().await {
            Ok(users) => Ok(users),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn create_user(
        &self,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<User, AppError> {
        let exists = match self.repository.find_by_email_exists(email).await {
            Ok(exists) => exists,
            Err(err) => return Err(err.into()),
        };

        if exists {
            return Err(AppError::EmailAlreadyExists);
        }

        let hashed_password = match self.hashing.hash_password(password).await {
            Ok(hashed) => hashed,
            Err(err) => return Err(AppError::HashingError(err)),
        };

        let create_user = match self.repository.create_user(name, email, &hashed_password, job, description).await {
            Ok(user) => user,
            Err(err) => return Err(err.into()),
        };

        Ok(create_user)
    }


    async fn find_by_id(&self, id: i32) -> Result<Option<User>, AppError> {
        match self.repository.find_by_id(id).await {
            Ok(user) => Ok(user),
            Err(err) => Err(AppError::SqlxError(err)),
        }
    }

    async fn update_user(
        &self,
        user_id: i64,
        name: &str,
        email: &str,
        password: &str,
        job: &str,
        description: &str,
    ) -> Result<Option<User>, AppError> {

        let hashed_password = match self.hashing.hash_password(password).await {
            Ok(hashed) => hashed,
            Err(err) => return Err(AppError::HashingError(err)),
        };

        info!("User ID: {}, Email: {}, Name: {}, Password: {}, Job: {}, Description: {}", user_id, email, name, password, job, description);


        match self.repository.update_user(user_id, name, email, &hashed_password, job, description).await {
            Ok(user) => Ok(user),
            Err(err) => Err(AppError::SqlxError(err)),
        }
    }

    async fn delete_user(&self, id: i64) -> Result<bool, AppError> {
        match self.repository.delete_user(id).await {
            Ok(result) => Ok(result),
            Err(err) => Err(AppError::SqlxError(err)),
        }
    }
}