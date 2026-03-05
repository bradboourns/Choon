'use client';

import { useState } from 'react';

type Props = {
  gigId: number;
  initiallySaved: boolean;
  compact?: boolean;
};

export default function SaveGigButton({ gigId, initiallySaved, compact = false }: Props) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isSaving, setIsSaving] = useState(false);

  async function onToggle() {
    if (isSaving) return;

    const nextSaved = !saved;
    setSaved(nextSaved);
    setIsSaving(true);

    try {
      const data = new FormData();
      data.set('gig_id', String(gigId));
      data.set('action', nextSaved ? 'save' : 'unsave');
      const response = await fetch('/api/save', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) setSaved(!nextSaved);
    } catch {
      setSaved(!nextSaved);
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
        ? `inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 ${saved ? 'border-zinc-200 bg-zinc-100 text-zinc-900' : 'border-zinc-600 hover:bg-zinc-800'} ${isSaving ? 'opacity-70' : ''}`
        : `inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-medium ${saved ? 'bg-zinc-100 text-zinc-900' : 'border border-zinc-600 text-zinc-100'} ${isSaving ? 'opacity-70' : ''}`
      }
    >
      <svg aria-hidden viewBox='0 0 24 24' className='h-4 w-4 fill-none stroke-current stroke-2'><path d='M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z' /></svg>
      {saved ? 'Saved' : 'Save gig'}
    </button>
  );
}
