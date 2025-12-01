'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { translations } from '@/lib/translations';
import { currencyNames } from '@/lib/currencyNames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Globe, ArrowLeftRight, Search, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const { theme, setTheme, language, setLanguage } = useStore();
  const t = translations[language] || translations['pt-BR'];

  const [mounted, setMounted] = useState(false);
  const [rates, setRates] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRates();
    
    const intervalId = setInterval(() => {
      fetchRates(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchRates = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const response = await fetch('/api/rates');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.rates && Object.keys(data.rates).length > 0) {
        setRates(data.rates);
        setLastUpdate(data.lastUpdate);
      } else {
        throw new Error('No rates data received');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      if (!rates) {
        setRates({});
      }
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchRates();
    if (result) {
      convertCurrency();
    }
  };

  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

    try {
      const response = await fetch(
        `/api/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
    } catch (error) {
      console.error('Error converting:', error);
      setResult(null);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR');
  };

  const currencyList = rates && Object.keys(rates).length > 0 ? Object.keys(rates).sort() : [];
  
  const filteredCurrencies = currencyList.filter((code) => {
    const name = currencyNames[code] || code;
    const searchLower = searchTerm.toLowerCase();
    return (
      code.toLowerCase().includes(searchLower) ||
      name.toLowerCase().includes(searchLower)
    );
  });
  
  const hasCurrencies = currencyList.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Atualizar cotações"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[100px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">PT</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-lg">{t.loading}</span>
          </div>
        ) : !hasCurrencies ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <p className="text-xl font-semibold text-destructive">{t.error}</p>
                <p className="text-muted-foreground">Não foi possível carregar as cotações. Tente novamente.</p>
                <Button onClick={() => fetchRates()} className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="converter" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="converter">{t.title}</TabsTrigger>
              <TabsTrigger value="currencies">{t.allCurrencies}</TabsTrigger>
            </TabsList>

            <TabsContent value="converter">
              <Card>
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.from}</label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyList.map((code) => (
                            <SelectItem key={code} value={code}>
                              {code} - {currencyNames[code] || code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={swapCurrencies}
                      className="mb-0 md:mb-0"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </Button>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.to}</label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyList.map((code) => (
                            <SelectItem key={code} value={code}>
                              {code} - {currencyNames[code] || code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.amount}</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <Button onClick={convertCurrency} className="w-full" size="lg">
                    {t.convert}
                  </Button>

                  {result && (
                    <>
                      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">{t.result}</p>
                            <p className="text-4xl font-bold">
                              {result.result.toLocaleString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{' '}
                              {result.to}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              1 {result.from} = {result.rate} {result.to}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {result.history && result.history.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">{t.historyChart}</CardTitle>
                            <CardDescription>
                              {result.from} → {result.to}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={result.history}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis 
                                  dataKey="date" 
                                  className="text-xs"
                                  tickFormatter={(date) => {
                                    const d = new Date(date);
                                    return `${d.getDate()}/${d.getMonth() + 1}`;
                                  }}
                                />
                                <YAxis 
                                  className="text-xs"
                                  domain={['auto', 'auto']}
                                  tickFormatter={(value) => value.toFixed(4)}
                                />
                                <Tooltip 
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                  }}
                                  labelFormatter={(date) => {
                                    return new Date(date).toLocaleDateString(
                                      language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR'
                                    );
                                  }}
                                  formatter={(value) => [value.toFixed(4), t.exchangeRate]}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="rate" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={2}
                                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="currencies">
              <Card>
                <CardHeader>
                  <CardTitle>{t.allCurrencies}</CardTitle>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t.search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto">
                    <div className="grid gap-2">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((code) => (
                          <div
                            key={code}
                            className="flex justify-between items-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                          >
                            <div>
                              <p className="font-semibold">{code}</p>
                              <p className="text-sm text-muted-foreground">
                                {currencyNames[code] || code}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono">{rates[code].toFixed(4)}</p>
                              <p className="text-xs text-muted-foreground">vs USD</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">{t.noResults}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <footer className="mt-16 text-center text-muted-foreground border-t pt-8 space-y-4">
          {lastUpdate && (
            <p className="text-sm">
              {t.lastUpdate}: {formatDate(lastUpdate)}
            </p>
          )}
          <p className="text-lg">
            Feito com <span className="text-red-500 animate-pulse">❤</span> pelo Dev{' '}
            <a 
              href="https://devskyyhd.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              SkyyHd
            </a>
          </p>
          {mounted && (
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/SkyyHd2855/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-foreground"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}