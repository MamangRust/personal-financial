use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub user_id: i64,
    pub exp: usize,
    pub iat: usize,
}

impl Claims {
    pub fn new(user_id: i64, exp: usize, iat: usize) -> Self {
        Claims { user_id, exp, iat}
    }
}
