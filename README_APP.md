# Sistema de Denúncias Criminais - Web Application

## 📋 Descrição

Aplicação web para denúncias de crimes que conecta cidadãos com autoridades policiais, com funcionalidades de registro, rastreamento e gerenciamento de denúncias.

## 🎯 Funcionalidades

### Para Cidadãos
- ✅ Registro e Login seguro
- ✅ Criar denúncias com descrição detalhada
- ✅ Geolocalização automática
- ✅ Denúncias anônimas
- ✅ Acompanhar status das denúncias
- ✅ Histórico de denúncias

### Para Administradores/Polícia
- ✅ Dashboard com estatísticas
- ✅ Listar e filtrar denúncias
- ✅ Atualizar status das denúncias
- ✅ Gerenciar usuários
- ✅ Gerar relatórios
- ✅ Autenticação por role

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- MongoDB
- JWT para autenticação
- Bcrypt para hash de senhas
- Express Validator para validação

### Frontend
- React 18
- React Router v6
- Axios para requisições
- CSS modularizado

## 📦 Instalação

### Pré-requisitos
- Node.js (v14+)
- MongoDB
- npm ou yarn

### Passos

1. Clone o repositório
```bash
git clone <url-do-repo>
cd sistema-denuncias-criminais
```

2. Instale dependências do backend
```bash
npm install
```

3. Instale dependências do frontend
```bash
cd client
npm install
```

4. Configure variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

5. Inicie o servidor
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
.
├── models/
│   ├── Usuario.js
│   └── Denuncia.js
├── routes/
│   ├── auth.js
│   ├── denuncias.js
│   ├── usuarios.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── adminAuth.js
├── client/
│   ├── public/
│   └── src/
│       ├── pages/
│       ├── styles/
│       └── App.js
├── server.js
├── .env.example
└── package.json
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login
2. Servidor valida credenciais e gera token JWT
3. Token é armazenado no localStorage
4. Token é enviado em todas as requisições protegidas
5. Middleware verifica validade do token

### Roles disponíveis
- `cidadao` - Usuário comum
- `admin` - Administrador do sistema
- `policia` - Policial com acesso ao painel admin

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/registro` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Denúncias
- `POST /api/denuncias` - Criar denúncia
- `GET /api/denuncias/minhas` - Listar minhas denúncias
- `GET /api/denuncias/:id` - Obter detalhes de uma denúncia
- `PUT /api/denuncias/:id/status` - Atualizar status
- `PUT /api/denuncias/:id/prioridade` - Atualizar prioridade

### Administração
- `GET /api/admin/dashboard` - Estatísticas do dashboard
- `GET /api/admin/denuncias` - Listar todas denúncias
- `GET /api/admin/usuarios` - Listar usuários
- `PUT /api/admin/usuarios/:id/desativar` - Desativar usuário
- `GET /api/admin/relatorio` - Gerar relatório

## 🎨 UI/UX

- Interface responsiva
- Paleta de cores moderna (Gradiente roxo)
- Componentes intuitivos
- Feedbacks visuais claros
- Formulários com validação

## 🚀 Deployment

### Heroku
```bash
heroku create
heroku config:set MONGODB_URI=<seu-mongodb-uri>
heroku config:set JWT_SECRET=<sua-secret-key>
git push heroku main
```

## 📝 Licença

CC0 1.0 Universal

## 👨‍💻 Contribuição

Pull requests são bem-vindas! Para mudanças maiores, abra uma issue primeiro.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
