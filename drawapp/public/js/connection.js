class Connection
{
	constructor ()
	{
		this.connection = null;
	}

	init (onReception)
	{
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		this.connection = new WebSocket('ws://127.0.0.1:1337');

		this.connection.onopen = function ()
		{
			console.log("Open");
		};

		this.connection.onerror = function (error)
		{
			console.log("Error", error);
		};

		this.connection.onmessage = function (message)
		{
			try
			{
				var json = JSON.parse(message.data);
				onReception(json);
			}
			catch (e)
			{
				console.log(e);
				return;
			}
		};
	}

	send (msg)
	{
		if (this.connection == null) return;
		this.connection.send(JSON.stringify(msg));
	}
}

export default new Connection();