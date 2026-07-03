const express = require('express');
const Denuncia = require('../models/Denuncia');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Dashboard - Estatísticas
router.get('/dashboard', async (req, res) => {
  try {
    const totalDenuncias = await Denuncia.countDocuments();
    const denunciasPendentes = await Denuncia.countDocuments({ status: 'pendente' });
    const denunciasResolvidas = await Denuncia.countDocuments({ status: 'resolvida' });
    const denunciasEmAnalise = await Denuncia.countDocuments({ status: 'em_analise' });
    const totalUsuarios = await Usuario.countDocuments();

    // Denúncias por tipo
    const denunciasPorTipo = await Denuncia.aggregate([
      { $group: { _id: '$tipo', total: { $sum: 1 } } }
    ]);

    // Denúncias por prioridade
    const denunciasPorPrioridade = await Denuncia.aggregate([
      { $group: { _id: '$prioridade', total: { $sum: 1 } } }
    ]);

    res.json({
      totalDenuncias,
      denunciasPendentes,
      denunciasResolvidas,
      denunciasEmAnalise,
      totalUsuarios,
      denunciasPorTipo,
      denunciasPorPrioridade
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar todas as denúncias
router.get('/denuncias', async (req, res) => {
  try {
    const { status, tipo, prioridade, pagina = 1, limite = 10 } = req.query;
    let filtro = {};

    if (status) filtro.status = status;
    if (tipo) filtro.tipo = tipo;
    if (prioridade) filtro.prioridade = prioridade;

    const denuncias = await Denuncia.find(filtro)
      .populate('cidadao', 'nome email telefone')
      .sort({ dataCriacao: -1 })
      .limit(limite * 1)
      .skip((pagina - 1) * limite);

    const total = await Denuncia.countDocuments(filtro);

    res.json({
      denuncias,
      paginaAtual: pagina,
      totalPaginas: Math.ceil(total / limite),
      total
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar usuários
router.get('/usuarios', async (req, res) => {
  try {
    const { pagina = 1, limite = 10, role } = req.query;
    let filtro = {};

    if (role) filtro.role = role;

    const usuarios = await Usuario.find(filtro)
      .select('-senha')
      .limit(limite * 1)
      .skip((pagina - 1) * limite)
      .sort({ dataCriacao: -1 });

    const total = await Usuario.countDocuments(filtro);

    res.json({
      usuarios,
      paginaAtual: pagina,
      totalPaginas: Math.ceil(total / limite),
      total
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Desativar usuário
router.put('/usuarios/:id/desativar', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    ).select('-senha');

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({
      sucesso: true,
      usuario
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Gerar relatório
router.get('/relatorio', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    let filtro = {};

    if (dataInicio && dataFim) {
      filtro.dataCriacao = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    }

    const denuncias = await Denuncia.find(filtro)
      .populate('cidadao', 'nome email')
      .sort({ dataCriacao: -1 });

    res.json({
      periodoRelatorio: { dataInicio, dataFim },
      totalDenuncias: denuncias.length,
      denuncias
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
