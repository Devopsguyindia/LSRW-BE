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

exports.getUserTypes = function (req, resp) {
    connection.query("select * from user_role_ut", function (err, rows) {
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

exports.getUsers = function (req, resp) {
    connection.query("select * from user_master_ut where role_id != 1", function (err, rows) {
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

exports.getUserById = function (req, resp) {
    connection.query("select * from user_master_ut where id = " + req.body.id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "data": rows[0]
            });
        }
    })
}

exports.registerUser = function (req, resp) {
    connection.query("select * from user_master_ut where email_id = '" + req.body.email_id + "'", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.rows.length > 0) {
                resp.status(200).json({
                    "status": 0,
                    "message": "Email address is already register with us"
                });
            } else {
                connection.query("insert into user_master_ut (first_name, last_name, dob, gender, email_id, contact_no, user_name, passsword, role_id, user_info, status) values ('" + req.body.first_name + "', '" + req.body.last_name + "', '" + req.body.dob + "', '" + req.body.gender + "', '" + req.body.email_id + "', '" + req.body.contact_no + "', '" + req.body.email_id + "', '" + md5(req.body.passsword) + "', '" + req.body.role_id + "', '" + req.body.user_info + "', " + req.body.status + ")", function (err, rows) {
                    if (err) {
                        console.log(err);
                        resp.status(200).json({
                            "status": 0,
                            "message": "Something went wrong"
                        });
                    } else {
                        resp.status(200).json({
                            "status": 1,
                            "message": "User registered successfully"
                        });
                    }
                })
            }
        }
    })
}

exports.editUser = function (req, resp) {
    connection.query("select * from user_master_ut where email_id = '" + req.body.email_id + "' and not (id = " + req.body.id + ")", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.rows.length > 0) {
                resp.status(200).json({
                    "status": 0,
                    "message": "Email address is already register with us"
                });
            } else {
                connection.query("update user_master_ut set first_name = '" + req.body.first_name + "', last_name ='" + req.body.last_name + "', dob = '" + req.body.dob + "', gender = '" + req.body.gender + "', email_id = '" + req.body.email_id + "', contact_no = '" + req.body.contact_no + "', user_name = '" + req.body.email_id + "', user_info = '" + req.body.user_info + "', status = " + req.body.status + " where id = " + req.body.id + "", function (err, rows1) {
                    if (err) {
                        console.log(err);
                        resp.status(200).json({
                            "status": 0,
                            "message": "Something went wrong"
                        });
                    } else {
                        resp.status(200).json({
                            "status": 1,
                            "message": "User edited successfully"
                        });
                    }
                })
            }
        }
    })
}

exports.deleteUser = function (req, resp) {
    connection.query("delete from user_master_ut where id = " + req.body.id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "message": "User deleted successfully"
            });
        }
    })
}