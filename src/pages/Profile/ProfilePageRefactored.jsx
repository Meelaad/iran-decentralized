import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { useProfile, useInviteCodes, useUpdateProfile, useCastVote, useGenerateCode } from '../../hooks/useProfile';
import MemberInfoCard from '../../components/Profile/MemberInfoCard';
import AdditionalInfoForm from '../../components/Profile/AdditionalInfoForm';
import InviteCodesCard from '../../components/Profile/InviteCodesCard';
import BlueprintVoteCard from '../../components/Profile/BlueprintVoteCard';
import './ProfilePage.css';

export default function ProfilePage() {
    const { t, isRTL, monoFont, headFont } = useLang();
    const navigate = useNavigate();

    const memberCardRef = useRef(null);

    const { session, authLoading } = useAuth();
    const userId = session?.user?.id;

    const { data: profile, isLoading: profileLoading } = useProfile(userId);
    const { data: codes = [] } = useInviteCodes(userId);

    const nameUpdateMutation = useUpdateProfile(userId);
    const birthUpdateMutation = useUpdateProfile(userId);
    const additionalInfoMutation = useUpdateProfile(userId);
    const castVoteMutation = useCastVote(userId);
    const generateCodeMutation = useGenerateCode(userId);

    const [preferredBlueprint, setPreferredBlueprint] = useState('');

    useEffect(() => {
        if (profile) setPreferredBlueprint(profile.preferred_blueprint || '');
    }, [profile]);

    const loading = authLoading || (!!userId && profileLoading);

    if (loading) return (
        <div className="prof-page">
            <div className="prof-loading"><span className="prof-spinner" /></div>
        </div>
    );

    if (!session) return (
        <div className="prof-page">
            <div className="prof-no-session" style={{ fontFamily: monoFont }}>
                {isRTL ? 'شما وارد نشدهاید.' : 'You are not logged in.'}{' '}
                <button className="prof-link-btn" onClick={() => navigate('/register')} style={{ fontFamily: monoFont }}>
                    {isRTL ? 'ثبتنام' : 'Register →'}
                </button>
            </div>
        </div>
    );

    const joinedDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
        : '';

    function handleVote(blueprintId, callbacks) {
        castVoteMutation.mutate(blueprintId, {
            ...callbacks,
            onSuccess: () => {
                setPreferredBlueprint(blueprintId);
                callbacks?.onSuccess?.();
            },
        });
    }

    function handleScrollToMemberCard() {
        memberCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="prof-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="prof-bg-grid" />
            <div className="prof-scanline" />

            <div className="prof-inner">
                <div className="prof-header">
                    <div className="prof-eyebrow" style={{ fontFamily: monoFont }}>{isRTL ? 'پروفایل عضو' : 'MEMBER PROFILE'}</div>
                    <h1 className="prof-name" style={{ fontFamily: headFont }}>{profile?.full_name}</h1>
                    <div className="prof-meta" style={{ fontFamily: monoFont }}>
                        <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                            {profile?.user_type === 'citizen' ? (isRTL ? 'شهروند' : 'Citizen') : (isRTL ? 'دیاسپورا' : 'Diaspora')}
                        </span>
                        {profile?.country && <span className="prof-meta-sep">·</span>}
                        {profile?.country && <span>{profile.country}</span>}
                        {joinedDate && <span className="prof-meta-sep">·</span>}
                        {joinedDate && <span>{isRTL ? `عضو از ${joinedDate}` : `Member since ${joinedDate}`}</span>}
                    </div>
                </div>

                <div ref={memberCardRef}>
                    <MemberInfoCard
                        profile={profile}
                        session={session}
                        isRTL={isRTL}
                        monoFont={monoFont}
                        onNameUpdate={(fields, callbacks) => nameUpdateMutation.mutate(fields, callbacks)}
                        onBirthUpdate={(fields, callbacks) => birthUpdateMutation.mutate(fields, callbacks)}
                    />
                </div>

                <div className="prof-grid">
                    <AdditionalInfoForm
                        profile={profile}
                        isRTL={isRTL}
                        monoFont={monoFont}
                        onSave={(fields, callbacks) => additionalInfoMutation.mutate(fields, callbacks)}
                    />

                    <div className="prof-right-col">
                        <InviteCodesCard
                            profile={profile}
                            codes={codes}
                            isRTL={isRTL}
                            monoFont={monoFont}
                            onGenerate={(_, callbacks) => generateCodeMutation.mutate(undefined, callbacks)}
                        />

                        <BlueprintVoteCard
                            profile={profile}
                            preferredBlueprint={preferredBlueprint}
                            isRTL={isRTL}
                            monoFont={monoFont}
                            headFont={headFont}
                            t={t}
                            onVote={handleVote}
                            onScrollToMemberCard={handleScrollToMemberCard}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
