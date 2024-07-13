var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
var env = require('./Api/environment');
var userLogin = require('./Api/login');
var users = require('./Api/users');
var questions = require('./Api/questions');
var vocabulary = require('./Api/vocabulary');
var courses = require('./Api/courses');
var school = require('./Api/school');
var student = require('./Api/student');
var teacher = require('./Api/teacher');
var batch = require('./Api/batch');
var connection = env.Dbconnection;
var app = express();
const cors = require('cors');
var multer = require('multer');
var AWS = require('aws-sdk');
var jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
var base_urls = env.base_urls;
var compression = require('compression')
app.use(compression())
connection.query('SELECT NOW()', (err, res) => {
    // console.log(err, res);
    // connection.end();
    });

var sessionOptions = {
    secret: "2C44-4D44-WppQ38S",
    resave: true,
    saveUninitialized: true //,
    // cookie: {
    //     secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
    //     maxAge: Date.now() + (30 * 86400 * 1000) // 10 Days in miliseconds
    // }
};

app.use(cors());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var storage = multer.diskStorage({ // storage code for storing setting
    destination: function (req, file, cb) {
        cb(null, base_urls + 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.').pop())
    }
});

var upload = multer({
    storage: storage
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// AWS.config.update({ accessKeyId: env.accessKeyId, secretAccessKey: env.secretAccessKey });

app.use("/Api", express.static(path.join(__dirname, 'Api')));

app.use("/lexiconlab", express.static(path.join(__dirname, 'Lexicon-Homepage-html')));
app.use(express.static(path.join(__dirname, 'angular-learn/dist/angular-learn')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'angular-learn/dist/angular-learn/index.html'));
});

//server port handles
var server = app.listen(env.port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});

app.post('/loginUser', userLogin.loginUser);
app.post('/forgotPassword', userLogin.forgotPassword);
app.post('/changePassword', userLogin.changePassword);
app.post('/checkToken', userLogin.checkToken);
app.post('/getques1', questions.getques1);
app.post('/getUserTypes', users.getUserTypes);
app.post('/getUsers', users.getUsers);
app.post('/getUserById', users.getUserById);
app.post('/registerUser', users.registerUser);
app.post('/editUser', users.editUser);
app.post('/deleteUser', users.deleteUser);
app.post('/getCards', vocabulary.getCards);
app.post('/getCards1', vocabulary.getCards1);
app.post('/getUnits', vocabulary.getUnits);
app.post('/insertCards', vocabulary.insertCards);
app.post('/insertBulkCards', upload.any(), vocabulary.insertBulkCards);
app.post('/getCourses', courses.getCourses);
app.post('/getTopics', courses.getTopics);
app.post('/getTopicsById', courses.getTopicsById);
app.post('/updateProgress', courses.updateProgress);
app.post('/updateScore', courses.updateScore);
app.post('/getProgress', courses.getProgress);
app.post('/getProgressByStudent', courses.getProgressByStudent);
app.post('/getProgressByTopic', courses.getProgressByTopic);
app.post('/getCountries', school.getCountries);
app.post('/getStates', school.getStates);
app.post('/getCities', school.getCities);
app.post('/saveSchool', school.saveSchool);
app.post('/saveStudent', student.saveStudent);
app.post('/bulkSaveStudent', upload.any(), student.bulkSaveStudent);
app.post('/getStudents', student.getStudents);
app.post('/deleteStudents', student.deleteStudents);
app.post('/editStudent', student.editStudent);
app.post('/getStudentById', student.getStudentById);
app.post('/searchStudent', student.searchStudent);
app.post('/saveTeacher', teacher.saveTeacher);
app.post('/getTeachers', teacher.getTeachers);
app.post('/deleteTeachers', teacher.deleteTeachers);
app.post('/editTeacher', teacher.editTeacher);
app.post('/getTeacherById', teacher.getTeacherById);
app.post('/searchTeacher', teacher.searchTeacher);
app.post('/saveBatch', batch.saveBatch);
app.post('/getBatchs', batch.getBatchs);
app.post('/deleteBatchs', batch.deleteBatchs);
app.post('/editBatch', batch.editBatch);
app.post('/getBatchById', batch.getBatchById);
app.post('/searchBatch', batch.searchBatch);
app.post('/getBatchCourses', batch.getBatchCourses);
app.post('/saveBatchEnrollment', batch.saveBatchEnrollment);
app.post('/getBatchStudents', batch.getBatchStudents);
app.post('/deleteStudentBatch', batch.deleteStudentBatch);



// app.post('/checkAns', questions.checkAns);
// app.post('/getrightdata', questions.getrightdata);
// app.post('/getleftdata', questions.getleftdata);
// app.post('/checkMatch', questions.checkMatch);