const color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgrey','darkgreen','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','grey','green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgrey','lightgreen','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','rebeccapurple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyBlue','slateBlue','slateGray','slateGrey','snow','springGreen','steelBlue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whiteSmoke','yellow','yellowGreen'];
const color_hex = ['#f0f8ff','#faebd7','#00ffff','#7fffd4','#f0ffff','#f5f5dc','#ffe4c4','#000000','#ffebcd','#0000ff','#8a2be2','#a52a2a','#deb887','#5f9ea0','#7fff00','#d2691e','#ff7f50','#6495ed','#fff8dc','#dc143c','#00ffff','#00008b','#008b8b','#b8860b','#a9a9a9','#a9a9a9','#006400','#bdb76b','#8b008b','#556b2f','#ff8c00','#9932cc','#8b0000','#e9967a','#8fbc8f','#483d8b','#2f4f4f','#2f4f4f','#00ced1','#9400d3','#ff1493','#00bfff','#696969','#696969','#1e90ff','#b22222','#fffaf0','#228b22','#ff00ff','#dcdcdc','#f8f8ff','#ffd700','#daa520','#808080','#808080','#008000','#adff2f','#f0fff0','#ff69b4','#cd5c5c','#4b0082','#fffff0','#f0e68c','#e6e6fa','#fff0f5','#7cfc00','#fffacd','#add8e6','#f08080','#e0ffff','#fafad2','#d3d3d3','#d3d3d3','#90ee90','#ffb6c1','#ffa07a','#20b2aa','#87cefa','#778899','#778899','#b0c4de','#ffffe0','#00ff00','#32cd32','#faf0e6','#ff00ff','#800000','#66cdaa','#0000cd','#ba55d3','#9370db','#3cb371','#7b68ee','#00fa9a','#48d1cc','#c71585','#191970','#f5fffa','#ffe4e1','#ffe4b5','#ffdead','#000080','#fdf5e6','#808000','#6b8e23','#ffa500','#ff4500','#da70d6','#eee8aa','#98fb98','#afeeee','#db7093','#ffefd5','#ffdab9','#cd853f','#ffc0cb','#dda0dd','#b0e0e6','#800080','#663399','#ff0000','#bc8f8f','#4169e1','#8b4513','#fa8072','#f4a460','#2e8b57','#fff5ee','#a0522d','#c0c0c0','#87ceeb','#6a5acd','#708090','#708090','#fffafa','#00ff7f','#4682b4','#d2b48c','#008080','#d8bfd8','#ff6347','#40e0d0','#ee82ee','#f5deb3','#ffffff','#f5f5f5','#ffff00','#9acd32'];


var drawing = false, color_wheel,
	color_pickers = {color: null, value: null},
	shiftPressed = false,
	drawing_board = {canvas: null, ctx: null, w: 0, h: 0},
	mousePos = {curr: {x:0,y:0}, prev: {x:0,y:0}},
	cursor = {circ_pointer: null, color: "#ffffff", radius: 20};

var toHex = (x) => {let y=x.toString(16); return y.length==1? "0"+y : y;};

function init()
{
	drawing_board.canvas = document.getElementById('can');
	cursor.circ_pointer = document.getElementById("circ_pointer");
	drawing_board.ctx = drawing_board.canvas.getContext("2d");

	drawing_board.w = drawing_board.canvas.clientWidth;
	drawing_board.h = drawing_board.canvas.clientHeight;
	drawing_board.canvas.width = drawing_board.canvas.clientWidth;
	drawing_board.canvas.height = drawing_board.canvas.clientHeight;

	erase();
	cursor.color = "#000000";


	window.addEventListener('mousemove', function(e){
		cursor.circ_pointer.style.left = `${e.clientX-parseInt(cursor.radius/2)}px`;
		cursor.circ_pointer.style.top = `${e.clientY-parseInt(cursor.radius/2)}px`;
	}, false);
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.addEventListener('keydown', e => {if(e.key=="Shift") shiftPressed = true;});
	document.addEventListener('keyup', e => {if(e.key=="Shift") shiftPressed = false;});

	drawing_board.canvas.addEventListener("mousemove", function (e) { findxy('move', e); }, false);
	drawing_board.canvas.addEventListener("mousedown", function (e) { findxy('down', e); }, false);
	drawing_board.canvas.addEventListener("mouseup", function (e) { findxy('up', e); }, false);
	drawing_board.canvas.addEventListener("mouseout", function (e) { findxy('out', e); }, false);
	drawing_board.canvas.addEventListener("mouseenter", function (e) { findxy('in', e); }, false);

	cursor.circ_pointer.style.width = cursor.radius;
	cursor.circ_pointer.style.height = cursor.radius;


	initColorWheel();
}

