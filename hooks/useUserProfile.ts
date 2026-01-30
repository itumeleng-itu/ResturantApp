import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';
import { useCallback, useState } from 'react';

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuthAndLoadProfile = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setIsLoggedIn(true);
                setProfile({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || '',
                    surname: session.user.user_metadata?.surname || '',
                    contact_number: session.user.user_metadata?.contact_number || '',
                    avatar_url: session.user.user_metadata?.avatar_url,
                });
            } else {
                setIsLoggedIn(false);
                setProfile(null);
            }
        } catch (error) {
            // Error loading profile
        } finally {
            setLoading(false);
        }
    }, []);

    return { profile, loading, isLoggedIn, checkAuthAndLoadProfile };
}
