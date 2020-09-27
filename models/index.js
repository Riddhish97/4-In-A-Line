/**
 * Script for load db and models
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
let dbConfig = config['database'];
//set environment
require('custom-env').env();
if (process.env.IS_DOCKER.toUpperCase() === "TRUE") {
    dbConfig.host = "mongodb";
}
var options = {
    user: dbConfig.username,
    pass: dbConfig.password,
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
try {
    mongoose.connect('mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database + '', options);
    fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach(function (file) {
        mongoose.model(path.parse(file).name, require(path.join(__dirname, file))(mongoose));
    });

} catch (e) {
    console.log(e);

}

module.exports = mongoose;