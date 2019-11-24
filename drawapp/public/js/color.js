export default class Color
{
	constructor ()
	{
		this.data = {rgb:{r:0,g:0,b:0}, hsv:{h:0,s:0,v:0}, xyv:{x:0,y:0,v:0}};
		this.upToDate = {rgb:true, hsv:true, xyv:true};
	}

	getRGB ()
	{
		if (this.upToDate.rgb)
			return this.data.rgb;
		
		if (this.upToDate.xyv)
			this.XYVtoHSV();
		this.HSVtoRGB();
		
		return this.data.rgb;
	}

	getHSV ()
	{
		if (this.upToDate.hsv)
			return this.data.hsv;
		
		if (this.upToDate.rgb)
			this.RGBtoHSV();
		else if (this.upToDate.xyv)
			this.XYVtoHSV();
		return this.data.hsv;
	}

	getXYV ()
	{
		if (this.upToDate.xyv)
			return this.data.xyv;
		
		if (this.upToDate.rgb)
			this.RGBtoHSV();
		this.HSVtoXYV();
		return this.data.xyv;
	}

	setRGB (rgb)
	{
		this.data.rgb = rgb;
		this.upToDate.hsv = this.upToDate.xyv = false;
	}

	setHSV (hsv)
	{
		this.data.hsv = hsv;
		this.upToDate.rgb = this.upToDate.xyv = false;
	}

	setXYV (xyv)
	{
		this.data.xyv = xyv;
		this.upToDate.rgb = this.upToDate.hsv = false;
	}

	setR (r) {this.getRGB(); this.data.rgb.r = r; this.upToDate.hsv = this.upToDate.xyv = false;}
	setG (g) {this.getRGB(); this.data.rgb.g = g; this.upToDate.hsv = this.upToDate.xyv = false;}
	setB (b) {this.getRGB(); this.data.rgb.b = b; this.upToDate.hsv = this.upToDate.xyv = false;}

	setH (h) {this.getHSV(); this.data.hsv.h = h; this.upToDate.rgb = this.upToDate.xyv = false;}
	setS (s) {this.getHSV(); this.data.hsv.s = s; this.upToDate.rgb = this.upToDate.xyv = false;}

	setX (x) {this.getXYV(); this.data.xyv.x = x; this.upToDate.rgb = this.upToDate.hsv = false;}
	setY (y) {this.getXYV(); this.data.xyv.y = y; this.upToDate.rgb = this.upToDate.hsv = false;}

	setV (v) {this.getHSV(); this.getXYV(); this.data.hsv.v = this.data.xyv.v = v; this.upToDate.rgb = false;}

	R() {return this.getRGB().r;}
	G() {return this.getRGB().g;}
	B() {return this.getRGB().b;}
	H() {return this.getHSV().h;}
	S() {return this.getHSV().s;}
	V() {if (this.upToDate.xyv) return this.getXYV().v; return this.getHSV().v;}
	X() {return this.getXYV().x;}
	Y() {return this.getXYV().y;}

	
	toHexStr()
	{
		let toHex = (x) => {let y=x.toString(16); return y.length==1?"0"+y:y;};
		this.getRGB();
		return "#" + toHex(Math.round(this.data.rgb.r*255)) + toHex(Math.round(this.data.rgb.g*255)) + toHex(Math.round(this.data.rgb.b*255));
	}


	HSVtoRGB ()
	{
		var i, f, p, q, t;
		i = Math.floor(this.data.hsv.h * 6);
		f = this.data.hsv.h * 6 - i;
		p = this.data.hsv.v * (1 - this.data.hsv.s);
		q = this.data.hsv.v * (1 - f * this.data.hsv.s);
		t = this.data.hsv.v * (1 - (1 - f) * this.data.hsv.s);
		switch (i % 6)
		{
			case 0: this.data.rgb.r = this.data.hsv.v, this.data.rgb.g = t, this.data.rgb.b = p; break;
			case 1: this.data.rgb.r = q, this.data.rgb.g = this.data.hsv.v, this.data.rgb.b = p; break;
			case 2: this.data.rgb.r = p, this.data.rgb.g = this.data.hsv.v, this.data.rgb.b = t; break;
			case 3: this.data.rgb.r = p, this.data.rgb.g = q, this.data.rgb.b = this.data.hsv.v; break;
			case 4: this.data.rgb.r = t, this.data.rgb.g = p, this.data.rgb.b = this.data.hsv.v; break;
			case 5: this.data.rgb.r = this.data.hsv.v, this.data.rgb.g = p, this.data.rgb.b = q; break;
		}
		this.upToDate.rgb = true;
	}

	XYVtoHSV ()
	{
		let a = Math.atan2(this.data.xyv.y, this.data.xyv.x)/(2*Math.PI);
		this.data.hsv.h = a<0? a+1: a;
		this.data.hsv.s = Math.sqrt(this.data.xyv.x*this.data.xyv.x + this.data.xyv.y*this.data.xyv.y);
		this.data.hsv.v = this.data.xyv.v;
		this.upToDate.hsv = true;
	}

	RGBtoHSV ()
	{
		let rr, gg, bb, diff, diffc;
		this.data.hsv.v = Math.max(this.data.rgb.r, this.data.rgb.g, this.data.rgb.b);
		diff = this.data.hsv.v - Math.min(this.data.rgb.r, this.data.rgb.g, this.data.rgb.b);
		diffc = c => (this.data.hsv.v - c) / 6 / diff + .5;
		if (diff == 0)
		{
			this.data.hsv.h = this.data.hsv.s = 0;
		}
		else
		{
			this.data.hsv.s = diff / this.data.hsv.v;
			rr = diffc(this.data.rgb.r);
			gg = diffc(this.data.rgb.g);
			bb = diffc(this.data.rgb.b);

			if (this.data.rgb.r === this.data.hsv.v)			this.data.hsv.h = bb - gg;
			else if (this.data.rgb.g === this.data.hsv.v)	this.data.hsv.h = (1 / 3) + rr - bb;
			else if (this.data.rgb.b === this.data.hsv.v)	this.data.hsv.h = (2 / 3) + gg - rr;
			
			if (this.data.hsv.h < 0)		this.data.hsv.h += 1;
			else if (this.data.hsv.h > 1)	this.data.hsv.h -= 1;
		}
		this.upToDate.hsv = true;
	}

	HSVtoXYV ()
	{
		this.data.xyv.x = this.data.hsv.s * Math.cos(2*Math.PI*this.data.hsv.h);
		this.data.xyv.y = this.data.hsv.s * Math.sin(2*Math.PI*this.data.hsv.h);
		this.data.xyv.v = this.data.hsv.v;
		this.upToDate.hsv = true;
	}
}