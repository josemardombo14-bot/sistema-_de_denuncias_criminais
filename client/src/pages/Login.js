import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await axios.post('/api/auth/login', { email, senha });
      const { token, usuario } = response.data;
      onLogin(token, usuario);
      navigate(usuario.role === 'admin' || usuario.role === 'policia' ? '/admin' : '/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚔 Sistema de Denúncias</h1>
        <h2>Login</h2>
        
        {erro && <div className="erro-mensagem">{erro}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="texto-alternativa">
          Não tem conta? <Link to="/registro">Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
