'use client';

import { useState } from 'react';

type Props = {
  venueId: number;
  initiallyFollowing: boolean;
};

export default function FollowVenueButton({ venueId, initiallyFollowing }: Props) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [isSaving, setIsSaving] = useState(false);

  async function onToggle() {
    if (isSaving) return;

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setIsSaving(true);

    try {
      const data = new FormData();
      data.set('venue_id', String(venueId));
      data.set('follow', nextFollowing ? '1' : '0');
      const response = await fetch('/api/follow-venue', {
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
      aria-label={following ? 'Unfollow venue' : 'Follow venue'}
      onClick={onToggle}
      disabled={isSaving}
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/80 px-4 py-2 text-sm hover:border-violet-400 ${following ? 'border-violet-400 bg-violet-900/40' : ''} ${isSaving ? 'opacity-70' : ''}`}
    >
      <svg aria-hidden viewBox='0 0 24 24' className='h-4 w-4 fill-none stroke-current stroke-2'><path d='M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z' /><circle cx='12' cy='10' r='2.5' /></svg>
      <svg aria-hidden viewBox='0 0 24 24' className='h-4 w-4 fill-none stroke-current stroke-2'><path d='M8 10h8M12 6v8' /><path d='M5 18c2-2 4-3 7-3s5 1 7 3' /></svg>
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
