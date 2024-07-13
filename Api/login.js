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


exports.loginUser = function (req, resp) {
    connection.query("select * from user_master_ut where email_id = '" + req.body.email + "' and password = '" + req.body.password + "' and role_id =" + req.body.role_id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                if (rows[0].status == 1) {
                    resp.status(200).json({
                        "status": 1,
                        "data": rows[0],
                        "message": "Login Successful"
                    });
                } else {
                    resp.status(200).json({
                        "status": 0,
                        "message": "Please wait for admin's confirmation"
                    });
                }
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Email or Password might be wrong"
                });
            }
        }
    })
}

exports.forgotPassword = function (req, resp, next) {
    var user_id;
    connection.query("select * from user_master_ut where username = '" + req.body.email + "'", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                if (rows[0].status == 1) {
                    user_id = rows[0].id
                    var token = randtoken.generate(11);
                    var mailto = req.body.email;
                    var subject = "Learning Reset Password."
                    var link;
                    if (req.body.role == 1) {
                        link = env.mailURL + "changepassword/" + token;
                    } else {
                        link = env.mailURL1 + "changeclientpassword/" + token;
                    }
                    var mailmattter = "<p>Hello " + rows[0].username + "</p>";
                    mailmattter += "<p style='margin-top:5px;'>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n Please click on the following link, or paste this into your browser to complete the process: " + link + "</p>";
                    mailmattter += "<a style='margin-top:5px;' href='" + link + "' target='_blank' rel='noreferrer'>Click here..</a>";
                    mailmattter += "<p style='margin-top:5px'> If you did not request this, please ignore this email and your password will remain unchanged. </p>"
                    mailmattter += "<p style='margin-top:5px;'><strong>SotsTag</strong></p><p>________________________________________</p>";
                    connection.query("select * from authentication where user_id = " + user_id, function (err, tokenrows) {
                        if (err) {
                            resp.status(200).json({
                                "status": 0,
                                "message": "Something Went Wrong"
                            });
                        } else {
                            if (tokenrows.length > 0) {
                                connection.query("UPDATE authentication SET token= '" + token + "' WHERE user_id=" + user_id + "", function (err, rows) {
                                    if (err) {
                                        resp.status(200).json({
                                            "status": 0,
                                            "message": "Something Went Wrong"
                                        });
                                    } else {
                                        sendmail.sendmail(mailto, mailmattter, subject);
                                        resp.status(200).json({
                                            "status": 1,
                                            "message": "Reset password link has been sent to your Email."
                                        });
                                    }
                                });
                            } else {
                                connection.query("insert into authentication (token , user_id ) VALUES ('" + token + "', " + user_id + ")", function (err, rows) {
                                    if (err) {
                                        resp.status(200).json({
                                            "status": 0,
                                            "message": "Something Went Wrong"
                                        });
                                    } else {
                                        sendmail.sendmail(mailto, mailmattter, subject);
                                        resp.status(200).json({
                                            "status": 1,
                                            "message": "Reset password link has been sent to your Email."
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    resp.status(200).json({
                        "status": 0,
                        "message": "Account is not activated"
                    });
                }
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Email is not registerd with us"
                });
            }
        }
    })
}

exports.changePassword = function (req, resp, next) {
    connection.query("update user_master_ut set password = '" + md5(req.body.password) + "' where id = (select user_id from authentication where token = '" + req.body.token + "')", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something Went Wrong."
            });
        } else {
            connection.query("delete from authentication where token = '" + req.body.token + "'", function (err, row) {
                if (err) {
                    resp.status(200).json({
                        "status": 0,
                        "message": "Something Went Wrong."
                    });
                } else {
                    resp.status(200).json({
                        "status": 1,
                        "message": "Password Changed Successfully"
                    });
                }
            });

        }
    });
}

exports.checkToken = function (req, resp, next) {
    connection.query("select * from authentication where token = '" + req.body.token + "'", function (err, tokenrows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something Went Wrong."
            });
        } else {
            if (tokenrows.length > 0) {
                resp.status(200).json({
                    "status": 1
                });
            } else {
                resp.status(200).json({
                    "status": 0,
                    "message": "Link is expired"
                });
            }
        }
    });
}