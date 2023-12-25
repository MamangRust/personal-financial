use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Account {
    pub account_id: i64,
    pub user_id: i64,
    pub account_name: String,
    pub balance: Option<f64>,
    pub currency: Option<String>,
    pub created_at: Option<NaiveDateTime>, 
    pub updated_at: Option<NaiveDateTime>, 
}