import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { UserStats } from '../types/math.ts';
import {
  X,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Cloud,
  Award,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  const {
    user,
    isSigningIn,
    authError,
    clearAuthError,
    signInWithGoogle,
    signOutUser,
  } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      onClose();
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    onClose();
  };

  const initials = (user?.displayName || user?.email || 'M')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90dvh] flex flex-col rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between shrink-0 gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
              {user ? t.account.titleSignedIn : t.account.titleSignedOut}
            </h2>
            <p className="text-xs text-white/50 mt-0.5 truncate">
              {user ? t.account.subSignedIn : t.account.subSignedOut}
            </p>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
            aria-label={t.account.closeAria}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto no-scrollbar">
          {authError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{authError}</div>
            </div>
          )}

          {user ? (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/15 flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Account avatar'}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl border border-white/20 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center text-sm font-bold font-mono text-white shrink-0">
                    {initials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white truncate">
                      {user.displayName || t.account.defaultName}
                    </span>
                    {user.emailVerified && (
                      <ShieldCheck
                        className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                        aria-label={t.account.verifiedAria}
                      />
                    )}
                  </div>
                  <div className="text-xs text-white/50 truncate font-mono mt-0.5">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Synced Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/10">
                  <div className="text-[11px] text-white/40 font-mono uppercase">
                    {t.account.syncedPoints}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-lg font-bold font-mono tabular-nums text-white">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>{stats.totalPoints}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/10">
                  <div className="text-[11px] text-white/40 font-mono uppercase">
                    {t.account.verifiedSolved}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-lg font-bold font-mono tabular-nums text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{stats.succeededCount}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.account.backupBanner}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-white/70" />
                <span>{t.account.signOut}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2.5 text-xs text-white/70">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950 border border-white/10">
                  <Cloud className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">{t.account.feature1Title}</div>
                    <p className="text-white/50 mt-0.5 leading-relaxed">
                      {t.account.feature1Desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">{t.account.feature2Title}</div>
                    <p className="text-white/50 mt-0.5 leading-relaxed">
                      {t.account.feature2Desc}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-60 text-black font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.account.signingIn}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                    <span>{t.account.continueWithGoogle}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-white/40">
                {t.account.guestNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
