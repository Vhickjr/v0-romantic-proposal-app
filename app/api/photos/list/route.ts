import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'love-photos/' });
    return NextResponse.json(blobs);
  } catch {
    return NextResponse.json([]);
  }
}
