import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Formulario.css';

const CriarDenuncia = ({ token, onLogout }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'outro',
    dataDenuncia: new Date().toISOString().split('T')[0],
    anonima: false,
    localizacao: {
      latitude: '',
      longitude: '',
      endereco: '',
      cidade: '',
      provincia: ''
    }
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obter localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      const response = await axios.post('/api/denuncias', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso('Denúncia registrada com sucesso!');
      setTimeout(() => navigate('/minhas-denuncias'), 2000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar denúncia');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-card">
        <h1>📝 Fazer uma Denúncia</h1>
        <p className="subtitulo">Seus dados serão protegidos e analisados com confidencialidade</p>

        {erro && <div className="erro-mensagem">{erro}</div>}
        {sucesso && <div className="sucesso-mensagem">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Informações Básicas</h3>
            
            <div className="form-group">
              <label>Título da Denúncia *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ex: Roubo em Via Pública"
              />
            </div>

            <div className="form-group">
              <label>Descrição Detalhada *</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                placeholder="Descreva o incidente em detalhes..."
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Crime *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="outro">Outro</option>
                  <option value="roubo">Roubo</option>
                  <option value="assalto">Assalto</option>
                  <option value="homicídio">Homicídio</option>
                  <option value="tráfico">Tráfico</option>
                  <option value="corrupção">Corrupção</option>
                </select>
              </div>

              <div className="form-group">
                <label>Data do Incidente *</label>
                <input
                  type="date"
                  name="dataDenuncia"
                  value={formData.dataDenuncia}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Localização</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  name="localizacao.latitude"
                  value={formData.localizacao.latitude}
                  onChange={handleChange}
                  step="0.000001"
                  placeholder="-8.838333"
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  name="localizacao.longitude"
                  value={formData.localizacao.longitude}
                  onChange={handleChange}
                  step="0.000001"
                  placeholder="13.234444"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <input
                type="text"
                name="localizacao.endereco"
                value={formData.localizacao.endereco}
                onChange={handleChange}
                placeholder="Rua/Avenida e número"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  name="localizacao.cidade"
                  value={formData.localizacao.cidade}
                  onChange={handleChange}
                  placeholder="Cuito"
                />
              </div>

              <div className="form-group">
                <label>Província</label>
                <input
                  type="text"
                  name="localizacao.provincia"
                  value={formData.localizacao.provincia}
                  onChange={handleChange}
                  placeholder="Bié"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Privacidade</h3>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="anonima"
                name="anonima"
                checked={formData.anonima}
                onChange={handleChange}
              />
              <label htmlFor="anonima">Fazer denúncia anônima</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Registrando...' : 'Registrar Denúncia'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarDenuncia;
