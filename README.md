# Clínica Odontológica OdontoShine

Projeto de um site desenvolvido para uma clínica odontológica fictícia.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript

## Funcionalidades

- Página inicial
- Apresentação da clínica
- Página de serviços odontológicos
- Página da equipe e áreas de atuação
- Seção de depoimentos na página inicial
- Página de contato e agendamento
- Formulário de solicitação de agendamento
- Página de confirmação do agendamento
- Navegação entre páginas
- Layout responsivo
- Validação de telefone, campos obrigatórios e e-mail
- Regras de datas e períodos conforme o horário de funcionamento
- Seleção de serviço a partir dos links de tratamentos
- Resumo da solicitação de agendamento salvo no navegador com localStorage
- Navegação por teclado, foco visível e mensagens de erro associadas aos campos
- Imagens dimensionadas e comprimidas para carregar mais rápido
- Identidade visual com a paleta Turquesa leve

## Estrutura do projeto

- `index.html` - Página inicial
- `servicos.html` - Serviços oferecidos pela clínica
- `equipe.html` - Equipe e áreas de atuação
- `contato.html` - Contato e formulário de agendamento
- `confirmacao.html` - Confirmação da solicitação
- `style.css` - Estilização das páginas
- `script.js` - Validação, regras do formulário e armazenamento local

## Execução

Abra `index.html` no navegador para visualizar o site. O JavaScript é executado pelo próprio navegador, sem depender do VS Code.

Para testar o armazenamento de forma consistente entre as páginas, recomenda-se servir a pasta por HTTP local, por exemplo com a extensão Live Server, ou usar uma hospedagem estática. O comportamento do localStorage em arquivos abertos diretamente por `file:` pode variar entre navegadores.

Não há instalação de bibliotecas ou back-end de agendamento.

## Agendamento

O formulário demonstra o fluxo de solicitação de agendamento. Os dados ficam somente no navegador, na chave `odontoshine-simulacao`, e não são enviados a uma clínica. Uma nova solicitação substitui a anterior. A interface usa a linguagem de atendimento da clínica; o registro exibido é local e não reserva um horário real.

Os horários considerados são de segunda a sexta, das 08h às 18h, e sábado, das 08h às 12h. Não é possível selecionar datas passadas ou domingos; aos sábados, somente o período da manhã fica disponível. O formulário não consulta disponibilidade real de vagas.

## Autor

Gabriel Bahri
