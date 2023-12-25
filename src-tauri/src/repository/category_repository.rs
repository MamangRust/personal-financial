use crate::{config::ConnectionPool, abstract_trait::CategoryRepositoryTrait, models::Category};
use async_trait::async_trait;
use chrono::Utc;
use sqlx::Error;
use anyhow::Result;

#[derive(Clone)]
pub struct CategoryRepository{
    pub db_pool: ConnectionPool,
}

impl CategoryRepository{
    pub fn new(db_pool: ConnectionPool) -> Self{
        Self{
            db_pool,
        }
    }
}

#[async_trait]
impl CategoryRepositoryTrait for CategoryRepository{
    async fn find_all(&self, user_id: i64) -> Result<Vec<Category>, Error> {
        let categories = sqlx::query_as::<_, Category>(
            "SELECT category_id, user_id, category_name, created_at, updated_at FROM categories WHERE user_id = ?",
        )
        .bind(user_id)
        .fetch_all(&self.db_pool)
        .await?;
    
        Ok(categories)
    }

    async fn find_by_id(&self, user_id: i64, category_id: i64) -> Result<Option<Category>, Error> {
        let category = sqlx::query_as!(
            Category,
            "SELECT category_id, user_id, category_name, created_at, updated_at FROM categories WHERE user_id = ? AND category_id = ?",
            user_id,
            category_id
        )
        .fetch_optional(&self.db_pool)
        .await?;
    
        Ok(category)
    }

    async fn create_category(
        &self,
        user_id: i64,
        category_name: &str,
    ) -> Result<(), Error> {
        let created_at = Utc::now().to_rfc3339();
        let updated_at = Utc::now().to_rfc3339();

        sqlx::query(
            "INSERT INTO categories (user_id, category_name,created_at, updated_at) VALUES (?, ?, ?, ?)",
        )
        .bind(user_id)
        .bind(category_name)
        .bind(created_at)
        .bind(updated_at)
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn update_category_name(
        &self,
        category_id: i64,
        new_name: &str,
    ) -> Result<(), Error> {
        let updated_at = Utc::now().to_rfc3339();

        sqlx::query(
            "UPDATE categories SET category_name = ?, updated_at = ? WHERE category_id = ?",
        )
        .bind(new_name)
        .bind(category_id)
        .bind(updated_at)
        .execute(&self.db_pool)
        .await?;

        Ok(())
    }

    async fn delete_category(&self, user_id: i64, category_id: i64) -> Result<(), Error> {
        sqlx::query("DELETE FROM categories WHERE user_id = ? AND category_id = ?")
            .bind(user_id)
            .bind(category_id)
            .execute(&self.db_pool)
            .await?;
    
        Ok(())
    }
}