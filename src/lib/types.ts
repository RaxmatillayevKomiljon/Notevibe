export interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    bio: string | null;
    updated_at: string | null;
}

export interface Post {
    id: string;
    author_id: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    tags: string[] | null;
    likes_count: number;
    created_at: string;
    updated_at: string;
    author?: Profile; // Joined data
}