function draw ()
{
	drawing_board.ctx.beginPath();
	drawing_board.ctx.moveTo(mousePos.prev.x, mousePos.prev.y);
	drawing_board.ctx.lineTo(mousePos.curr.x, mousePos.curr.y);
	drawing_board.ctx.strokeStyle = cursor.color;
	drawing_board.ctx.lineWidth = cursor.radius;
	drawing_board.ctx.stroke();
	drawing_board.ctx.closePath();
}

function drawEnd ()
{
	drawing_board.ctx.beginPath();
	drawing_board.ctx.arc(mousePos.curr.x, mousePos.curr.y, cursor.radius/2., 0, 2 * Math.PI, false);
	drawing_board.ctx.fillStyle = cursor.color;
	drawing_board.ctx.fill();
	drawing_board.ctx.closePath();
}

function erase()
{
	drawing_board.ctx.beginPath();
	drawing_board.ctx.rect(0, 0, drawing_board.w, drawing_board.h);
	drawing_board.ctx.fillStyle = cursor.color;
	drawing_board.ctx.fill();
	drawing_board.ctx.closePath();
}

function fill(x0, y0)
{
	var imgData = drawing_board.ctx.getImageData(0, 0, drawing_board.w, drawing_board.h);
	var pixels = imgData.data;

	var nextColor = [parseInt(cursor.color.substr(1,2),16), parseInt(cursor.color.substr(3,2),16), parseInt(cursor.color.substr(5,2),16)];
	var ind = (x0+y0*imgData.width)*4;
	var prevColor = [pixels[ind], pixels[ind+1], pixels[ind+2]];

	var stack = [[x0,y0]];
	var testColor = (x,y,test,diff) => {let ind=(x+y*imgData.width)*4; return Math.abs(pixels[ind]-test[0]) + Math.abs(pixels[ind+1]-test[1]) + Math.abs(pixels[ind+2]-test[2]) <= diff;};
	var setColor = (x,y) => {let ind=(x+y*imgData.width)*4; pixels[ind]=nextColor[0]; pixels[ind+1]=nextColor[1]; pixels[ind+2]=nextColor[2];pixels[ind+3]=255;};
	var testNpush = (a,b) => {if(!testColor(a,b,nextColor,0) && testColor(a,b,prevColor,10)) stack.push([a,b]);};

	var a,b;
	setColor(x0,y0);
	while (stack.length>0)
	{
		[a,b] = stack.pop();
		//setColor(a,b);

		if(a>0) {testNpush(a-1,b); setColor(a-1,b);}
		if(b>0) {testNpush(a,b-1); setColor(a,b-1);}
		if(a<imgData.width-1) {testNpush(a+1,b); setColor(a+1,b);}
		if(b<imgData.height-1) {testNpush(a,b+1); setColor(a,b+1);}
	}

	drawing_board.ctx.putImageData(imgData, 0, 0);
}

function findColor(a,b)
{
	var imgData = drawing_board.ctx.getImageData(a, b, 1, 1);
	cursor.color = "#" + toHex(imgData.data[0]) + toHex(imgData.data[1]) + toHex(imgData.data[2]);
	let color = RGBtoHSV(imgData.data[0],imgData.data[1],imgData.data[2]);
	color_wheel.col_v = color.v;

	color_wheel.x = color_wheel.cx * color.s * Math.cos(2*Math.PI*color.h) + color_wheel.cx;
	color_wheel.y = color_wheel.cx * color.s * Math.sin(2*Math.PI*color.h) + color_wheel.cx;

	color_pickers.color.style.left = (color_wheel.x + color_wheel.canvas.offsetLeft - 4) + "px";
	color_pickers.color.style.top = (color_wheel.y + color_wheel.canvas.offsetTop - 4) + "px";

	color_pickers.value.style.top = (color_wheel.canvas.offsetTop + Math.round(color.v*color_wheel.h) - 4) + "px";

	updateAndRenderPickers();
	renderColorWheel();
}

