// ========================================
// CHATBOT - SUPORTE EM TEMPO REAL
// ========================================

// Base de conhecimento do chatbot
const chatbotKnowledge = {
  greeting: {
    keywords: ['oi', 'olá', 'oi!', 'olá!', 'oi chat', 'olá chat', 'e aí', 'tudo bem'],
    responses: [
      'Olá! 👋 Como posso ajudá-lo com sua denúncia?',
      'Bem-vindo! 😊 Estou aqui para ajudar. O que você gostaria de saber?',
      'Oi! Como posso ser útil?'
    ]
  },
  
  anonymous: {
    keywords: ['anônimo', 'anônima', 'anônimamente', 'como funciona anônimo', 'privacidade', 'sigiloso'],
    responses: [
      'Você pode fazer uma denúncia completamente anônima! 🔒 Basta marcar a caixa "Desejo permanecer anônimo" no formulário. Nenhuma informação pessoal será registrada ou compartilhada.',
      'Sim, oferecemos denúncias anônimas e sigilosas. Seus dados estão protegidos por criptografia de ponta a ponta. Ninguém saberá que foi você!'
    ]
  },

  protocol: {
    keywords: ['protocolo', 'número protocolo', 'número de protocolo', 'rastrear', 'acompanhar', 'rastreamento'],
    responses: [
      'Você receberá um número de protocolo após enviar sua denúncia. 📋 Use este número para acompanhar o status em "Acompanhar Denúncia". Guarde bem este número!',
      'Cada denúncia recebe um número de protocolo único. Você pode usar este número para rastrear sua denúncia a qualquer momento. Formato: DEN-AAAA-XXXXX'
    ]
  },

  files: {
    keywords: ['arquivo', 'fotos', 'vídeo', 'documento', 'evidência', 'anexo', 'upload', 'imagem', 'anexar', 'enviar arquivo'],
    responses: [
      'Você pode enviar fotos, vídeos e documentos como evidências! 📎 Tamanho máximo total: 50MB. Formatos aceitos: JPG, PNG, MP4, PDF.',
      'Sim! Você pode anexar múltiplos arquivos. Quanto mais provas você fornecer, melhor a investigação. Apenas certifique-se de que o tamanho total não ultrapasse 50MB.'
    ]
  },

  investigation: {
    keywords: ['investigação', 'quanto tempo', 'quando', 'demora', 'tempo', 'respondido', 'resposta'],
    responses: [
      'O tempo de investigação varia conforme a complexidade do caso. 🔍 Crimes graves recebem prioridade. Você pode acompanhar o progresso usando seu número de protocolo!',
      'Geralmente, a análise inicial leva até 24 horas. Investigações mais profundas podem levar semanas. Tudo depende da natureza do crime.'
    ]
  },

  categories: {
    keywords: ['categoria', 'categorias', 'tipos de crime', 'tipo de denúncia', 'o que posso denunciar'],
    responses: [
      'Você pode denunciar: Roubo, Furto, Violência, Tráfico de Drogas, Fraude/Estelionato, Corrupção e Outros. 📋 Escolha a categoria que melhor se aplica ao seu caso.',
      'As categorias disponíveis são: Roubo, Furto, Violência, Tráfico de Drogas, Fraude, Corrupção e Outro. Se seu caso não se encaixa perfeitamente, use "Outro".'
    ]
  },

  emergency: {
    keywords: ['emergência', 'emergência', 'urgente', 'risco de morte', '190', 'policia agora'],
    responses: [
      '⚠️ EMERGÊNCIA? Ligue 190 IMEDIATAMENTE! Este sistema é para denúncias que não requerem resposta imediata.',
      'Se há risco de morte ou perigo iminente, disque 190 agora! Use este sistema apenas para denúncias que não exigem resposta imediata.'
    ]
  },

  security: {
    keywords: ['segurança', 'seguro', 'criptografia', 'dados', 'privacidade', 'proteção', 'safe'],
    responses: [
      'Todos seus dados estão protegidos! 🔐 Usamos criptografia de ponta a ponta para garantir sua privacidade e segurança. Seu anonimato é garantido.',
      'Sua segurança é nossa prioridade! Todos os dados são criptografados e armazenados com segurança. Você pode confiar neste sistema.'
    ]
  },

  contact: {
    keywords: ['contato', 'suporte', 'ajuda', 'email', 'telefone', 'falar com', 'atendimento'],
    responses: [
      'Para suporte adicional:\n📧 Email: snad@policia.gov.br\n☎️ Disque-denúncia: 181\n🚨 Emergência: 190\n⏰ Atendimento: 24h todos os dias',
      'Você pode nos contactar de várias formas! Email: snad@policia.gov.br | Telefone: 181 (disque-denúncia). Estamos disponíveis 24/7!'
    ]
  },

  thanks: {
    keywords: ['obrigado', 'obrigada', 'vlw', 'vlw!', 'muito obrigado', 'valeu'],
    responses: [
      'De nada! 😊 Sua contribuição é importante para manter nossa comunidade segura. Obrigado!',
      'Fico feliz em ajudar! Lembre-se: sua denúncia pode fazer a diferença! 🙏'
    ]
  },

  default: {
    keywords: [],
    responses: [
      'Desculpe, não entendi perfeitamente sua pergunta. 🤔 Posso ajudá-lo com:\n• Como fazer uma denúncia\n• Número de protocolo\n• Rastreamento\n• Segurança/Privacidade\n• Tipos de crimes\n• Contatos úteis',
      'Hmm, não tenho certeza. Tente fazer uma pergunta sobre:\n• Denúncias anônimas\n• Arquivos/evidências\n• Status de investigação\n• Emergências\n• Como usar o sistema'
    ]
  }
};

