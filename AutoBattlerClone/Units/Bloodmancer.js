var BloodBeamJson = {
    "Func" : BloodBeam,
    "Cost" : 100,
    "Details" : "Doing 200 Magic damage and 5% Max Health Damage",
}

var BloodMancer = {
	"name" : "Bloodmancer",
	"health" : 800,
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
    "Cast" : BloodBeamJson,
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

function BloodBeam(Target, Me)
{
    var DmgType = "Phys";
    var DealtDamage = 200;
    Target.GetComponent("Stats")._DamageNumbers.push(new HealthNumber(Me.X ,  Me.Y - 30, "BLOOD BEAM!!!"))

    var WeakenBeam = function() {

        // Gonna be honest this is my favourite part of JS
        if(Target.GetComponent("Stats") != null && Target.GetComponent("Stats") != undefined)
        {
            var CurrentHealth = Target.GetComponent("Stats").GetHealth();
            var HealthPerc = CurrentHealth * 0.05;
            Target.GetComponent("Stats").Damage(200 + HealthPerc,DmgType);
        }
    }

    var thisLine = new Line(WeakenBeam, null, Target, Me);
    Renderables.push(thisLine);
}

