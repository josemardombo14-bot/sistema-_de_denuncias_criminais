const express = require('express');
const { body, validationResult } = require('express-validator');
const Denuncia = require('../models/Denuncia');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Criar denúncia (cidadão)
router.post('/', auth, [
  body('titulo').trim().notEmpty().withMessage('Título é obrigatório'),
  body('descricao').trim().isLength({ min: 10 }).withMessage('Descrição deve ter no mínimo 10 caracteres'),
  body('tipo').isIn(['roubo', 'assalto', 'homicídio', 'tráfico', 'corrupção', 'outro']).withMessage('Tipo inválido'),
  body('localizacao.latitude').isFloat().withMessage('Latitude inválida'),
  body('localizacao.longitude').isFloat().withMessage('Longitude inválida'),
  body('dataDenuncia').isISO8601().withMessage('Data inválida')
], async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { titulo, descricao, tipo, localizacao, dataDenuncia, anonima } = req.body;

    const denuncia = new Denuncia({
      titulo,
      descricao,
      tipo,
      localizacao,
      dataDenuncia,
      anonima,
      cidadao: req.usuario.id
    });

    await denuncia.save();

    res.status(201).json({
      sucesso: true,
      denuncia
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Obter minhas denúncias (cidadão)
router.get('/minhas', auth, async (req, res) => {
  try {
    const denuncias = await Denuncia.find({ cidadao: req.usuario.id }).sort({ dataCriacao: -1 });
    res.json(denuncias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Obter denúncia por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const denuncia = await Denuncia.findById(req.params.id).populate('cidadao', 'nome email');
    
    if (!denuncia) {
      return res.status(404).json({ erro: 'Denúncia não encontrada' });
    }

    // Verificar se é o cidadão ou um admin
    if (denuncia.cidadao._id.toString() !== req.usuario.id && req.usuario.role === 'cidadao') {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    res.json(denuncia);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar status (admin)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pendente', 'em_analise', 'resolvida', 'rejeitada']).withMessage('Status inválido')
], async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { status, observacoes } = req.body;

    let denuncia = await Denuncia.findById(req.params.id);

    if (!denuncia) {
      return res.status(404).json({ erro: 'Denúncia não encontrada' });
    }

    denuncia.status = status;
    denuncia.observacoesAdmin = observacoes || denuncia.observacoesAdmin;
    denuncia.dataAtualizacao = Date.now();

    await denuncia.save();

    res.json({
      sucesso: true,
      denuncia
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar prioridade (admin)
router.put('/:id/prioridade', adminAuth, [
  body('prioridade').isIn(['baixa', 'media', 'alta', 'critica']).withMessage('Prioridade inválida')
], async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { prioridade } = req.body;

    let denuncia = await Denuncia.findByIdAndUpdate(
      req.params.id,
      { prioridade, dataAtualizacao: Date.now() },
      { new: true }
    );

    if (!denuncia) {
      return res.status(404).json({ erro: 'Denúncia não encontrada' });
    }

    res.json({
      sucesso: true,
      denuncia
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
