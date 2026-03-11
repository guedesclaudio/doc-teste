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

async function test() {
  const body = {
    "source_id": "sds-lib-test",
    "source_version": "1.0.0",
    "source_user": "test",
    "type": "animal_nurse_mother_register",
    "version": "1.0",
    "data": {
      "farm_uuid": "1adb9694-c330-418e-93ad-c9647150367c",
      "date": "2025-01-03",
      "animal_uuid": "c67c3614-db9b-4796-95c0-a90e715c494e"
    }
  };
  const headers = { apikey: 'sua-api-key' };
  const urlSDS = 'https://sds-backend.agriness-qa.com';
  await processInput(body, urlSDS, headers);
}
```

## Formato da resposta

- Sucesso
```json
{
	"data": {
		"event_id": "69b0818839b650c3e7f82334",
		"uuid": "6658dc8c-bd21-42a7-ae3f-5894ed46550b"
	},
	"errors": [],
	"logUUID": "b57a6d00-c82e-4a95-bc5c-ac3b8c1211a0"
}
```

- Erro
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
