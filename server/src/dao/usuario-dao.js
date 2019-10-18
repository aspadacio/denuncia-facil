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
     doDecrypt: async (req, resp) => {
         if( req.body['password'], req.body['cpf'] ){
            //Find at DB Hash & Seed
            const cpf = req.body['cpf'];
            const pass = req.body['password'];

             await Promise.all([
                 //Catching Hash & Seed from db
                 MongoClient.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}`, (err, client) => {
                     if (err) {
                         resp.json({
                             status: "error",
                             message: err
                         })
                     }

                     let db = client.db(`${config.DB_NAME}`);
                     if (!db) {
                         console.log("Error connecting data base");
                     }

                     db.collection(COLLECTION_NAME).findOne(
                         { CPF: cpf },
                         { _id: 0, HASH: 1, SEED: 1 },
                         (err, document) => {
                             if (err) {
                                 resp.json({
                                     status: "error",
                                     message: err
                                 })
                             }

                             if (!document) {
                                 resp.json({
                                     status: "error",
                                     message: 'Usuário não cadastrado'
                                 })
                             } else {
                                 const hash = Util.doEncrypt(pass, document.SEED);
                                 const isEquals = document.HASH === hash;
                                 resp.json({
                                     status: "success",
                                     message: isEquals ? "Senha correta" : "Senha incorreta",
                                     data: isEquals
                                 })
                             }
                         }
                    );
                 })
             ]);
        }
    },

    add: async (req, resp) => {
        console.log('Inserindo usuário...');
        await Promise.all([
            MongoClient.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}`, (err, client) => {
                if(err){
                    resp.json({
                        status: "error",
                        message: err
                    }) 
                }

                let db = client.db(`${config.DB_NAME}`);
                if(!db){
                    console.log("Error connecting data base");
                }

                db.collection(COLLECTION_NAME).insertOne({
                    CPF:   req.body["cpf"],
                    NOME:  req.body["nome"],
                    EMAIL: req.body["email"],
                    HASH:  req.body["hash"],
                    SEED:  req.body["seed"]
                })
                .then(result => {
                    console.log('Usuário inserido id:' + result.insertedId);
                    resp.json({ 
                        status: "success",
                        message: "Usuario criado com sucesso",
                        data: result
                     })
                })
            })
        ]);
    }
}