use crate::{abstract_trait::{DynAccountRepository, AccountServiceTrait}, models::Account, utils::AppError};
use async_trait::async_trait;
use anyhow::Result;


pub struct AccountService{
    repository: DynAccountRepository
}

impl AccountService{
    pub fn new(repository: DynAccountRepository) ->  Self{ 
        Self{
            repository
        }
    }
}

#[async_trait]
impl AccountServiceTrait for AccountService{
    async fn find_all(&self, user_id: i64) -> Result<Vec<Account>, AppError>{
        match self.repository.find_all(user_id).await{
            Ok(accounts) => Ok(accounts),
            Err(err) => Err(err.into()),
        }
    }

    async fn create_account(&self,user_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>,) -> Result<(), AppError>{
        match self.repository.create_account(user_id, account_name, balance, currency).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err.into()),
        }
    }

    async fn get_account_by_id(&self, user_id: i64,account_id: i64) ->  Result<Option<Account>, AppError>{
        match self.repository.get_account_by_id(user_id,account_id).await{
            Ok(account) => Ok(account),
            Err(err) => Err(err.into())
        }
    }

    async fn update_account(&self, account_id: i64,
        account_name: &str,
        balance: f64,
        currency: Option<&str>) -> Result<(), AppError>{
        match self.repository.update_account(account_id, account_name, balance, currency).await{
            Ok(_) => Ok(()),
            Err(err) => Err(err.into())
        }
    } 

    async fn delete_account(&self, user_id: i64,account_id: i64) -> Result<(), AppError>{
        match self.repository.delete_account(user_id,account_id).await{
            Ok(_) => Ok(()),
            Err(err) => Err(err.into())
        }
    }
}