-- Create tables for the chat application

-- Enable RLS (Row Level Security)
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Conversations table
create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    user_id text not null,
    messages jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on conversations
alter table public.conversations enable row level security;

-- Create policies
create policy "Users can view their own conversations"
    on conversations for select
    using (auth.uid()::text = user_id);

create policy "Users can insert their own conversations"
    on conversations for insert
    with check (auth.uid()::text = user_id);

create policy "Users can update their own conversations"
    on conversations for update
    using (auth.uid()::text = user_id);

create policy "Users can delete their own conversations"
    on conversations for delete
    using (auth.uid()::text = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on conversations
    for each row
    execute procedure public.handle_updated_at();
