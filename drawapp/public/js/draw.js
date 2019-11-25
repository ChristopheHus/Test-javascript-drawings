import Connection from './connection.js';


export function draw (ctx, prev, curr, radius, color)
{
	ctx.beginPath();
	ctx.moveTo(prev.x, prev.y);
	ctx.lineTo(curr.x, curr.y);
	ctx.strokeStyle = typeof(color)=="string"? color : color.toHexStr();
	ctx.lineWidth = radius;
	ctx.stroke();
	ctx.closePath();

	if (!(typeof(color)=="string"))
		Connection.send({type:"draw", subtype:"draw", opt:[color.toHexStr(),radius], from:prev, to:curr});
}

export function drawEnd (ctx, curr, radius, color)
{
	ctx.beginPath();
	ctx.arc(curr.x, curr.y, radius/2., 0, 2 * Math.PI, false);
	ctx.fillStyle = typeof(color)=="string"? color : color.toHexStr();
	ctx.fill();
	ctx.closePath();

	if (!(typeof(color)=="string"))
		Connection.send({type:"draw", subtype:"end", opt:[color.toHexStr(),radius], to:curr});
}

export function erase(ctx, w, h, color)
{
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = typeof(color)=="string"? color : color.toHexStr();
	ctx.fill();
	ctx.closePath();

	if (!(typeof(color)=="string"))
		Connection.send({type:"draw", subtype:"erase", opt:[color.toHexStr()]});
}

export function fill(ctx, w, h, x0, y0, color)
{
	var imgData = ctx.getImageData(0, 0, w, h);
	var pixels = imgData.data;

	var nextColor;
	if (typeof(color) == "string")
		nextColor = [parseInt(color.substr(1,2),16), parseInt(color.substr(3,2),16), parseInt(color.substr(5,2),16)];
	else
		nextColor = [Math.round(color.R()*255),Math.round(color.G()*255),Math.round(color.B()*255)];
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

	ctx.putImageData(imgData, 0, 0);

	if (!(typeof(color)=="string"))
		Connection.send({type:"draw", subtype:"fill", opt:[color.toHexStr()], from:[x0,y0]});
}