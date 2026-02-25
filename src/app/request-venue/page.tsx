import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requestVenueAction } from '../actions';

export default async function RequestVenuePage({ searchParams }: { searchParams: Promise<{ request?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'venue_admin') redirect('/login');

  const query = await searchParams;

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Request a new venue listing</h1>
      <p className='text-sm text-zinc-400'>
        Submit a venue you own/manage. Admin can approve or reject, and approved venues appear as separate listings for fans.
      </p>

      <form action={requestVenueAction} className='space-y-3 rounded-xl border border-zinc-700 p-4'>
        {query.request === 'sent' && <p className='rounded bg-emerald-900/40 p-2 text-sm text-emerald-300'>Request sent to admin for approval.</p>}
        <input name='venue_name' required placeholder='Venue name' className='w-full rounded bg-zinc-900 p-2' />
        <input name='abn' required placeholder='ABN' className='w-full rounded bg-zinc-900 p-2' />
        <input name='address' required placeholder='Street address' className='w-full rounded bg-zinc-900 p-2' />
        <div className='grid grid-cols-2 gap-2'>
          <input name='suburb' required placeholder='Suburb' className='rounded bg-zinc-900 p-2' />
          <input name='postcode' required placeholder='Postcode' className='rounded bg-zinc-900 p-2' />
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <input name='city' defaultValue='Gold Coast' required placeholder='City' className='rounded bg-zinc-900 p-2' />
          <input name='state' defaultValue='QLD' required placeholder='State' className='rounded bg-zinc-900 p-2' />
        </div>
        <input name='website' placeholder='Website (optional)' className='w-full rounded bg-zinc-900 p-2' />
        <input name='instagram' placeholder='Instagram handle (optional)' className='w-full rounded bg-zinc-900 p-2' />
        <textarea name='notes' placeholder='Notes for admin (optional)' className='w-full rounded bg-zinc-900 p-2' />
        <button className='rounded bg-zinc-100 px-4 py-2 text-zinc-900'>Send venue request</button>
      </form>
    </div>
  );
}
