-- Add up migration script here
CREATE TABLE IF NOT EXISTS `accounts` (
  account_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  account_name TEXT NOT NULL,
  balance REAL DEFAULT 0,
  currency TEXT,
  created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  updated_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id)
);
