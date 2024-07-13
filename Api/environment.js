//for database connection
var mysql = require('mysql');
var nodemailer = require("nodemailer");
var sesTransport = require('nodemailer-ses-transport');
const pg = require('pg');

var enviroment_local = {
    Dbconnection: mysql.createConnection({
        database: 'lexicon',
        user: 'root',
        password: '',
        host: 'localhost',
        // acquireTimeout: 1000000
    }),
    base_urls: __dirname + "/",
    mailURL: 'http://localhost:1337/',
    mailURL1: 'http://localhost:1337/student/',
    port: 8080
}

// Dbconnection: new pg.Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'client',
//     password: 'postgres',
//     port: '5432'}),
module.exports = enviroment_local;
