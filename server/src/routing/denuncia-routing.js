const dao = require('../dao/denuncia-dao');
const express = require('express');
const router = express.Router();

/**
 * Parse http requests with content-type multipart/form-data, also known as file uploads.
 * This middleware will create temp files on your server and never clean them up. 
 * Thus you should not add this middleware to all routes; only to the ones in which you want to accept uploads.
 */
const multipart = require('connect-multiparty');

//Diretório ao qual será armazenados os arquivos
//Ou, em num projeto real, aqui ficaria as configurações de acesso ao DB
let multipartMiddleware = multipart({ uploadDir: './static/denuncia/' });

//List
router.get('/', dao.list);

//Insert
router.post('/', dao.add);

//Update
router.put('/', dao.update);

//Find
//router.post('/find', dao.find);

//Remove
//router.post('/remove', dao.remove);

//Insert Files
router.post('/anexo', multipartMiddleware, dao.addAnexo);

//./static/denuncia
//Retorna os arquivos solicitados do System File
router.get('/anexo', dao.downloadAnexo);

module.exports = router;