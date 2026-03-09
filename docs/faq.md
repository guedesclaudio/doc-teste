---
sidebar_position: 3
---

# FAQ — Perguntas Frequentes e Motivações

## P: Por que a lib bloqueia eventos que parecem corretos individualmente?

**R:** A sds-lib não valida apenas o "formato" do JSON, mas o contexto zootécnico do evento. As validações são interdependentes; por exemplo, um evento de parto é rejeitado se o sistema identificar que o animal não possui um registro de cobertura prévio ou se o intervalo de gestação estiver fora dos limites (_thresholds_). A motivação é garantir que o banco de dados reflita a realidade biológica da fazenda, evitando "saltos" no histórico do animal que tornariam os relatórios inconsistentes.

---

## P: Por que recebo erros de "Animal/Farm is not defined" se eu acabei de criar a entidade?

**R:** Isso geralmente ocorre devido ao tempo de propagação/sincronização entre serviços ou uso de ambientes distintos.

- **Ambientes:** Verifique se você não está tentando validar um evento em Homologação (HML) usando UUIDs que só existem em QA.
- **Configuração:** No caso de Farms, o erro pode indicar que a fazenda existe, mas não possui os `threshold_references` (limites de referência) configurados, impedindo a lib de calcular se os dados do evento são aceitáveis.

---

## P: Por que a lib emite logs de "Attempt 10" antes de falhar?

**R:** A lib possui um mecanismo de resiliência (_retry_). Quando ela precisa buscar dados externos (como os limites de uma fazenda) e a rede ou o serviço de destino oscila, ela tenta realizar a chamada até 10 vezes antes de retornar um erro definitivo.

**Motivação:** Evitar que instabilidades momentâneas de rede invalidem processos importantes. Se chegar à tentativa 10, é um indicativo forte de erro de configuração de infraestrutura ou URL inexistente.

---

## P: Posso ignorar um erro de "Consistência Cronológica" se a data estiver correta?

**R:** Não. Esse erro indica que, embora a data do seu evento seja válida (não é futura), ela é anterior ao último evento registrado para aquele animal. O SDS utiliza o paradigma de eventos sequenciais; permitir um evento retroativo sem o devido reprocessamento corromperia o saldo atual de leitões ou o estágio fisiológico da matriz, por exemplo.

---

## P: Como a lib decide quais regras aplicar a cada evento?

**R:** A lib utiliza um **Mapa de Validações** interno que associa o `type` do evento (ex: `animal_loss_off_register`) a um conjunto de regras específicas daquela versão. Essas regras variam conforme a espécie, o estágio do animal e as configurações da fazenda. Por isso, é vital consultar o [Explorador de Regras](/rules) sempre que uma nova regra for implementada ou alterada.

---

## Suporte

Dúvidas não respondidas aqui? Abra uma issue no repositório GitHub da sds-lib ou entre em contato com o time Agriness.
