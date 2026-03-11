---
sidebar_position: 3
title: Padrão de Eventos
description: Formato e descrição dos campos necessários para o envio de eventos ao SDS.
---

# Padrão de Preenchimento dos Eventos do SDS

Abaixo, detalhamos o formato e a descrição dos campos necessários para o envio de eventos ao SDS. Seguindo esse padrão, garantimos consistência, rastreabilidade e facilidade de integração.

---

## Formato do Evento

```json
{
  "source_id": "ec7ca42e-2146-475c-aa7a-3dad27a3e262",
  "source_version": "1.0.0",
  "source_user": "decbbd95-4ee8-4bff-9bfd-9edfd590e3d2",
  "type": "animal_group_register",
  "version": "1.5",
  "source_tz": "AMERICA/SAO_PAULO",
  "data": {
    // Dados específicos do evento
  }
}
```

---

## Descrição dos Campos

### `source_id`

| | |
|---|---|
| **Descrição** | Identificador único da API que está enviando o evento |
| **Origem** | API Key fornecida para o sistema que realiza a integração |
| **Uso** | Permite identificar a origem dos eventos e gerar relatórios internos de rastreamento |

```json
"source_id": "ec7ca42e-2146-475c-aa7a-3dad27a3e262"
```

---

### `source_version`

| | |
|---|---|
| **Descrição** | Versão atual do sistema emissor do evento |
| **Origem** | `process.env.npm_package_version` |
| **Uso** | Vincula a versão do sistema ao evento, facilitando rastreamento de problemas entre versões |

```json
"source_version": "1.0.0"
```

:::tip Exemplo de uso
*"Na versão 1.3 do sistema sds-tests, o campo `name` não estava presente no evento `animal_group_register`."*
:::

---

### `source_user`

| | |
|---|---|
| **Descrição** | Identificador do usuário que realizou a ação no sistema |
| **Com autenticação** | UUID do usuário presente no token de autenticação |
| **Sem autenticação** | Nome do projeto responsável pelo evento |

```json
// Com autenticação de usuário
"source_user": "decbbd95-4ee8-4bff-9bfd-9edfd590e3d2"

// Sem autenticação de usuário
"source_user": "ais_server"
```

---

### `source_tz`

| | |
|---|---|
| **Descrição** | Fuso horário do usuário (não da farm) |
| **Com autenticação** | Fuso horário do usuário com base no navegador |
| **Sem autenticação** | Campo não obrigatório — pode ser omitido |
| **Uso** | Permite rastrear a timezone do usuário e verificar inconsistências de horário |

```json
"source_tz": "AMERICA_SAO_PAULO"
```

:::caution Atenção
Use `_` (underscore) em vez de `/` (barra) no valor da timezone. Exemplo: `AMERICA_SAO_PAULO` e não `AMERICA/SAO_PAULO`.

Para a lista completa de timezones disponíveis, consulte o [banco de dados de fusos horários tz](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
:::

---

### `type`

| | |
|---|---|
| **Descrição** | Tipo do evento enviado ao SDS |
| **Origem** | Define o tipo conforme a ação realizada no sistema |
| **Uso** | Identifica a natureza do evento para processamento específico no SDS |

```json
"type": "animal_group_register"
```

---

### `version`

| | |
|---|---|
| **Descrição** | Versão do formato do tipo do evento |
| **Origem** | Deve ser atualizado conforme alterações no payload |
| **Uso** | Permite a evolução dos formatos de evento, garantindo compatibilidade retroativa e suporte a novos campos ou regras de negócio |

```json
"version": "1.5"
```

---

## Validações do Payload (`data`)

O objeto `data` de cada evento passa por validações automáticas antes de ser processado. Abaixo estão os tipos de validação aplicados e o comportamento esperado em cada caso.

### Tipos primitivos

| Tipo | Validação aplicada | Erro em caso de falha |
|---|---|---|
| `string` | Deve ser uma string não nula | Campo rejeitado |
| `int` | Deve ser um inteiro (sem casas decimais) | Campo rejeitado |
| `float` | Deve ser um número (inteiro ou decimal) | Campo rejeitado |
| `boolean` | Deve ser `true` ou `false` | Campo rejeitado |

```json
// Exemplos válidos
"name": "Granja Central",       // string
"age_days": 42,                 // int
"weight": 3.75,                 // float
"is_active": true               // boolean
```

---

### Data e hora

| Validação | Comportamento |
|---|---|
| Formato aceito | ISO 8601 — `YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ` |
| Fuso horário | Interpretado em UTC quando não especificado |
| Valor nulo | Rejeitado se o campo for obrigatório |

```json
"date": "2024-06-15",
"born_at": "2024-06-15T08:30:00Z"
```

:::caution
Datas enviadas sem timezone são interpretadas como UTC. Considere sempre enviar com offset ou usar `source_tz` para contextualizar o horário do usuário.
:::

---

### Enum

Campos do tipo enum só aceitam valores pertencentes ao conjunto definido. Qualquer valor fora do conjunto é rejeitado.

```json
// Válido
"status": "active"

// Inválido — valor não pertence ao enum
"status": "ativo"
```

---

### Objeto aninhado

Objetos dentro de `data` são validados recursivamente. Campos obrigatórios dentro do objeto também são verificados.

```json
"address": {
  "city": "Campinas",      // obrigatório
  "state": "SP"            // obrigatório
}
```

---

### Array

| Validação | Descrição |
|---|---|
| **Tipo dos itens** | Cada elemento deve corresponder ao tipo esperado |
| **Mínimo de itens** | Array não pode ter menos que o mínimo definido |
| **Máximo de itens** | Array não pode exceder o limite de tamanho |
| **Array vazio** | Rejeitado quando o campo é obrigatório e tem `minItems > 0` |

```json
// Array de strings — válido
"production_stages": ["pullets", "broiler"]

// Array vazio — rejeitado se minItems = 1
"production_stages": []
```

---

### Limites numéricos (`min` / `max`)

Campos numéricos podem ter restrições de valor mínimo e máximo. Valores fora do intervalo são rejeitados.

```json
// Campo com min: 0 e max: 100
"percentage": 85     // válido
"percentage": 110    // inválido — excede o máximo
"percentage": -5     // inválido — abaixo do mínimo
```

---

### Tamanho de string

Strings podem ter restrição de tamanho mínimo e máximo de caracteres.

```json
// Campo com maxLength: 100
"name": "Granja São João"          // válido
"name": "..."                      // inválido se minLength > 0
```

---

### Campos obrigatórios vs. opcionais

| Comportamento | Descrição |
|---|---|
| Campo obrigatório ausente | Evento rejeitado com erro de validação |
| Campo opcional ausente | Aceito — valor tratado como `null` ou omitido |
| Campo nulo em obrigatório | Rejeitado |

:::info
Cada tipo de evento possui seu próprio schema com a lista exata de campos obrigatórios e opcionais. Consulte o [Explorador de Eventos](./events.mdx) para visualizar o schema de cada evento.
:::

---

## Resumo dos Campos

| Campo | Obrigatório | Exemplo |
|---|---|---|
| `source_id` | Sim | `"ec7ca42e-..."` |
| `source_version` | Sim | `"1.0.0"` |
| `source_user` | Sim | `"decbbd95-..."` ou `"ais_server"` |
| `source_tz` | Apenas com autenticação | `"AMERICA_SAO_PAULO"` |
| `type` | Sim | `"animal_group_register"` |
| `version` | Sim | `"1.5"` |
| `data` | Sim | Objeto específico do evento |
