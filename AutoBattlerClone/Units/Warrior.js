var BloodSurge = {
    "Func" : BloodSurgeFunc,
    "Cost" : 100,
    "Details" : "Deals 300% Attack damage and heals for 300",
}

var RoyalKnight = {
	"name" : "Knight",
	"health" : 650,
	"armour" :  45,
	"magResist": 45,
    "StartMana": 50,
    "damg" : 55,
	"cost" : 1,
    "range" : 1,
	"SpriteInfo": "Sprites/_StanSprite.json",
    "thumb" : "Sprites/_StanThumb.png",
	"sheet" : "Sprites/_StanSheet.png",
    "traits" : ["Royal", "Tank"], 
    "Cast" : BloodSurge,
    "Basic" : Slash,
}


function BloodSurgeFunc(Target, Me)
{
    var DmgType = "Mag";
    var DealtDamage = 300;
    Target.GetComponent("Stats")._DamageNumbers.push(new HealthNumber(Me.X ,  Me.Y -30, "SAVAGE STRIKE!!!"))
    Me.GetComponent("Stats").Damage(DealtDamage*-1, "true");
    Target.GetComponent("Stats").Damage(((DealtDamage/100) * Me.GetComponent("Attack")._Damage), DmgType);
    
}

function Slash(Target, Me)
{
    Target.GetComponent("Stats").Damage(RoyalKnight.damg,"Phys")
}
