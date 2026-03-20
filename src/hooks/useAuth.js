import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }) => {
            setSession(data.session);
            if (data.session) await checkAdmin(data.session.user.id);
            setAuthLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) checkAdmin(session.user.id);
            else {
                setIsAdmin(false);
                setProfileName('');
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    async function checkAdmin(userId) {
        const { data } = await supabase
            .from('profiles')
            .select('is_admin, full_name')
            .eq('id', userId)
            .maybeSingle();
        setIsAdmin(data?.is_admin === true);
        if (data?.full_name) setProfileName(data.full_name.split(' ')[0]);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setProfileName('');
        navigate('/');
    }

    return { session, isAdmin, profileName, authLoading, logout: handleLogout };
}
