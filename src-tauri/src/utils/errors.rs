use sqlx::Error as SqlxError;
use thiserror::Error;
use sqlx::sqlite::SqliteError;

use bcrypt::BcryptError;
use jsonwebtoken::errors::Error as JwtError;



#[derive(Debug, Error)]
pub enum AppError{
    #[error("SQLx error: {0}")]
    SqlxError(#[from] SqlxError),

    #[error("Sqlite error: {0}")]
    SqliteError(#[from] SqliteError),

    #[error("Hashing error: {0}")]
    HashingError(#[from] BcryptError),

    #[error("Email already exists")]
    EmailAlreadyExists,

    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("Invalid credentials")]
    InvalidTransactionType,

    #[error("User not found")]
    UserNotFound,

    #[error("Transaction not create")]
    TransactionNotCreate,

    #[error("Transaction not found")]
    TransactionNotFound,

    #[error("Token expired")]
    TokenExpiredError, // New variant for token expiration error

    #[error("Verifiy Token jwt Error")]
    TokenValidationError,

    #[error("Token generation error")]
    TokenGenerationError(#[from] JwtError),
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

