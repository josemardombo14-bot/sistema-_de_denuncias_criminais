import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DashboardAdmin.css';

const DashboardAdmin = ({ usuario, token, onLogout }) => {
  const [ativa, setAtiva] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({ status: '', tipo: '', prioridade: '' });
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      if (ativa === 'dashboard') {
        const response = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } else if (ativa === 'denuncias') {
        const response = await axios.get('/api/admin/denuncias', {
          headers: { Authorization: `Bearer ${token}` },
          params: filtros
        });
        setDenuncias(response.data.denuncias);
      } else if (ativa === 'usuarios') {
        const response = await axios.get('/api/admin/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(response.data.usuarios);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleAtualizarStatus = async (denunciaId, novoStatus) => {
    try {
      await axios.put(`/api/denuncias/${denunciaId}/status`, 
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <h1>🚔 Painel Administrativo</h1>
        <div className="nav-items">
          <span>Bem-vindo, {usuario?.nome}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </nav>

      <div className="admin-sidebar">
        <button
          className={`nav-btn ${ativa === 'dashboard' ? 'ativo' : ''}`}
          onClick={() => { setAtiva('dashboard'); setCarregando(true); }}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${ativa === 'denuncias' ? 'ativo' : ''}`}
          onClick={() => { setAtiva('denuncias'); setCarregando(true); }}
        >
          📋 Denúncias
        </button>
        <button
          className={`nav-btn ${ativa === 'usuarios' ? 'ativo' : ''}`}
          onClick={() => { setAtiva('usuarios'); setCarregando(true); }}
        >
          👥 Usuários
        </button>
      </div>

      <div className="admin-content">
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <>
            {ativa === 'dashboard' && stats && (
              <div className="dashboard-stats">
                <h2>Estatísticas</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total de Denúncias</h3>
                    <p className="numero">{stats.totalDenuncias}</p>
                  </div>
                  <div className="stat-card pendente">
                    <h3>Pendentes</h3>
                    <p className="numero">{stats.denunciasPendentes}</p>
                  </div>
                  <div className="stat-card analise">
                    <h3>Em Análise</h3>
                    <p className="numero">{stats.denunciasEmAnalise}</p>
                  </div>
                  <div className="stat-card resolvida">
                    <h3>Resolvidas</h3>
                    <p className="numero">{stats.denunciasResolvidas}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total de Usuários</h3>
                    <p className="numero">{stats.totalUsuarios}</p>
                  </div>
                </div>
              </div>
            )}

            {ativa === 'denuncias' && (
              <div className="denuncias-section">
                <h2>Gerenciar Denúncias</h2>
                
                <div className="filtros-admin">
                  <select
                    value={filtros.status}
                    onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                  >
                    <option value="">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="resolvida">Resolvida</option>
                    <option value="rejeitada">Rejeitada</option>
                  </select>

                  <select
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                  >
                    <option value="">Todos os Tipos</option>
                    <option value="roubo">Roubo</option>
                    <option value="assalto">Assalto</option>
                    <option value="homicídio">Homicídio</option>
                    <option value="tráfico">Tráfico</option>
                    <option value="corrupção">Corrupção</option>
                  </select>
                </div>

                <table className="denuncias-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Cidadão</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denuncias.map(denuncia => (
                      <tr key={denuncia._id}>
                        <td>{denuncia.titulo}</td>
                        <td>{denuncia.tipo}</td>
                        <td>{denuncia.cidadao?.nome}</td>
                        <td>
                          <select
                            value={denuncia.status}
                            onChange={(e) => handleAtualizarStatus(denuncia._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_analise">Em Análise</option>
                            <option value="resolvida">Resolvida</option>
                            <option value="rejeitada">Rejeitada</option>
                          </select>
                        </td>
                        <td>{new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <button className="btn-ver">Ver Detalhes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ativa === 'usuarios' && (
              <div className="usuarios-section">
                <h2>Gerenciar Usuários</h2>
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario._id}>
                        <td>{usuario.nome}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefone}</td>
                        <td>{usuario.role}</td>
                        <td>{usuario.ativo ? '✅ Ativo' : '❌ Inativo'}</td>
                        <td>{new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
