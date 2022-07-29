
document.onkeydown = handleKeyboard;
document.onmousedown = SetMouse;//function(event) {}
document.onmouseup = function() { MouseDown = false }
document.onmousemove = UpdateMousePos;// = function(event) { var TempMx = event.x; var TempMy = event.y; if(MouseDown){ CameraXY.X -= (MX - TempMx)/10;  CameraXY.Y -= (MY - TempMy)/10 }}
var t = new Date();

var AutoMove = true;
var TileW = 60;
var DiagonalMoveCost = 14;
var NonDiagonalMoveCost = 10;
var StatingMapXY = {X: 0, Y: 0};
var CameraXY = {X: 35, Y: 20}
var MouseX = 0;
var MouseY = 0;
var MX = 0;
var MY = 0;
var CurrentlySelecting = null;
var MouseDown;
var GetActiveUnits = 0;
var SpawnedEnemies = 0;

var PlayerHealth = 100;
var Gold = 9999;

var SpriteImgSize = 48;

var I = 0;

var DoingDebug = false;



var SavedMap = [];

const tick = 50;
const TicksInASecond = 1000/tick;
var Delta = 0;

var Canvas = document.getElementById("Canvas");
var C1 = Canvas.getContext("2d");
var Renderables = [];

var BB=Canvas.getBoundingClientRect();
var offsetX=BB.left;
var offsetY=BB.top; 
var TempImage = new Image();
var ClearContext = C1.save();


AvailableUnits = {

    "Bloodmancer"   : BloodMancer,
    "Knight"        : RoyalKnight,
    "Shield Maiden" : ShieldMaiden,
    "Puppeteer"     : Puppeteer,
    "Magikarp"      : Magikarp,
}


UnitTable = [
    "Bloodmancer",
    "Knight"    ,    
    "Shield Maiden" ,
    "Puppeteer"   , 
    "Magikarp"     ,
]


var RoundList = [];
class Round
{
    isActive;
    Victory;

    constructor()
    {
        this.Victory = "Undecided";
        this.isActive = true;
    }

    Update()
    {
    }

    isFinished()
    {
        var Enemy = 0;
        var Ally = 0;
        var IsOver = false;

        for(var i = 0; i < Arena.Tiles.length; i++)
        {
            if(Arena.Tiles[i].Occupied != null)
            {
                if(!Arena.Tiles[i].Occupied.GetComponent("CHARCONTROL").isDead)
                {
                    if(Arena.Tiles[i].Occupied._Ally == true)
                    {
                        Ally++;
                    }
                    else
                    {
                        Enemy++;
                    }
                }
            }
        }

        if(Enemy == 0)
        {
            IsOver = true;
            this.Victory = "WIN";
        }
        else if(Ally == 0)
        {
            IsOver = true;
            this.Victory = "LOSS";
        }

        return IsOver;
    }
}

function StartRound()
{
    SaveMap();

    var round = new Round();

    RoundList.push(round);
}


var RollChanceTable = {

    1 : [100, 0, 0, 0, 0],
    2 : [100, 0, 0, 0, 0],
    3 : [75, 25, 0, 0, 0],
    4 : [55, 30, 15, 0, 0],
    5 : [45, 33, 20, 2, 0],
    6 : [25, 40, 30, 5, 0],
    7 : [19, 30, 35, 15, 1],
    8 : [16, 20, 35, 25, 4],
    9 : [1, 2, 12, 50, 35],
}

function GetRandomUnit()
{
    var TotalChance = 100;
    var RandomNumber = Math.floor(Math.random() * TotalChance);

    var Index = 0;
    var GottenLevel = Level;

    if(Level <=0)
    GottenLevel = 1;
    var Chance = RollChanceTable[GottenLevel];
    var TotalChance = 0;

    while( TotalChance < RandomNumber)
    {
        TotalChance += Chance[Index];
        Index++;
    }

    return Index;
}

function isValidToAttack(Me, Target)
{
    var Affiliation = Me._Ally;
    if(Target == null)
        return false;

    if(Affiliation == Target._Ally 
        || Target.isDead)
        {
            return false;
        }

    return true;
}

