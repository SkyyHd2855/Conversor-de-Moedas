# 🚀 Como Fazer Deploy no Vercel

## Preparação

### 1. Arquivos Importantes
✅ Todos os arquivos já estão configurados:
- `/app/app/api/rates/route.js` - API de cotações
- `/app/app/api/convert/route.js` - API de conversão  
- `/app/app/api/history/route.js` - API de histórico
- `/app/lib/api.js` - Funções compartilhadas
- `/app/vercel.json` - Configuração do Vercel (CORRIGIDA)
- `/app/.vercelignore` - Arquivos ignorados no deploy

### 2. Estrutura das APIs
```
/app
├── app/
│   ├── api/
│   │   ├── rates/route.js       ← Edge runtime
│   │   ├── convert/route.js     ← Edge runtime
│   │   └── history/route.js     ← Edge runtime
│   └── page.js
└── lib/
    └── api.js                    ← Funções compartilhadas
```

## Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Crie um repositório no GitHub:**
   ```bash
   cd /app
   git init
   git add .
   git commit -m "Initial commit - Currency Converter"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/currency-converter.git
   git push -u origin main
   ```

2. **No Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe o repositório do GitHub
   - Clique em "Deploy"

### Opção 2: Via Vercel CLI

1. **Instale a Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd /app
   vercel
   ```

## Variáveis de Ambiente

**NÃO** precisa configurar variáveis de ambiente! 
Todas as APIs usadas são públicas e gratuitas:
- ✅ ExchangeRate-API (sem chave)
- ✅ Frankfurter.app (sem chave)

## Verificação

Após o deploy, teste as seguintes URLs:

```bash
# Teste 1: API de cotações
https://SEU-APP.vercel.app/api/rates

# Teste 2: Conversão
https://SEU-APP.vercel.app/api/convert?from=USD&to=BRL&amount=100

# Teste 3: Histórico
https://SEU-APP.vercel.app/api/history?from=USD&to=BRL&days=7

# Teste 4: App principal
https://SEU-APP.vercel.app
```

## Troubleshooting

### Problema: Moedas não aparecem
**Solução:** Verifique os logs no Vercel:
1. Acesse o projeto no Vercel
2. Clique em "Functions"
3. Veja os logs das funções `/api/rates`, `/api/convert`

### Problema: Erro 500 nas APIs
**Solução:** 
1. Verifique se as APIs externas estão acessíveis
2. Teste manualmente:
   ```bash
   curl https://api.exchangerate-api.com/v4/latest/USD
   curl https://api.frankfurter.app/latest
   ```

### Problema: Gráfico não aparece
**Solução:**
1. Verifique se a API de histórico está respondendo
2. Teste: `curl https://SEU-APP.vercel.app/api/history?from=USD&to=BRL`

## Performance

### Cache Configurado
- ✅ Cache de 10 minutos (600 segundos)
- ✅ Stale-while-revalidate de 5 minutos
- ✅ Edge runtime para baixa latência

### Edge Runtime
Todas as APIs usam Edge Runtime do Vercel:
- ⚡ Resposta ultra-rápida
- 🌍 Distribuído globalmente
- 💰 Custo otimizado

## Domínio Personalizado

Para usar seu próprio domínio:
1. No Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Configure os DNS conforme instruções

## Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Teste as APIs manualmente
3. Verifique se as APIs externas estão online

## ✅ Checklist Final

Antes de fazer deploy:
- [x] APIs separadas em rotas específicas
- [x] Edge runtime configurado
- [x] Error handling implementado
- [x] Cache configurado
- [x] vercel.json criado
- [x] CORS configurado
- [x] Sem variáveis de ambiente necessárias
- [x] Testado localmente

**Seu app está pronto para produção! 🚀**
