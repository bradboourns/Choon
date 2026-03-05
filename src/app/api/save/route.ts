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
  const gigId = Number(data.get('gig_id'));
  const action = String(data.get('action') || 'save');
  const redirectTo = String(data.get('redirect_to') || '/saved');

  if (!gigId) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'invalid_gig_id' }, { status: 400 });
    redirect(redirectTo);
  }

  if (action === 'unsave') {
    db.prepare('DELETE FROM saved_gigs WHERE user_id = ? AND gig_id = ?').run(session.id, gigId);
  } else {
    db.prepare('INSERT OR IGNORE INTO saved_gigs (user_id,gig_id) VALUES (?,?)').run(session.id, gigId);
  }

  if (wantsJson) return NextResponse.json({ ok: true, saved: action !== 'unsave' });
  redirect(redirectTo);
}
