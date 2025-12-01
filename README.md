# 💱 Conversor de Moedas - Currency Converter

Aplicativo web de conversão de moedas de alto desempenho construído com Next.js 14.

## ✨ Funcionalidades

### 🎯 Principais
- ✅ **Conversão de 170+ moedas globais** em tempo real
- ✅ **API pública gratuita** (ExchangeRate-API + Frankfurter.app) com cache de 10 minutos
- ✅ **Gráfico de histórico** dos últimos 7 dias usando recharts
- ✅ **Interface responsiva** (mobile, tablet, desktop)
- ✅ **PWA instalável** - funciona como app nativo
- ✅ **Temas claro/escuro** com persistência
- ✅ **Suporte a 3 idiomas**: Português (pt-BR), Inglês (en), Espanhol (es)
- ✅ **Busca de moedas** em tempo real
- ✅ **Lista completa** de todas as moedas com taxas vs USD
- ✅ **Botão inverter** moedas (swap)
- ✅ **Footer com última atualização** das cotações

### 🚀 Performance
- ✅ Server-Side Rendering (SSR)
- ✅ Cache de cotações (10 minutos)
- ✅ Hot reload no desenvolvimento
- ✅ Código TypeScript-ready
- ✅ Otimizado para SEO

### 🎨 Design
- ✅ Tailwind CSS + shadcn/ui
- ✅ Design moderno com gradientes
- ✅ Animações suaves
- ✅ Footer customizado: "Feito com ❤ pelo Dev SkyyHd"

## 🛠️ Tecnologias

- **Framework**: Next.js 14.2.3
- **Linguagem**: JavaScript (TypeScript-ready)
- **Gerenciamento de Estado**: Zustand com persistência
- **Estilização**: Tailwind CSS + shadcn/ui
- **API**: ExchangeRate-API (gratuita)
- **PWA**: Service Worker + Manifest

## 📦 Instalação

```bash
# Instalar dependências
yarn install

# Iniciar servidor de desenvolvimento
yarn dev

# Build para produção
yarn build

# Iniciar servidor de produção
yarn start
```

## 🌐 API Routes

### GET /api/rates
Retorna todas as taxas de câmbio e última atualização.

```json
{
  "rates": { "USD": 1, "BRL": 5.34, "EUR": 0.863, ... },
  "base": "USD",
  "lastUpdate": "2025-12-01T00:00:01.000Z"
}
```

### GET /api/convert
Converte valores entre moedas e retorna histórico dos últimos 7 dias.

**Query params:**
- `from`: código da moeda origem (ex: USD)
- `to`: código da moeda destino (ex: BRL)
- `amount`: valor a converter (ex: 100)

```json
{
  "from": "USD",
  "to": "BRL",
  "amount": 100,
  "result": 534,
  "rate": 5.34,
  "lastUpdate": "2025-12-01T00:00:01.000Z",
  "history": [
    { "date": "2025-11-24", "rate": 5.3826 },
    { "date": "2025-11-25", "rate": 5.3655 },
    ...
  ]
}
```

### GET /api/history
Retorna histórico de taxas de câmbio.

**Query params:**
- `from`: código da moeda origem (padrão: USD)
- `to`: código da moeda destino (padrão: BRL)
- `days`: número de dias (padrão: 7)

```json
{
  "history": [
    { "date": "2025-11-24", "rate": 5.3826 },
    { "date": "2025-11-25", "rate": 5.3655 },
    ...
  ]
}
```

## 🎯 Estrutura do Projeto

```
/app/
├── app/
│   ├── api/[[...path]]/route.js  # API Routes (rates, convert)
│   ├── page.js                    # Página principal
│   ├── layout.js                  # Layout + PWA
│   └── globals.css                # Estilos globais
├── store/
│   └── useStore.js                # Zustand store (tema, idioma)
├── lib/
│   ├── translations.js            # Traduções (pt-BR, en, es)
│   └── currencyNames.js           # Nomes das moedas
├── components/ui/                 # shadcn/ui components
├── public/
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service Worker
└── package.json
```

## 🌍 Internacionalização (i18n)

Idiomas suportados:
- 🇧🇷 Português (pt-BR) - Padrão
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)

Troca de idioma persistida localmente via Zustand.

## 🎨 Temas

- ☀️ **Tema Claro** (padrão)
- 🌙 **Tema Escuro**

Persistência via localStorage com detecção automática.

## 📱 PWA

O aplicativo pode ser instalado como PWA em:
- 📱 Dispositivos móveis (Android/iOS)
- 💻 Desktop (Chrome, Edge, Safari)

Para instalar: Clique no ícone de instalação no navegador ou use "Adicionar à tela inicial".

## 🔄 Cache e Atualização

- Cotações são atualizadas **a cada 10 minutos** automaticamente
- Data da última atualização é exibida na interface
- Cache no servidor para melhor performance

## 🚀 Deploy

O aplicativo está pronto para deploy em:
- Vercel (recomendado)
- Netlify
- Docker
- VPS/Cloud

## 📄 Licença

Projeto desenvolvido por **SkyyHd**

---

**Feito com ❤ pelo Dev SkyyHd**
