use chrono::NaiveDate;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Budget {
    pub budget_id: i64,
    pub user_id: i64,
    pub category_id: i64,
    pub amount: f64,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
