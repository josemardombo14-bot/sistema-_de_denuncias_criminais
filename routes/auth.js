const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

const router = express.Router();

// Gerar JWT
const gerarToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'sua_chave_secreta', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Registro
router.post('/registro', [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefone').isMobilePhone().withMessage('Telefone inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { nome, email, telefone, senha } = req.body;

    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ erro: 'Usuário já existe' });
    }

    usuario = new Usuario({
      nome,
      email,
      telefone,
      senha,
      role: 'cidadao'
    });

    await usuario.save();

    const token = gerarToken(usuario._id, usuario.role);

    res.status(201).json({
      sucesso: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').exists().withMessage('Senha é obrigatória')
], async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario._id, usuario.role);

    res.json({
      sucesso: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Obter usuário autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
