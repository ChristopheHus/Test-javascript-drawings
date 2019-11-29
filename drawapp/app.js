var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next)
{
	next(createError(404));
});


app.use(function(err, req, res, next)
{
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

process.env.port = 5000;
process.env.port2 = 1337;






var words = new Promise((resolve, reject) =>
{
	fs.readFile('words.txt', (err, data) =>
	{
		if (err) reject(err);
		resolve(data.toString().split("\n"));
	})
});

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response)
{
});

const STATES = {
	START: 0,
	CHOOSING: 1,
	DRAWING: 2
};

var clients = [];
var idPlayer1 = 0, nextPlayer = 0;

var next_id = 0;
var messages_logs = [];


server.listen(process.env.port2, function() { });

wsServer = new WebSocketServer(
{
	httpServer: server
});

wsServer.on('request', function(request)
{
	var connection = request.accept(null, request.origin);
	var name = "player"+next_id++;
	clients.push({name:name, socket:connection});
	const id = clients.find(e => e.socket===connection);
	console.log(connection);

	connection.on('message', function(message)
	{
		if (message.type == "utf8")
		{
			try
			{
				var json = JSON.parse(message.utf8Data);
				switch (json.type)
				{
				case "draw":
					messages_logs.push(json);
					clients.forEach((e,i) => {if(i!==id) e.socket.send(message.utf8Data);});
					break;
				case "init":
					connection.send(JSON.stringify({type:"drawhistory",data:messages_logs}));
					break;
				case "name":
					const old = clients[id];
					clients[id].name = json.name;
					clients.forEach(e => {if(i!==id) e.socket.send({type:"nameChange",old:old, new:clients[id].name});});
					break;
				case "message":
					// TODO : test word
					clients.forEach(e => {if(i!==id) e.socket.send({type:"message",author:clients[id].name,message:json.message});});
					break;
				case "choose":
					// TODO : launch drawing phase
					break;
				}
				
			}
			catch(e)
			{
				console.error(e);
			}
		}
		else
		{
			console.log(message.type);
		}
	});

	connection.on('close', function(connection)
	{
		clients[id] = undefined;
		console.log("Closing", connection);
	});
});