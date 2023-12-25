use crate::{config::JwtConfig, utils::AppError};



pub fn auth_token_middleware(jwt_config: &JwtConfig, token: &str) -> Result<i64, AppError> {
    match jwt_config.verify_token(token) {
        Ok(e) => Ok(e),
        Err(AppError::TokenExpiredError) => Err(AppError::TokenExpiredError),
        Err(_) => Err(AppError::TokenValidationError), 
    }
}