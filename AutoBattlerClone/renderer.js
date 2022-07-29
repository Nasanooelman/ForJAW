class Renderable
{
    X;
    Y;
    Components = {};

    constructor()
    {
        this.X = 0;
        this.Y = 0;
    }

    Draw() {
        console.log("No Draw call specified")
    }

    AddComponent(comp)
    {
        this.Components[comp._name] = comp;

        return this.Components[comp._name];
    }

    GetComponent(name)
    {
        return this.Components[name];
    }

    Update()
    {
        this.Draw();

        for (let component in this.Components)
        {
            this.Components[component].Update();
        }
    }
}

class Sprite
{
    CurrentFrame;
    Texture;
    MaxFrame;
    FrameCnt;
    playing;
    _rotation;

    constructor(Img, Frames)
    {
        this.Texture = Img;
        this.CurrentFrame = 0;
        this.MaxFrame = Frames;
        this.FrameCnt = 0;
        this.playing = true;
        this._rotation = 0;
    }

    Update()
    {
        if(this.playing)
        {
        if(this.FrameCnt == 10)
        {
            this.CurrentFrame++;
            this.FrameCnt = 0;
        }
        else
        {
            this.FrameCnt++;      
        }
        
        if(this.CurrentFrame > this.MaxFrame)
        {
            this.CurrentFrame = 0;
        }
    }
    }
}



class Line extends Renderable
{
    constructor(UpdateFunc, sprite, Target, Orig)
    {
        super();
        this.UpdateFunction = UpdateFunc;
        this.mySprite = sprite;
        this.Target = Target;
        this.Speed = 2;
        this.X = Orig.X;
        this.Y = Orig.Y;
        this.OriginX = Orig.X;
        this.OriginY = Orig.Y;
        this.Alive = true;
        this.StartTime = new Date().getTime();
        this.TimeToDo = 500;
    }

    Draw()
    {
        
        C1.beginPath();
        C1.strokeStyle = 'red';
        C1.lineWidth = 10;
        C1.moveTo(this.OriginX + (TileW), this.OriginY+ (TileW));
        C1.lineTo(this.X + (TileW), this.Y + (TileW));
        C1.stroke();
    }

    Update()
    {
        if(!this.Alive)
        return;
        super.Update();

        var X1 = this.OriginX;
        var Y1 = this.OriginY;

        var X2 = this.Target.X;
        var Y2 = this.Target.Y;

        var DistX = Math.min(X1, X2) - Math.max(X1, X2);
        var DistY = Math.min(Y1, Y2) - Math.max(Y1, Y2);

        var TimeConv = new Date().getTime();
        var TimeDone = ((TimeConv -this.StartTime));

        var DeltaT = TimeDone;

        DeltaT = DeltaT/this.TimeToDo

        this.X = this.OriginX + (DistX * DeltaT);
        this.Y = this.OriginY + (DistY * DeltaT);

        if(TimeDone>=this.TimeToDo)
        {
             //this.UpdateFunction(this.Target);
             this.Alive = false;
        }
    }
}

class Projectile extends Renderable
{
    UpdateFunction;
    mySprite;
    Target;
    Speed;
    Alive;
    OriginX;
    OriginY;
    StartTime;
    TimeToDo;

    constructor(UpdateFunc, sprite, Target, Orig)
    {
        super();
        this.UpdateFunction = UpdateFunc;
        this.mySprite = sprite;
        this.Target = Target;
        this.Speed = 2;
        this.X = Orig.X;
        this.Y = Orig.Y;
        this.OriginX = Orig.X;
        this.OriginY = Orig.Y;
        this.Alive = true;
        this.StartTime = new Date().getTime();
        this.TimeToDo = 1000;
    }

    Draw()
    {
       var SpriteImgSize = 60;

       var bloodSize = 20;
       var ExtraSize = 0;
   
       C1.drawImage(this.mySprite.Texture, SpriteImgSize * this.mySprite.CurrentFrame, SpriteImgSize * 0, SpriteImgSize, SpriteImgSize, this.X +  CameraXY.X + 20, this.Y +  CameraXY.Y - ExtraSize, bloodSize + ExtraSize, bloodSize+20+ ExtraSize);

    }

    Update()
    {
        if(!this.Alive)
            return;
        super.Update();

        var X1 = this.OriginX;
        var Y1 = this.OriginY;

        var X2 = this.Target.X;
        var Y2 = this.Target.Y;

        var DistX = Math.min(X1, X2) - Math.max(X1, X2);
        var DistY = Math.min(Y1, Y2) - Math.max(Y1, Y2);

        var TimeConv = new Date().getTime();
        var TimeDone = ((TimeConv -this.StartTime));

        var DeltaT = TimeDone;

        DeltaT = DeltaT/this.TimeToDo

        this.X = this.OriginX + (DistX * DeltaT);
        this.Y = this.OriginY + (DistY * DeltaT);

        if(TimeDone>=this.TimeToDo)
        {
             this.UpdateFunction(this.Target);
             this.Alive = false;
        }
    }
}