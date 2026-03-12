-- Blueprint layout overrides: stores admin-positioned x,y per sector per blueprint
create table if not exists blueprint_layouts (
    blueprint_id text primary key,
    positions    jsonb not null default '{}',
    updated_at   timestamptz not null default now()
);

alter table blueprint_layouts enable row level security;

-- Everyone can read layouts (so visitors see admin-adjusted positions)
create policy "Public read blueprint_layouts"
    on blueprint_layouts for select using (true);

-- Only service role can write (admin API uses service role key)
