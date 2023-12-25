-- Add up migration script here
CREATE TABLE IF NOT EXISTS `categories` (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  updated_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id)
);