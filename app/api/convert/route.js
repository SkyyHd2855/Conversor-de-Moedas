import { NextResponse } from 'next/server';
import { fetchRates, fetchHistory } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const amount = parseFloat(searchParams.get('amount'));

    if (!from || !to || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid parameters. Required: from, to, amount' },
        { status: 400 }
      );
    }

    const data = await fetchRates();
    const fromRate = data.rates[from];
    const toRate = data.rates[to];

    if (!fromRate || !toRate) {
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      );
    }

    const result = (amount / fromRate) * toRate;
    const history = await fetchHistory(from, to, 7);

    return NextResponse.json({
      from,
      to,
      amount,
      result: parseFloat(result.toFixed(2)),
      rate: parseFloat((toRate / fromRate).toFixed(6)),
      lastUpdate: data.lastUpdate,
      history,
    });
  } catch (error) {
    console.error('Error in /api/convert:', error);
    return NextResponse.json(
      { error: 'Conversion failed', message: error.message },
      { status: 500 }
    );
  }
}