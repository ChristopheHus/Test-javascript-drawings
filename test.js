const color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgrey','darkgreen','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','grey','green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgrey','lightgreen','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','rebeccapurple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyBlue','slateBlue','slateGray','slateGrey','snow','springGreen','steelBlue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whiteSmoke','yellow','yellowGreen'];
const color_hex = ['#f0f8ff','#faebd7','#00ffff','#7fffd4','#f0ffff','#f5f5dc','#ffe4c4','#000000','#ffebcd','#0000ff','#8a2be2','#a52a2a','#deb887','#5f9ea0','#7fff00','#d2691e','#ff7f50','#6495ed','#fff8dc','#dc143c','#00ffff','#00008b','#008b8b','#b8860b','#a9a9a9','#a9a9a9','#006400','#bdb76b','#8b008b','#556b2f','#ff8c00','#9932cc','#8b0000','#e9967a','#8fbc8f','#483d8b','#2f4f4f','#2f4f4f','#00ced1','#9400d3','#ff1493','#00bfff','#696969','#696969','#1e90ff','#b22222','#fffaf0','#228b22','#ff00ff','#dcdcdc','#f8f8ff','#ffd700','#daa520','#808080','#808080','#008000','#adff2f','#f0fff0','#ff69b4','#cd5c5c','#4b0082','#fffff0','#f0e68c','#e6e6fa','#fff0f5','#7cfc00','#fffacd','#add8e6','#f08080','#e0ffff','#fafad2','#d3d3d3','#d3d3d3','#90ee90','#ffb6c1','#ffa07a','#20b2aa','#87cefa','#778899','#778899','#b0c4de','#ffffe0','#00ff00','#32cd32','#faf0e6','#ff00ff','#800000','#66cdaa','#0000cd','#ba55d3','#9370db','#3cb371','#7b68ee','#00fa9a','#48d1cc','#c71585','#191970','#f5fffa','#ffe4e1','#ffe4b5','#ffdead','#000080','#fdf5e6','#808000','#6b8e23','#ffa500','#ff4500','#da70d6','#eee8aa','#98fb98','#afeeee','#db7093','#ffefd5','#ffdab9','#cd853f','#ffc0cb','#dda0dd','#b0e0e6','#800080','#663399','#ff0000','#bc8f8f','#4169e1','#8b4513','#fa8072','#f4a460','#2e8b57','#fff5ee','#a0522d','#c0c0c0','#87ceeb','#6a5acd','#708090','#708090','#fffafa','#00ff7f','#4682b4','#d2b48c','#008080','#d8bfd8','#ff6347','#40e0d0','#ee82ee','#f5deb3','#ffffff','#f5f5f5','#ffff00','#9acd32'];


var canvas, ctx, drawing = false, color_wheel,
    circ_pointer, color_picker,
    shiftPressed = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var x = "#000000",
    y = 20;

function init()
{
    canvas = document.getElementById('can');
    circ_pointer = document.getElementById("circ_pointer");
    ctx = canvas.getContext("2d");
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    erase();

    window.addEventListener('mousemove', function(e){
        circ_pointer.style.left = `${e.clientX-parseInt(y/2)+2}px`;
        circ_pointer.style.top = `${e.clientY-parseInt(y/2)+2}px`;
    }, false);
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', e => {if(e.key=="Shift") shiftPressed = true;});
    document.addEventListener('keyup', e => {if(e.key=="Shift") shiftPressed = false;});

    canvas.addEventListener("mousemove", function (e) { findxy('move', e); }, false);
    canvas.addEventListener("mousedown", function (e) { findxy('down', e); }, false);
    canvas.addEventListener("mouseup", function (e) { findxy('up', e); }, false);
    canvas.addEventListener("mouseout", function (e) { findxy('out', e); }, false);
    canvas.addEventListener("mouseenter", function (e) { findxy('in', e); }, false);

    circ_pointer.style.width = y;
    circ_pointer.style.height = y;

    initColorWheel();
}

function color(obj)
{
    var temp = obj.toLowerCase();
    let t = color_names.indexOf(temp);
    if (t>=0) temp = color_hex[t];
    x = temp;
}

