use crate::{abstract_trait::{DynCategoryRepository, CategoryServiceTrait}, models::Category, utils::AppError};
use async_trait::async_trait;
use anyhow::Result;

pub struct CategoryService{
    repository: DynCategoryRepository,
}

impl CategoryService{
    pub fn new(repository: DynCategoryRepository) -> Self{
        Self { repository }
    }
}

#[async_trait]
impl CategoryServiceTrait for CategoryService{
    async fn find_all_categories(&self, user_id: i64) -> Result<Vec<Category>, AppError> {
        match self.repository.find_all(user_id).await {
            Ok(categories) => Ok(categories),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn find_category_by_id(&self, user_id: i64,category_id: i64) -> Result<Option<Category>, AppError> {
        match self.repository.find_by_id(user_id,category_id).await {
            Ok(category) => Ok(category),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn create_category(&self, user_id: i64, category_name: &str) -> Result<(), AppError> {
        match self.repository.create_category(user_id, category_name).await {
            Ok(_) => Ok(()),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn update_category_name(
        &self,
        category_id: i64,
        new_name: &str,
    ) -> Result<(), AppError> {
        match self.repository.update_category_name(category_id, new_name).await {
            Ok(_) => Ok(()),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }

    async fn delete_category(&self, user_id: i64,category_id: i64) -> Result<(), AppError> {
        match self.repository.delete_category(user_id,category_id).await {
            Ok(_) => Ok(()),
            Err(err) => Err(AppError::SqlxError(err.into())),
        }
    }
}