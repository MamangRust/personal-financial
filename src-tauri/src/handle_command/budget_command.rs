use crate::{
    config::AppState, dto::BudgetRelation, middleware::auth_token_middleware, models::Budget,
    utils::AppError,
};
use anyhow::Result;
use chrono::NaiveDate;
use tauri::{command, State};
use tracing::info;

#[command]
pub async fn sum_budget(state: State<'_, AppState>, token: &str) -> Result<Option<f64>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => state.budget_service.sum_budget(user_id).await,
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn find_all_budget(
    state: State<'_, AppState>,
    token: &str,
) -> Result<Vec<BudgetRelation>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            let budgets = state.budget_service.find_all(user_id).await?;
            info!("Mengambil semua data budget dari database");
            Ok(budgets)
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn find_budget_by_id(
    state: State<'_, AppState>,
    token: &str,
    budget_id: i64,
) -> Result<Option<Budget>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => state.budget_service.find_by_id(user_id, budget_id).await,
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn create_budget(
    state: State<'_, AppState>,
    token: &str,
    category_id: i64,
    amount: f64,
    start_date: NaiveDate,
    end_date: NaiveDate,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state
                .budget_service
                .create(user_id, category_id, amount, start_date, end_date)
                .await?;
            info!("Membuat budget baru");
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn update_budget(
    state: State<'_, AppState>,
    token: &str,
    budget_id: i64,
    category_id: i64,
    amount: f64,
    start_date: NaiveDate,
    end_date: NaiveDate,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state
                .budget_service
                .update(
                    budget_id,
                    user_id,
                    category_id,
                    amount,
                    start_date,
                    end_date,
                )
                .await?;
            info!("Mengupdate data budget dengan ID {}", budget_id);
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn delete_budget(state: State<'_, AppState>, token: &str,budget_id: i64) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state.budget_service.delete(user_id, budget_id).await?;

            info!("Menghapus data budget dengan ID {}", budget_id);

            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}
