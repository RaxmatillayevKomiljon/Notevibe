import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

async function ensureProfile(user: User) {
    try {
        // Check if profile already exists
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (existing) return; // Profile already exists

        // Auto-create from user_metadata (works for Google, email, etc.)
        const meta = user.user_metadata || {};
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                username: meta.preferred_username || meta.user_name || user.email?.split('@')[0] || 'user',
                full_name: meta.full_name || meta.name || user.email?.split('@')[0] || '',
                avatar_url: meta.avatar_url || meta.picture || null,
            });

        if (error) {
            console.error('Error auto-creating profile:', error);
        }
    } catch (err) {
        console.error('ensureProfile error:', err);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
            }
            setLoading(false);
        }).catch((error) => {
            console.error("Auth session error:", error);
            setLoading(false);
        });

        // Listen for changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (event === 'SIGNED_IN' && session?.user) {
                ensureProfile(session.user);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
