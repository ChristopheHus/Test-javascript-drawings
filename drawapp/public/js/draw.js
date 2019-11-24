export function draw (ctx, mousePos, cursor, color)
{
	ctx.beginPath();
	ctx.moveTo(mousePos.prev.x, mousePos.prev.y);
	ctx.lineTo(mousePos.curr.x, mousePos.curr.y);
	ctx.strokeStyle = color.toHexStr();
	ctx.lineWidth = cursor.radius;
	ctx.stroke();
	ctx.closePath();
}

export function drawEnd (ctx, mousePos, cursor, color)
{
	ctx.beginPath();
	ctx.arc(mousePos.curr.x, mousePos.curr.y, cursor.radius/2., 0, 2 * Math.PI, false);
	ctx.fillStyle = color.toHexStr();
	ctx.fill();
	ctx.closePath();
}

export function erase(ctx, w, h, color)
{
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = color.toHexStr();
	ctx.fill();
	ctx.closePath();
}

export function fill(ctx, w, h, x0, y0, color)
{
	var imgData = ctx.getImageData(0, 0, w, h);
	var pixels = imgData.data;

	var nextColor = [color.R(),color.G(),color.B()];
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
}