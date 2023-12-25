use crate::config::AppState;
use crate::dto::{LoginResponse, RegisterResponse};
use crate::utils::AppError;
use anyhow::Result;
use tauri::State;
use tracing::info;

#[tauri::command]
pub async fn register_user(state: State<'_, AppState>, name: String,email: String, password: String) -> Result<RegisterResponse, AppError>{
    let user= state.auth_service.register_user(&name, &email, &password).await?;

    info!("Name: {}, Email: {}, Password: {}", name, email, password);

    info!("Register User: {:#?}", user);

    let response = RegisterResponse{
        user
    };

    Ok(response)
}

#[tauri::command]
pub async fn login_user(state: State<'_, AppState>, email: String, password: String) -> Result<LoginResponse, AppError>{
    let user = state.auth_service.login_user(&email, &password).await?;

    info!("Login {}", user);

    let response = LoginResponse{ token: user};

    Ok(response)
}

#[tauri::command]
pub async fn verify_token(state: State<'_, AppState>, token: String) -> Result<i64, AppError>{
    state.auth_service.verify_token(&token)
}