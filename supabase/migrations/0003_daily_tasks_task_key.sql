alter table daily_tasks
  add column if not exists task_key text;

create unique index if not exists idx_daily_tasks_user_date_task_key
  on daily_tasks(user_id, task_date, task_key);
