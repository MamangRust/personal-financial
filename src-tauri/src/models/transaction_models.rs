use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use sqlx::prelude::FromRow;



#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Transaction {
    pub transaction_id: i64,
    pub user_id: i64,
    pub account_id: i64,
    pub transaction_date: String,
    pub description: String,
    pub amount: i64,
    pub transaction_type: String,
    pub category_id: Option<i64>,
    pub location: Option<String>,
    pub created_at: Option<NaiveDateTime>, 
    pub updated_at: Option<NaiveDateTime>, 
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub enum TransactionType {
    Income,
    Expense,
    Transfer,
}

impl TransactionType {
    pub fn to_string(&self) -> &'static str {
        match self {
            TransactionType::Income => "income",
            TransactionType::Expense => "expense",
            TransactionType::Transfer => "transfer",
        }
    }
}