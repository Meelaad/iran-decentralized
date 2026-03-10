-- 1. Creating the public profiles table with strict data validation
create table public.profiles (
                                 id uuid references auth.users on delete cascade not null primary key,
                                 email text,
                                 full_name text,
                                 country text,
                                 user_type text check (user_type in ('citizen', 'diaspora')),
                                 created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turning on Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Creating RLS Policies so citizens can only see/edit their own data
create policy "Users can view own profile"
  on public.profiles for select
                                    using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
                                    using (auth.uid() = id);

-- 4. Creating the trigger function to automatically insert new users
create function public.handle_new_user()
    returns trigger as $$
begin
insert into public.profiles (id, email, full_name, country, user_type)
values (
           new.id,
           new.email,
           new.raw_user_meta_data->>'full_name',
           new.raw_user_meta_data->>'country',
           new.raw_user_meta_data->>'user_type'
       );
return new;
end;
$$ language plpgsql security definer;

-- 5. Bind the trigger to the auth.users table
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();