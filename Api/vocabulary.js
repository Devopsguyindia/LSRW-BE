// var http = require('http');
var env = require('./environment');
var connection = env.Dbconnection;
var md5 = require('md5');
var async = require('async');
var randtoken = require('rand-token');
var isempty = require('is-empty');
var moment = require('moment');
var today = moment();
var path = require('path');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const fs = require('fs');
var stats = require('word-stats');
const readXlsxFile = require('read-excel-file/node');
const http = require("https");
const app_id = "e1b02c38"; // insert your APP Id
const app_key = "96a700f72baa1c0e64402d726db6f342"; // insert your APP Key
const wordId = "ace";
const fields = "pronunciations";
const strictMatch = "false";

exports.getCards = function (req, resp) {
    let query;
    if (req.body.unit_id > 5000) {
        query = "select * from card_master_ut where topic_id = " + req.body.topic_id + " and section_id = " + req.body.section_id + " and course_id = " + req.body.course_id + " order by RAND() LIMIT 0,20";
    } else {
        query = "select * from card_master_ut where topic_id = " + req.body.topic_id + " and section_id = " + req.body.section_id + " and course_id = " + req.body.course_id + " and unit_id = " + req.body.unit_id + " order by sequence_no";
    }
    connection.query(query, function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            async.forEach(rows, function (values, callback) {
                values.content = JSON.parse(values.content);
                // if(values.section_id == 2) {
                //     const options = {
                //         host: 'od-api.oxforddictionaries.com',
                //         port: '443',
                //         path: '/api/v2/entries/en-gb/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch,
                //         method: "GET",
                //         headers: {
                //           'app_id': app_id,
                //           'app_key': app_key
                //         }
                //       };
                //       http.get(options, (resp) => {
                //         let body = '';
                //         resp.on('data', (d) => {
                //             body += d;
                //         });
                //         resp.on('end', () => {
                //             let parsed = JSON.stringify(body);
                    
                //             console.log(parsed);
                //         });
                //     });
                //     values.wordData = stats(values.content.word);
                // }
                callback()
            }, function (err) {
                resp.status(200).json({
                    "status": 1,
                    "data": rows
                });
            })

        }
    })
}

exports.getCards1 = function (req, resp) {
    let query;
    if (req.body.unit_id > 5000) {
        query = "select * from card_master_ut where topic_id = " + req.body.topic_id + " and section_id = " + req.body.section_id + " and course_id = " + req.body.course_id + " order by RAND() LIMIT 0,20";
    } else {
        query = "select * from card_master_ut where topic_id = " + req.body.topic_id + " and section_id = " + req.body.section_id + " and course_id = " + req.body.course_id + " and unit_id = " + req.body.unit_id + " order by RAND()";
    }
    connection.query(query, function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            async.forEach(rows, function (values, callback) {
                values.content = JSON.parse(values.content);
                callback()
            }, function (err) {
                resp.status(200).json({
                    "status": 1,
                    "data": rows
                });
            })

        }
    })
}

exports.getUnits = function (req, resp) {
    connection.query("select * from unit_master_ut where topic_id = " + req.body.topic_id + " and section_id = " + req.body.section_id + " and course_id = " + req.body.course_id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "data": rows
            });
        }
    })
}


exports.insertCards = function (req, resp) {
    connection.query("insert into card_master_ut (name, section_id, topic_id, course_id, content, sequence_no, card_type_id, card_category_id, unit_id) values ('" + req.body.name + "', " + req.body.section_id + ", " + req.body.topic_id + ", " + req.body.course_id + ", '" + JSON.stringify(req.body.content) + "', " + req.body.sequence_no + ", " + req.body.card_type_id + ", " + req.body.card_category_id + ", " + req.body.unit_id + ")", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "message": "Data added successfully"
            });

        }
    })
}


exports.insertBulkCards = function (req, resp) {
    //console.log(req.files);
    readXlsxFile(env.base_urls + 'uploads/' + req.files[0].filename).then((rows1) => {
        rows1.shift();
        async.forEach(rows1, function (values, callback) {
            connection.query("insert into card_master_ut (course_id, topic_id, section_id, card_type_id, card_category_id, unit_id, sequence_no, name, description, content) values ('" + values[0] + "', '" + values[1] + "', '" + values[2] + "', '" + values[3] + "', '" + values[4] + "', '" + values[5] + "', '" + values[6] + "', '" + values[7] + "', '" + values[8] + "', '" + values[9] + "')", function (err, rows) {
                if (err) {
                    console.log(err);
                    callback();
                } else {
                    callback();
                }
            })
        }, function (err) {
            fs.unlink(env.base_urls + 'uploads/' + req.files[0].filename, (err) => {})
            resp.status(200).json({
                "status": 1,
                "message": "Data added successfully"
            });
        })
    })
}