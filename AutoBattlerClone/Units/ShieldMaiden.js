var ShieldsUp = {
    "Func" : ArmourShield,
    "Cost" : 75,
    "Details" : "Shields Unit",
}

var ShieldMaiden = {
	"name" : "Shield Maiden",
	"health" : 650,
	"armour" :  45,
	"magResist": 45,
    "StartMana": 50,
    "damg" : 36,
	"cost" : 1,
    "range" : 1,
	"SpriteInfo": "Sprites/_StanSprite.json",
    "thumb" : "Sprites/_StanThumb.png",
	"sheet" : "Sprites/_StanSheet.png",
    "traits" : ["Hemo", "Tank"], 
    "Cast" : ShieldsUp,
    "Basic" : Slash,
}


function ArmourShield(target, Me)
{
    target.GetComponent("Stats")._DamageNumbers.push(new HealthNumber(Me.X ,  Me.Y - 30, "Shields UP!"))
    Me.GetComponent("Stats").SetShield(null, 400);
    var Sheild = new RaiseShields(Me);
    Me._TemporaryEffects.push(Sheild);
}

function Slash(Target, Me)
{
    Target.GetComponent("Stats").Damage(ShieldMaiden.damg,"Phys")
}

class RaiseShields extends TempEffect
{
    _OriginalArmour;
    ActiveEffect;
    constructor(Unit)
    {
        super(Unit);
        this._OriginalArmour = Unit.GetComponent("Stats").GetCurrentArmour();
        Unit.GetComponent("Stats").SetCurrentArmour(this._OriginalArmour + 100);
        this.ActiveEffect = true;
    }

    Update()
    {
        if(this.ActiveEffect)
        {

            var TimeTillDone = 100;
            C1.fillStyle = 'white'; 
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
            this._AffectedUnit.GetComponent("Stats").SetCurrentArmour(this._OriginalArmour);
            this._AffectedUnit.GetComponent("Stats").SetShield(null, 0);

            this.ActiveEffect = false;
        }
    }
}

