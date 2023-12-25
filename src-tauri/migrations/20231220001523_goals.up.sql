-- Add up migration script here
CREATE TABLE IF NOT EXISTS `goals` (
  goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  goal_name TEXT,
  target_amount REAL,
  start_date DATE,
  end_date DATE,
  current_amount REAL,
  created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  updated_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id)
);