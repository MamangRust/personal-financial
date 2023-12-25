// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod abstract_trait;
mod config;
mod dto;
mod handle_command;
mod models;
mod repository;
mod service;
mod utils;
mod middleware;

use config::{AppState, ConnectionManager};
use handle_command::*;
use tauri::Manager;
use utils::tracing;

fn main() {
    tracing();
  
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                let connection_manager =
                    ConnectionManager::new_pool("personal_financial.db", true)
                        .await
                        .expect("Failed to create connection manager");

                let app_state = AppState::new(connection_manager.db_pool);

                app.manage(app_state);

                Ok(())
            })
        })
        .invoke_handler(tauri::generate_handler![
            login_user,
            register_user,
            verify_token,
            find_all_user,
            create_user,
            update_user,
            delete_user,
            find_by_id_user,
            create_account,
            find_all_accounts,
            find_account_by_id,
            update_account,
            delete_account,
            find_all_categories,
            find_category_by_id,
            create_category,
            update_category,
            delete_category,
            find_all_transaction,
            find_transaction_by_id,
            create_transaction,
            update_transaction,
            delete_transaction,
            get_categories_with_transaction_counts,
            calculate_yearly_revenue,
            sum_transaction,
            find_all_budget,
            find_budget_by_id,
            create_budget,
            update_budget,
            delete_budget,
            sum_budget,
            find_all_goals,
            find_goal_by_id,
            create_goal,
            update_goal,
            delete_goal,
            sum_goal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
