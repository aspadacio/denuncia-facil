const config = require('../util/config');
const Util = require('../util/server-util');
const http = require('http');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "DENUNCIA";

module.exports = {
    list: async (req, resp) => {
        let query = {};
        
        //Query String
        if(Object.keys(req.query).length !== 0){
            if(req.query.protocolo){
                query.PROTOCOLO = req.query.protocolo;
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
                    console.log("Error connecting data base");
                }

                db.collection(COLLECTION_NAME).insertOne({
                    DS_HISTORIA: req.body["DS_HISTORIA"],
                    DS_RESPOSTA:  req.body["DS_RESPOSTA"],
                    DS_TITULO: req.body["DS_TITULO"],
                    EMPRESA_ID: req.body["EMPRESA_ID"],
                    USUARIO_ID: req.body["USUARIO_ID"],
                    PROTOCOLO: req.body["PROTOCOLO"],
                    TS_DENUNCIA: req.body["TS_DENUNCIA"]
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

    update: async (req, resp) => {
        console.log('Atualizando Denuncia...');

        if( req.body["_id"] ){
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

                    let query = {  _id: ObjectID(req.body["_id"]) };
                    let fields = {};

                    if( req.body["type"] === 0 ){
                        fields = { $set: { DS_HISTORIA:  req.body["DS_HISTORIA"] }};
                    }else{
                        fields = { $set: { DS_RESPOSTA:  req.body["DS_RESPOSTA"] }};
                    }
    
                    db.collection(COLLECTION_NAME).updateOne(query, fields)
                    .then(result => {
                        if(result){
                            resp.json({
                                status: "success",
                                message: "Denuncia inserida com sucesso"
                            }) 
                        }
                    });
                })
            ]);
        }
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