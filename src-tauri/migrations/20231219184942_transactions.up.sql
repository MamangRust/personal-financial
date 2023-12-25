-- Add up migration script here
CREATE TABLE IF NOT EXISTS `transaction` (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  transaction_date TEXT, 
  description TEXT,
  amount INTEGER NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  category_id INTEGER,
  location TEXT,
  created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  updated_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id),
  FOREIGN KEY (account_id) REFERENCES `accounts`(account_id),
  FOREIGN KEY (category_id) REFERENCES `categories`(category_id)
);