function GetTicks(time)
{
    return (time/tick);
}
function SetMouse(event)
{
    MouseDown = true; 

    var rect = Canvas.getBoundingClientRect(); 
    MX = event.clientX  - rect.left - CameraXY.X; 
    MY = event.clientY - rect.top - CameraXY.Y - (TileW/2);


    var Pos =  Arena.ConvertXAndYToTile(MX, MY);

    if(CurrentlySelecting != null || MY > Bench.MapY + TileW)
        return;

    var CheckCharControl = false;
    if(RoundList.length > 0)
    {
        if(!RoundList[RoundList.length-1].isActive)
        {
            if( Pos >= 0 && Pos < 64)
            {
                CheckCharControl = true;
            }
        }
    }
    else
    {
        if( Pos >= 0 && Pos < 64)
        {
            CheckCharControl = true;
        }
    }

    if(CheckCharControl)
    {
        if(Arena.Tiles[Pos].Occupied)
        {
            Arena.Tiles[Pos].Occupied.GetComponent("CHARCONTROL")._state = "Selected";
            CurrentlySelecting = Arena.Tiles[Pos].Occupied;
            Arena.Tiles[Pos].Occupied = null;
        }
    }

 

    Pos = Bench.ConvertXAndYToTile(MX, MY)
    //if(Pos = Bench.ConvertXAndYToTile(MX, MY))
    {
        if( Pos >= 0 && Pos < 8)
        {
            if(Bench.Tiles[Pos].Occupied)
            {
                Bench.Tiles[Pos].Occupied.GetComponent("CHARCONTROL")._state = "Selected";
                CurrentlySelecting = Bench.Tiles[Pos].Occupied;
                Bench.Tiles[Pos].Occupied = null;
            }
        }
    }
}
function UpdateMousePos(event)
{
    var rect = Canvas.getBoundingClientRect(); 
    MX = event.clientX  - rect.left - CameraXY.X - (TileW/2); 
    MY = event.clientY - rect.top - CameraXY.Y-(TileW/2);


    var MouseCalcX;

    if(MX > Canvas.width)
        MX = Canvas.width;

    if(MY > Canvas.height)
        MY = Canvas.height;

    //console.log(MX);
}
function RefreshButtons(Free)
{
    var JsonInfo;
    var GoldCost = 2;
    if(!Free)
    {
        if(Gold < GoldCost)
        {
            return;
        }       
        else
        {
            Gold -= GoldCost;
        }
    }

    const myElement = document.getElementById('ShopBody');
    if(myElement == null)
    {
        return false;
    }
    for (let i = 0; i < myElement.children.length; i++) {
        if(myElement.children[i].id != "levelBut" && 
        myElement.children[i].id != "refreshBut" &&
        myElement.children[i].id != "Hover")
        {
            
            var Num = UnitTable.length;

            var Rand = Math.floor(Math.random() * Num);

            JsonInfo = AvailableUnits[UnitTable[Rand]];
           
        
            myElement.children[i].innerHTML = "";
            for (let X = 0; X <  myElement.children[i].children.length; X++) {
                myElement.children[i].removeChild(X);
            }
            myElement.children[i].disabled = false;
            var BgColour = "green";

            var Cost = GetRandomUnit();
            switch(Cost)
            {
                case 1: BgColour = "DarkGrey"; break;
                case 2: BgColour = "DarkGreen"; break;
                case 3: BgColour = "DarkBlue"; break;
                case 4: BgColour = "DarkOrchid"; break;
                case 5: BgColour = "DarkOrange"; break;
            }

            myElement.children[i].style.background = BgColour;

            var img = document.createElement("img");
            img.src = JsonInfo.thumb;
            myElement.children[i].append(img)
            var Name = document.createElement("p");
            //myElement.children[i].innerHTML = JsonInfo.name;
            Name.innerHTML = JsonInfo.name;
            Name.style.color = "white"
            //Name.style.fontSize = "20px";
            Name.style.position = "absolute";
            Name.style.top = "55px"  ;
            Name.style.left = "0px " + (i *66);
            Name.style.zIndex = "999";
            Name.id = "scaling";

            
            var GoldCost = document.createElement("p");
            GoldCost.innerHTML = Cost;
            GoldCost.style.color = "gold"
            GoldCost.style.fontSize = "20px";
            GoldCost.style.position = "absolute";
            GoldCost.style.top = "55px";
            GoldCost.style.left = "50px"
            GoldCost.style.zIndex = "999";

            var TraitList = JsonInfo.traits;

            for(var index = 0; index < TraitList.length; index++)
            {
                var Trait = document.createElement("p");
                Trait.innerHTML = TraitList[index];
                Trait.style.color = "white"
                Trait.style.fontSize = "10px";
                Trait.style.position = "absolute";
                Trait.style.top = 0 + (30 * index) + "px";
                Trait.style.left = "0px"
                Trait.style.zIndex = "999";
                myElement.children[i].append(Trait);
            }

        

            myElement.children[i].append(Name);
            myElement.children[i].append(GoldCost);
        }
        //m
    }

    return true;
}

