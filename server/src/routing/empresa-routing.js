const dao = require('../dao/empresa-dao');
const express = require('express');
const router = express.Router();

//List
router.get('/', dao.list);

//Insert
router.post('/', dao.add);

//Find
router.post('/find', dao.find);

//Remove
router.post('/remove', dao.remove);

module.exports = router;