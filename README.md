# Padaria Verena – Unidade Brasiléia

Site institucional demonstrativo desenvolvido para a atividade Betim Digital.

## Arquivos
- `index.html`: estrutura e conteúdo.
- `style.css`: identidade visual e layout responsivo.
- `script.js`: menu móvel.

## Publicação
O projeto é estático e pode ser publicado pelo GitHub Pages:
1. Abra **Settings** do repositório.
2. Entre em **Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Selecione a branch **main** e a pasta **/(root)** e salve.
5. Aguarde a publicação indicada pelo GitHub Pages.

## Dados utilizados
Endereço, telefone e horário da Unidade Brasiléia foram conferidos em diretórios públicos. O número (31) 99090-5985 também foi confirmado pelo solicitante. Produtos e categorias são exemplos citados em listagens públicas; disponibilidade deve ser confirmada com a padaria.

- Endereço divulgado: Praça José Lino da Silva, 101 – Brasiléia, Betim/MG, CEP 32600-308.
- WhatsApp divulgado: (31) 99090-5985.
- Horário divulgado: segunda a sábado, 06:00–21:20; domingo, 06:00–13:30.
- Instagram listado em diretório: @verenabrasileia.

## Observação importante
As fotografias do site são imagens ilustrativas de banco de imagens, não fotos confirmadas da unidade. Antes de usar comercialmente, substitua por fotos próprias autorizadas e confirme os dados diretamente com o estabelecimento. Este é um projeto acadêmico independente, sem alegação de vínculo oficial com a empresa.

## Fontes consultadas
- Restaurant Guru: https://restaurantguru.com.br/Padaria-Verena-Unidade-Brasileia-Betim
- Bendito Guia: https://www.benditoguia.com.br/empresa/padaria-verena-unidade-brasileia-betim-mg
- Solutudo: https://www.solutudo.com.br/empresas/mg/betim/panificadoras-e-padarias/padaria-verena-unidade-brasileia-22332617


## Recursos adicionados (versão ampliada)
- Catálogo digital com busca, categorias e favoritos.
- Sacola de seleção que monta uma mensagem e abre o WhatsApp da unidade; o pedido só é enviado depois de o cliente confirmar no WhatsApp.
- Painel de demonstração para cadastrar, editar e excluir produtos e alterar o destaque promocional.
- Layout responsivo, atalhos de contato e área de avaliações.

### Limites importantes do painel
O painel atual é uma demonstração front-end: os dados são gravados no armazenamento local do navegador. Isso significa que as alterações só aparecem no dispositivo/navegador em que foram feitas. Não existe autenticação segura, banco de dados compartilhado, processamento de pagamento ou recebimento automático de pedidos. Não coloque senhas, dados de clientes ou informações privadas nele. Para operação real, conecte um backend com autenticação e regras de acesso (por exemplo, Firebase Authentication + Firestore) e mantenha qualquer segredo no servidor. O GitHub Pages hospeda conteúdo estático e não executa código de servidor.