function CheckMinimumUnits()
{
    // If we dont have enough units and the bench has them.
    while(Arena.GetNumOccupied() < Level && Bench.GetNumOccupied() > 0)
    {
        var TileCheck = (Arena.MapSizeX * Arena.MapSizeY) - 3;
        while(Arena.Tiles[TileCheck].Occupied != null)
        {
            TileCheck--;
        }

        var TileToMoveTo = null;
        var UnitToSwapIn = null;
        var BenchTile = null;

        for(var Units = 0; Units < Bench.Tiles.length; Units++)
        {
            if(Bench.Tiles[Units].Occupied != null)
            {
                UnitToSwapIn = Bench.Tiles[Units].Occupied;
                BenchTile = Units;
                break;
            }
        }

        TileToMoveTo = Arena.Tiles[TileCheck];

        if(TileToMoveTo != null && UnitToSwapIn != null)
        {
            TileToMoveTo.Occupied = Bench.Tiles[BenchTile].Occupied;
            Bench.Tiles[BenchTile].Occupied = null;
            
            TileToMoveTo.Occupied.X = TileToMoveTo.X;
            TileToMoveTo.Occupied.Y = TileToMoveTo.Y;

            TileToMoveTo.Occupied.GetComponent("CHARCONTROL")._state = "Seeking";
            TileToMoveTo.Occupied.GetComponent("CHARCONTROL")._Current = TileCheck;
            TileToMoveTo.Occupied._OccupiedTile = TileToMoveTo;
        }
    }
}

// function PressRandom()
// {
//     var NumBerOnBunch = Bench.Tiles.length;

//     for(var Unit = 0; Unit < Level; Unit++)
//     {
//         if(Bench.GetNumOccupied() > 0)
//         {
//             if(Bench.Tiles.Occupied != null)
//             {
                
//             }
//         }
//     }
// }


