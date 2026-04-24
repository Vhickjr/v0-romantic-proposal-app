import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const STATE_PREFIX = 'app-state/';

interface AppState {
  accepted: boolean;
  timestamp: number | null;
}

async function readState(): Promise<AppState> {
  try {
    const { blobs } = await list({ prefix: STATE_PREFIX });
    if (blobs.length === 0) return { accepted: false, timestamp: null };

    // Most recently uploaded wins
    const latest = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const res = await fetch(latest.url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return { accepted: false, timestamp: null };
  }
}

async function writeState(state: AppState) {
  // Clear old state blobs so they don't accumulate
  const { blobs } = await list({ prefix: STATE_PREFIX });
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url));
  }

  await put(`${STATE_PREFIX}state.json`, JSON.stringify(state), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
}

export async function GET() {
  const state = await readState();
  return NextResponse.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const state: AppState = {
    accepted: Boolean(body.accepted),
    timestamp: body.timestamp ?? null,
  };
  await writeState(state);
  return NextResponse.json(state);
}
