import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Lista.css';

const MinhasDenuncias = ({ token, onLogout }) => {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDenuncias();
  }, []);

  const carregarDenuncias = async () => {
    try {
      const response = await axios.get('/api/denuncias/minhas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDenuncias(response.data);
    } catch (err) {
      setErro('Erro ao carregar denúncias');
    } finally {
      setCarregando(false);
    }
  };

  const denunciasFiltradas = filtroStatus
    ? denuncias.filter(d => d.status === filtroStatus)
    : denuncias;

  const getCorStatus = (status) => {
    const cores = {
      pendente: '#FFA500',
      em_analise: '#4169E1',
      resolvida: '#228B22',
      rejeitada: '#DC143C'
    };
    return cores[status] || '#808080';
  };

  const getTextoStatus = (status) => {
    const textos = {
      pendente: 'Pendente',
      em_analise: 'Em Análise',
      resolvida: 'Resolvida',
      rejeitada: 'Rejeitada'
    };
    return textos[status] || status;
  };

  if (carregando) return <div className="lista-container"><p>Carregando...</p></div>;

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1>📋 Minhas Denúncias</h1>
        <button className="btn-nova" onClick={() => navigate('/criar-denuncia')}>
          + Nova Denúncia
        </button>
      </div>

      {erro && <div className="erro-mensagem">{erro}</div>}

      <div className="filtros">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="filtro-select"
        >
          <option value="">Todos os Status</option>
          <option value="pendente">Pendente</option>
          <option value="em_analise">Em Análise</option>
          <option value="resolvida">Resolvida</option>
          <option value="rejeitada">Rejeitada</option>
        </select>
      </div>

      {denunciasFiltradas.length === 0 ? (
        <div className="vazio">
          <p>Nenhuma denúncia encontrada</p>
        </div>
      ) : (
        <div className="denuncias-lista">
          {denunciasFiltradas.map(denuncia => (
            <div
              key={denuncia._id}
              className="denuncia-card"
              onClick={() => navigate(`/denuncia/${denuncia._id}`)}
            >
              <div className="denuncia-header">
                <h3>{denuncia.titulo}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getCorStatus(denuncia.status) }}
                >
                  {getTextoStatus(denuncia.status)}
                </span>
              </div>
              
              <p className="denuncia-tipo">Tipo: <strong>{denuncia.tipo}</strong></p>
              <p className="denuncia-data">
                {new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
              
              {denuncia.anonima && <span className="anonima-badge">🔒 Anônima</span>}
            </div>
          ))}
        </div>
      )}

      <button className="btn-voltar" onClick={() => navigate('/dashboard')}>
        ← Voltar
      </button>
    </div>
  );
};

export default MinhasDenuncias;
