import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const DashboardCidadao = ({ usuario, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🚔 Bem-vindo, {usuario?.nome}</h1>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Painel do Cidadão</h2>
          <p>Denuncie crimes e acompanhe o status das suas denúncias</p>
        </div>

        <div className="cards-grid">
          <div className="card clickable" onClick={() => navigate('/criar-denuncia')}>
            <div className="card-icon">📝</div>
            <h3>Fazer Denúncia</h3>
            <p>Registre um novo crime ou situação suspeita</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/minhas-denuncias')}>
            <div className="card-icon">📋</div>
            <h3>Minhas Denúncias</h3>
            <p>Consulte e acompanhe suas denúncias</p>
          </div>

          <div className="card">
            <div className="card-icon">📞</div>
            <h3>Contato Seguro</h3>
            <p>Denuncie de forma anônima e segura</p>
          </div>

          <div className="card">
            <div className="card-icon">ℹ️</div>
            <h3>Informações</h3>
            <p>Saiba mais sobre como fazer uma denúncia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCidadao;
