var http = require('http');
var env = require('./environment');
var sendmail = require('./sendmail');
var connection = env.Dbconnection;
var async = require('async');
var randtoken = require('rand-token');

exports.saveTeacher = function (req, resp, next) {
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
                    s_count = 0;
                }
                if (row[0].teacher_id) {
                    t_count = row[0].teacher_id;
                } else {
                    t_count = 1;
                }
                connection.query("delete from system_master_values where school_id = " + req.body.school_id + "", function (err, row) {
                    if (err) {
                        console.log(err);
                    } else {}
                })
            } else {
                s_count = 0;
                t_count = 1;
            }
               const s_userName = row[0].user_name + '-t' + s_count;
                const password = randtoken.generate(9);
                connection.query("insert into user_master_ut (user_name, email_id, first_name, last_name, gender, password, role_id, status, school_id) values ('" + s_userName + "', '" + s_userName + "', '" + req.body.first_name + "','" + req.body.last_name + "', '" + req.body.gender + "', '" + password + "', 3, 1, "+req.body.school_id+")", function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        s_count++;
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
                                    "message": "Teacher added successfully"
                                });
                            }
                        })
                    }
                })
        }
    })
}


exports.getTeachers = function (req, resp) {
    connection.query("select * from user_master_ut where school_id = " + req.body.id + " and role_id = 3", function (err, rows) {
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

exports.searchTeacher = function (req, resp) {
    connection.query("select * from user_master_ut where (user_name like '%"+req.body.search+"%' || first_name like '%"+req.body.search+"%' || last_name like '%"+req.body.search+"%') and school_id = " + req.body.school_id + " and role_id = 3", function (err, rows) {
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

exports.getTeacherById = function (req, resp) {
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

exports.editTeacher = function (req, resp) {
    connection.query("update user_master_ut set first_name = '"+req.body.first_name+"', last_name = '"+req.body.last_name+"', gender = '"+req.body.gender+"' where id = " + req.body.id + "", function (err, rows) {
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

exports.deleteTeachers = function (req, resp) {
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
