var http = require('http');
var env = require('./environment');
var sendmail = require('./sendmail');
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

exports.getCountries = function (req, resp, next) {
    connection.query("select * from countries", function (err, rows) {
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
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Record not found"
                });
            }
        }
    })
}

exports.getStates = function (req, resp, next) {
    connection.query("select * from states where country_id = " + req.body.country_id + "", function (err, rows) {
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
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Record not found"
                });
            }
        }
    })
}

exports.getCities = function (req, resp, next) {
    connection.query("select * from cities where state_id = " + req.body.state_id + "", function (err, rows) {
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
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Record not found"
                });
            }
        }
    })
}

exports.saveSchool = function (req, resp, next) {
    connection.query("select * from user_master_ut where email_id = '" + req.body.email_id + "' and role_id = " + req.body.role + "", function (err, row) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (row.length > 0) {
                resp.status(200).json({
                    "status": 0,
                    "message": "Email id is already registered with us."
                });
            } else {
                connection.query("insert into user_master_ut (user_name, first_name, last_name, org_name, email_id, contact_no, address, country, state, city, password, role_id, status) values ('" + req.body.user_name + "','" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.org_name + "', '" + req.body.email_id + "', " + req.body.contact_no + ", '" + req.body.address + "', " + req.body.country + ", " + req.body.state + ", " + req.body.city + ", '" + md5(req.body.password) + "', " + req.body.role + ", " + req.body.status + ")", function (err, rows) {
                    if (err) {
                        console.log(err);
                        resp.status(200).json({
                            "status": 0,
                            "message": "Something went wrong"
                        });
                    } else {
                        var mailmatter = "<p>Hello,</p>";
                        mailmatter += "<p style='margin-top:5px;'>Welcome To Lexicon language lab</p>";
                        mailmatter += "<p style='margin-top:5px;'><strong>Lexicon language lab</strong></p><p>________________________________________</p>";
                        sendmail.sendmail(req.body.email_id, mailmatter, 'Lexicon language lab school registration');
                        resp.status(200).json({
                            "status": 1,
                            "message": "School registered successfully"
                        });
                    }
                })
            }
        }
    })
}