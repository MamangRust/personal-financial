use std::collections::HashMap;

use crate::{
    config::AppState,
    dto::{CategoryTransactionCount, TransactionRelation},
    middleware::auth_token_middleware,
    models::Transaction,
    utils::AppError,
};
use anyhow::Result;
use tauri::State;
use tracing::info;

#[tauri::command]
pub async fn sum_transaction(
    state: State<'_, AppState>,
    token: &str,
) -> Result<Option<f64>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => state.transaction_service.sum_transaction(user_id).await,
        Err(err) => Err(err.into()),
    }
}


#[tauri::command]
pub async fn get_categories_with_transaction_counts(
    state: State<'_, AppState>,
    token: String,
) -> Result<Vec<CategoryTransactionCount>, AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
            info!("Mengambil daftar semua category dari database");

            state
                .transaction_service
                .get_categories_with_transaction_counts(user_id)
                .await
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn calculate_yearly_revenue(
    state: State<'_, AppState>,
    token: &str,
) -> Result<HashMap<u32, f64>, AppError> {

    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state.transaction_service.calculate_yearly_revenue(user_id).await
        }
        Err(err) => Err(err.into()),
    }

    
}

#[tauri::command]
pub async fn find_all_transaction(
    state: State<'_, AppState>,
    token: &str,
) -> Result<Vec<TransactionRelation>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!("Mencari semua transaksi");

            let transaction = state.transaction_service.find_all(user_id).await?;

            Ok(transaction)
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn find_transaction_by_id(
    state: State<'_, AppState>,
    token: &str,
    transaction_id: i64,
) -> Result<Option<Transaction>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!("Mencari transaksi berdasarkan ID: {}", transaction_id);
            state.transaction_service.find_by_id(user_id,transaction_id).await
        }
        Err(err) => Err(err.into()),
    }
}

#[tauri::command]
pub async fn create_transaction(
    state: State<'_, AppState>,
    token: &str,
    account_id: i64,
    description: String,
    amount: f64,
    transaction_type: String,
    category_id: Option<i64>,
    location: Option<String>,
) -> Result<(), AppError> {

    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!(
                "Membuat transaksi baru: user_id: {}, account_id: {}, description: {}, amount: {}, transaction_type: {}, category_id: {:?}, location: {:?}",
                user_id, account_id, description, amount, transaction_type, category_id, location
            );
            state
                .transaction_service
                .create(
                    user_id,
                    account_id,
                    description,
                    amount,
                    transaction_type,
                    category_id,
                    location,
                )
                .await
        }
        Err(err) => Err(err.into()),
    }
}


#[tauri::command]
pub async fn update_transaction(
    state: State<'_, AppState>,
    token: &str,
    transaction_id: i64,
    account_id: i64,
    description: String,
    amount: f64,
    transaction_type: String,
    category_id: Option<i64>,
    location: Option<String>,
) -> Result<(), AppError> {

    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!(
                "Mengupdate transaksi: transaction_id: {}, user_id: {}, account_id: {}, description: {}, amount: {}, transaction_type: {}, category_id: {:?}, location: {:?}",
                transaction_id, user_id, account_id, description, amount, transaction_type, category_id, location
            );
            state
                .transaction_service
                .update(
                    transaction_id,
                    user_id,
                    account_id,
                    description,
                    amount,
                    transaction_type,
                    category_id,
                    location,
                )
                .await
        }
        Err(err) => Err(err.into()),
    }

    
}

#[tauri::command]
pub async fn delete_transaction(
    state: State<'_, AppState>,
    token: &str,
    transaction_id: i64,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!("Menghapus transaksi dengan ID: {}", transaction_id);
            state
                .transaction_service
                .delete(user_id, transaction_id)
                .await
        }
        Err(err) => Err(err.into()),
    }
}
