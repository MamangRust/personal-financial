use crate::{abstract_trait::{DynUserRepository, AuthServiceTrait}, config::{Hashing, JwtConfig}, models::User, utils::AppError};
use async_trait::async_trait;
use anyhow::Result;



pub struct AuthService{
    repository: DynUserRepository,
    hashing: Hashing,
    jwt_config: JwtConfig
}




impl AuthService{
    pub fn new(repository: DynUserRepository, hashing: Hashing, jwt_config: JwtConfig) -> Self{
        Self { repository, hashing, jwt_config }
    }
}

#[async_trait]
impl AuthServiceTrait for AuthService{
    async fn register_user(&self, name: &str, email: &str, password: &str) -> Result<User, AppError> {
        let exists = match self.repository.find_by_email_exists(email).await {
            Ok(exists) => exists,
            Err(err) => return Err(err.into()),
        };

        if exists {
            return Err(AppError::EmailAlreadyExists);
        }
        
        let job = "lorem";
        let description = "Lorem";

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

    async fn login_user(&self, email: &str, password: &str) -> Result<String, AppError> {
        let user = match self.repository.find_by_email(email).await {
            Ok(user) => user,
            Err(err) => return Err(err.into()),
        };
    
        if let Some(user) = user {
            match self.hashing.compare_password(&user.password, password).await {
                Ok(_) => {
                   
                    self.jwt_config.generate_token(user.user_id)
                }
                Err(_) => return Err(AppError::InvalidCredentials),
            }
        } else {
            Err(AppError::UserNotFound)
        }
    }
    

    fn verify_token(&self,token: &str) -> Result<i64, AppError> {
        self.jwt_config.verify_token(token)
    }
}