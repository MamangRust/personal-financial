use chrono::{NaiveDateTime, NaiveDate};
use serde::{Serialize,Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BudgetRelation{
    pub budget_id: i64,
    pub user_id: i64,
    pub category_name: String,
    pub amount: f64,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}