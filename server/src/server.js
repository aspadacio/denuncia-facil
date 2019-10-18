const config = require('./util/config');
const express = require('express');
const cors = require('cors');

/**
 * Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 */
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Por questões de segurando o JavaScript não permite por default que uma aplicação que esteja rodando numa determinada porta
 * consuma serviços de um servidor noutra porta, mesmo localhost.
 * Portanto, precisamos utilzar o CORS para habilitar a escuta por todas as porta localhost
 */
const corsOptions = {
    origin: '*',
    optionSuccessStatus: 200
};
app.use(cors(corsOptions)); 

/**
 * BEGIN - HTTP Calss
 */

 //Inject Routings
app.use('/user', require('./routing/user-routing'));
app.use('/empresa', require('./routing/empresa-routing'));
app.use('/denuncia', require('./routing/denuncia-routing'));

app.get('/', (req, res) => { 
    res.send('ExpressJS Server Working!');
});

/**
 * END - HTTP Calss
 */

app.use((err, req, res, next) => {
    res.json({ error: err.message });
});

app.listen(config.PORT, () => {
    console.log(`Servidor ExpressJs/NodeJs na porta ${config.PORT}`)
});