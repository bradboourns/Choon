import db from '@/lib/db';
import { loginAction, quickLoginAction, requestPasswordResetAction } from '../actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string }> }) {
  const query = await searchParams;
  const quickProfiles = db.prepare(`SELECT username, role FROM users WHERE username IS NOT NULL AND username != '' ORDER BY created_at ASC, id ASC`).all() as Array<{ username: string; role: string }>;

  return (
    <div className='mx-auto flex max-w-md flex-col gap-4 rounded-xl border border-zinc-700 p-4'>
      <form action={loginAction} className='flex flex-col gap-3'>
        <h1 className='text-2xl font-bold'>Log in</h1>
        <p className='text-sm text-zinc-400'>Use your email or username and password.</p>
        {query.error === 'wrong-password' && <p className='rounded bg-red-900/60 p-2 text-sm text-red-100'>Password is incorrect. Please try again.</p>}
        {query.error === 'account-not-found' && <p className='rounded bg-amber-900/60 p-2 text-sm text-amber-100'>No account matched that email/username.</p>}
        {query.error === 'missing-identifier' && <p className='rounded bg-amber-900/60 p-2 text-sm text-amber-100'>Enter your username or email to request a reset.</p>}
        {query.reset === 'requested' && <p className='rounded bg-emerald-900/50 p-2 text-sm text-emerald-100'>Reset request sent to admin. They will contact your venue with new login details.</p>}
        <input name='username' type='text' required placeholder='Email or username' className='rounded bg-zinc-900 p-2' />
        <input name='password' type='password' required placeholder='Password' className='rounded bg-zinc-900 p-2' />
        <button className='rounded bg-violet-600 p-2'>Log in</button>
      </form>
      <form action={requestPasswordResetAction} className='flex flex-col gap-2 rounded-xl border border-zinc-800 p-3'>
        <p className='text-sm text-zinc-300'>Forgot password?</p>
        <input name='username' type='text' placeholder='Email or username' className='rounded bg-zinc-900 p-2' />
        <button className='rounded border border-zinc-600 p-2 text-sm hover:bg-zinc-900'>Request password reset from admin</button>
      </form>

      <div className='border-t border-zinc-800 pt-3'>
        <p className='text-xs uppercase tracking-wide text-zinc-500'>Quick test logins</p>
        <div className='mt-2 flex flex-wrap gap-2'>
          {quickProfiles.map((profile) => (
            <form key={profile.username} action={quickLoginAction}>
              <input type='hidden' name='profile' value={profile.username} />
              <button type='submit' className='rounded-full border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900'>
                {profile.username} · {profile.role}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
