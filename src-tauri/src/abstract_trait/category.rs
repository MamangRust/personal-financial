use crate::{models::Category, utils::AppError};
use async_trait::async_trait;
use std::sync::Arc;
use sqlx::Error;

pub type DynCategoryRepository = Arc<dyn CategoryRepositoryTrait + Send + Sync>;
pub type DynCategoryService = Arc<dyn CategoryServiceTrait + Send + Sync>;


#[async_trait]
pub trait CategoryRepositoryTrait {
    async fn find_all(&self, user_id: i64) -> Result<Vec<Category>, Error>;
    async fn find_by_id(&self, user_id: i64, category_id: i64) -> Result<Option<Category>, Error> ;
    async fn create_category(
        &self,
        user_id: i64,
        category_name: &str,
    ) -> Result<(), Error>; 
    async fn update_category_name(
        &self,
        category_id: i64,
        new_category_name: &str,
    ) -> Result<(), Error>;
    async fn delete_category(&self, user_id: i64,category_id: i64) -> Result<(), Error>;
}

#[async_trait]
pub trait CategoryServiceTrait {
    async fn find_all_categories(&self, user_id: i64) -> Result<Vec<Category>, AppError>;
    async fn find_category_by_id(&self, user_id: i64,category_id: i64) -> Result<Option<Category>, AppError>;
    async fn create_category(&self, user_id: i64, category_name: &str) -> Result<(), AppError>;
    async fn update_category_name(
        &self,
        category_id: i64,
        new_category_name: &str,
    ) -> Result<(), AppError>;
    async fn delete_category(&self, user_id: i64,category_id: i64) -> Result<(), AppError>;
}