import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! 👋 Bem-vindo ao Sistema de Denúncias Criminais de Bié. Como posso ajudá-lo?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Respostas do chatbot baseadas em palavras-chave - CONTEXTUALIZADO PARA BIÉ
  const botResponses = {
    'como denunciar': {
      text: '📝 Como fazer uma denúncia em Bié:\n\n1️⃣ Registre-se ou faça login\n2️⃣ Clique em "Fazer Denúncia"\n3️⃣ Preencha o formulário:\n   • Local do incidente (Cuito, Chinguar, Camacupa, etc.)\n   • Bairro ou zona específica\n   • Hora e data do crime\n4️⃣ Escolha o tipo de crime\n5️⃣ Sistema localizará automaticamente ou indique manualmente\n6️⃣ Confirme e envie\n\n⚠️ Sua denúncia será encaminhada à PNA (Polícia Nacional Angolana) de Bié!',
      keywords: ['como', 'denunciar', 'denuncia', 'registrar', 'como fazer']
    },
    'criminalidade': {
      text: '🚨 Principais crimes em Bié que denunciamos:\n\n🏪 Roubos em via pública (Rua 21 de Janeiro, Avenida Fernandes, etc)\n🏃 Assaltos em residências\n💼 Furtos em lojas e mercados\n💊 Tráfico de drogas\n🤑 Corrupção\n⚠️ Violência doméstica\n👮 Abuso de autoridade policial\n🏦 Fraudes e burlas\n🔫 Posse ilegal de armas\n❓ Outros crimes\n\nDenuncie qualquer suspeita!',
      keywords: ['crime', 'criminalidade', 'roubos', 'assaltos', 'tráfico', 'violência']
    },
    'segurança': {
      text: '🔒 Segurança do seu sistema em Bié:\n\n✅ Criptografia de dados sensíveis\n✅ Servidor seguro e protegido\n✅ Confidencialidade garantida\n✅ Compliance com leis de proteção de dados\n✅ Seus dados não são vendidos\n✅ Possibilidade de denúncia anônima\n✅ Acesso restrito à PNA e Administração Provincial\n\n🛡️ Seus dados estão seguros conosco em Bié!',
      keywords: ['segurança', 'seguro', 'protegido', 'criptografia', 'privado']
    },
    'anonimato': {
      text: '👤 Denúncia Anônima em Bié:\n\n✅ Você pode denunciar SEM revelar sua identidade\n✅ Basta marcar "Fazer denúncia anônima"\n✅ Proteja-se de possíveis represálias\n\nSeu anonimato será mantido:\n• Seu nome não será divulgado\n• Sua identidade está protegida\n• A PNA trabalhará com as informações\n• Você ainda poderá acompanhar o status\n\n⚠️ Importante: Denúncias anônimas são investigadas com base nos detalhes fornecidos',
      keywords: ['anonimo', 'anonimato', 'anônima', 'identidade', 'privado', 'sem nome']
    },
    'status': {
      text: '📊 Acompanhando sua denúncia:\n\n1️⃣ Faça login em sua conta\n2️⃣ Clique em "Minhas Denúncias"\n3️⃣ Visualize o status:\n   🟠 Pendente - Aguardando análise da PNA\n   🔵 Em Análise - PNA investigando\n   🟢 Resolvida - Caso resolvido\n   🔴 Rejeitada - Sem evidências suficientes\n\n📱 Você receberá atualizações sobre sua denúncia\n⏰ Tempo de resposta: 5-15 dias úteis',
      keywords: ['status', 'acompanhar', 'denúncia', 'progresso', 'como saber', 'resolvida']
    },
    'contato': {
      text: '📞 Fale conosco - Bié/Cuito:\n\n📧 Email: denuncias.bie@pna.gov.ao\n☎️ Telefone: +244 232 665 XXX (PNA Cuito)\n📱 WhatsApp: +244 912 345 678\n🏢 Endereço: Cuito, Bié, Angola\n⏰ Disponível 24/7\n\n🚗 Você também pode denunciar pessoalmente:\n   • Delegação da PNA em Cuito\n   • Administração Provincial de Bié\n   • Postos policiais em Chinguar e Camacupa',
      keywords: ['contato', 'telefone', 'email', 'fale', 'suporte', 'onde', 'pna']
    },
    'bié': {
      text: '🗺️ Sobre a Província de Bié:\n\n📍 Bié está localizada na região Central-Leste de Angola\n🏙️ Capital: Cuito\n👥 População: ~1.5 milhão de habitantes\n🌍 Principais cidades: Chinguar, Camacupa, Andulo\n\n🚨 Este sistema cobre toda a Província de Bié\n✅ Aceita denúncias de qualquer localidade\n✅ Conecta cidadãos à PNA (Polícia Nacional Angolana)',
      keywords: ['bié', 'bie', 'cuito', 'chinguar', 'camacupa', 'andulo', 'província']
    },
    'registro': {
      text: '📋 Como se registrar (Residente em Bié):\n\n1️⃣ Clique em "Registrar"\n2️⃣ Preencha seus dados:\n   • Nome completo (conforme BI/CC)\n   • Email válido\n   • Telefone (prefira números Zap/Unitel/Movicel)\n   • Cidade/Bairro em Bié\n   • Senha segura (mín. 6 caracteres)\n3️��� Aceite os termos de confidencialidade\n4️⃣ Confirme seu email\n\n✅ Pronto! Comece a denunciar crimes em Bié!',
      keywords: ['registro', 'registrar', 'cadastro', 'criar conta', 'nova conta']
    },
    'login': {
      text: '🔑 Fazendo login:\n\n1️⃣ Clique em "Login"\n2️⃣ Insira seu email\n3️⃣ Insira sua senha\n4️⃣ Clique em "Entrar"\n\n❓ Esqueceu a senha?\n   • Clique em "Recuperar senha"\n   • Insira seu email\n   • Verifique seu email (pasta de spam)\n   • Clique no link de recuperação\n   • Defina uma nova senha\n\n📞 Se tiver dúvidas, entre em contato conosco!',
      keywords: ['login', 'entrar', 'senha', 'acesso', 'autenticação', 'esqueci']
    },
    'policia': {
      text: '👮 PNA (Polícia Nacional Angolana) em Bié:\n\n🏢 Delegação Provincial: Cuito\n🚔 Delegações Locais: Chinguar, Camacupa, Andulo\n\n📞 Emergência: 113 (chamada nacional)\n☎️ PNA Cuito: +244 232 665 XXX\n\n🤝 Este sistema integra-se com a PNA\n✅ Suas denúncias vão direto para investigação\n✅ Você pode acompanhar o progresso online\n✅ Maior rapidez na resposta',
      keywords: ['policia', 'pna', 'delegação', 'cuito', 'emergência', '113']
    },
    'tipos crimes': {
      text: '��� Tipos de crimes em Bié que aceitamos:\n\n🏪 Roubo a lojas/residências\n🏃 Assaltos a mão armada\n💼 Furtos\n🔪 Violência física/pancadas\n💊 Tráfico de drogas\n🤑 Corrupção/Suborno\n⚠️ Violência doméstica\n👮 Abuso de autoridade\n🏦 Fraudes/Burlas\n🔫 Armas ilegais\n🚗 Acidentes de trânsito suspeitos\n❓ Outros crimes\n\nDenuncie qualquer ato ilegal!',
      keywords: ['tipos', 'crimes', 'que aceita', 'qual', 'categorias']
    },
    'geolocalização': {
      text: '📍 Geolocalização em Bié:\n\nAo fazer uma denúncia:\n✅ Sistema captura localização automática\n✅ Você pode editar o bairro/zona\n✅ Coordenadas GPS são registradas\n\n🏘️ Principais bairros em Cuito:\n   • Cambundi\n   • Kilombo\n   • Vila Verde\n   • São João\n   • Ponta Zangano\n\n📍 Isso ajuda a PNA a investigar mais rápido!',
      keywords: ['geolocalização', 'localização', 'coordenadas', 'gps', 'endereço', 'bairro']
    },
    'ajuda': {
      text: '❓ Como posso ajudá-lo?\n\nTópicos disponíveis:\n📝 Como denunciar\n🚨 Criminalidade em Bié\n🔒 Segurança\n👤 Anonimato\n📊 Status da denúncia\n📍 Geolocalização\n📋 Registro\n🔑 Login\n📞 Contato\n🗺️ Sobre Bié\n👮 PNA\n\nEscreva qualquer desses tópicos!',
      keywords: ['ajuda', 'help', 'o que', 'como', 'dúvida', 'suporte']
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(botResponses)) {
      if (value.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return value.text;
      }
    }
    
    return 'Desculpe, não entendi sua pergunta. 😕\n\nTópicos que posso ajudar:\n📝 Como denunciar\n🚨 Criminalidade\n🔒 Segurança\n👤 Anonimato\n📊 Status\n📞 Contato\n🗺️ Sobre Bié\n👮 PNA\n\nEscreva um destes!';
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: findResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          title="Abrir chat"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <h3>🤖 Assistente Bié</h3>
              <p>Denúncias criminais em Bié</p>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              title="Fechar chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-options">
              <button onClick={() => {
                setInputValue('Como denunciar');
                setTimeout(() => handleSendMessage(), 0);
              }}>📝 Denunciar</button>
              <button onClick={() => {
                setInputValue('Criminalidade');
                setTimeout(() => handleSendMessage(), 0);
              }}>🚨 Crimes</button>
              <button onClick={() => {
                setInputValue('PNA');
                setTimeout(() => handleSendMessage(), 0);
              }}>👮 PNA</button>
              <button onClick={() => {
                setInputValue('Contato');
                setTimeout(() => handleSendMessage(), 0);
              }}>📞 Contato</button>
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escreva sua pergunta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={inputValue.trim() === ''}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;