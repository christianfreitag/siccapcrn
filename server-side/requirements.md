# REGRAS DE NEGOCIO

     ==============

## Duvidas

    - Eu preciso realizar uma verificação de autenticação todas as vezes que eu precisar pegar algo do banco de dados ?

    - O analista deve ter acesso ao sistema por um tipo de usuário diferente ? (Assim ele poderia acessar os relatórios, os casos e seu perfil.
    Tendo também acesso ao seu perfil e dados referentes as suas férias.)
    - [IDEIA] Mapa de ferias -  um mapa para ter uma visualização geral dos analistas e seus agendamentos pra ferias.
    - [IDEIA] Pagina na qual o analista ode ir la e solicitar as ferias escolhendo o período desejado. (Para isso eles precisam de login)
    ...

## Usuários

    - Existem 2 dois tipos de usuários (Moderador e Usuário padrão)
    - O sistema devera ter um usuário moderador
    - O usuário moderador sera capaz de criar, listar os usuários, editar e apagar.
    - O usuário sera capaz de criar um caso, adicionar um analista, e criar relatórios, solicitações e afastamentos
    - O usuário tera permissão para apagar um caso, relatório, solicitação e afastamento
    - Os casos, relatórios, analistas, e etc.. são individuais de um usuário (Podendo serem compartilhados[IDEIA])
    - Para logar no sistema o usuário deve passar login e senha
    ...

## Casos

    - Os casos são criados pelo usuário
    - Em cada caso existem informações fixas e 7 datas que são preenchidas no decorrer do andar do caso.
    - quando se cria um caso, inicialmente deve-se passar so valores fixos para iniciar o caso, após salvar , a timeline de passos do caso vai estar disponível.
    - Os usuários poderão buscar por casos na tela inicia
    - Dentro dos caso sera possível ver as datas em formato timeline e histórico
    - Sera possível finalizar o caso a qualquer momento
    - Dentro do caso sera possível ver os relatórios vinculados
    - Sera possível salvar casos favoritos
    ...

## Analistas

    - Os analistas são adicionados ao sistema pelos usuários
    - Na listagem dos analistas sera possível ver o nome e o status
    - Os dias pendentes dos analistas devem ser contabilizados quando um afastamento marcado do tipo "*" não é gozado por completo.

## Afastamentos

    - na criação do afastamento o usuário deve selecionar um tipo de afastamento e entre os tipos deve incluir a opção de gozar das ferias pendentes do analista
    - afastamento marcado a data marcada não pode ser editada, para isso basta apagar o afastamento marcado e criar um novo com a data correta.



    Case

## Futuros problemas:

    - O report na criação so faz criar um relatório com o num, mas o status dele e esse tipo de coisa ´pe feito separadamente pelo update
