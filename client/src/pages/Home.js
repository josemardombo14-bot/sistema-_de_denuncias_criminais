import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">🚨 Sistema de Denúncias Criminais</h1>
            <p className="tagline">Juntos contra a criminalidade</p>
          </div>
          <div className="header-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-registro" onClick={() => navigate('/registro')}>Registrar</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Sua Segurança é Nossa Prioridade</h2>
          <p>Denuncie crimes de forma segura, anônima e eficaz. Conectando cidadãos com autoridades para uma comunidade mais segura.</p>
          <div className="hero-buttons">
            <button className="btn-primary-large" onClick={() => navigate('/registro')}>
              Começar Agora
            </button>
            <button className="btn-secondary-large" onClick={() => navigate('/login')}>
              Já tem conta? Faça Login
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-icon">🛡️</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Por que usar nosso sistema?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>100% Seguro</h3>
            <p>Seus dados são protegidos com criptografia de ponta. Confidencialidade garantida.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Denúncias Anônimas</h3>
            <p>Denuncie sem revelar sua identidade. Seu anonimato é nossa prioridade.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Geolocalização</h3>
            <p>Registro automático de localização para melhor resposta das autoridades.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Acompanhamento</h3>
            <p>Acompanhe em tempo real o status e evolução de suas denúncias.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rápido e Fácil</h3>
            <p>Interface intuitiva que torna o processo de denúncia simples e rápido.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Conexão Direta</h3>
            <p>Conectando você diretamente com as autoridades competentes.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>Como Funciona</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Registre-se</h3>
            <p>Crie sua conta com seus dados básicos. Rápido e seguro.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Denuncie</h3>
            <p>Preencha o formulário com detalhes do crime ocorrido.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Acompanhe</h3>
            <p>Monitore o status da sua denúncia em tempo real.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Resolução</h3>
            <p>Autoridades trabalham para resolver o caso.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3 className="stat-number">+5000</h3>
          <p>Denúncias Registradas</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">+2000</h3>
          <p>Casos Resolvidos</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">+500</h3>
          <p>Usuários Ativos</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number">24/7</h3>
          <p>Disponível</p>
        </div>
      </section>

      {/* Types of Crimes */}
      <section className="crimes-section">
        <h2>Tipos de Crimes que Aceitamos</h2>
        <div className="crimes-grid">
          <div className="crime-item">🏪 Roubo</div>
          <div className="crime-item">🏃 Assalto</div>
          <div className="crime-item">⚠️ Homicídio</div>
          <div className="crime-item">💊 Tráfico</div>
          <div className="crime-item">🤑 Corrupção</div>
          <div className="crime-item">❓ Outros</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Pronto para fazer uma diferença?</h2>
        <p>Comece agora a denunciar crimes e ajude a criar uma comunidade mais segura.</p>
        <button className="btn-cta" onClick={() => navigate('/registro')}>Registre-se Agora</button>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Sobre</h4>
            <p>Sistema de denúncias criminais dedicado a conectar cidadãos com as autoridades.</p>
          </div>
          <div className="footer-section">
            <h4>Segurança</h4>
            <ul>
              <li>Criptografia SSL</li>
              <li>Dados Protegidos</li>
              <li>Privacidade Garantida</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contato</h4>
            <p>Email: denuncias@sistema.gov.ao</p>
            <p>Telefone: +244 123 456 789</p>
            <p>WhatsApp: +244 912 345 678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Sistema de Denúncias Criminais. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;