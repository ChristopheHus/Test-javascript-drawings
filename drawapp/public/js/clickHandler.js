
class ClickHandler
{
	constructor()
	{
		this.fields = [];
		this.selected = null;
	}

	addField (area, callback)
	{
		this.fields.push({area:area, callback:callback});
	}

	findArea (x, y)
	{
		for(let i=0; i<this.fields.length; i++)
		{
			let area = this.fields[i].area;

			if (x>=area.x && x<=area.x+area.w && y>=area.y && y<=area.y+area.h)
				return i;
		}
		return -1;
	}

	onMouseDown (e)
	{
		let ind = this.findArea(e.clientX, e.clientY);
		if (ind==-1) return;

		this.selected = this.fields[ind];
		this.selected.callback("down", e);
	}

	onMouseMove (e)
	{
		if (this.selected==null) return;

		this.selected.callback("move", e);
	}

	onMouseUp (e)
	{
		if (this.selected==null) return;
		try
		{
			this.selected.callback("up", e);
		}
		catch(e)
		{
			console.error(e);
		}
		finally
		{
			this.selected = null;
		}
	}
}



export default new ClickHandler();