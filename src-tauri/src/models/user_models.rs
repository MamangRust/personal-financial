use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct User {
    pub user_id: i64,
    pub name: String,
    pub email: String,
    pub password: String,
    pub job: Option<String>,
    pub description: Option<String>,
    pub created_at: Option<DateTime<Utc>>, 
    pub updated_at: Option<DateTime<Utc>>, 
}