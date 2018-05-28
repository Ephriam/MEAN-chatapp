var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var _ = require("lodash");
var io = require('socket.io');
var ss = require('socket.io-stream');
 
var Chat = require('./controllers/ChatController')

var app = express();

serverPort = process.env.PORT || 3000;
databasePort = 27017;
databseName = "chatapp2";
mongoUri = 'mongodb://username:password@ds119150.mlab.com:19150/chatandwallet'
mongoUriLocal = 'mongodb://127.0.0.1:'+ databasePort + '/' + databseName
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "./public")))

//connect to mongoDB
//mongoose.connect('mongodb://127.0.0.1:'+ databasePort + '/' + databseName)
mongoose.connect(mongoUri).then(()=>{}, (err) => {console.log(err)})
mongoose.connection.on('error', console.error.bind(console, 'Database connection error:'))
                   .once('open', function() {  console.log("Database is connected!");  })

var routes = require('./routes')

_.each(routes, (controller, route)=>{
    app.use('/api'+route, require(controller))
})

app.use('/socket', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js')
})

app.use('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
app.use((req, res, next) => {
    var error = new Error('404 Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
var server = app.listen(serverPort, function(){
	console.log("Server started at port "+serverPort)
})

var io = require('socket.io').listen(server)

var socket = io.sockets

socket.on('connection', (socket1) => {
    socket1.emit('confirm', {msg: 'connected'})
    socket1.on('Auth', (data) => {
        Chat.register(data.Authorization, socket1.id)
    })
    socket1.on('message', (data) => {
         Chat.register(data.Authorization, socket1.id)
             .then((res) => {
               data.from = res.id
               Chat.saveChat(data)
               return Chat.findSocketId(data.to)
             }).
             then((recverSocketId)=>{
                 data.Authorization = undefined
                 io.to(recverSocketId).emit('message', data)
             }) .catch((err) =>{
                 socket.emit('message', {msg: 'Unauthorized'})
             })
    })
    socket1.on('disconnect', () => {
        console.log('distcon')
        Chat.unsubscribe(socket1.id)
    })
})

