use tracing::info;
use sqlx::sqlite::{SqlitePool, SqliteConnectOptions};

use crate::utils::AppError;

pub type ConnectionPool = SqlitePool;



pub struct ConnectionManager{
    pub db_pool: SqlitePool
}

impl ConnectionManager {
    pub async fn new_pool(connection_string: &str, run_migrations: bool) -> Result<Self, AppError> {
        let options = SqliteConnectOptions::new()
            .filename(connection_string)
            .create_if_missing(true);

        let pool = SqlitePool::connect_with(options)
            .await?;

        if run_migrations {
            info!("migrations enabled, running...");
            
            match sqlx::migrate!().run(&pool).await {
                Ok(_) => {
                    // Migrasi berhasil dilakukan
                    println!("Migrations ran successfully");
                }
                Err(err) => {
                    // Penanganan error migrasi
                    return Err(AppError::SqlxError(sqlx::Error::Io(std::io::Error::new(std::io::ErrorKind::Other, format!("Migration error: {:?}", err)))));
                }
            }
        }

        Ok(Self{
            db_pool: pool
        })
    }
}



