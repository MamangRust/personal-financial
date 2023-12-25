use crate::{
    config::AppState, middleware::auth_token_middleware, models::Category, utils::AppError,
};
use anyhow::Result;
use tauri::State;
use tracing::info;

#[tauri::command]
pub async fn find_all_categories(
    state: State<'_, AppState>,
    token: String,
) -> Result<Vec<Category>, AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
            info!("Mengambil daftar semua category dari database");
            let category = state.category_service.find_all_categories(user_id).await?;
            Ok(category)
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn find_category_by_id(
    state: State<'_, AppState>,
    token: String,
    category_id: i64,
) -> Result<Option<Category>, AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
            info!("Mencari kategori berdasarkan ID: {}", category_id);

            let category = state
                .category_service
                .find_category_by_id(user_id,category_id)
                .await?;

            Ok(category)
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn create_category(
    state: State<'_, AppState>,
    token: String,
    
    category_name: &str,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
            info!(
                "Membuat kategori baru: user_id: {}, category_name: {}",
                user_id, category_name
            );

            state
                .category_service
                .create_category(user_id, &category_name)
                .await
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn update_category(
    state: State<'_, AppState>,
    token: String,
    category_id: i64,
    new_name: &str,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(_) => {
            info!(
                "Mengupdate kategori: category_id: {}, new_name: {}",
                category_id, new_name
            );

            state
                .category_service
                .update_category_name(category_id, new_name)
                .await
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn delete_category(state: State<'_, AppState>, token: String ,category_id: i64) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
            info!("Menghapus kategori dengan ID: {}", category_id);

            state.category_service.delete_category(user_id,category_id).await
        }
        Err(err) => Err(err.into()),
    }
    
}
