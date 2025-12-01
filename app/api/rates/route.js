import { NextResponse } from 'next/server';
import { fetchRates } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchRates();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error in /api/rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates', message: error.message },
      { status: 500 }
    );
  }
}