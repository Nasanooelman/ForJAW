var ShieldsUp = {
    "Func" : SplashAttack,
    "Cost" : 75,
    "Details" : "Splash Attack",
}

var Magikarp = {
	"name" : "Magikarp",
	"health" : 1000,
	"armour" :  100,
	"magResist": 100,
    "StartMana": 50,
    "damg" : 0,
	"cost" : 1,
    "range" : 1,
	"SpriteInfo": "Sprites/_StanSprite.json",
    "thumb" : "Sprites/_StanThumb.png",
	"sheet" : "Sprites/_StanSheet.png",
    "traits" : ["Hemo", "Tank"], 
    "Cast" : SplashAttack,
    "Basic" : SplashAttack,
}

function SplashAttack(Target, Me)
{
	Target.GetComponent("Stats")._DamageNumbers.push(new HealthNumber(Me.X ,  Me.Y - 30, "SPLASH!!!"))
    Target.GetComponent("Stats").Damage(Magikarp.damg,"Phys")
}