function save()
{
	document.getElementById("canvasimg").style.border = "2px solid";
	var dataURL = drawing_board.canvas.toDataURL();
	document.getElementById("canvasimg").src = dataURL;
	document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e)
{
	if (res=='down'|| res=='in')
	{
		if(e.buttons&0b1)
		{
			if(shiftPressed)
			{
				findColor(e.clientX - drawing_board.canvas.offsetLeft, e.clientY - drawing_board.canvas.offsetTop);
			}
			else
			{
				mousePos.prev = mousePos.curr;
				mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};

				drawing = true;
				drawEnd();
			}
		}
		else if(e.buttons&0b10)
		{
			if (shiftPressed)
			{
				erase();
			}
			else
			{
				mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};
				fill(mousePos.curr.x, mousePos.curr.y);
			}
		}
	}
	if (res=='move' || res=='out')
	{
		if (drawing)
		{
			mousePos.prev = mousePos.curr;
			mousePos.curr = {x: e.clientX-drawing_board.canvas.offsetLeft, y: e.clientY-drawing_board.canvas.offsetTop};

			draw();
			drawEnd();
		}
	}
	if (res=='up' || res=='out')
	{
		drawing = false;
	}
}


function initColorWheel()
{
	color_wheel = {};
	color_wheel.canvas = document.getElementById("color_wheel");
	color_wheel.ctx = color_wheel.canvas.getContext("2d");

	color_wheel.w = color_wheel.canvas.clientWidth;
	color_wheel.h = color_wheel.canvas.clientHeight;
	color_wheel.canvas.width = color_wheel.w;
	color_wheel.canvas.height = color_wheel.h;

	color_wheel.x = Math.floor((color_wheel.h-1)/2);
	color_wheel.y = Math.floor((color_wheel.h-1)/2);
	color_wheel.valueStart = Math.ceil(color_wheel.x/2)+color_wheel.h;

	color_wheel.cx = color_wheel.x;
	color_wheel.cy = color_wheel.y;
	color_wheel.col_h = 0;
	color_wheel.col_s = 0;
	color_wheel.col_v = 1;

	renderColorWheel();

	initPickers();
}

function initPickers ()
{
	color_pickers.color = document.getElementById("color_picker");
	color_pickers.value = document.getElementById("value_picker");

	color_pickers.color.style.left = (color_wheel.canvas.offsetLeft + color_wheel.x - 4) + "px";
	color_pickers.color.style.top = (color_wheel.canvas.offsetTop + color_wheel.y - 4) + "px";

	color_pickers.value.style.left = (color_wheel.canvas.offsetLeft + color_wheel.valueStart - 4) + "px";
	color_pickers.value.style.top = (color_wheel.canvas.offsetTop + color_wheel.h - 4) + "px";
	color_pickers.value.style.width = (color_wheel.w - color_wheel.valueStart + 5)+"px";

	color_wheel.canvas.addEventListener("mousemove", function (e) { movePickers(e); }, false);
	color_wheel.canvas.addEventListener("mousedown", function (e) { movePickers(e); }, false);

	renderPickers();
}

function movePickers(e)
{
	let x = e.clientX - color_wheel.canvas.offsetLeft;

	if (e.buttons&0b1)
	{
		if (x<color_wheel.h)
		{
			color_wheel.x = x;
			color_wheel.y = e.clientY - color_wheel.canvas.offsetTop;

			var d = Math.sqrt((color_wheel.x-color_wheel.cx)*(color_wheel.x-color_wheel.cx) + (color_wheel.y-color_wheel.cy)*(color_wheel.y-color_wheel.cy)) / color_wheel.cx;
			if (d>1)
			{
				color_wheel.x = color_wheel.cx + (color_wheel.x-color_wheel.cx) / d;
				color_wheel.y = color_wheel.cy + (color_wheel.y-color_wheel.cy) / d;
			}

			color_pickers.color.style.left = (color_wheel.x + color_wheel.canvas.offsetLeft - 4) + "px";
			color_pickers.color.style.top = (color_wheel.y + color_wheel.canvas.offsetTop - 4) + "px";

			updateAndRenderPickers();
		}
		else if (x>=color_wheel.valueStart)
		{
			color_pickers.value.style.top = (e.clientY - 4) + "px";
			color_wheel.col_v = (e.clientY - color_wheel.canvas.offsetTop) / color_wheel.h;

			updateAndRenderPickers();
			renderColorWheel();
		}
	}
}

