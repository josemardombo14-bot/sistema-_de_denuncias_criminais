const mongoose = require('mongoose');

const DenunciaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Por favor forneça um título'],
    maxlength: 100
  },
  descricao: {
    type: String,
    required: [true, 'Por favor forneça uma descrição'],
    minlength: 10
  },
  tipo: {
    type: String,
    enum: ['roubo', 'assalto', 'homicídio', 'tráfico', 'corrupção', 'outro'],
    required: true
  },
  localizacao: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    endereco: String,
    cidade: String,
    provincia: String
  },
  dataDenuncia: {
    type: Date,
    required: true
  },
  cidadao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  anonima: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pendente', 'em_analise', 'resolvida', 'rejeitada'],
    default: 'pendente'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'critica'],
    default: 'media'
  },
  imagens: [{
    url: String,
    data: Date
  }],
  observacoesAdmin: String,
  dataAtualizacao: {
    type: Date,
    default: Date.now
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Índice para geolocalização
DenunciaSchema.index({ 'localizacao.latitude': 1, 'localizacao.longitude': 1 });
DenunciaSchema.index({ cidadao: 1 });
DenunciaSchema.index({ status: 1 });
DenunciaSchema.index({ dataCriacao: -1 });

module.exports = mongoose.model('Denuncia', DenunciaSchema);
