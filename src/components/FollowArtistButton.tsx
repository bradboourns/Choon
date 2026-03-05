'use client';

import { useState } from 'react';

type Props = {
  artistId: number;
  initiallyFollowing: boolean;
  compact?: boolean;
};

export default function FollowArtistButton({ artistId, initiallyFollowing, compact = false }: Props) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [isSaving, setIsSaving] = useState(false);

  async function onToggle() {
    if (isSaving) return;

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setIsSaving(true);

    try {
      const data = new FormData();
      data.set('artist_id', String(artistId));
      data.set('follow', nextFollowing ? '1' : '0');
      const response = await fetch('/api/follow-artist', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) setFollowing(!nextFollowing);
    } catch {
      setFollowing(!nextFollowing);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type='button'
      onClick={onToggle}
      disabled={isSaving}
      className={compact
        ? `inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 ${following ? 'border-fuchsia-400 bg-fuchsia-500/20' : 'border-zinc-600 hover:bg-zinc-800'} ${isSaving ? 'opacity-70' : ''}`
        : `inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 ${following ? 'border-fuchsia-400 bg-fuchsia-500/20' : 'border-zinc-600'} ${isSaving ? 'opacity-70' : ''}`
      }
    >
      <svg aria-hidden viewBox='0 0 24 24' className='h-4 w-4 fill-none stroke-current stroke-2'><circle cx='9' cy='8' r='3' /><path d='M4 19c1.5-3 3.8-5 6.5-5' /><path d='M16 7v8M12 11h8' /></svg>
      {following ? 'Following artist' : 'Follow artist'}
    </button>
  );
}
