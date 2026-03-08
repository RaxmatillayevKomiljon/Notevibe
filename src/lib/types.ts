export interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    bio: string | null;
    updated_at: string | null;
    created_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    tags: string[] | null; // Restored
    likes_count: number;
    kudos?: number; // Added
    comment_count?: number; // Added
    created_at: string;
    updated_at: string;
    author?: Profile; // Joined data
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    author?: { username: string; full_name: string | null; avatar_url: string | null };
}