function ShowBig(Element)
{
    var Doc =  document.getElementById("Hover");
    if(Doc.children.length <= 0)
    {
        let rect = Element.getBoundingClientRect();

        var Postop = -100;
        var PosLeft = rect.x - 100;

        var Div = document.createElement("div");
        Div.style.position = "absolute";
        Div.style.width = "100px";
        Div.style.height = "100px";
        Div.style.top = Postop;
        Div.style.left = PosLeft;
        Div.style.background = "Red";

        Element.addEventListener('mouseleave', (event) => { RemoveBig() });

        Doc.append(Div);
    }
}
function RemoveBig()
{
    var Doc =  document.getElementById("Hover");
    if(Doc.children.length > 0)
    {
        Doc.children[0].remove();
    }
}
function InstansiateUnit (ID, Target, Fellowship)
{
    var JsonInfo = AvailableUnits["Knight"];


    if((ID != 0))
    {
        var Button = document.getElementById(ID);

        var Name = Button.querySelector('#Scaling').innerHTML;

        JsonInfo = AvailableUnits[Name];
    }

    var AttackInfo = JsonInfo.Cast;

    var GOLDCOST = JsonInfo.cost;
    
    if(Bench.GetNumOccupied() < (Bench.MapSizeX*Bench.MapSizeY))
    {
        
        if(Fellowship == undefined)
        {
            if(Gold < GOLDCOST )
            {
                return;
            }
            else
            {
                Gold-=GOLDCOST;
            }
        }

        var SpriteImage = new Image();
        SpriteImage.src = JsonInfo.sheet;
        var Play1 = new _Champion();
        Play1._Sprite = new Sprite(SpriteImage, 3);

        Play1.AddComponent(new _StatComponent(Play1, JsonInfo.health, JsonInfo.armour, JsonInfo.magResist))._MaxMana = AttackInfo.Cost;
        Play1.GetComponent("Stats")._Mana = JsonInfo.StartMana;
        Play1.AddComponent(new CharacterController(Play1));
        Play1.AddComponent(new ShopAble(Play1));
        Play1.AddComponent(new AttackComponent(Play1,JsonInfo.damg, JsonInfo.range));
        Play1.GetComponent("Attack")._Cost = AttackInfo.Cost;
        Play1.GetComponent("Attack")._cast = AttackInfo.Func;
        Play1.GetComponent("Attack")._basic = JsonInfo.Basic;
    
        Play1.AddComponent(new PickupAble(Play1));

        Play1._GoldCost = JsonInfo.cost;
        Play1._ChampionName = JsonInfo.name;

        Play1.ID = GetActiveUnits + SpawnedEnemies;
        Play1.DebugColour = randomHexColor();

        Play1.traits = JsonInfo.traits;

        if(Fellowship == undefined)
            Fellowship = true;

        Play1._Ally = Fellowship;

        Play1._myJson = JsonInfo;

        if(Target == undefined)
        {
            Target = Bench;
        }
        else
        {
            Play1.X = Arena.Tiles[SpawnedEnemies].X;
            Play1.Y = Arena.Tiles[SpawnedEnemies].Y;
            SpawnedEnemies++;
        }

        Target.AddToMap(Play1);
        Play1.GetComponent("CHARCONTROL")._Current = 0;
        Renderables.push(Play1);
        GetActiveUnits++;

        if(ID != 0)
        {

            var Button = document.getElementById(ID);
            Button.disabled = true;
            Button.style.background = "blue";

            var Length = Button.children.length;
            for (let X = 0; Button.children.length > 0;) {
                Button.children[X].innerHTML = "";
                Button.children[X].remove();
            }
        }
        RemoveBig();
       // Button.innerHTML = "";

       return Play1;
    }

    return null;
}
function randomInteger(max) {
    return Math.floor(Math.random()*(max + 1));
}
function randomRgbColor() {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return [r,g,b];
}
function randomHexColor() {
    let [r,g,b] =randomRgbColor();
    
    let hr = r.toString(16).padStart(2, '0');
    let hg = g.toString(16).padStart(2, '0');
    let hb = b.toString(16).padStart(2, '0');
    
    return "#" + hr + hg + hb;
}





class HealthNumber extends Renderable{
    Number;
    Alpha;
    constructor(X,Y,NUM)
    {
        super();
        this.Number = NUM;
        this.X = X;
        this.Y = Y;
        this.Alpha = 2;
    }

    Draw()
    {
        if(this.Number < 0)
        {
            C1.fillStyle = "rgba(0, 255, 0, " + this.Alpha + ")";
        }
        else
        {
            C1.fillStyle = "rgba(255, 0, 0, " + this.Alpha + ")";
        }

        if(typeof this.Number === 'string')
        {
            C1.fillStyle = "rgba(255, 0, 0, " + this.Alpha + ")";
            C1.fillText(this.Number, this.X + CameraXY.X, this.Y + CameraXY.Y);
        }
        else
        {
            C1.fillText(this.Number * -1, this.X + CameraXY.X, this.Y + CameraXY.Y);
        }
        
        //C1.fillText(this.Number, this.X + CameraXY.X, this.Y + CameraXY.Y);
    }

    Update()
    {
        super.Update();
       
       this.Y--;
       this.Alpha -= 0.01;
    }
}

var Level = 0;
var MAX_LEVEL = 9;


function DebugAddEnemies()
{


    CheckMinimumUnits();
    if(RoundList.length > 0)
    {
        if(RoundList[RoundList.length-1].isActive)
        {
            return;
        }
    }

    for(var i = 0; i < Level; i++)
    {
        InstansiateUnit(0, Arena, false);
    }

    StartRound();
}

function LevelUp()
{
    if(Level < MAX_LEVEL)
    {
        Level++;
        document.getElementById("Level").innerHTML = "LEVEL: " + Level;
    }
}



