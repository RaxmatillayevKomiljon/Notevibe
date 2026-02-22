-- Create a table for public profiles (linked to auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for posts
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  tags text[],
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone."
  on posts for select
  using ( true );

create policy "Users can create posts."
  on posts for insert
  with check ( auth.uid() = author_id );

create policy "Users can update own posts."
  on posts for update
  using ( auth.uid() = author_id );

-- Kudos table (tracks who gave kudos to which post)
create table public.kudos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

alter table public.kudos enable row level security;

create policy "Kudos are viewable by everyone."
  on kudos for select
  using ( true );

create policy "Users can give kudos."
  on kudos for insert
  with check ( auth.uid() = user_id );

create policy "Users can remove their own kudos."
  on kudos for delete
  using ( auth.uid() = user_id );

-- RPC functions for atomic kudos count updates
create or replace function increment_kudos(post_id_arg uuid)
returns void as $$
begin
  update public.posts
  set likes_count = coalesce(likes_count, 0) + 1
  where id = post_id_arg;
end;
$$ language plpgsql security definer;

create or replace function decrement_kudos(post_id_arg uuid)
returns void as $$
begin
  update public.posts
  set likes_count = greatest(coalesce(likes_count, 0) - 1, 0)
  where id = post_id_arg;
end;
$$ language plpgsql security definer;

-- Follows table (tracks who follows whom)
create table public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid not null references auth.users on delete cascade,
  following_id uuid not null references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone."
  on follows for select
  using ( true );

create policy "Users can follow others."
  on follows for insert
  with check ( auth.uid() = follower_id );

create policy "Users can unfollow."
  on follows for delete
  using ( auth.uid() = follower_id );

-- Set up Storage for images (Avatars and Covers)
insert into storage.buckets (id, name)
values ('images', 'images');

create policy "Images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Authenticated users can upload images."
  on storage.objects for insert
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