// ========================================
// FUNÇÕES DO CHATBOT
// ========================================

/**
 * Inicializa o chatbot
 */
function initChatbot() {
  console.log('Chatbot inicializado');
  addChatMessage('Olá! 👋 Bem-vindo ao Sistema Nacional de Denúncias. Como posso ajudá-lo?', 'assistant');
}

/**
 * Envia mensagem do chat
 */
function sendChat() {
  const chatInput = document.getElementById('chatInput');
  const userMessage = chatInput.value.trim();

  if (!userMessage) return;

  // Mostra mensagem do usuário
  addChatMessage(userMessage, 'user');
  chatInput.value = '';

  // Processa e responde
  setTimeout(() => {
    const response = processUserMessage(userMessage);
    addChatMessage(response, 'assistant');
  }, 300);
}

/**
 * Adiciona mensagem ao chat
 * @param {string} text - Texto da mensagem
 * @param {string} sender - 'user' ou 'assistant'
 */
function addChatMessage(text, sender) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}`;
  messageElement.textContent = text;
  messagesDiv.appendChild(messageElement);

  // Scroll automático para última mensagem
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Processa mensagem do usuário e retorna resposta
 * @param {string} userMessage - Mensagem do usuário
 * @returns {string} Resposta do chatbot
 */
function processUserMessage(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  // Verifica cada categoria de conhecimento
  for (const [category, data] of Object.entries(chatbotKnowledge)) {
    if (category === 'default') continue;

    // Verifica se alguma palavra-chave corresponde
    for (const keyword of data.keywords) {
      if (lowerMessage.includes(keyword)) {
        return getRandomResponse(data.responses);
      }
    }
  }

  // Se não encontrar correspondência, retorna resposta padrão
  return getRandomResponse(chatbotKnowledge.default.responses);
}

/**
 * Retorna uma resposta aleatória de uma lista
 * @param {array} responses - Lista de respostas possíveis
 * @returns {string} Resposta selecionada aleatoriamente
 */
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Permite enviar mensagem pressionando Enter
 */
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendChat();
      }
    });
  }
});

/**
 * Estrutura de resposta inteligente para análise de sentimento
 */
function analyzeSentiment(message) {
  const positiveSentiments = ['obrigado', 'muito bom', 'ótimo', 'perfeito', 'excelente', 'maravilhoso'];
  const negativeSentiments = ['ruim', 'péssimo', 'horrível', 'problema', 'não funciona', 'erro'];

  const lower = message.toLowerCase();

  for (const sentiment of positiveSentiments) {
    if (lower.includes(sentiment)) return 'positive';
  }

  for (const sentiment of negativeSentiments) {
    if (lower.includes(sentiment)) return 'negative';
  }

  return 'neutral';
}

/**
 * Gera resposta baseada em sentimento
 * @param {string} sentiment - Tipo de sentimento
 * @returns {string} Resposta apropriada
 */
function getResponseBySentiment(sentiment) {
  const responses = {
    positive: '😊 Fico feliz em ajudar! Há mais algo que eu possa fazer?',
    negative: '😞 Desculpe ouvir isso. Posso ajudá-lo a resolver esse problema? Qual é a dificuldade?',
    neutral: 'Como posso ajudá-lo?'
  };

  return responses[sentiment] || responses.neutral;
}

// ========================================
// LOGGING E DEBUG
// ========================================

/**
 * Log de mensagens para debug
 * @param {string} level - 'info', 'warning', 'error'
 * @param {string} message - Mensagem de log
 */
function logChatbot(level, message) {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] [Chatbot - ${level}] ${message}`);
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  logChatbot('info', 'Chatbot carregado e pronto');
});
