import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Detalhe.css';

const VerDenuncia = ({ token, onLogout }) => {
  const { id } = useParams();
  const [denuncia, setDenuncia] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDenuncia();
  }, [id]);

  const carregarDenuncia = async () => {
    try {
      const response = await axios.get(`/api/denuncias/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDenuncia(response.data);
    } catch (err) {
      setErro('Erro ao carregar denúncia');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <div className="detalhe-container"><p>Carregando...</p></div>;
  if (erro) return <div className="detalhe-container"><p className="erro">{erro}</p></div>;
  if (!denuncia) return <div className="detalhe-container"><p>Denúncia não encontrada</p></div>;

  return (
    <div className="detalhe-container">
      <button className="btn-voltar" onClick={() => navigate('/minhas-denuncias')}>
        ← Voltar
      </button>

      <div className="detalhe-card">
        <div className="detalhe-header">
          <h1>{denuncia.titulo}</h1>
          <div className="badges">
            <span className="status-badge">{denuncia.status}</span>
            <span className="tipo-badge">{denuncia.tipo}</span>
            <span className="prioridade-badge">{denuncia.prioridade}</span>
            {denuncia.anonima && <span className="anonima-badge">🔒 Anônima</span>}
          </div>
        </div>

        <div className="detalhe-info">
          <section>
            <h3>Descrição</h3>
            <p>{denuncia.descricao}</p>
          </section>

          <section>
            <h3>Localização</h3>
            <p><strong>Endereço:</strong> {denuncia.localizacao.endereco}</p>
            <p><strong>Cidade:</strong> {denuncia.localizacao.cidade}</p>
            <p><strong>Província:</strong> {denuncia.localizacao.provincia}</p>
            <p><strong>Coordenadas:</strong> {denuncia.localizacao.latitude}, {denuncia.localizacao.longitude}</p>
          </section>

          <section>
            <h3>Datas</h3>
            <p><strong>Data do Incidente:</strong> {new Date(denuncia.dataDenuncia).toLocaleDateString('pt-BR')}</p>
            <p><strong>Data de Registro:</strong> {new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR')}</p>
            <p><strong>Última Atualização:</strong> {new Date(denuncia.dataAtualizacao).toLocaleDateString('pt-BR')}</p>
          </section>

          {denuncia.observacoesAdmin && (
            <section>
              <h3>Observações do Administrador</h3>
              <p>{denuncia.observacoesAdmin}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerDenuncia;