function updateAndRenderPickers()
{
	let color = getColor(color_wheel.x, color_wheel.y);
	cursor.color = "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
	renderPickers();
}

function renderPickers()
{
	if (color_wheel.col_v<.5)
	{
		color_pickers.color.style["border-color"] = "#fff";
		color_pickers.value.style["border-color"] = "#fff";
	}
	else
	{
		color_pickers.color.style["border-color"] = "#000";
		color_pickers.value.style["border-color"] = "#000";
	}
	color_pickers.color.style["background-color"] = cursor.color;
	let w = toHex(Math.floor(color_wheel.col_v*255));
	color_pickers.value.style["background-color"] ="#"+w+w+w;
}

function getColor(x,y)
{
	var r2 = color_wheel.cx * color_wheel.cx + 7;
	var d2 = (x-color_wheel.cx)*(x-color_wheel.cx) + (y-color_wheel.cy)*(y-color_wheel.cy);

	let d = Math.sqrt(d2/r2);
	let a = Math.atan2(y-color_wheel.cy, x-color_wheel.cx)/(2*Math.PI);
	a = a<0? a+1: a;

	return HSVtoRGB(a,d,color_wheel.col_v);
}

function renderColorWheel ()
{
	var imgData = color_wheel.ctx.getImageData(0, 0, color_wheel.w, color_wheel.h);
	var pixels = imgData.data;

	var r2 = color_wheel.cx * color_wheel.cx + 7;

	for(var j=0; j<color_wheel.h; j++)
	for(var i=0; i<color_wheel.h; i++)
	{
		var d2 = (i-color_wheel.cx)*(i-color_wheel.cx) + (j-color_wheel.cy)*(j-color_wheel.cy);
		if (d2<r2)
		{
			let d = Math.sqrt(d2/r2);
			let a = Math.atan2(j-color_wheel.cy, i-color_wheel.cx)/(2*Math.PI);
			a = a<0? a+1: a;

			let t = HSVtoRGB(a,d,color_wheel.col_v);
			let ind = (j*imgData.width + i)*4;
			pixels[ind] = t.r;
			pixels[ind+1] = t.g;
			pixels[ind+2] = t.b;
			pixels[ind+3] = 255;
		}
	}

	for(var j=0; j<color_wheel.h; j++)
	for(var i=color_wheel.valueStart; i<color_wheel.w; i++)
	{
		let ind = (j*imgData.width + i)*4;
		pixels[ind] = 255*j/color_wheel.h;
		pixels[ind+1] = 255*j/color_wheel.h;
		pixels[ind+2] = 255*j/color_wheel.h;
		pixels[ind+3] = 255;
	}

	color_wheel.ctx.putImageData(imgData, 0, 0);
}


/* h,s,v in [0,1] */
/* r,g,b in [|0,255|]*/
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1)
	{
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6)
	{
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

function RGBtoHSV (r, g, b) {
	let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc;
	rabs = r / 255;
	gabs = g / 255;
	babs = b / 255;
	v = Math.max(rabs, gabs, babs),
	diff = v - Math.min(rabs, gabs, babs);
	diffc = c => (v - c) / 6 / diff + 1 / 2;
	if (diff == 0)
	{
		h = s = 0;
	} else
	{
		s = diff / v;
		rr = diffc(rabs);
		gg = diffc(gabs);
		bb = diffc(babs);

		if (rabs === v)
			h = bb - gg;
		else if (gabs === v)
			h = (1 / 3) + rr - bb;
		else if (babs === v)
			h = (2 / 3) + gg - rr;
		
		if (h < 0)
			h += 1;
		else if (h > 1)
			h -= 1;
	}
	return {h: h, s: s, v: v};
}