var http = require('http');
var env = require('./environment');
var sendmail = require('./sendmail');
var connection = env.Dbconnection;
var async = require('async');
var randtoken = require('rand-token');
var moment = require('moment');
var today = moment();

exports.saveBatch = function (req, resp, next) {
    var s_count = 0;
    var t_count = 0;
    connection.query("select * from batch_master_ut where name = '" + req.body.name + "' and id = " + req.body.user_id + "", function (err, row) {
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
                    "message": "Batch name is already exist"
                });
            } else {
                const start_date = moment(req.body.start_date).format("YYYY-MM-DD");
                const end_date = moment(req.body.end_date).format("YYYY-MM-DD");
                connection.query("insert into batch_master_ut (name, start_date, end_date, course_id, user_id) values ('" + req.body.name + "', '" + start_date + "', '" + end_date + "', " + req.body.course_id + ", " + req.body.user_id + ")", function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        resp.status(200).json({
                            "status": 1,
                            "message": "Batch created successfully"
                        });
                    }
                })
            }
        }
    })
}


exports.getBatchs = function (req, resp) {
    connection.query("select *, batch_master_ut.id as id ,batch_master_ut.name as name, course_master_ut.name as course_name from batch_master_ut join course_master_ut on batch_master_ut.course_id = course_master_ut.id where user_id = " + req.body.id + "", function (err, rows) {
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

exports.getBatchStudents = function (req, resp) {
    connection.query("select * from user_master_ut join batch_enrollment_ut on user_master_ut.id = batch_enrollment_ut.user_id where batch_id = " + req.body.id + " and school_id = "+req.body.school_id+"", function (err, rows) {
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

exports.searchBatch = function (req, resp) {
    connection.query("select *, course_master_ut.name as course_name from batch_master_ut join course_master_ut on batch_master_ut.course_id = course_master_ut.id where (batch_master_ut.name like '%" + req.body.search + "%') and user_id = " + req.body.user_id + "", function (err, rows) {
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

exports.getBatchById = function (req, resp) {
    connection.query("select * from batch_master_ut where id = " + req.body.id + "", function (err, rows) {
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

exports.editBatch = function (req, resp) {
    const start_date = moment(req.body.start_date).format("YYYY-MM-DD");
    const end_date = moment(req.body.end_date).format("YYYY-MM-DD");
    connection.query("update batch_master_ut set name = '" + req.body.name + "', course_id = '" + req.body.course_id + "', start_date = '" + start_date + "', end_date = '" + end_date + "' where id = " + req.body.id + "", function (err, rows) {
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

exports.deleteBatchs = function (req, resp) {
    connection.query("delete from batch_master_ut where id = " + req.body.id + "", function (err, rows) {
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

exports.deleteStudentBatch = function (req, resp) {
    connection.query("delete from batch_enrollment_ut where id = " + req.body.id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            resp.status(200).json({
                "status": 1,
                "message": "Student removed from batch successfully"
            });
        }
    })
}

exports.getBatchCourses = function (req, resp) {
    connection.query("select * from course_master_ut", function (err, rows) {
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

exports.saveBatchEnrollment = function (req, resp, next) {
    async.forEach(req.body.addStudent, function (values, callback) {
        connection.query("select * from batch_enrollment_ut where batch_id = " + req.body.batch_id + " and user_id = " + values.id + "", function (err, rows1) {
            if (err) {
                console.log(err);
                callback();

            } else {
                if (rows1.length > 0) {
                    callback();
                } else {
                    connection.query("insert into batch_enrollment_ut (batch_id, user_id) values (" + req.body.batch_id + ", " + values.id + ")", function (err, rows) {
                        if (err) {
                            console.log(err);
                            callback();
                        } else {
                            callback();
                        }
                    })
                }
            }
        })
    }, function (err) {
        resp.status(200).json({
            "status": 1,
            "message": "Batch created successfully"
        });
    })
}