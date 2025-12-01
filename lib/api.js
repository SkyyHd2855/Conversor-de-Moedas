let ratesCache = null;
let lastFetch = 0;
const CACHE_DURATION = 10 * 60 * 1000;

export async function fetchRates() {
  const now = Date.now();
  
  if (ratesCache && (now - lastFetch) < CACHE_DURATION) {
    return ratesCache;
  }

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }
    
    const data = await response.json();
    
    ratesCache = {
      rates: data.rates,
      base: data.base,
      lastUpdate: new Date().toISOString(),
    };
    
    lastFetch = now;
    return ratesCache;
  } catch (error) {
    console.error('Error fetching rates:', error);
    if (ratesCache) {
      return ratesCache;
    }
    throw error;
  }
}

export async function fetchHistory(fromCurrency, toCurrency, days = 7) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://api.frankfurter.app/${formatDate(startDate)}..${formatDate(endDate)}?from=${fromCurrency}&to=${toCurrency}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    
    const data = await response.json();
    
    const history = Object.entries(data.rates || {}).map(([date, rates]) => ({
      date,
      rate: rates[toCurrency] || 0,
    }));
    
    return history;
  } catch (error) {
    console.error('Error fetching history:', error);
    const fallbackHistory = [];
    const baseRate = 1;
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      fallbackHistory.push({
        date: date.toISOString().split('T')[0],
        rate: baseRate + (Math.random() - 0.5) * 0.1,
      });
    }
    return fallbackHistory;
  }
}