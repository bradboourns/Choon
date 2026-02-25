import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import MyGigsManager from '@/components/MyGigsManager';

export default async function MyGigs() {
  const session = await getSession();
  if (!session) redirect('/login');
  const gigs = db.prepare('SELECT gigs.*, venues.name venue_name FROM gigs JOIN venues ON venues.id=gigs.venue_id WHERE created_by_user_id=? ORDER BY date ASC, start_time ASC').all(session.id) as any[];
  const profile = db.prepare('SELECT time_format FROM user_profiles WHERE user_id=?').get(session.id) as { time_format: '12h' | '24h' } | undefined;
  return <MyGigsManager gigs={gigs} timeFormat={profile?.time_format || '12h'} />;
}
