use serde::Serialize;
use crate::models::User;


#[derive(Debug, Serialize)]
pub struct RegisterResponse {
    pub user: User,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse{
    pub token: String
}

#[derive(Debug, Serialize)]
pub struct CreateUserResponse {
    pub user: User,
}

#[derive(Debug, Serialize)]
pub struct UpdateUserResponse {
    pub user: Option<User>,
}

#[derive(Debug, Serialize)]
pub struct DeleteUserResponse {
    pub success: bool,
}