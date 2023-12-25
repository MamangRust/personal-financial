use crate::{middleware::auth_token_middleware, models::Goal, utils::AppError, AppState};
use anyhow::Result;
use chrono::NaiveDate;
use tauri::{command, State};
use tracing::info;


#[command]
pub async fn sum_goal(state: State<'_, AppState>, token: &str) -> Result<Option<f64>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state.goal_service.sum_goal(user_id).await
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn find_all_goals(
    state: State<'_, AppState>,
    token: &str,
) -> Result<Vec<Goal>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            let goals = state.goal_service.find_all(user_id).await?;
            info!("Found all goals");
            Ok(goals)
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn find_goal_by_id(
    state: State<'_, AppState>,
    token: &str,
    goal_id: i64,
) -> Result<Option<Goal>, AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            let goals = state.goal_service.find_by_id(user_id, goal_id).await?;
            info!("Found goal by ID: {}", goal_id);
            Ok(goals)
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn create_goal(
    state: State<'_, AppState>,
    token: &str,
    goal_name: Option<String>,
    target_amount: Option<f64>,
    start_date: Option<NaiveDate>,
    end_date: Option<NaiveDate>,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!(
                "Creating goal: user_id: {}, goal_name: {:?}, target_amount: {:?}, start_date: {:?}, end_date: {:?}",
                user_id,
                goal_name,
                target_amount,
                start_date,
                end_date
            );
            state
                .goal_service
                .create(user_id, goal_name, target_amount, start_date, end_date)
                .await?;
            info!("Created goal for user: {}", user_id);
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn update_goal(
    state: State<'_, AppState>,
    token: &str,
    goal_id: i64,
    goal_name: Option<String>,
    target_amount: Option<f64>,
    start_date: Option<NaiveDate>,
    end_date: Option<NaiveDate>,
    current_amount: Option<f64>,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            info!(
                "Updating goal: goal_id: {}, user_id: {}, goal_name: {:?}, target_amount: {:?}, start_date: {:?}, end_date: {:?}, current_amount: {:?}",
                goal_id,
                user_id,
                goal_name,
                target_amount,
                start_date,
                end_date,
                current_amount
            );
            state
                .goal_service
                .update(
                    goal_id,
                    user_id,
                    goal_name,
                    target_amount,
                    start_date,
                    end_date,
                    current_amount,
                )
                .await?;
            info!("Updated goal with ID: {}", goal_id);
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}

#[command]
pub async fn delete_goal(
    state: State<'_, AppState>,
    token: &str,
    goal_id: i64,
) -> Result<(), AppError> {
    match auth_token_middleware(&state.jwt_config, token) {
        Ok(user_id) => {
            state.goal_service.delete(user_id, goal_id).await?;
            info!("Deleted goal with ID: {}", goal_id);
            Ok(())
        }
        Err(err) => Err(err.into()),
    }
}
