var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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



var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response)
{
});
var clients = [];

var next_id = 0;
var messages_logs = [];


server.listen(1337, function() { });

wsServer = new WebSocketServer(
{
	httpServer: server
});

wsServer.on('request', function(request)
{
	var connection = request.accept(null, request.origin);
	var name = "player"+next_id++;
	clients.push({name:name, socket:connection});
	console.log(connection);

	connection.on('message', function(message)
	{
		if (message.type == "utf8")
		{
			console.log(message.utf8Data);
			try
			{
				var json = JSON.parse(message.utf8Data);
				if (json.type == "draw")
				{
					messages_logs.push(json);
					clients.forEach(e => {e.socket.send(message.utf8Data);});
				}
				else if (json.type == "init")
				{
					connection.send(JSON.stringify(messages_logs));
				}
				else if (json.type == "name")
				{
					
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
		console.log("Closing", connection);
	});
});