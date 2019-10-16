const config = require('../util/config');
const Util = require('../util/server-util');
const http = require('http');

const MongoClient = require('mongodb').MongoClient;
const COLLECTION_NAME = "EMPRESA";

module.exports = {
    list: async (req, resp) => {
        //console.log('Listando Empresas...');
        let query = {};

        //Query String
        if(Object.keys(req.query).length !== 0){
            if(req.query.contexto){
                query.CONTEXTO = req.query.contexto;
            }
        }

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
                    console.log("Error connectiong data base");
                }

                db.collection(COLLECTION_NAME).find(query)
                .sort({ CONTEXTO: 1 })
                .toArray( (err, result) => {
                    if(err){
                        resp.json({
                            status: "error",
                            message: err
                        }) 
                    }
                    resp.json({
                        status: "success",
                        message: "Empresas listadas com sucesso",
                        data: result
                    })
                });
            })
        ]);
    },

    find: async (req, resp) => {

    },

    add: async (req, resp) => {
        console.log('Inserindo Empresa...');
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
                    console.log("Error connectiong data base");
                }

                db.collection(COLLECTION_NAME).insertOne({
                    CNPJ: req.body["cnpj"],
                    CONTEXTO:  req.body["contexto"],
                    NOME: req.body["nome"],
                    FANTASIA: req.body["fantasia"],
                    UF: req.body["uf"],
                    CEP: req.body["cep"],
                    MUNICIPIO: req.body["municipio"],
                    BAIRRO: req.body["bairro"],
                    LOGRADOURO: req.body["logradouro"],
                    NUMERO: req.body["numero"],
                    COMPLEMENTO: req.body["complemento"]
                })
                .then(result => {
                    console.log('Empresa inserida id:' + result.insertedId);
                    resp.json({
                        status: "success",
                        message: "Empresas criada com sucesso",
                        data: result
                     })
                })
            })
        ]);
    },

    remove: async (req, resp) => {

    }
}