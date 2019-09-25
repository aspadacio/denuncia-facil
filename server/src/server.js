const express = require('express');
const cors = require('cors');

/**
 * Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 */
const bodyParser = require('body-parser');

/**
 * Parse http requests with content-type multipart/form-data, also known as file uploads.
 * This middleware will create temp files on your server and never clean them up. 
 * Thus you should not add this middleware to all routes; only to the ones in which you want to accept uploads.
 */
const multipart = require('connect-multiparty');

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

//Diretório ao qual será armazenados os arquivos
//Ou, em num projeto real, aqui ficaria as configurações de acesso ao DB
let multipartMiddleware = multipart({ uploadDir: './static/denuncia/' });

/**
 * BEGIN - HTTP Calss
 */
app.get('/', (req, res) => { 
    res.send('ExpressJS Server Working!');
});

//./static/docs
//Retorna os nomes criados dos arquivos
app.post('/denuncia', multipartMiddleware, (req, res) => {
    let names = [];

    if( req.files.file.hasOwnProperty('length') ){
        //req.files.file.forEach(el => { console.log(el) });
        for( let i=0; i<req.files.file.length; i++ ){
            names.push(req.files.file[i].path.split("\\")[2]);
        }
    }else {
        names.push(req.files.file.path.split("\\")[2]);
    }
    
    return res.json({
        //files: req.files,
        names: names
    });
});

app.get('/downloadExcel', (req, res) => {
    res.download('./uploads/mRpXKI308Uz6FWYkcJQKkbms.xlsx');
});

app.get('/downloadPDF', (req, res) => {
    res.download('./uploads/zoB49xSOEqCBp9o7n3ZxRFg3.pdf');
});

/**
 * END - HTTP Calss
 */

app.use((err, req, res, next) => {
    res.json({ error: err.message });
});

app.listen(8000, () => {
    console.log('Servidor ExpressJs/NodeJs na porta 8000')
});