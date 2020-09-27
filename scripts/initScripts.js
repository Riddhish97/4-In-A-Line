/**
 * Script is used for setup db first time this script will work only in docker
 */
//set environment
require('custom-env').env();
global.models = null //load all models in global conn var.
global.conn = null;
//inport config file
global.config = require('../config/config.js');
if (process.env.IS_DOCKER.toUpperCase() === "TRUE") {
    config.database.host = "mongodb";
}
let ObjectId = require('mongoose').Types.ObjectId;
//create client of mongo
const MongoClient = require('mongodb').MongoClient;
//get dbconfig
let dbconfig = config['database'];
//create database connection uri for central db
let database = 'mongodb://' + dbconfig.root_user + ':' + dbconfig.root_password + '@' + dbconfig.host + ':' + dbconfig.port + '/admin';
//connect database
MongoClient.connect(database, function (err, client) {
    if (!err) {
        console.log('==============>DB connected');
        //authentication if centraldb already created
        let central_database = 'mongodb://' + dbconfig.username + ':' + dbconfig.password + '@' + dbconfig.host + ':' + dbconfig.port + '/' + dbconfig.database;
        MongoClient.connect(central_database, async function (central_err, central_client) {
            if (central_err) {
                // Add the new user to the admin database
                const db = client.db(dbconfig.database);
                db.addUser(dbconfig.username, dbconfig.password, {
                    roles: ["readWrite", "dbAdmin"]
                }, async function (err, result) {
                    // db.close();
                    if (err) {
                        console.log('==============>Error while add user');
                        console.log(err);
                    } else {
                        console.log('==============>Central db user added');
                        process.exit();
                    }
                })
            } else {
                console.log('==============>central db and user already created');
                process.exit();
            }
        });
    } else {
        console.log('==============>Error while connect admin db');
        console.log(err);
    }
});