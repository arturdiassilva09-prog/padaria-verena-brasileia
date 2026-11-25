# API do Assistente Verena

Backend Node.js para Gemini + Firebase Admin, destinado ao site Padaria Verena.

## Variáveis secretas no Render

- GEMINI_API_KEY: chave criada no Google AI Studio.
- FIREBASE_SERVICE_ACCOUNT_JSON: conteúdo JSON completo de uma chave de conta de serviço do projeto Firebase padaria-verena.
- GEMINI_MODEL: opcional; padrão gemini-2.5-flash.
- VERENA_ADMIN_UID: UID da conta administradora.
- SITE_ORIGIN: origem do GitHub Pages.

Nunca coloque as chaves no GitHub, no HTML ou no JavaScript do navegador.

## Rotas

- GET /health: estado do serviço e configuração, sem revelar segredos.
- POST /api/assistant/chat: pergunta, histórico limitado e token Firebase opcional.

O servidor valida o ID token do Firebase. Dados de mensagens privadas e avaliações pendentes/rejeitadas só entram no contexto quando o UID autenticado coincide com VERENA_ADMIN_UID. A API atual é somente leitura: não aprova avaliações, não edita produtos e não apaga registros.

## Deploy

Render Web Service:
- Runtime: Node
- Build: npm install
- Start: npm start
- Node: 22+
