import { supabase } from './supabase';
import type { Library, Book, Borrowing, BookReview } from './types';

// ── Libraries ──

export async function getLibraries(): Promise<Library[]> {
    const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { console.error('getLibraries error:', error); return []; }

    // Get book counts
    const withCounts = await Promise.all(
        (data || []).map(async (lib: Library) => {
            const { count } = await supabase
                .from('books')
                .select('*', { count: 'exact', head: true })
                .eq('library_id', lib.id)
                .eq('status', 'approved');
            return { ...lib, book_count: count || 0 };
        })
    );
    return withCounts;
}

export async function getLibrary(id: string): Promise<Library | null> {
    const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error || !data) return null;

    const { count } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('library_id', id)
        .eq('status', 'approved');

    return { ...data, book_count: count || 0 };
}

export async function createLibrary(lib: { name: string; description?: string; location?: string; phone?: string; logo_url?: string; created_by: string }): Promise<Library | null> {
    const { data, error } = await supabase
        .from('libraries')
        .insert(lib)
        .select()
        .single();

    if (error) { console.error('createLibrary error:', error); return null; }
    return data;
}

// ── Books ──

export async function getBooks(libraryId: string, onlyApproved = true): Promise<Book[]> {
    let query = supabase
        .from('books')
        .select('*')
        .eq('library_id', libraryId)
        .order('created_at', { ascending: false });

    if (onlyApproved) query = query.eq('status', 'approved');

    const { data, error } = await query;
    if (error) { console.error('getBooks error:', error); return []; }
    return data || [];
}

export async function getBook(id: string): Promise<Book | null> {
    const { data, error } = await supabase
        .from('books')
        .select('*, library:libraries(*)')
        .eq('id', id)
        .maybeSingle();

    if (error || !data) return null;

    // Get avg rating
    const { data: reviews } = await supabase
        .from('book_reviews')
        .select('rating')
        .eq('book_id', id);

    const ratings = reviews || [];
    const avg = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;

    return { ...data, avg_rating: Math.round(avg * 10) / 10, review_count: ratings.length };
}

export async function addBook(book: {
    library_id: string; title: string; author: string;
    genre?: string; language?: string; description?: string;
    cover_url?: string; total_count?: number; created_by: string;
}): Promise<Book | null> {
    const { data, error } = await supabase
        .from('books')
        .insert({ ...book, status: 'pending', available_count: book.total_count || 1 })
        .select()
        .single();

    if (error) { console.error('addBook error:', error); return null; }
    return data;
}

export async function approveBook(bookId: string): Promise<boolean> {
    const { error } = await supabase
        .from('books')
        .update({ status: 'approved' })
        .eq('id', bookId);
    return !error;
}

export async function rejectBook(bookId: string): Promise<boolean> {
    const { error } = await supabase
        .from('books')
        .update({ status: 'rejected' })
        .eq('id', bookId);
    return !error;
}

export async function getPendingBooks(): Promise<Book[]> {
    const { data, error } = await supabase
        .from('books')
        .select('*, library:libraries(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) { console.error('getPendingBooks error:', error); return []; }
    return data || [];
}

// ── Borrowings ──

export async function requestBorrow(bookId: string, libraryId: string, userId: string): Promise<Borrowing | null> {
    const { data, error } = await supabase
        .from('borrowings')
        .insert({ book_id: bookId, library_id: libraryId, user_id: userId, status: 'requested' })
        .select()
        .single();

    if (error) { console.error('requestBorrow error:', error); return null; }
    return data;
}

export async function approveBorrow(borrowId: string): Promise<boolean> {
    const { data: borrow } = await supabase.from('borrowings').select('book_id').eq('id', borrowId).single();
    if (!borrow) return false;

    const { error } = await supabase
        .from('borrowings')
        .update({ status: 'approved', taken_date: new Date().toISOString() })
        .eq('id', borrowId);

    if (error) return false;

    // Decrease available count
    await supabase.rpc('decrement_available', { bid: borrow.book_id });
    return true;
}

export async function markReturned(borrowId: string): Promise<boolean> {
    const { data: borrow } = await supabase.from('borrowings').select('book_id').eq('id', borrowId).single();
    if (!borrow) return false;

    const { error } = await supabase
        .from('borrowings')
        .update({ status: 'returned', return_date: new Date().toISOString() })
        .eq('id', borrowId);

    if (error) return false;

    // Increase available count
    await supabase.rpc('increment_available', { bid: borrow.book_id });
    return true;
}

export async function getBorrowings(libraryId?: string): Promise<Borrowing[]> {
    let query = supabase
        .from('borrowings')
        .select('*, book:books(title, author, cover_url), user:profiles(username, full_name, avatar_url)')
        .order('created_at', { ascending: false });

    if (libraryId) query = query.eq('library_id', libraryId);

    const { data, error } = await query;
    if (error) { console.error('getBorrowings error:', error); return []; }
    return data || [];
}

export async function getUserBorrowings(userId: string): Promise<Borrowing[]> {
    const { data, error } = await supabase
        .from('borrowings')
        .select('*, book:books(title, author, cover_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

// ── Reviews ──

export async function getReviews(bookId: string): Promise<BookReview[]> {
    const { data, error } = await supabase
        .from('book_reviews')
        .select('*, user:profiles(username, full_name, avatar_url)')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

    if (error) { console.error('getReviews error:', error); return []; }
    return data || [];
}

export async function addReview(review: { book_id: string; user_id: string; rating: number; comment?: string }): Promise<BookReview | null> {
    const { data, error } = await supabase
        .from('book_reviews')
        .insert(review)
        .select()
        .single();

    if (error) { console.error('addReview error:', error); return null; }
    return data;
}