function draw ()
{
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function drawEnd ()
{
    ctx.beginPath();
    ctx.arc(currX, currY, y/2., 0, 2 * Math.PI, false);
    ctx.fillStyle = x;
    ctx.fill();
    ctx.closePath();
}

function erase()
{
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function fill(x0, y0)
{
    var imgData = ctx.getImageData(0, 0, w, h);
    var pixels = imgData.data;

    var nextColor = [parseInt(x.substr(1,2),16), parseInt(x.substr(3,2),16), parseInt(x.substr(5,2),16)];
    var ind = (x0+y0*imgData.width)*4;
    var prevColor = [pixels[ind], pixels[ind+1], pixels[ind+2]];

    var stack = [[x0,y0]];
    var testColor = (x,y,test,diff) => {let ind=(x+y*imgData.width)*4; return Math.abs(pixels[ind]-test[0]) + Math.abs(pixels[ind+1]-test[1]) + Math.abs(pixels[ind+2]-test[2]) <= diff;};
    var setColor = (x,y) => {let ind=(x+y*imgData.width)*4; pixels[ind]=nextColor[0]; pixels[ind+1]=nextColor[1]; pixels[ind+2]=nextColor[2];pixels[ind+3]=255;};
    var testNpush = (a,b) => {if(!testColor(a,b,nextColor,0) && testColor(a,b,prevColor,0)) stack.push([a,b]);};

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

function save()
{
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e)
{
    if (res=='down'|| res=='in')
    {
        if(e.buttons&0b1 && !shiftPressed)
        {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;

            drawing = true;
            drawEnd();
        }
        else if(e.buttons&0b10)
        {
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            fill(currX, currY);
        }
    }
    if (res=='move' || res=='out')
    {
        if (drawing)
        {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
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
    color_picker = document.getElementById("color_picker");

    color_wheel.w = color_wheel.canvas.clientWidth;
    color_wheel.h = color_wheel.canvas.clientHeight;
    color_wheel.canvas.width = color_wheel.w;
    color_wheel.canvas.height = color_wheel.h;

    color_wheel.x = parseInt((color_wheel.w-1)/2);
    color_wheel.y = parseInt((color_wheel.w-1)/2);
    color_wheel.cx = color_wheel.x;
    color_wheel.cy = color_wheel.y;
    color_wheel.col_h = 0;
    color_wheel.col_s = 0;
    color_wheel.col_v = 1;

    color_picker.style.left = (color_wheel.canvas.offsetLeft + color_wheel.x - 4) + "px";
    color_picker.style.top = (color_wheel.canvas.offsetTop + color_wheel.y - 4) + "px";

    color_wheel.canvas.addEventListener("mousemove", function (e) { moveColorPicker(e); }, false);
    color_wheel.canvas.addEventListener("mousedown", function (e) { moveColorPicker(e); }, false);
    //color_wheel.canvas.addEventListener("mouseout", function (e) { moveColorPicker(e); }, false);

    renderColorWheel();
}

function moveColorPicker(e)
{
    if(e.buttons&0b1)
    {
        color_wheel.x = e.clientX - color_wheel.canvas.offsetLeft;
        color_wheel.y = e.clientY - color_wheel.canvas.offsetTop;

        var d = Math.sqrt((color_wheel.x-color_wheel.cx)*(color_wheel.x-color_wheel.cx) + (color_wheel.y-color_wheel.cy)*(color_wheel.y-color_wheel.cy)) / color_wheel.cx;
        if (d>1)
        {
            color_wheel.x = color_wheel.cx + (color_wheel.x-color_wheel.cx) / d;
            color_wheel.y = color_wheel.cy + (color_wheel.y-color_wheel.cy) / d;
        }

        color_picker.style.left = (color_wheel.x + color_wheel.canvas.offsetLeft - 4) + "px";
        color_picker.style.top = (color_wheel.y + color_wheel.canvas.offsetTop - 4) + "px";

        renderColorPicker();
    }
}

function renderColorPicker()
{
    if (color_wheel.col_v<.5)
        color_picker.style["border-color"] = "#fff";
    else
        color_picker.style["border-color"] = "#000";

    let color = getColor(color_wheel.x, color_wheel.y);
    toHex = (x) => {let y=x.toString(16); return y.length==1? "0"+y : y;};
    x = "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
    color_picker.style["background-color"] = x;
}

function valueChange (value)
{
    color_wheel.col_v = value;
    renderColorWheel();
    renderColorPicker();
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
    for(var i=0; i<color_wheel.w; i++)
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

    color_wheel.ctx.putImageData(imgData, 0, 0);
}


/* h,s,v in [0,1] */
/* r,g,b in [|0,255|]*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}