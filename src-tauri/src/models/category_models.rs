use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Category {
    pub category_id: i64,
    pub user_id: i64,
    pub category_name: String,
    pub created_at: Option<NaiveDateTime>, 
    pub updated_at: Option<NaiveDateTime>, 
}
