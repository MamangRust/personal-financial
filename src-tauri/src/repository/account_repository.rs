use crate::{config::ConnectionPool, abstract_trait::AccountRepositoryTrait, models::Account};
use async_trait::async_trait;
use chrono::Utc;
use sqlx::Error;
use anyhow::Result;

#[derive(Clone)]
pub struct  AccountRepository{
    pub db_pool: ConnectionPool
}

impl AccountRepository{
    pub fn new(db_pool: ConnectionPool) -> Self{
        Self { db_pool }
    }
}


#[async_trait]
impl AccountRepositoryTrait for AccountRepository{
    async fn find_all(&self, user_id: i64) -> Result<Vec<Account>, Error> {
        let accounts: Vec<Account> = sqlx::query_as::<_, Account>(
            "SELECT * FROM accounts WHERE user_id = ?"
        )
        .bind(user_id)
        .fetch_all(&self.db_pool)
        .await?;
        Ok(accounts)
    }

    async fn create_account(
        &self,
        user_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), Error> {
        let created_at = Utc::now().to_rfc3339();
        let updated_at = Utc::now().to_rfc3339();

        let currency_str = match currency {
            Some(c) => Some(c.to_string()),
            None => None,
        };

        sqlx::query!(
            "INSERT INTO accounts (user_id, account_name, balance, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            user_id,
            account_name,
            balance,
            currency_str,
            created_at,
            updated_at,
        )
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn get_account_by_id(&self, user_id: i64,account_id: i64) -> Result<Option<Account>, Error> {
        let account = sqlx::query_as!(
            Account,
            "SELECT account_id, user_id, account_name, balance, 
            currency, created_at, updated_at FROM accounts WHERE account_id = ? AND user_id = ?",
            account_id,
            user_id
        )
        .fetch_optional(&self.db_pool)
        .await?;
        Ok(account)
    }
    

    async fn update_account(
        &self,
        account_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,
    ) -> Result<(), Error> {
        let updated_at = Utc::now().to_rfc3339();

        let currency_str = match currency {
            Some(c) => Some(c.to_string()),
            None => None,
        };

        sqlx::query!(
            "UPDATE accounts SET account_name = ?, balance = ?, currency = ?, updated_at = ? WHERE account_id = ?",
            account_name,
            balance,
            currency_str,
            updated_at,
            account_id,
        )
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn delete_account(&self, user_id: i64,account_id: i64) -> Result<(), Error> {
        sqlx::query!(
            "DELETE FROM accounts WHERE account_id = ? AND user_id = ?",
            account_id,
            user_id
        )
        .execute(&self.db_pool)
        .await?;
        Ok(())
    }
}
