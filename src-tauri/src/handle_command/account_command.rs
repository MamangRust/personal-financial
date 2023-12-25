use crate::models::Account;
use crate::utils::AppError;
use crate::{config::AppState, middleware::auth_token_middleware};
use anyhow::Result;
use tauri::{command, State};
use tracing::info;

#[command]
pub async fn find_all_accounts(
    state: State<'_, AppState>,
    token: String,
) -> Result<Vec<Account>, AppError> {
    match auth_token_middleware(&state.jwt_config, &token) {
        Ok(user_id) => {
        let accounts = state.account_service.find_all(user_id).await?;
            Ok(accounts)
        }
        Err(err) => Err(err.into()),
    }
}


#[command]
pub async fn find_account_by_id(
    state: State<'_, AppState>,
    token: &str,
    account_id: i64,
) -> Result<Option<Account>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!("Mencari akun berdasarkan ID: {}", account_id);
            let account = state
                .account_service
                .get_account_by_id(user_id, account_id)
                .await?;
            Ok(account)
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn create_account(
    state: State<'_, AppState>,
    token: &str,
    account_name: &str,
    balance: f64,
    currency: Option<&str>,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!(
                "Membuat akun baru: user_id: {}, account_name: {}, balance: {}, currency: {:?}",
                user_id, account_name, balance, currency
            );
            state
                .account_service
                .create_account(user_id, account_name, balance, currency)
                .await
        }
        Err(err) => Err(err.into()),
    }
}


#[command]
pub async fn update_account(
    state: State<'_, AppState>,
    token: &str,
    account_id: i64,
    account_name: &str,
    balance: f64,
    currency: Option<&str>,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(_) => {
            info!(
                "Mengupdate akun: account_id: {}, account_name: {}, balance: {}, currency: {:?}",
                account_id, account_name, balance, currency
            );
            state
                .account_service
                .update_account(account_id, account_name, balance, currency)
                .await?;
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn delete_account(
    state: State<'_, AppState>,
    token: &str,
    account_id: i64,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!("Menghapus akun dengan ID: {}", account_id);
            state.account_service.delete_account(user_id,account_id).await?;
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}
