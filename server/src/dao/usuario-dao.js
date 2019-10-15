const config = require('../util/config');
const Util = require('../util/server-util');
const http = require('http');

const MongoClient = require('mongodb').MongoClient;
const COLLECTION_NAME = "USUARIO";

module.exports = {

    /**************************************************************************
     * From the Password, it returns the Hash & Seed
     * Returns: Hash & Seed
     **************************************************************************/
    doEncrypt: async (req, resp) => {
        if( req.body['password'] ){
            const seed = Util.doRandomString();
            const hash = Util.doEncrypt(req.body['password'], seed);
            resp.json({
                seed: seed,
                hash: hash
            });
        }
    },

    /**************************************************************************
     * From the Hash & Seed, it returns the password
     *  Returns: Password
     **************************************************************************/
     doDecrypt: async (req, resp1) => {
        if( req.body['password'], req.body['cpf'] ){
            //Find at DB Hash & Seed
            const cpf = req.body['cpf'];
            let isEquals = null;

            //`http://localhost:3000/usuario?cpf=${cpf}`
            await Promise.all([
                http.get(`http://denunciafacil.com.br:3000/usuario?cpf=${cpf}`, (resp2) => {
                    let data = '';
                    // A chunk of data has been recieved.
                    resp2.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp2.on('end', () => {
                        let user = JSON.parse(data)[0];
                        const hash = Util.doEncrypt(req.body['password'], user.seed);
                        isEquals = user.hash === hash;
                        resp1.json({
                            isEquals: isEquals
                        })
                    });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                })
            ]);
        }
    },

    add: async (req, resp) => {
        console.log('Inserindo usuário...');
        await Promise.all([
            MongoClient.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}`, (err, client) => {
                if (err) {
                    throw err;
                }
                let db = client.db(`${config.DB_NAME}`);
                db.collection(COLLECTION_NAME).insertOne({
                    CPF:   req.body["cpf"],
                    NOME:  req.body["nome"],
                    EMAIL: req.body["email"],
                    HASH:  req.body["hash"],
                    SEED:  req.body["seed"]
                })
                .then(result => {
                    console.log('Usuário inserido id:' + result.insertedId);
                    resp.json({  isOk: 'OK' })
                })
            })
        ]);
    }
}