const express = require('express');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

const router = express.Router();

// Atualizar perfil do usuário
router.put('/perfil', auth, async (req, res) => {
  try {
    const { nome, telefone, localizacao } = req.body;

    let usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (nome) usuario.nome = nome;
    if (telefone) usuario.telefone = telefone;
    if (localizacao) usuario.localizacao = localizacao;

    await usuario.save();

    res.json({
      sucesso: true,
      usuario
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