function Debug()
{
    DoingDebug = !DoingDebug;
}




class BryceShield extends TempEffect
{
    ShieldStrength = 200;
    InitialArmour = 0;
    InitialMagicResist = 0;
    IncreaseAmt = 50;

    constructor(Unit)
    {
        super(Unit);

        var Stats = this._AffectedUnit.GetComponent("Stats");

        InitialMagicResist = Stats._MagResist;
        InitialArmour = Stats._Armour;

        Stats._MagResist += IncreaseAmt;
        Stats._MagResist += IncreaseAmt;
    }
}





var Arena = new TileMap(8,8, 0, 0);
Arena.defaultColour = "green";
Renderables.push(Arena);

var Bench = new TileMap(1,8, 0, (Arena.MapSizeY * TileW));
Bench.defaultColour = "gray";
Renderables.push(Bench);

var InitialRefresh = false;

var GoldTracker = document.getElementById("GOLD");



function GetUnitsOnBoard(GetOnlyYours)
{
    var List = [];

    for(var i = 0; i < Renderables.length; i++)
    {
        // All Units have this.
        if(Renderables[i]._ChampionName != null)
        {
            if(Renderables[i]._Ally || !Renderables[i]._Ally && !GetOnlyYours)
            {
                if(Renderables[i].GetComponent("CHARCONTROL")._state != "Idle" && Renderables[i].GetComponent("CHARCONTROL")._state != "Selected" )
                List.push(Renderables[i]);
            }
        }
    }

    return List;
}


function CheckActiveTraits()
{
    var OurUnits = GetUnitsOnBoard(true);

    var TraitDict = [];
    var CheckedUnits = [];

    for(var i = 0; i < OurUnits.length; i++)
    {
        for(var trait = 0; trait < OurUnits[i].traits.length; trait++)
        {

            if(CheckedUnits[OurUnits[i]._ChampionName] == null)
            {
                if( TraitDict[OurUnits[i].traits[trait]] == null)
                {
                    TraitDict[OurUnits[i].traits[trait]] = 1;
                }
                else
                {
                    TraitDict[OurUnits[i].traits[trait]]++;
                }

                
            }
        }
        CheckedUnits[OurUnits[i]._ChampionName] = 1;
    }

    var TraitHtml = document.getElementById("TraitList");
    TraitHtml.innerHTML = "ACTIVE TRAITS";

    for (const [key, value] of Object.entries(TraitDict)) {
        TraitHtml.innerHTML += "<li>" + key + ": " + value + "</li>";

      }

}


function GameLoop()
{
    if(!InitialRefresh)
    {
        InitialRefresh = RefreshButtons(true);
        LevelUp();
    }

    CheckActiveTraits();

    GoldTracker.innerHTML = "GOLD: " + Gold;
    
    Delta = new Date() - t;

    C1.clearRect(0, 0, Canvas.width, Canvas.height);

    Renderables.forEach(element => {
        element.Update();
    });

    if(RoundList.length > 0)
    {
        if(RoundList[RoundList.length-1].isActive)
        {
            if(RoundList[RoundList.length-1].isFinished())
            {
                SpawnedEnemies = 0;
                RoundList[RoundList.length-1].isActive = false;
                if(RoundList[RoundList.length-1].Victory == "WIN")
                {
                    console.log("Win");
                    Gold += 2;
                }
                else if(RoundList[RoundList.length-1].Victory == "LOSS")
                {
                    console.log("Loss");
                    PlayerHealth -= 5;
                    document.getElementById("HEALTH").innerHTML = "HEALTH: " + PlayerHealth;
                    Gold += 1;
                }

                // Clear up the Arena

           

                setTimeout(CleanUpArena, 2000);
            }
            else
            {
                RoundList[RoundList.length-1].Update();
            }
        }
    }

    for(var i = 0; i < Arena.Tiles.length; i++)
    {
        Arena.Tiles[i].CurrentColour = "Default";

        if(Arena.Tiles[i].Occupied != null)
        {
            Arena.Tiles[i].CurrentColour = Arena.Tiles[i].Occupied.DebugColour;
        }
    }

    requestAnimationFrame(GameLoop);
}


GameLoop();
