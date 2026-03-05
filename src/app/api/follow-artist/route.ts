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
  const artistId = Number(data.get('artist_id'));
  const follow = String(data.get('follow') || '1') === '1';
  const redirectTo = String(data.get('redirect_to') || '/');

  if (!artistId) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'invalid_artist_id' }, { status: 400 });
    redirect(redirectTo);
  }

  if (follow) {
    db.prepare('INSERT OR IGNORE INTO artist_follows (user_id, artist_id) VALUES (?, ?)').run(session.id, artistId);
  } else {
    db.prepare('DELETE FROM artist_follows WHERE user_id = ? AND artist_id = ?').run(session.id, artistId);
  }

  if (wantsJson) return NextResponse.json({ ok: true, following: follow });
  redirect(redirectTo);
}
