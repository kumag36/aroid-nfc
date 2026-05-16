create table if not exists public.preorder_requests (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',
  product_id text not null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  instagram_handle text,
  plant_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  budget text,
  pickup_method text not null,
  preferred_timing text,
  note text,
  user_agent text,
  request_ip text
);

alter table public.preorder_requests
  add column if not exists product_id text;

alter table public.preorder_requests
  alter column product_id set not null;

create index if not exists preorder_requests_created_at_idx
  on public.preorder_requests (created_at desc);

create index if not exists preorder_requests_product_id_idx
  on public.preorder_requests (product_id);

alter table public.preorder_requests enable row level security;
