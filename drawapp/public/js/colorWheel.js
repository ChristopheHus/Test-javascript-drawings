import * as conversions from './conversions.js';
import Color from './color.js';
import ClickHandler from './clickHandler.js';


class ColorWheel
{
	constructor ()
	{
		this.canvas = null;
		this.ctx = null;

		this.color_picker = null;
		this.value_picker = null;

		this.pointer = new Color();
		this.positions = {cx:0, cy:0, valueStart:0};
	}

	init ()
	{
		this.canvas = document.getElementById("color_wheel");
		this.ctx = this.canvas.getContext("2d");

		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;

		this.color_picker = document.getElementById("color_picker");
		this.value_picker = document.getElementById("value_picker");

		this.positions.cx = Math.floor((this.canvas.height-1)/2);
		this.positions.cy = this.positions.cx;
		this.positions.valueStart = Math.ceil(this.positions.cx/2)+this.canvas.height;

		this.pointer.setXYV({x:0, y:0, v:1});

		ClickHandler.addField(
			{x:this.canvas.offsetLeft, y:this.canvas.offsetTop, w:this.canvas.height, h:this.canvas.height},
			(s,e)=>{this.moveColorPicker(e);}
		);
		ClickHandler.addField(
			{x:this.canvas.offsetLeft+this.positions.valueStart, y:this.canvas.offsetTop, w:this.canvas.width-this.positions.valueStart, h:this.canvas.height},
			(s,e)=>{this.moveValuePicker(e);}
		);

		
		this.color_picker.style.left = (this.canvas.offsetLeft + this.positions.cx - 4) + "px";
		this.color_picker.style.top = (this.canvas.offsetTop + this.positions.cy - 4) + "px";

		this.value_picker.style.left = (this.canvas.offsetLeft + this.positions.valueStart - 4) + "px";
		this.value_picker.style.top = (this.canvas.offsetTop + this.canvas.height - 4) + "px";
		this.value_picker.style.width = (this.canvas.width - this.positions.valueStart + 5) + "px";

		this.render();
		this.renderPickers();
	}

	setColor(r, g, b)
	{
		var color = new Color();
		color.setRGB({r:r/255,g:g/255,b:b/255});

		this.pointer = color;
		this.updatePickerPosition();
		this.render();
		this.renderPickers();
	}

	getCurrentColor()
	{
		return this.pointer;
	}

	updatePickerPosition ()
	{
		this.color_picker.style.left = (this.canvas.offsetLeft + this.positions.cx + this.pointer.X()*this.positions.cx - 4) + "px";
		this.color_picker.style.top = (this.canvas.offsetTop + this.positions.cy + this.pointer.Y()*this.positions.cx - 4) + "px";

		this.value_picker.style.left = (this.canvas.offsetLeft + this.positions.valueStart - 4) + "px";
		this.value_picker.style.top = (this.canvas.offsetTop + this.pointer.V()*this.canvas.height) - 4 + "px";
	}

	moveValuePicker (e)
	{
		var y = e.clientY - this.canvas.offsetTop;
		y = y>0? y : 0;
		y = y<this.canvas.height? y : this.canvas.height;

		this.value_picker.style.top = this.canvas.offsetTop + y - 4 + "px";
		this.pointer.setV(y / this.canvas.height);

		this.render();
		this.renderPickers();
	}

	moveColorPicker (e)
	{
		var x = e.clientX - this.canvas.offsetLeft - this.positions.cx;
		var y = e.clientY - this.canvas.offsetTop - this.positions.cx;

		var d2 = (x*x + y*y);

		if (d2>this.positions.cx*this.positions.cx)
		{
			let d = Math.sqrt(d2) / this.positions.cx;
			x /= d;
			y /= d;
		}

		this.color_picker.style.left = (this.canvas.offsetLeft + this.positions.cx + x - 4) + "px";
		this.color_picker.style.top = (this.canvas.offsetTop + this.positions.cy + y - 4) + "px";

		x /= this.positions.cx;
		y /= this.positions.cx;

		this.pointer.setX(x);
		this.pointer.setY(y);
		
		this.renderPickers();
	}

	renderPickers ()
	{
		if (this.pointer.V()<.5)
		{
			this.color_picker.style["border-color"] = "#fff";
			this.value_picker.style["border-color"] = "#fff";
		}
		else
		{
			this.color_picker.style["border-color"] = "#000";
			this.value_picker.style["border-color"] = "#000";
		}
		this.color_picker.style["background-color"] = this.pointer.toHexStr();
		let value = conversions.toHex(Math.round(this.pointer.V()*255));
		this.value_picker.style["background-color"] ="#" + value + value + value;
	}

	render ()
	{
		var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		var pixels = imgData.data;

		var r2 = this.positions.cx * this.positions.cx + 7;

		for(var j=0; j<this.canvas.height; j++)
		for(var i=0; i<this.canvas.height; i++)
		{
			var d2 = (i-this.positions.cx)*(i-this.positions.cx) + (j-this.positions.cy)*(j-this.positions.cy);
			if (d2<r2)
			{
				var c = new Color();
				c.setXYV({x:(i-this.positions.cx)/this.positions.cx, y:(j-this.positions.cy)/this.positions.cx, v:this.pointer.V()});
				let rgb = c.getRGB();

				let ind = (j*imgData.width + i)*4;
				pixels[ind] = Math.round(rgb.r*255);
				pixels[ind+1] = Math.round(rgb.g*255);
				pixels[ind+2] = Math.round(rgb.b*255);
				pixels[ind+3] = 255;
			}
		}

		for(var j=0; j<this.canvas.height; j++)
		for(var i=this.positions.valueStart; i<this.canvas.width; i++)
		{
			let ind = (j*imgData.width + i)*4;
			pixels[ind] = 255*j/this.canvas.height;
			pixels[ind+1] = 255*j/this.canvas.height;
			pixels[ind+2] = 255*j/this.canvas.height;
			pixels[ind+3] = 255;
		}

		this.ctx.putImageData(imgData, 0, 0);
	}
}

export default new ColorWheel();