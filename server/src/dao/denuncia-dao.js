const config = require('../util/config');
const Util = require('../util/server-util');
const http = require('http');

const MongoClient = require('mongodb').MongoClient;
const COLLECTION_NAME = "DENUNCIA";

module.exports = {
    list: async (req, resp) => {
        let query = {};

        //Query String
        if(Object.keys(req.query).length !== 0){
            if(req.query){
                
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
                    console.log("Error connecting data base");
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
                        message: "Denuncias listadas com sucesso",
                        data: result
                    })
                });
            })
        ]);
    },

    add: async (req, resp) => {
        console.log('Adicionando Denuncia...');

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
                    DS_HISTORIA: req.body["dsHistoria"],
                    DS_RESPOSTA:  req.body["dsResposta"],
                    DS_TITULO: req.body["dsTitulo"],
                    EMPRESA_ID: req.body["idEmpresa"],
                    USUARIO_ID: req.body["idUsuario"],
                    PROTOCOLO: req.body["protocolo"],
                    TS_DENUNCIA: req.body["tsReclamacao"]
                })
                .then(result => {
                    console.log('Denuncia inserida id:' + result.insertedId);
                    resp.json({
                        status: "success",
                        message: "Denuncia inserida com sucesso",
                        data: result
                     })
                })
            })
        ]);
    },

    addAnexo: async (req, resp) => {
        console.log('Adicionando Anexos...');
        let names = [];

        if( req.files.file.hasOwnProperty('length') ){
            for( let i=0; i<req.files.file.length; i++ ){
                names.push(req.files.file[i].path.split("\\")[2]);
            }
        }else {
            names.push(req.files.file.path.split("\\")[2]);
        }
        
        return resp.json({
            names: names
        });
    },

    downloadAnexo: async (req, resp) => {
        console.log(`Download doc: ${req.query.name}`);
        resp.download('./static/denuncia/' + req.query.name);
    }
}   