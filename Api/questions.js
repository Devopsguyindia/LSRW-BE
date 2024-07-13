var http = require('http');
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
// var arr = [];

exports.getques = function (req, resp, next) {
    var arr = [];
    connection.query("select * from fill_in_the_blanks", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                async.forEach(rows, function (values, callback) {
                    connection.query("select * from options where question_id = " + values.id + "", function (err, rows1) {
                        if (err) {
                            console.log(err);
                        } else {
                            values.options = rows1;
                            arr.push(values);
                            callback();
                        }
                    })
                }, function (err) {
                    resp.status(200).json({
                        "status": 0,
                        "data": arr
                    });
                })
            }
        }
    })
}

exports.checkAns = function (req, resp, next) {
    connection.query("select * from answer where question_id = " + req.body.question_id + " and option_id = " + req.body.option_id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                resp.status(200).json({
                    "status": 1,
                    "data": req.body.question_id,
                    "message": "Correct"
                });
            } else {
                resp.status(200).json({
                    "status": 1,
                    "data": req.body.question_id,
                    "message": "Wrong"
                });
            }
        }
    })
}

exports.getques1 = function (req, resp) {
    connection.query("select * from question_master_ut", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
                resp.status(200).json({
                    "status": 0,
                    "data": rows
                });
        }
    })
}


exports.getleftdata = function (req, resp, next) {
    var arr = [];
    connection.query("select * from match_left_data", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                resp.status(200).json({
                    "status": 1,
                    "data": rows
                });
            }
        }
    })
}

exports.getrightdata = function (req, resp, next) {
    var arr = [];
    connection.query("select * from match_right_data", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                resp.status(200).json({
                    "status": 1,
                    "data": rows
                });
            }
        }
    })
}

exports.checkMatch = function (req, resp, next) {
    connection.query("select * from match_right_data where id = " + req.body.id + " and left_id = " + req.body.left_id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                resp.status(200).json({
                    "status": 1,
                    "message": "Correct",
                    "style": "green",
                    "id": req.body.id
                });
            } else {
                resp.status(200).json({
                    "status": 1,
                    "message": "Wrong",
                    "style": "red",
                    "id": req.body.id
                });
            }
        }
    })
}