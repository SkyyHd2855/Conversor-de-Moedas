import { NextResponse } from 'next/server';
import { fetchHistory } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || 'USD';
    const to = searchParams.get('to') || 'BRL';
    const days = parseInt(searchParams.get('days') || '7');

    const history = await fetchHistory(from, to, days);
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error in /api/history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history', message: error.message },
      { status: 500 }
    );
  }
}