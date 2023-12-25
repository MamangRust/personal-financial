use chrono::NaiveDateTime;
use serde::{Serialize,Deserialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryTransactionCount {
    pub category_name: String,
    pub total_transactions: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RevenuePerMonth {
    pub month: u32,
    pub revenue: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionRelation{
    pub transaction_id: i64,
    pub user_id: i64,
    pub account_name: String,
    pub transaction_date: String,
    pub description: String,
    pub amount: i64,
    pub transaction_type: String,
    pub category_name: String,
    pub location: Option<String>,
    pub created_at: Option<NaiveDateTime>, 
    pub updated_at: Option<NaiveDateTime>, 
}