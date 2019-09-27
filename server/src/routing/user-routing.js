const dao = require('../dao/usuario-dao');
const express = require('express');
const router = express.Router();

/****************
 * ROUTE: 'user'
 ****************/

//A partir da senha, gera o Hash e a Semente
router.post('/doEncrypt', dao.doEncrypt);

//A partir do Hash e a Semente, retorna a Senha
router.post('/doDecrypt', dao.doDecrypt);

module.exports = router;