---
sidebar_position: 1
---

# Introdução

**sds-lib** é o motor de validação para eventos de gestão de animais desenvolvido pela equipe **Agriness**.

Ela fornece um sistema de regras centralizado e modular que garante a integridade dos dados em todos os eventos do ciclo de vida animal — do parto e desmame até transferências e registros de baixa.

## O que a sds-lib faz?

Quando um usuário realiza uma ação (ex: registrar um desmame, atualizar uma transferência ou excluir um registro de baixa), a **sds-lib** valida o evento contra um conjunto de regras predefinido. Se uma violação for detectada, um código de erro estruturado é retornado.

```json
{
  "error": "AN009",
  "message": "Não é possível excluir o desmame se existirem eventos posteriores.",
  "field": "date"
}
```

## Conceitos principais

| Conceito | Descrição |
|---|---|
| **Evento** | Uma ação sobre o registro de um animal (ex: `animal_weaning_register`) |
| **Regra** | Uma restrição que deve ser satisfeita para que o evento seja válido |
| **Código de Erro** | Identificador único de uma violação de regra (ex: `AN009`) |
| **Grupo** | Categoria lógica de regras (ex: `animal_weaning`) |
| **Espécie** | A espécie animal à qual a regra se aplica (ex: `sow`, `gilt`) |
| **Estágio** | O estágio reprodutivo ao qual a regra se aplica (ex: `lactating`, `gestation`) |

## Convenção de nomenclatura dos eventos

Todos os eventos seguem o padrão: `{grupo}_{ação}`

| Sufixo de ação | Significado |
|---|---|
| `_register` | Criação de um novo registro |
| `_update` | Modificação de um registro existente |
| `_deletion` | Remoção de um registro |

## Próximos passos

- [Instalação](./installation) — Adicione a sds-lib ao seu projeto
- [Explorador de Regras](/sds-lib/rules) — Navegue por todas as regras de validação
- [FAQ](./faq) — Perguntas frequentes e motivações
- [Releases](./releases) — Histórico de versões
