import * as draw from './draw.js';
import ClickHandler from './clickHandler.js';
import ColorWheel from './colorWheel.js';
import Color from './color.js';
import Connection from './connection.js';

var drawing = false,
	drawing_board = {canvas: null, ctx: null, w: 0, h: 0},
	mousePos = {curr: {x:0,y:0}, prev: {x:0,y:0}},
	cursor = {circ_pointer: null, radius: 20};


window.init = init;
export function init()
{
	drawing_board.canvas = document.getElementById('can');
	cursor.circ_pointer = document.getElementById("circ_pointer");
	drawing_board.ctx = drawing_board.canvas.getContext("2d");

	drawing_board.w = drawing_board.canvas.clientWidth;
	drawing_board.h = drawing_board.canvas.clientHeight;
	drawing_board.canvas.width = drawing_board.canvas.clientWidth;
	drawing_board.canvas.height = drawing_board.canvas.clientHeight;

	let color = new Color();
	color.setRGB({r:1,g:1,b:1});
	draw.erase(drawing_board.ctx, drawing_board.w, drawing_board.h, color);


	document.addEventListener('contextmenu', event => event.preventDefault());
	window.addEventListener('mousemove', function(e)
	{
		cursor.circ_pointer.style.left = `${e.clientX-parseInt(cursor.radius/2)}px`;
		cursor.circ_pointer.style.top = `${e.clientY-parseInt(cursor.radius/2)}px`;
		ClickHandler.onMouseMove(e);
	}, false);
	window.addEventListener('mousedown', ClickHandler.onMouseDown.bind(ClickHandler), false);
	window.addEventListener('mouseup', ClickHandler.onMouseUp.bind(ClickHandler), false);

	ClickHandler.addField(
		"canvas",
		{x:drawing_board.canvas.offsetLeft, y:drawing_board.canvas.offsetTop, w:drawing_board.canvas.width, h:drawing_board.canvas.height},
		(s,e)=>{findxy(s,e);}
	);


	cursor.circ_pointer.style.width = cursor.radius;
	cursor.circ_pointer.style.height = cursor.radius;

	ColorWheel.init();

	Connection.init((msg) =>
	{
		let parseDraw = (msg) =>
		{
			switch(msg.subtype)
			{
			case "draw":
				draw.draw(drawing_board.ctx, msg.from, msg.to, msg.opt[1], msg.opt[0]);
				break;
			case "end":
				draw.drawEnd(drawing_board.ctx, msg.to, msg.opt[1], msg.opt[0]);
				break;
			case "erase":
				draw.erase(drawing_board.ctx, drawing_board.w, drawing_board.h, msg.opt[0]);
				break;
			case "fill":
				draw.fill(drawing_board.ctx, drawing_board.w, drawing_board.h, msg.from[0], msg.from[1], msg.opt[0]);
				break;
			}
		}

		if (msg.type == "draw")
		{
			parseDraw(msg);
		}
		else
		{
			msg.forEach(e => parseDraw(e));
		}
	});
}

function findColor(a,b)
{
	var imgData = drawing_board.ctx.getImageData(a, b, 1, 1);
	ColorWheel.setColor(imgData.data[0], imgData.data[1], imgData.data[2]);
}

window.save = save;
export function save()
{
	document.getElementById("canvasimg").style.border = "2px solid";
	var dataURL = drawing_board.canvas.toDataURL();
	document.getElementById("canvasimg").src = dataURL;
	document.getElementById("canvasimg").style.display = "inline";
}

window.resize = resize;
export function resize ()
{
	ColorWheel.updatePickerPosition();
}

function findxy(res, e)
{
	if (res=='down'|| res=='in')
	{
		if(e.buttons&0b1)
		{
			if(e.shiftKey)
			{
				findColor(e.clientX - drawing_board.canvas.offsetLeft, e.clientY - drawing_board.canvas.offsetTop);
			}
			else
			{
				mousePos.prev = mousePos.curr;
				mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};

				drawing = true;
				draw.drawEnd(drawing_board.ctx, mousePos.curr, cursor.radius, ColorWheel.getCurrentColor());
			}
		}
		else if(e.buttons&0b10)
		{
			if (e.shiftKey)
			{
				draw.erase(drawing_board.ctx, drawing_board.w, drawing_board.h, ColorWheel.getCurrentColor());
			}
			else
			{
				mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};
				draw.fill(drawing_board.ctx, drawing_board.w, drawing_board.h, mousePos.curr.x, mousePos.curr.y, ColorWheel.getCurrentColor());
			}
		}
	}
	if (res=='move' || res=='out')
	{
		if (drawing)
		{
			mousePos.prev = mousePos.curr;
			mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};

			draw.draw(drawing_board.ctx, mousePos.prev, mousePos.curr, cursor.radius, ColorWheel.getCurrentColor());
			draw.drawEnd(drawing_board.ctx, mousePos.curr, cursor.radius, ColorWheel.getCurrentColor());
		}
	}
	if (res=='up' || res=='out')
	{
		drawing = false;
	}
}

window.cursorResize = cursorResize;
function cursorResize (value)
{
	cursor.radius = value;
	cursor.circ_pointer.style.width = cursor.radius;
	cursor.circ_pointer.style.height = cursor.radius;
}