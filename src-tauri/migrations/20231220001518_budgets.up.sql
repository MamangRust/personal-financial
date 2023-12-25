-- Add up migration script here
CREATE TABLE IF NOT EXISTS `budgets` (
  budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  amount REAL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  updated_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id),
  FOREIGN KEY (category_id) REFERENCES `categories`(category_id)
);