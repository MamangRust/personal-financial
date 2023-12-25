use crate::config::AppState;
use crate::dto::{CreateUserResponse, DeleteUserResponse, UpdateUserResponse};
use crate::models::User;
use crate::utils::AppError;
use anyhow::Result;
use tauri::State;
use tracing::info;

#[tauri::command]
pub async fn create_user(
    state: State<'_, AppState>,
    name: String,
    email: String,
    password: String,
    job: String,
    description: String,
) -> Result<CreateUserResponse, AppError> {
    let user = state
        .user_service
        .create_user(&name, &email, &password, &job, &description)
        .await?;

    let response = CreateUserResponse { user };

    Ok(response)
}

#[tauri::command]
pub async fn find_all_user(state: State<'_, AppState>) -> Result<Vec<User>, AppError> {
    let user = state.user_service.find_all().await?;

    Ok(user)
}

#[tauri::command]
pub async fn find_by_id_user(
    state: State<'_, AppState>,
    id: i32,
) -> Result<Option<User>, AppError> {
    state.user_service.find_by_id(id).await
}

#[tauri::command]
pub async fn update_user(
    state: State<'_, AppState>,
    user_id: i64,
    name: String,
    email: String,
    password: String,
    job: String,
    description: String,
) -> Result<UpdateUserResponse, AppError> {
    let user = state
        .user_service
        .update_user(user_id, &name, &email, &password, &job, &description)
        .await?;

    info!(
        "User ID: {}, Email: {}, Name: {}, Password: {}, Job: {}, Description: {}",
        user_id, email, name, password, job, description
    );

    let response = UpdateUserResponse { user };

    Ok(response)
}

#[tauri::command]
pub async fn delete_user(
    state: State<'_, AppState>,
    id: i64,
) -> Result<DeleteUserResponse, AppError> {
    let result = state.user_service.delete_user(id).await?;

    let response = DeleteUserResponse { success: result };
    Ok(response)
}
