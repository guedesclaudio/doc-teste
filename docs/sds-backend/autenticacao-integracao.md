---
sidebar_position: 2
title: Autenticação e Integração
description: Guia para realizar a integração com o SDS — autenticação, API Key, exemplos de eventos e consultas.
---

# Autenticação e Integração com o SDS

Este documento descreve os detalhes necessários para realizar a integração com o SDS. O objetivo é fornecer um guia claro e conciso para facilitar o processo de integração, garantindo uma experiência suave e eficiente.

---

## Autenticação

O SDS utiliza duas camadas de identificação em todas as requisições:

| Mecanismo | Onde enviar | Finalidade |
|---|---|---|
| **Bearer Token** | Header `Authorization` | Autenticação do usuário/serviço |
| **API Key** | Header `apikey` | Identificação do cliente e roteamento de alertas |

### API Key

A API Key identifica unicamente cada cliente que utiliza os serviços do SDS. Ela deve ser enviada em **todas** as requisições à API, no cabeçalho `apikey`.

```http
apikey: <sua-api-key>
```

:::info Solicitar uma API Key
A chave deve ser solicitada à squad responsável pelo SDS.
:::

---

## Alertas via Slack

O SDS possui integração com o Slack para envio de logs e alertas de erros. Cada cliente/time possui um canal dedicado para receber notificações de falhas em produção e QA.

Para verificar quais canais estão disponíveis para o seu time, consulte a seção [Canais de Alertas](#canais-de-alertas) abaixo.

:::tip
Não é obrigatório integrar todos os serviços disponíveis. Identifique previamente quais eventos e consultas são necessários para o seu caso de uso — isso simplifica o desenvolvimento. Algumas integrações podem exigir a composição de várias APIs; a equipe do SDS está disponível para apoiar.
:::

---

## Exemplos de Integração

### Chave para testes

Durante a fase de desenvolvimento, utilize a seguinte chave de exemplo:

```
73bcaaa458bff0d27989ed331b68b64d
```

Essa chave deve ser usada:
- No campo `source_id` dos eventos enviados
- No header `apikey` das consultas à API

---

### Exemplo de evento

```json
{
  "source_id": "73bcaaa458bff0d27989ed331b68b64d",
  "source_version": "1.0.0",
  "source_user": "test",
  "type": "farm_register",
  "version": "2.0",
  "data": {
    "external_id": "1",
    "farm_holdings": [
      {
        "holding_uuid": "aa03455f-9172-4dea-88fe-f2af435c861e",
        "account_uuid": "91957d91-5957-433a-95d2-ac5c0be0dcda",
        "regions": ["f98d58b3-2b0e-49b0-85b5-b4afe163e1b6"],
        "producers": ["8a92f040-93c7-4ffa-9fc1-f9dd36f5baba"],
        "technicians": ["62f2fb3d-5c59-438a-96bb-c858e651f570"],
        "is_holder": true
      }
    ],
    "name": "Poultry Farm",
    "city": "Campinas",
    "latitude": -22.932924,
    "longitude": -47.073845,
    "is_verticalized": false,
    "currency_unit": "brl",
    "measurement_unit": "kg",
    "status": "active",
    "production_type": "commercial",
    "production_system": "pullets",
    "production_stages": ["pullets"]
  }
}
```

---

### Exemplo de consulta (cURL)

```bash
curl --location 'https://sds-backend.agriness-dev.com/api/holdings/aa03455f-9172-4dea-88fe-f2af435c861e/farms?page=1&page_size=10' \
  --header 'accept: application/json' \
  --header 'apikey: 73bcaaa458bff0d27989ed331b68b64d'
```

---

## Canais de Alertas

### Produção

| Canal | Link |
|---|---|
| `sds-erros-prd-ais_server` | https://agriness.slack.com/archives/C0661JW3CRF |
| `sds-erros-prd-corp` | https://agriness.slack.com/archives/C069851N2RE |
| `sds-erros-prd-corp_ingest` | https://agriness.slack.com/archives/C068K87D1MH |
| `sds-erros-prd-p4app` | https://agriness.slack.com/archives/C068K88JQ6P |
| `sds-erros-prd-s4app` | https://agriness.slack.com/archives/C068KKQ9JQJ |
| `sds-erros-prd-s4web` | https://agriness.slack.com/archives/C068KKRAJP4 |
| `sds-erros-prd-presence` | https://agriness.slack.com/archives/C0698DBKM5W |
| `sds-erros-prd-bff-roots` | https://agriness.slack.com/archives/C068KPP0ERZ |

### QA

| Canal | Link |
|---|---|
| `sds-erros-qa-corp` | https://agriness.slack.com/archives/C068VEH8GCR |
| `sds-erros-qa-corp_ingest` | https://agriness.slack.com/archives/C068DTF2F8D |
| `sds-erros-qa-p4app` | https://agriness.slack.com/archives/C068CL2BYCW |
| `sds-erros-qa-s4app` | https://agriness.slack.com/archives/C068K6HEG03 |
| `sds-erros-qa-s4web` | https://agriness.slack.com/archives/C068XUECXJ5 |
| `sds-erros-qa-presence` | https://agriness.slack.com/archives/C068K9X5HUJ |
| `sds-erros-qa-ais_server` | https://agriness.slack.com/archives/C068G9DPWG5 |
| `sds-erros-qa-bff-roots` | https://agriness.slack.com/archives/C0698LLKSRE |

---

## Dúvidas e Suporte

Entre no canal de Slack do SDS: **SDS Sustentação**
