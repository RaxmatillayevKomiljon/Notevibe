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

// ── Library Management Module ──

export interface Library {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    phone: string | null;
    logo_url: string | null;
    created_by: string | null;
    created_at: string;
    book_count?: number;
}

export interface Book {
    id: string;
    library_id: string;
    title: string;
    author: string;
    genre: string | null;
    language: string | null;
    description: string | null;
    cover_url: string | null;
    total_count: number;
    available_count: number;
    status: 'pending' | 'approved' | 'rejected';
    created_by: string | null;
    created_at: string;
    library?: Library;
    avg_rating?: number;
    review_count?: number;
}

export interface Borrowing {
    id: string;
    book_id: string;
    library_id: string;
    user_id: string;
    taken_date: string | null;
    return_date: string | null;
    status: 'requested' | 'approved' | 'borrowed' | 'returned' | 'late';
    created_at: string;
    book?: Book;
    user?: Profile;
}

export interface BookReview {
    id: string;
    book_id: string;
    user_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user?: { username: string; full_name: string | null; avatar_url: string | null };
}
