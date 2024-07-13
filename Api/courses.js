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
var stats = require('word-stats');

exports.getCourses = function (req, resp) {
    connection.query("select * from batch_master_ut join batch_enrollment_ut on batch_master_ut.id = batch_enrollment_ut.batch_id join course_master_ut on batch_master_ut.course_id = course_master_ut.id where batch_enrollment_ut.user_id = " + req.body.id + "", function (err, rows) {
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

exports.getTopics = function (req, resp) {
    const arr = [];
    connection.query("select * from course_master_ut join topic_master_ut on course_master_ut.id = topic_master_ut.course_id where course_master_ut.id = " + req.body.id + " order by topic_master_ut.sequence_no", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            if (rows.length > 0) {
                async.forEach(rows, function (values, callback) {
                    connection.query("select * from language_master_ut where id = " + values.from_language_id + "", function (err, rows1) {
                        if (err) {
                            console.log(err);
                        } else {
                            connection.query("select * from language_master_ut where id = " + values.to_language_id + "", function (err, rows2) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    connection.query("select AVG(progress) as progress from user_course_progress_ut where user_id = " + req.body.user_id + " and topic_id = " + values.id + "", function (err, rows3) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            if (rows3.length > 0) {
                                                rows3[0].progress = Math.round(rows3[0].progress);
                                                connection.query("select AVG(score) as score from user_course_progress_ut where user_id = " + req.body.user_id + " and topic_id = " + values.id + "", function (err, rows4) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        values.from_language = rows1[0];
                                                        values.to_language = rows2[0];
                                                        values.score = rows4[0].score;
                                                        if (rows3[0].progress == 1) {
                                                            values.progress = 0;
                                                        } else if (rows3[0].progress == 2) {
                                                            values.progress = 20;
                                                        } else if (rows3[0].progress == 3) {
                                                            values.progress = 40;
                                                        } else if (rows3[0].progress == 4) {
                                                            values.progress = 60;
                                                        } else if (rows3[0].progress == 5) {
                                                            values.progress = 80;
                                                        } else if (rows3[0].progress == 6) {
                                                            values.progress = 100;
                                                        } else {
                                                            values.progress = 0;
                                                        }
                                                        arr.push(values);
                                                        callback();
                                                    }
                                                })
                                            } else {
                                                values.from_language = rows1[0];
                                                values.to_language = rows2[0];
                                                values.score = 0;
                                                values.progress = 0;
                                                arr.push(values);
                                                callback();
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }, function (err) {
                    resp.status(200).json({
                        "status": 1,
                        "data": arr
                    });
                })
            } else {
                resp.status(200).json({
                    "status": 1,
                    "data": rows
                });
            }
        }
    })
}

exports.getTopicsById = function (req, resp) {
    connection.query("select * from user_course_progress_ut join topic_master_ut on user_course_progress_ut.topic_id = topic_master_ut.id where user_course_progress_ut.user_id = " + req.body.user_id + " and user_course_progress_ut.topic_id = '" + req.body.id + "'", function (err, rows3) {
        if (err) {
            console.log(err);
        } else {
            resp.status(200).json({
                "status": 1,
                "data": rows3[0]
            });
        }
    })
}

exports.updateProgress = function (req, resp) {
    connection.query("select * from user_course_progress_ut where user_id = " + req.body.user_id + "  and topic_id = " + req.body.id + "", function (err1, rows) {
        if (err1) {
            console.log(err1);
        } else {
            if (rows.length > 0) {
                if (req.body.progress > rows[0].progress) {
                    connection.query("update user_course_progress_ut set progress = " + req.body.progress + " where user_id = " + req.body.user_id + " and topic_id = " + req.body.id + "", function (err, rows3) {
                        if (err) {
                            console.log(err);
                        } else {
                            resp.status(200).json({
                                "status": 1
                            });
                        }
                    })
                } else {
                    resp.status(200).json({
                        "status": 1
                    });
                }
            } else {
                connection.query("insert into user_course_progress_ut (topic_id, user_id, progress, score, listen_score, speak_score, read_score, write_score, listen_total, speak_total, read_total, write_total, total_question) values (" + req.body.id + ", " + req.body.user_id + ", " + req.body.progress + ", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)", function (err, rows3) {
                    if (err) {
                        console.log(err);
                    } else {
                        resp.status(200).json({
                            "status": 1
                        });
                    }
                })
            }
        }
    })
}

exports.updateScore = function (req, resp) {
    connection.query("insert into user_course_progress_ut (progress, score, user_id, topic_id, read_score, write_score, listen_score, speak_score, read_total, write_total, listen_total, speak_total, total_question) values (6, " + req.body.score + ", " + req.body.user_id + ", " + req.body.id + ", " + req.body.read + ", " + req.body.write + ", " + req.body.listen + ", " + req.body.speak + ", " + req.body.read_total + ", " + req.body.write_total + ", " + req.body.listen_total + ", " + req.body.speak_total + ", " + req.body.total_question + ")", function (err, rows3) {
        if (err) {
            console.log(err);
        } else {
            resp.status(200).json({
                "status": 1
            });
        }
    })
}

exports.getProgress = function (req, resp) {
    connection.query("select AVG(read_score) as read_score, AVG(write_score) as write_score, AVG(listen_score) as listen_score, AVG(speak_score) as speak_score, AVG(read_total) as read_total, AVG(write_total) as write_total, AVG(listen_total) as listen_total, AVG(speak_total) as speak_total from user_course_progress_ut where user_id = " + req.body.id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            rows[0].read_score = (rows[0].read_score / rows[0].read_total) * 100;
            rows[0].write_score = (rows[0].write_score / rows[0].write_total) * 100;
            rows[0].listen_score = (rows[0].listen_score / rows[0].listen_total) * 100;
            rows[0].speak_score = (rows[0].speak_score / rows[0].speak_total) * 100;
            resp.status(200).json({
                "status": 1,
                "data": rows[0]
            });
        }
    })
}

exports.getProgressByStudent = function (req, resp) {
    connection.query("select * from topic_master_ut left join user_course_progress_ut on topic_master_ut.id = user_course_progress_ut.topic_id where user_id = " + req.body.id + " group by topic_id", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            var arr = [];
            async.forEach(rows, function (values, callback) {
                connection.query("select AVG(read_score) as read_score, AVG(write_score) as write_score, AVG(listen_score) as listen_score, AVG(speak_score) as speak_score, AVG(read_total) as read_total, AVG(write_total) as write_total, AVG(listen_total) as listen_total, AVG(speak_total) as speak_total from user_course_progress_ut where topic_id = " + values.topic_id + "", function (err, rows1) {
                    if (err) {
                        console.log(err);
                        resp.status(200).json({
                            "status": 0,
                            "message": "Something went wrong"
                        });
                    } else {
                        rows1[0].read_score = (rows1[0].read_score / rows1[0].read_total) * 100;
                        rows1[0].write_score = (rows1[0].write_score / rows1[0].write_total) * 100;
                        rows1[0].listen_score = (rows1[0].listen_score / rows1[0].listen_total) * 100;
                        rows1[0].speak_score = (rows1[0].speak_score / rows1[0].speak_total) * 100;
                        if (values.progress == 1) {
                            values.progress = 20;
                        } else if (values.progress == 2) {
                            values.progress = 40;
                        } else if (values.progress == 3) {
                            values.progress = 60;
                        } else if (values.progress == 4) {
                            values.progress = 80;
                        } else if (values.progress >= 5) {
                            values.progress = 100;
                        }
                        values.score = rows1[0]
                        arr.push(values);
                        callback();
                    }
                })
            }, function (err) {
                resp.status(200).json({
                    "status": 1,
                    "data": arr
                });
            })
        }
    })
}

exports.getProgressByTopic = function (req, resp) {
    connection.query("select * from topic_master_ut left join user_course_progress_ut on topic_master_ut.id = user_course_progress_ut.topic_id where user_id = " + req.body.id + " and topic_id = " + req.body.topic_id + "", function (err, rows) {
        if (err) {
            console.log(err);
            resp.status(200).json({
                "status": 0,
                "message": "Something went wrong"
            });
        } else {
            var arr = [];
            async.forEach(rows, function (values, callback) {
                values.read_score = (values.read_score / values.read_total);
                values.write_score = (values.write_score / values.write_total);
                values.listen_score = (values.listen_score / values.listen_total);
                values.speak_score = (values.speak_score / values.speak_total);
                if (values.progress == 1) {
                    values.progress = 20;
                } else if (values.progress == 2) {
                    values.progress = 40;
                } else if (values.progress == 3) {
                    values.progress = 60;
                } else if (values.progress == 4) {
                    values.progress = 80;
                } else if (values.progress >= 5) {
                    values.progress = 100;
                }
                arr.push(values);
                callback();
            }, function (err) {
                resp.status(200).json({
                    "status": 1,
                    "data": arr
                });
            })
        }
    })
}