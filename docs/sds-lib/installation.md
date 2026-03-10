---
sidebar_position: 2
---

# Instalação

## Requisitos

- Node.js **≥ 18**
- npm, yarn ou pnpm

## Instalar

```bash
npm install @sds-lib/test
```

```bash
yarn add @sds-lib/test
```

```bash
pnpm add @sds-lib/test
```

## Uso básico

```typescript
import { processInput, versionLib } from '@sds-lib/test';

await processInput(body, this.url_sds, this.headers);
```

## Formato da resposta

```json
{
  "data": [],
  "errors": [
    {
      "error": "SDS9999",
      "description": "Max retry attempts reached. No data received."
    }
  ],
  "logUUID": "1b40ce67-6a28-478e-9e50-a7e014bebfdf"
}
```

| Campo | Descrição |
|---|---|
| `data` | Resultado do processamento quando bem-sucedido |
| `errors` | Lista de erros retornados pela lib, cada um com `error` (código) e `description` |
| `logUUID` | Identificador único do log para rastreamento (ver [Manual de Debug](./debug)) |

## Solução de problemas

**Module not found**

Certifique-se de estar rodando Node.js ≥ 18 e que o pacote está listado em `dependencies`.
