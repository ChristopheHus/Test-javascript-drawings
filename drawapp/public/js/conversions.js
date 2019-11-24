/*
 *	Color conversion library
 * @author: ChristopheHus
*/


export const color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgrey','darkgreen','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','grey','green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgrey','lightgreen','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','rebeccapurple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyBlue','slateBlue','slateGray','slateGrey','snow','springGreen','steelBlue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whiteSmoke','yellow','yellowGreen'];
export const color_hex = ['#f0f8ff','#faebd7','#00ffff','#7fffd4','#f0ffff','#f5f5dc','#ffe4c4','#000000','#ffebcd','#0000ff','#8a2be2','#a52a2a','#deb887','#5f9ea0','#7fff00','#d2691e','#ff7f50','#6495ed','#fff8dc','#dc143c','#00ffff','#00008b','#008b8b','#b8860b','#a9a9a9','#a9a9a9','#006400','#bdb76b','#8b008b','#556b2f','#ff8c00','#9932cc','#8b0000','#e9967a','#8fbc8f','#483d8b','#2f4f4f','#2f4f4f','#00ced1','#9400d3','#ff1493','#00bfff','#696969','#696969','#1e90ff','#b22222','#fffaf0','#228b22','#ff00ff','#dcdcdc','#f8f8ff','#ffd700','#daa520','#808080','#808080','#008000','#adff2f','#f0fff0','#ff69b4','#cd5c5c','#4b0082','#fffff0','#f0e68c','#e6e6fa','#fff0f5','#7cfc00','#fffacd','#add8e6','#f08080','#e0ffff','#fafad2','#d3d3d3','#d3d3d3','#90ee90','#ffb6c1','#ffa07a','#20b2aa','#87cefa','#778899','#778899','#b0c4de','#ffffe0','#00ff00','#32cd32','#faf0e6','#ff00ff','#800000','#66cdaa','#0000cd','#ba55d3','#9370db','#3cb371','#7b68ee','#00fa9a','#48d1cc','#c71585','#191970','#f5fffa','#ffe4e1','#ffe4b5','#ffdead','#000080','#fdf5e6','#808000','#6b8e23','#ffa500','#ff4500','#da70d6','#eee8aa','#98fb98','#afeeee','#db7093','#ffefd5','#ffdab9','#cd853f','#ffc0cb','#dda0dd','#b0e0e6','#800080','#663399','#ff0000','#bc8f8f','#4169e1','#8b4513','#fa8072','#f4a460','#2e8b57','#fff5ee','#a0522d','#c0c0c0','#87ceeb','#6a5acd','#708090','#708090','#fffafa','#00ff7f','#4682b4','#d2b48c','#008080','#d8bfd8','#ff6347','#40e0d0','#ee82ee','#f5deb3','#ffffff','#f5f5f5','#ffff00','#9acd32'];

/* h,s,v in [0,1] */
/* r,g,b in [0,1]*/
export function HSVtoRGB(hsv)
{
	var rgb={r:0,g:0,b:0}, i, f, p, q, t;
	i = Math.floor(hsv.h * 6);
	f = hsv.h * 6 - i;
	p = hsv.v * (1 - hsv.s);
	q = hsv.v * (1 - f * hsv.s);
	t = hsv.v * (1 - (1 - f) * hsv.s);
	switch (i % 6)
	{
		case 0: rgb.r = hsv.v, rgb.g = t, rgb.b = p; break;
		case 1: rgb.r = q, rgb.g = hsv.v, rgb.b = p; break;
		case 2: rgb.r = p, rgb.g = hsv.v, rgb.b = t; break;
		case 3: rgb.r = p, rgb.g = q, rgb.b = hsv.v; break;
		case 4: rgb.r = t, rgb.g = p, rgb.b = hsv.v; break;
		case 5: rgb.r = hsv.v, rgb.g = p, rgb.b = q; break;
	}
	return rgb;
}

/* h,s,v in [0,1] */
/* rgb:{r,g,b}, r,g,b in [0,1] */
export function RGBtoHSV (rgb)
{
	let rr, gg, bb, hsv={h:0, s:0, v:0}, diff, diffc;
	hsv.v = Math.max(rgb.r, rgb.g, rgb.b);
	diff = hsv.v - Math.min(rgb.r, rgb.g, rgb.b);
	diffc = c => (hsv.v - c) / 6 / diff + .5;
	if (diff == 0)
	{
		hsv.h = hsv.s = 0;
	}
	else
	{
		hsv.s = diff / hsv.v;
		rr = diffc(rgb.r);
		gg = diffc(rgb.g);
		bb = diffc(rgb.b);

		if (rgb.r === hsv.v)		hsv.h = bb - gg;
		else if (rgb.g === hsv.v)	hsv.h = (1 / 3) + rr - bb;
		else if (rgb.b === hsv.v)	hsv.h = (2 / 3) + gg - rr;
		
		if (hsv.h < 0)			hsv.h += 1;
		else if (hsv.h > 1)	hsv.h -= 1;
	}
	return hsv;
}

export function toHex (x)
{
	let y = x.toString(16);
	return y.length==1? "0"+y : y;
}

/* color:{r,g,b}, r,g,b in [0,1] */
export function colorToHexStr(color)
{
	return "#" + toHex(Math.round(color.r*255)) + toHex(Math.round(color.g*255)) + toHex(Math.round(color.b*255));
}