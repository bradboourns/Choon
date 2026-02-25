import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { genres, vibes } from '@/lib/data';
import { redirect } from 'next/navigation';
import CreateGigForm from '@/components/CreateGigForm';

export default async function CreateGig({ searchParams }: { searchParams: Promise<{ error?: string; venue_id?: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== 'artist' && session.role !== 'venue_admin')) redirect('/login');

  const query = await searchParams;
  const preferredVenueId = query.venue_id ? Number(query.venue_id) : undefined;
  const venues = session.role === 'venue_admin'
    ? db.prepare(`SELECT venues.* FROM venues
      JOIN venue_memberships ON venue_memberships.venue_id = venues.id
      WHERE venue_memberships.user_id=? AND venue_memberships.approved=1
      ORDER BY venues.approved DESC, venues.name`).all(session.id) as any[]
    : db.prepare('SELECT * FROM venues WHERE approved=1 ORDER BY name').all() as any[];

  return <div className='space-y-6'>
    <CreateGigForm
      venues={venues}
      preferredVenueId={preferredVenueId}
      error={query.error}
      genres={genres}
      vibes={vibes}
    />
  </div>;
}
