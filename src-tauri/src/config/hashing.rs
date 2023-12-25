use bcrypt::{hash, verify, DEFAULT_COST, BcryptError};

#[derive(Clone)]
pub struct Hashing;

impl Hashing {
    pub fn new() -> Self {
        Hashing
    }

    pub async fn hash_password(&self, password: &str) -> Result<String, BcryptError> {
        hash(password, DEFAULT_COST)
    }

    pub async fn compare_password(&self, hashed_password: &str, password: &str) -> Result<(), BcryptError> {
        verify(password, hashed_password).map(|_| ())
    }
}
