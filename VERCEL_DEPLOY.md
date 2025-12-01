# 🚀 Deploy no Vercel - Guia Simples

## ✅ Arquivos Corrigidos

Todos os problemas foram resolvidos:
- ✅ `vercel.json` - Corrigido (removido `routes`)
- ✅ `next.config.js` - Simplificado
- ✅ APIs separadas em rotas específicas
- ✅ `.vercelignore` criado

## 📦 Deploy no Vercel

### Opção 1: Via Interface do Vercel (Mais Fácil)

1. **Acesse:** https://vercel.com
2. **Faça login** com GitHub
3. **Clique em "Add New Project"**
4. **Importe seu repositório**
5. **Clique em "Deploy"**

**NÃO** precisa configurar NADA! Sem variáveis de ambiente necessárias.

### Opção 2: Via GitHub Automático

1. **Suba o código para GitHub:**
   ```bash
   cd /app
   git init
   git add .
   git commit -m "Currency Converter App"
   git branch -M main
   git remote add origin https://github.com/SkyyHd2855/seu-repo.git
   git push -u origin main
   ```

2. **No Vercel:**
   - Conecte seu GitHub
   - Selecione o repositório
   - Deploy automático a cada push!

### Opção 3: Via CLI

```bash
npm i -g vercel
cd /app
vercel login
vercel
```

## ⚡ O que Funciona

✅ **166+ moedas** carregando automaticamente
✅ **Conversão instantânea** com gráfico de 7 dias
✅ **Tema claro/escuro**
✅ **3 idiomas** (pt-BR, en, es)
✅ **PWA instalável**
✅ **Footer com seus links**
✅ **Atualização automática** a cada 10 minutos

## 🧪 Teste Após Deploy

Substitua `SEU-APP` pela URL do Vercel:

```bash
# Teste cotações
curl https://SEU-APP.vercel.app/api/rates

# Teste conversão
curl "https://SEU-APP.vercel.app/api/convert?from=USD&to=BRL&amount=100"

# Teste app
# Abra no navegador: https://SEU-APP.vercel.app
```

## 🔧 Troubleshooting

### Problema: Não consegue fazer deploy

**Erro comum:** "routes cannot be used with headers"

**Solução:** Já corrigido! O `vercel.json` foi simplificado.

### Problema: APIs não respondem

**Verifique:**
1. Acesse: `https://SEU-APP.vercel.app/api/rates`
2. Deve retornar JSON com 166 moedas
3. Se não funcionar, veja os logs no Vercel Dashboard

### Problema: Moedas não aparecem

**Verifique:**
1. No Vercel Dashboard, vá em "Functions"
2. Clique em `/api/rates`
3. Veja os logs
4. Verifique se a API externa está online:
   ```bash
   curl https://api.exchangerate-api.com/v4/latest/USD
   ```

## 📊 Performance Esperada

- ⚡ **First Load:** < 2s
- ⚡ **API Response:** < 500ms (com cache)
- ⚡ **Conversão:** < 1s
- 💰 **Custo:** Grátis (Hobby Plan)

## 🎯 Checklist Final

Antes de fazer deploy, verifique:

- [x] `vercel.json` sem `routes`
- [x] APIs em `/app/app/api/rates`, `/convert`, `/history`
- [x] `next.config.js` simplificado
- [x] Sem variáveis de ambiente necessárias
- [x] Testado localmente
- [x] `.vercelignore` criado

## 🌟 Pronto!

Seu conversor de moedas está 100% pronto para o Vercel!

**Qualquer problema, veja os logs no Vercel Dashboard.**
