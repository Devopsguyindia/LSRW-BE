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
const readXlsxFile = require('read-excel-file/node');

exports.saveStudent = function (req, resp, next) {
    var s_count = 0;
    var t_count = 0;
    connection.query("select * from user_master_ut left join system_master_values on user_master_ut.id = system_master_values.school_id where user_master_ut.id = " + req.body.school_id + "", function (err, row) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (row.length > 0) {
                if (row[0].student_id) {
                    s_count = row[0].student_id;
                } else {
                    s_count = 1;
                }
                if (row[0].teacher_id) {
                    t_count = row[0].teacher_id;
                } else {
                    t_count = 0;
                }
                connection.query("delete from system_master_values where school_id = " + req.body.school_id + "", function (err, row) {
                    if (err) {
                        console.log(err);
                    } else {}
                })
            } else {
                s_count = 1;
                t_count = 0;
            }
            async.forEach(req.body.arr, function (values, callback) {
                s_userName = row[0].user_name + '-s' + s_count;
                const password = randtoken.generate(9);
                connection.query("insert into user_master_ut (user_name, email_id, first_name, last_name, gender, standard, roll_no, divison, password, role_id, status, school_id) values ('" + s_userName + "', '" + s_userName + "', '" + values.first_name + "','" + values.last_name + "', '" + req.body.gender + "','" + values.standard + "', '" + values.roll_no + "', '" + values.divison + "', '" + password + "', 4, 1, " + req.body.school_id + ")", function (err, rows) {
                    if (err) {
                        console.log(err);
                        callback();
                    } else {
                        s_count++;
                        callback();
                    }
                })
            }, function (err) {
                connection.query("insert into system_master_values (student_id, teacher_id, school_id) values (" + s_count + ", " + t_count + ", " + req.body.school_id + ")", function (err, row) {
                    if (err) {
                        console.log(err);
                        resp.status(200).json({
                            "status": 0,
                            "message": "Something went wrong"
                        });
                    } else {
                        resp.status(200).json({
                            "status": 1,
                            "message": "Students added successfully"
                        });
                    }
                })
            })
        }
    })
}


exports.getStudents = function (req, resp) {
    connection.query("select * from user_master_ut where school_id = " + req.body.id + "  and role_id = 4", function (err, rows) {
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

exports.searchStudent = function (req, resp) {
    connection.query("select * from user_master_ut where (user_name like '%" + req.body.search + "%' || first_name like '%" + req.body.search + "%' || last_name like '%" + req.body.search + "%' || standard like '%" + req.body.search + "%' || roll_no like '%" + req.body.search + "%' || divison like '%" + req.body.search + "%') and school_id = " + req.body.school_id + "  and role_id = 4", function (err, rows) {
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

exports.getStudentById = function (req, resp) {
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

exports.editStudent = function (req, resp) {
    connection.query("update user_master_ut set first_name = '" + req.body.first_name + "', last_name = '" + req.body.last_name + "', standard = '" + req.body.standard + "', roll_no = '" + req.body.roll_no + "', divison = '" + req.body.divison + "', gender = '" + req.body.gender + "' where id = " + req.body.id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "message": "Student updated successfully"
            });
        }
    })
}

exports.deleteStudents = function (req, resp) {
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
                "message": "Student deleted successfully"
            });
        }
    })
}


exports.bulkSaveStudent = function (req, resp, next) {
    var s_count = 0;
    var t_count = 0;
    connection.query("select * from user_master_ut left join system_master_values on user_master_ut.id = system_master_values.school_id where user_master_ut.id = " + req.body.school_id + "", function (err, row) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (row.length > 0) {
                if (row[0].student_id) {
                    s_count = row[0].student_id;
                } else {
                    s_count = 1;
                }
                if (row[0].teacher_id) {
                    t_count = row[0].teacher_id;
                } else {
                    t_count = 0;
                }
                connection.query("delete from system_master_values where school_id = " + req.body.school_id + "", function (err, row) {
                    if (err) {
                        console.log(err);
                    } else {}
                })
            } else {
                s_count = 1;
                t_count = 0;
            }
            readXlsxFile(env.base_urls + 'uploads/' + req.files[0].filename).then((rows1) => {
                rows1.shift();
                async.forEach(rows1, function (values, callback) {
                    let s_userName = row[0].user_name + '-s' + s_count;
                    s_count++;
                    const password = randtoken.generate(9);
                    connection.query("insert into user_master_ut (user_name, email_Id, first_name, last_name, gender, standard, roll_no, divison, password, role_id, status, school_id) values ('" + s_userName + "', '" + s_userName + "', '" + values[0] + "','" + values[1] + "', '" + values[5] + "','" + values[2] + "', '" + values[3] + "', '" + values[4] + "', '" + password + "', 4, 1, " + req.body.school_id + ")", function (err, rows) {
                        if (err) {
                            console.log(err);
                            callback();
                        } else {
                            callback();
                        }
                    })
                }, function (err) {
                    connection.query("insert into system_master_values (student_id, teacher_id, school_id) values (" + s_count + ", " + t_count + ", " + req.body.school_id + ")", function (err, row) {
                        if (err) {
                            console.log(err);
                            resp.status(200).json({
                                "status": 0,
                                "message": "Something went wrong"
                            });
                        } else {
                            resp.status(200).json({
                                "status": 1,
                                "message": "Students added successfully"
                            });
                        }
                    })
                })
            })
        }
    })
}