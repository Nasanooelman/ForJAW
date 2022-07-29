var Command = {
    "Func" : MindLink,
    "Cost" : 50,
    "Details" : "ChangeYourMind",
}

var Puppeteer = {
	"name" : "Puppeteer",
	"health" : 400,
	"armour" :  50,
	"magResist": 50,
    "StartMana": 0,
    "damg" : 50,
	"cost" : 2,
    "range" : 6,
	"SpriteInfo": "Sprites/_StanSprite.json",
    "thumb" : "Sprites/_StanThumb.png",
	"sheet" : "Sprites/_StanSheet.png",
    "traits" : ["Royal", "Hemo"], 
    "Cast" : Command,
    "Basic" : BloodProj,
}

function BloodProj(Target, Me)
{
    var OnCollide = function(target) {target.GetComponent("Stats").Damage(80,"Phys")};
    var SpriteImage = new Image();
    SpriteImage.src = "Sprites/bloodBolt.png"
    var bolt = new Projectile(OnCollide, new Sprite(SpriteImage, 3), Target, Me);
    Renderables.push(bolt);
}

function MindLink(Target, Me)
{

    Target.GetComponent("Stats")._DamageNumbers.push(new HealthNumber(Target.X ,  Target.Y - 30, "Charmed!"))
    var MCEffect = new MindControl(Target, Target._Ally);
    Target._Ally = true;
    Target._TemporaryEffects.push(MCEffect);

}

class MindControl extends TempEffect
{
    _originalTeam;
    ActiveEffect;
    constructor(Unit, Team)
    {
        super(Unit);
        this._originalTeam = Team;
        this.ActiveEffect = true;
    }

    Update()
    {
        if(this.ActiveEffect)
        {

            var TimeTillDone = 100;
            C1.fillStyle = 'Purple'; 
            var BarX =  this._AffectedUnit.X +  CameraXY.X;
            var BarY =  this._AffectedUnit.Y +  CameraXY.Y;

            this._CurrentTime = new Date().getTime();
            var TicksSinceStart = GetTicks(this._CurrentTime - this._TimeStarted);        
            
            if(TicksSinceStart > TimeTillDone)
            {
                this.clear();
            }

            var HPHei = 6;
            var CurrentbarLength = TileW / (TimeTillDone/TicksSinceStart);
            C1.fillRect(BarX, BarY,  CurrentbarLength, HPHei)
            C1.strokeRect(BarX, BarY, TileW, HPHei);
        }
    }

    clear()
    {
        if(this.ActiveEffect)
        {
            this._AffectedUnit._Ally = this._originalTeam;
            this.ActiveEffect = false;
        }
    }
}

