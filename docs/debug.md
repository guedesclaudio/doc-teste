---
sidebar_position: 5
---

# 🛠️ Manual de Debug: SDS-Lib

Este documento é um guia técnico para desenvolvedores e analistas investigarem falhas no processamento de eventos através da sds-lib. O objetivo é reduzir o tempo médio de diagnóstico, separando problemas de infraestrutura/dados de bugs na lógica da biblioteca.

---

## 🏗️ Fluxo de Investigação

Sempre que um evento falhar nas validações da lib, siga a ordem de precedência abaixo:

### 1. Consistência de Dados

Antes de analisar o código da lib, valide se o estado das entidades no ambiente condiz com a requisição. As validações são **contextuais**: elas dependem do status atual do Animal, Lote ou Farm.

| Ponto de verificação | O que checar |
|---|---|
| **Existência de Entidades** | Verifique se os UUIDs de Farm, Lote e Animal realmente existem e estão configurados corretamente no ambiente onde a lib está rodando |
| **Estado da Entidade** | O erro pode ser uma regra de negócio válida (ex: tentar registrar um parto em um animal sem cobertura prévia) |
| **Isolamento** | Se a falha ocorre com um animal específico, mas não com outros na mesma fazenda com as mesmas condições, é um forte indício de que o problema está no dado do animal |

### 2. Mapa de Validações

A lib executa regras detalhadas que variam conforme a versão.

- **Consulta técnica:** Verifique o [Explorador de Regras](/rules) para entender o gatilho da regra que falhou.
- **Versão da Lib:** Certifique-se de que o projeto está utilizando uma versão estável. Versões instáveis podem apresentar comportamentos inesperados. Consulte as [Releases](./releases).

---

## 🪵 Interpretando Logs de Erro

A sds-lib emite logs estruturados que apontam a causa raiz de falhas de comunicação e configuração.

### Exemplo comum: Erro de Threshold / Configuração de Farm

Um log comum que indica erro de setup no ambiente:

```
Attempt 10: No valid data returned from
https://sds-backend.agriness-hml.com/api/farms/[UUID]/threshold_references?page_size=100
```

| Campo | Descrição |
|---|---|
| **`Attempt 10`** | A lib tentou buscar os dados 10 vezes e esgotou as tentativas de retry |
| **`threshold_references`** | Endpoint que fornece os limites de referência zootécnica da fazenda |
| **`[UUID]`** | Identificador da fazenda que não retornou dados válidos |

**Diagnóstico:** A lib tentou buscar as referências de limites (_thresholds_) da fazenda e não obteve sucesso após 10 tentativas.

**Causa raiz:** Farm mal configurada ou inexistente no ambiente de homologação. Verifique se a fazenda possui `threshold_references` cadastrados.

---

## 📈 Monitoramento de Performance e Erros (Grafana)

Para um debug avançado e análise de erros em massa, utilize o painel de observabilidade.

:::info Painel SDS-Lib Performance
Acesse o painel no Grafana interno da Agriness para visualizar métricas em tempo real.
:::

### Como explorar o painel

| Recurso | Como usar |
|---|---|
| **Filtro por Erro** | Utilize a variável **Valor da Busca** para buscar por códigos de erro específicos (ex: `ALO001`) |
| **Logs Detalhados** | Verifique o payload exato que causou a rejeição, o debug de toda a validação e o retorno dos erros |
| **LogUUID** | Utilize o `logUUID` retornado pela lib para rastrear todo o processamento do evento de ponta a ponta |

---

## 💻 Debug Local

Se precisar acompanhar os eventos em tempo real na sua máquina:

### Monitoramento no terminal

A lib imprime o rastro das regras processadas na saída padrão. Monitore a saída da sua aplicação enquanto reproduz o evento com falha.

### Filtros úteis no terminal

```bash
# Isolar erros de validação
grep "Validation Error" logs.txt

# Acompanhar tentativas de retry
grep "Attempt" logs.txt

# Rastrear um evento específico pelo logUUID
grep "<seu-log-uuid>" logs.txt
```

### Checklist de debug local

- [ ] O ambiente (dev/QA/HML) está correto?
- [ ] O UUID do animal/fazenda existe neste ambiente?
- [ ] A fazenda possui `threshold_references` configurados?
- [ ] A versão da lib é estável? (ver [Releases](./releases))
- [ ] O evento anterior do animal está consistente? (ver [FAQ](./faq))
