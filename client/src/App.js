import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';

// Páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import DashboardCidadao from './pages/DashboardCidadao';
import DashboardAdmin from './pages/DashboardAdmin';
import CriarDenuncia from './pages/CriarDenuncia';
import MinhasDenuncias from './pages/MinhasDenuncias';
import VerDenuncia from './pages/VerDenuncia';

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsuario(response.data);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, [token]);

  const handleLogin = (novoToken, novoUsuario) => {
    localStorage.setItem('token', novoToken);
    setToken(novoToken);
    setUsuario(novoUsuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  if (carregando) {
    return <div className="carregando">Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
        
        {usuario?.role === 'cidadao' && (
          <>
            <Route path="/dashboard" element={<DashboardCidadao usuario={usuario} onLogout={handleLogout} />} />
            <Route path="/criar-denuncia" element={<CriarDenuncia token={token} onLogout={handleLogout} />} />
            <Route path="/minhas-denuncias" element={<MinhasDenuncias token={token} onLogout={handleLogout} />} />
            <Route path="/denuncia/:id" element={<VerDenuncia token={token} onLogout={handleLogout} />} />
          </>
        )}
        
        {(usuario?.role === 'admin' || usuario?.role === 'policia') && (
          <Route path="/admin" element={<DashboardAdmin usuario={usuario} token={token} onLogout={handleLogout} />} />
        )}
        
        <Route path="/" element={usuario ? <Navigate to={usuario.role === 'admin' || usuario.role === 'policia' ? '/admin' : '/dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
