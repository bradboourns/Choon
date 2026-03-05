import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const wantsJson = req.headers.get('accept')?.includes('application/json');
  const session = await getSession();
  if (!session) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    redirect('/login');
  }

  const data = await req.formData();
  const venueId = Number(data.get('venue_id'));
  const follow = String(data.get('follow') || '1') === '1';
  const redirectTo = String(data.get('redirect_to') || '/');

  if (!venueId) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'invalid_venue_id' }, { status: 400 });
    redirect(redirectTo);
  }

  const isOwnVenueMembership = Boolean(
    db.prepare('SELECT 1 FROM venue_memberships WHERE user_id = ? AND venue_id = ? AND approved = 1').get(session.id, venueId),
  );
  if (isOwnVenueMembership) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'own_venue_membership' }, { status: 403 });
    redirect(redirectTo);
  }

  if (follow) {
    db.prepare('INSERT OR IGNORE INTO venue_follows (user_id, venue_id) VALUES (?, ?)').run(session.id, venueId);
  } else {
    db.prepare('DELETE FROM venue_follows WHERE user_id = ? AND venue_id = ?').run(session.id, venueId);
  }

  if (wantsJson) return NextResponse.json({ ok: true, following: follow });
  redirect(redirectTo);
}
