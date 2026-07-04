// ========================================
// SISTEMA DE NAVEGAÇÃO ENTRE TELAS
// ========================================

/**
 * Navega entre diferentes telas do aplicativo
 * @param {string} screenName - Nome da tela ('home', 'report', 'tracking', 'help')
 */
function navigateTo(screenName) {
  // Oculta todas as telas
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  // Mostra a tela solicitada
  const screenMap = {
    'home': 'homeScreen',
    'report': 'reportScreen',
    'tracking': 'trackingScreen',
    'help': 'helpScreen'
  };

  const targetScreen = document.getElementById(screenMap[screenName]);
  if (targetScreen) {
    targetScreen.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// ========================================
// GERENCIAMENTO DE FORMULÁRIO DE DENÚNCIA
// ========================================

/**
 * Alterna visibilidade dos campos de identidade
 */
function toggleIdentityFields() {
  const anonymous = document.getElementById('anonymous');
  const identityFields = document.getElementById('identityFields');
  
  if (anonymous.checked) {
    identityFields.style.display = 'none';
    document.getElementById('name').required = false;
    document.getElementById('contact').required = false;
  } else {
    identityFields.style.display = 'block';
  }
}

/**
 * Submete o formulário de denúncia
 */
function submitReport() {
  const form = document.getElementById('reportForm');
  
  // Validação básica
  if (!form.checkValidity()) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Coleta os dados do formulário
  const formData = new FormData(form);
  const reportData = {
    anonymous: formData.get('anonymous') === 'on',
    name: formData.get('name') || 'Anônimo',
    contact: formData.get('contact') || 'N/A',
    location: formData.get('location'),
    coords: formData.get('coords') || 'Não informado',
    datetime: formData.get('datetime'),
    category: formData.get('category'),
    description: formData.get('description'),
    timestamp: new Date().toISOString()
  };

  // Gera número de protocolo
  const protocolNumber = generateProtocolNumber();
  reportData.protocolNumber = protocolNumber;

  // Salva na localStorage (simulação de backend)
  saveReport(reportData);

  // Mostra mensagem de sucesso
  showSuccessMessage(protocolNumber, reportData.contact);

  // Limpa o formulário
  form.reset();
  document.getElementById('identityFields').style.display = 'block';
  document.getElementById('evidencePreview').innerHTML = '';
}

/**
 * Gera um número de protocolo único
 * @returns {string} Número de protocolo formatado
 */
function generateProtocolNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DEN-${year}-${random}`;
}

/**
 * Salva a denúncia no localStorage
 * @param {object} reportData - Dados da denúncia
 */
function saveReport(reportData) {
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.push(reportData);
  localStorage.setItem('reports', JSON.stringify(reports));
}

/**
 * Mostra mensagem de sucesso após submissão
 * @param {string} protocolNumber - Número de protocolo gerado
 * @param {string} contact - Contato do denunciante
 */
function showSuccessMessage(protocolNumber, contact) {
  const message = `
    ✓ Denúncia registrada com sucesso!
    
    Seu número de protocolo: ${protocolNumber}
    
    ${contact !== 'N/A' && contact !== 'Anônimo' ? `Um e-mail de confirmação foi enviado para: ${contact}` : 'Você pode acompanhar sua denúncia usando o número de protocolo acima.'}
    
    Você será redirecionado para a tela inicial em 3 segundos...
  `;

  alert(message);
  
  setTimeout(() => {
    navigateTo('home');
  }, 3000);
}

// ========================================
// GERENCIAMENTO DE RASTREAMENTO
// ========================================

/**
 * Rastreia uma denúncia existente
 */
function trackReport() {
  const protocolNumber = document.getElementById('protocolNumber').value;
  const email = document.getElementById('email').value;
  const resultDiv = document.getElementById('trackingResult');

  // Busca a denúncia
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  const report = reports.find(r => r.protocolNumber === protocolNumber);

  if (report && (report.anonymous || report.contact === email)) {
    // Denúncia encontrada
    const status = getReportStatus(report);
    
    resultDiv.innerHTML = `
      <h3>Status da Denúncia</h3>
      <p><strong>Protocolo:</strong> ${protocolNumber}</p>
      <p><strong>Data de Registro:</strong> ${new Date(report.timestamp).toLocaleDateString('pt-BR')}</p>
      <p><strong>Categoria:</strong> ${translateCategory(report.category)}</p>
      <p><strong>Local:</strong> ${report.location}</p>
      <p><strong>Status:</strong> <span style="color: ${status.color}; font-weight: bold;">${status.text}</span></p>
      <p><strong>Progresso:</strong></p>
      <div style="background: #e0e0e0; border-radius: 8px; height: 24px; overflow: hidden; margin: 10px 0;">
        <div style="background: linear-gradient(90deg, #0d47a1, #1565c0); height: 100%; width: ${status.progress}%; transition: width 0.3s ease;"></div>
      </div>
      <p>${status.message}</p>
    `;
    
    resultDiv.classList.remove('error');
    resultDiv.classList.add('success');
  } else {
    // Denúncia não encontrada
    resultDiv.innerHTML = `
      <h3>Denúncia não encontrada</h3>
      <p>Verifique se o número de protocolo e o e-mail estão corretos.</p>
    `;
    
    resultDiv.classList.remove('success');
    resultDiv.classList.add('error');
  }
}

/**
 * Obtém o status atual de uma denúncia
 * @param {object} report - Dados da denúncia
 * @returns {object} Status com texto, cor e progresso
 */
function getReportStatus(report) {
  const now = new Date();
  const reportDate = new Date(report.timestamp);
  const daysPassed = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));

  if (daysPassed < 1) {
    return {
      text: 'Recebida',
      message: 'Sua denúncia foi recebida e está aguardando análise inicial.',
      progress: 15,
      color: '#ffc107'
    };
  } else if (daysPassed < 7) {
    return {
      text: 'Em Análise',
      message: 'Sua denúncia está sendo analisada pelos órgãos competentes.',
      progress: 50,
      color: '#1565c0'
    };
  } else if (daysPassed < 30) {
    return {
      text: 'Em Investigação',
      message: 'Uma investigação foi aberta. Mais detalhes em breve.',
      progress: 75,
      color: '#0d47a1'
    };
  } else {
    return {
      text: 'Concluída',
      message: 'Investigação concluída. Obrigado por sua contribuição.',
      progress: 100,
      color: '#388e3c'
    };
  }
}

/**
 * Traduz categoria de crime para português
 * @param {string} category - Chave da categoria
 * @returns {string} Categoria traduzida
 */
function translateCategory(category) {
  const translations = {
    'roubo': 'Roubo',
    'furto': 'Furto',
    'violencia': 'Violência',
    'drogas': 'Tráfico de Drogas',
    'fraude': 'Fraude / Estelionato',
    'corrupcao': 'Corrupção',
    'outro': 'Outro'
  };
  return translations[category] || category;
}

// ========================================
// GERENCIAMENTO DE ARQUIVOS
// ========================================

/**
 * Manipula a seleção de arquivos de evidência
 */
document.addEventListener('DOMContentLoaded', function() {
  const evidenceInput = document.getElementById('evidence');
  if (evidenceInput) {
    evidenceInput.addEventListener('change', function(e) {
      const files = e.target.files;
      const preview = document.getElementById('evidencePreview');
      preview.innerHTML = '';

      let totalSize = 0;
      const maxSize = 50 * 1024 * 1024; // 50MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSize += file.size;

        if (totalSize > maxSize) {
          alert('Tamanho total de arquivos excede 50MB. Por favor, remova alguns arquivos.');
          evidenceInput.value = '';
          preview.innerHTML = '';
          return;
        }

        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.cssText = `
          display: flex;
          align-items: center;
          padding: 8px 12px;
          margin-bottom: 8px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 14px;
        `;

        const icon = getFileIcon(file.type);
        fileItem.innerHTML = `
          <span style="margin-right: 8px;">${icon}</span>
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">
            ${file.name} (${(file.size / 1024).toFixed(2)} KB)
          </span>
        `;

        preview.appendChild(fileItem);
      }

      if (files.length > 0) {
        const summary = document.createElement('p');
        summary.style.cssText = `
          color: #388e3c;
          font-weight: 600;
          margin-top: 8px;
        `;
        summary.textContent = `✓ ${files.length} arquivo(s) selecionado(s) - Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`;
        preview.appendChild(summary);
      }
    });
  }
});

/**
 * Retorna ícone apropriado para tipo de arquivo
 * @param {string} fileType - Tipo MIME do arquivo
 * @returns {string} Emoji representando o tipo
 */
function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.includes('pdf')) return '📄';
  return '📎';
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Inicializa a aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
  // Mostra tela inicial por padrão
  navigateTo('home');

  // Inicializa chat se necessário
  if (typeof initChatbot === 'function') {
    initChatbot();
  }
});

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

/**
 * Formata data para exibição
 * @param {string} dateString - String de data ISO
 * @returns {string} Data formatada
 */
function formatDate(dateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

/**
 * Formata número de telefone
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Valida email
 * @param {string} email - Endereço de email
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
