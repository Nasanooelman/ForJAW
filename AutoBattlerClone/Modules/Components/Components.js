// START COMPONENTS
class Component 
{
    _Owner;
    _name;

    constructor(MyOwner)
    {
        this._Owner = MyOwner;
        this._name = "UNDEF";
    }

    Update()
    {
        
    }
}

class ShopAble extends Component
{
    constructor(MyOwner)
    {
        super(MyOwner);
        this._name = "Shop";
    }
   

    sell()
    {
        this._Owner.removeFromWorld();
    }
}



class AttackComponent extends Component
{
    _range;
    _attackSpeed;
    _timeStarted;
    _Damage;
    _Cast;
    _basic;
    _Cost;

    constructor(MyOwner, Damage, Range)
    {
        super(MyOwner);
        this._name = "Attack";
        this._range = Range;// Math.floor(Math.random() * 2) + 1;
        this._attackSpeed = 0.65;
        this._Damage = Damage;
        this._timeStarted = new Date().getTime();
        this._cast = null;
        this._cost = null;
        this._basic = null;
    }

    getAttackRange()
    {
        return this._range;
    }

    Attack(MyTarget)
    {
        var CurrentTime = new Date().getTime();
        var Ticks = GetTicks(CurrentTime-this._timeStarted);
        var TicksNeeded = TicksInASecond / this._attackSpeed;

        this._Owner._Animation = 2;
        this._Owner.CurrentFrame = 0;

        if(this._Cost != null && this._cast != null)
        {
            if(this._Owner.GetComponent("Stats").GetCurrentMana() >= this._Cost && Ticks > 10)
            {
                this._Owner.GetComponent("Stats")._TicksSinceLast= new Date().getTime();
                this._cast(MyTarget, this._Owner);
                this._Owner.GetComponent("Stats").SetMana(0);
            }
            else
            {
                if(Ticks >= TicksNeeded)
                {
                    this._timeStarted = CurrentTime;
                    // MyTarget.GetComponent("Stats").Damage(DealtDamage,DmgType);
                    
                    var CurrentMana = this._Owner.GetComponent("Stats").GetCurrentMana();
                    CurrentMana += 10;
                    this._Owner.GetComponent("Stats").SetMana(CurrentMana);
                    if(this._basic != null)
                        this._basic(MyTarget, this._Owner); //StanBlade(MyTarget,this._Owner)
                }
                else
                {
                    if(this._Owner.CurrentFrame == 0 && this._Owner._Animation != 0 && Ticks > 5)
                    {
                        this._Owner._Animation = 0;
                        this._Owner.CurrentFrame = 0;
                    }
                }
            } 
        }
    
    }

    Cast(MyTarget)
    {
        if(_Cast != null)
        {
           
        }
    }

    TimeToAttack()
    {
        var CurrentTime = new Date().getTime();
        var Ticks = GetTicks(CurrentTime-this._timeStarted);
        if(Ticks)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}


class PickupAble extends Component
{

    constructor(MyOwner)
    {
        super(MyOwner);
        this._name = "PickupAble"

    }

    HandleSelected()
    {
        var OldX =  this._Owner.X;
        this._Owner.X = MX;
        this._Owner.Y = MY;
        this._Owner._Animation = 0;
        this._Owner.CurrentFrame = 0;

        var Position = Arena.ConvertXAndYToTile(MX, MY)

        if(MouseDown)
        {

        }
        else
        {

            var CurrentLoc = GetPositionOnTileMap(this._Owner.X, this._Owner.Y);
            if(CurrentLoc.tileMap == null)
                return;


            if(CurrentLoc.tileMap == Arena)
            {
                if(CurrentLoc.Location < 32)
                {
                    return;
                }
            } 


            if(Arena.GetNumOccupied() == Level && CurrentLoc.tileMap != Bench )
                return;

            if(RoundList.length > 0)
            {
                if(CurrentLoc.tileMap != Bench && RoundList[RoundList.length-1].isActive)
                {
                    return;
                }
            }
                
            var SelectedTile = CurrentLoc.tileMap.Tiles[CurrentLoc.Location];

            if(SelectedTile.Occupied == null)
            {
                MouseDown = false;
                this._Owner.X = SelectedTile.X;
                this._Owner.Y = SelectedTile.Y; 
                SelectedTile.Occupied = this._Owner;
                this._Owner._OccupiedTile = SelectedTile;
                
                var StateEngine = this._Owner.GetComponent("CHARCONTROL");

                StateEngine._Current = CurrentLoc.Location;

                if(CurrentLoc.tileMap == Arena)
                {
                    StateEngine._state = "Seeking";
                }
                else
                {
                    StateEngine._state = "Idle";
                    this._Owner.Y = this._Owner.Y + Bench.MapY
                }

                CurrentlySelecting = null;
            }
        }
    }
}

let LastOccupiedTile;
class CharacterController extends Component
{

    _path = [];
    _Dest;
    _Current;
    _state;
    _FullyInTile;
    _targeted;
    Speed;
    isDead;

    constructor(MyOwner)
    {
        super(MyOwner);
        this._name = "CHARCONTROL"
        this._state = "Idle";
        this._FullyInTile = true;
        this.isDead = false;
        this.Speed = 2;

    }

    MoveTo(_c, _d)
    {
        this._Current = _c;
        this._Dest = _d;
        this._path = [];
    }

    Move()
    {

        this.__FullyInTile = false;
        if(this._Owner._Animation != 1)
            this._Owner._Animation = 1;
            
        var EnemyTileLocation = Arena.GetTileFromEntity(this._targeted);
        var Attack = this._Owner.GetComponent("Attack")
        var Range = Attack.getAttackRange();
        var ClosestTile = Arena.getClosestTileWithinRange(EnemyTileLocation, this._Current, Range);
        this._Current = Arena.GetTileFromEntity(this._Owner);

         // If we have a path to follow.
        if(this._path.length > 0)
        {

            if(Bench.Tiles.includes(this._targeted._OccupiedTile))
            {
                // Its gone on the bench
                this._targeted = null;
                this._path = [];
                return;
            }
            
            var NeighBours = Arena.GetNeighbours(this._Current);
            
            for(var i = 0; i < NeighBours; i++ )
            {
                if(NeighBours[i].Loc == ClosestTile)
                {
                    this._path = [];
                }
            }
            var N = Arena.GetNeighbours(this._path[ this._path.length-1].Tile);
            // Next Node to find
            var NextNode = Arena.Tiles[this._path[ this._path.length-1].Tile];
            // If we can't go into the next tile
            if(NextNode.Occupied != this._Owner && NextNode.Occupied != null)
            {   
                // We can walk through dead people
                // otherwise clear the path lets try again.
                if(!NextNode.Occupied.GetComponent("CHARCONTROL").isDead)
                    this._path = [];
            }

            if(this._path.length <= 0)
                return;

            if(this._Owner._OccupiedTile != NextNode)
            {
                // Move in
                this._Owner._OccupiedTile.Occupied = null;
                NextNode.Occupied = this._Owner;
                this._Owner._OccupiedTile = NextNode;//Arena.Tiles[Arena.ConvertXAndYToTile(this._Owner.X, this._Owner.Y)];
                this._Current = this._path[ this._path.length-1].Tile;

                


            }

            // Handle Moving
            var TargetX = NextNode.X;
            var TargetY = NextNode.Y;


            if(this._Owner.X < TargetX)
            {
                this._Owner.X+=this.Speed;
               // this._Owner._Animation = 2;
                this._Owner._Sprite.playing = true;
            }
            else if(this._Owner.X > TargetX)
            {
                this._Owner.X-=this.Speed;
               // this._Owner._Animation = 1;
                this._Owner._Sprite.playing = true;  
            }

            if(this._Owner.Y < TargetY)
            {
                this._Owner.Y+=this.Speed;
                //this._Owner._Animation = 0;
                this._Owner._Sprite.playing = true;
            }
            else if(this._Owner.Y> TargetY)
            {
                this._Owner.Y-=this.Speed;
                //this._Owner._Animation = 3;
                this._Owner._Sprite.playing = true;  
            }
            else if(this._Owner.Y == TargetY && this._Owner.X == TargetX)
            {
                this._Owner._Animation = 0;
                this._Owner.CurrentFrame = 0;
               // this._Owner._Sprite.playing = false;

               // Recheck to see if there is anyone closer
               var Closest =  this.FindClosestEnemy(null);

               if(this._targeted != Closest)
               {
                   this._targeted = Closest;
                   this._path = [];
               }

                if(this._path.length > 0)
                {
                    // Remove Last element.
                    this._path.pop();
                    
                    if(this._path.length == 0)
                    {
                        this._FullyInTile = true;
                    }
                }
            }
        }
        else
        {
            this._Dest = Arena.getClosestTileWithinRange(EnemyTileLocation, this._Current, Range);
            // Move to our Enemy
            let list = Arena.GetNeighbours(this._Current);

            if(list.length > 0)
            {
                var SpaceAvailable = false;

                for(var i = 0; i < list.length; i++)
                {
                    if(list[i].Loc < Arena.MapSizeX * Arena.MapSizeY)
                    {
                        if(Arena.Tiles[list[i].Loc].Occupied == null)
                        {
                            SpaceAvailable = true;
                            break;
                        }
                    }
                }
            }
            if(SpaceAvailable)
            {
                this._path = AstarPathfinder(this._Current, this._Dest, this._Owner);
            }

            // If we couldnt pathfind try again
            if(this._path.length <=0)
            {
                var Closest =  this.FindClosestEnemy(null);

                if(this._targeted != Closest)
                {
                    this._targeted = Closest;
                }
            }

        }
    }

    SortState()
    {
        if(this._state == "Selected" || this._state == "Idle" && Bench.Tiles.includes(this._Owner._OccupiedTile))
            return this._state;

        var ReturnedState = "Idle";

        var thisTileMap = GetPositionOnTileMap(this._Owner.X, this._Owner.Y);
        if((this._targeted == null || this._targeted._OccupiedTile == null) && thisTileMap.tileMap != Bench || !isValidToAttack(this._Owner, this._targeted))
        {
            // If we have no target find one
            ReturnedState = "Seeking";
            this._targeted = null
        }
        else
        {
            // Are we in range of our Target?
            var Attack = this._Owner.GetComponent("Attack")
            var myLoc = Arena.ConvertXAndYToTile(this._Owner.X, this._Owner.Y);

            if(myLoc >= 0 && myLoc < 64)
            {
                var MyTile = Arena.GetTileFromEntity(this._targeted);

                if(Attack != null && MyTile != null)
                {
                    var Range = Attack.getAttackRange();
                    var EnemyTileLocation =  MyTile;

                    if((Arena.GetTileDistance(myLoc, EnemyTileLocation) < Range) && this._FullyInTile == true)
                    {
                        ReturnedState = "Attacking";
                    }
                    else
                    {
                        var Closest = Arena.getClosestTileWithinRange(EnemyTileLocation, myLoc, Range);

                        // Are we there?
                        if(Closest == myLoc &&
                            (this._Owner.Y == Arena.Tiles[Closest].Y && this._Owner.X == Arena.Tiles[Closest].X))
                        {
                            ReturnedState = "Attacking";
                        }
                        else
                        {
                            ReturnedState = "Move";
                        }
                    }
                }
            }
        }

        return ReturnedState;
    }


    FindClosestEnemy(target)
    {
        if(target== null)
        {
            this._path = [];
            // Make sure our Unit can attack
            var Attack = this._Owner.GetComponent("Attack")
            var myLoc = Arena.GetTileFromEntity(this._Owner);//Arena.ConvertXAndYToTile(this._Owner._OccupiedTile.X,this._Owner._OccupiedTile.Y);

            if(myLoc >= 0 && myLoc < 64)
            {
                if(Attack != null)
                {
                    var Range = Attack.getAttackRange();

                    var EnemyList = [];
                    // TODO make this mor efficient

                    var Index = 0;
                    Arena.Tiles.forEach(tile => {
                        if(tile.Occupied != null )
                        {
                            // ENEMY!!!
                            if(tile.Occupied._Ally != this._Owner._Ally && tile.Occupied.GetComponent("CHARCONTROL")._state != "Selected" && !tile.Occupied.GetComponent("CHARCONTROL").isDead)
                            {
                                var fCost = GetFCost(myLoc, Index, myLoc);
                                EnemyList.push({loc: Index, cost: fCost });
                            }
                            
                        }
                        Index++;
                    });

                    if(EnemyList.length > 0)
                    {
                        var LowestFCost = EnemyList[0].cost;
                        var EnemyIndex = 0;
                        Index = 0;

                        for(var Enemy = 0; Enemy < EnemyList.length; Enemy++)
                        {
                            if(LowestFCost > EnemyList[Enemy].cost)
                            {
                                LowestFCost = EnemyList[Enemy].cost;
                                EnemyIndex = Enemy;
                            }
                        }

                        // Set our Targeted Enemy
                         return Arena.Tiles[EnemyList[EnemyIndex].loc].Occupied;
                    }
                }
            }
        }
    }

    // Seeking State where its looking for a new target
    Seek()
    {
        this._Owner._Animation = 0;
        this._Owner.CurrentFrame = 0;
        this._targeted = this.FindClosestEnemy(this._targeted);
       
    }

    HandleAttack()
    {
        // this._Owner._Animation++;
        // if(this._Owner._Animation > 4)
        //     this._Owner._Animation = 0;

        if(this._targeted.GetComponent("CHARCONTROL").isDead)
        {
            this._targeted = null;
            return;
        }
        
        if(this._Owner.GetComponent("Attack").TimeToAttack())
        {
            this._Owner.GetComponent("Attack").Attack(this._targeted)
        }
        else
        {
            if(this._Owner._Sprite.CurrentFrame == 0)
            {
                //this._Owner._Animation = 0;
            }
        }
    }

    DoSelection()
    {
        var Comp = this._Owner.GetComponent("PickupAble");
        if(Comp != null)
        {
            Comp.HandleSelected();
        }
    }

    Update()
    {

        if(this.isDead)
        {
            var Played = this._Owner.GetComponent("Stats")._playedDeath;

            if(!Played && this._Owner._Sprite.CurrentFrame == 0)
            {
                this._Owner._Sprite.playing = false;
                this._Owner._Sprite.CurrentFrame = 2;
            }
            else
            {
                 this._Owner.GetComponent("Stats")._playedDeath = false;
            }

            return;
        }
        
        this._state = this.SortState();

        switch(this._state)
        {
            case "Move":  this.Move(); break;
            case "Selected": this.DoSelection(); break;
            case "Attacking" : this.HandleAttack(); break;
            case "Seeking" : this.Seek(); break;
            case "Idle": 
            default: this._Owner._Animation = 0; this._Owner.CurrentFrame = 0; break;
        }
       
    }
}

// Does this classify as a particle system? 
class _StatComponent extends Component
{
    _DamageNumbers;
    _playedDeath;
    _LastGainedMana;

    StatsMap;

    constructor(_Owner, HealthAmt, Armour, MagResist)
    {
        super(_Owner);
        this._name = "Stats";
        this._DamageNumbers = [];
        this._playedDeath = false;

        this._MaxHealth = HealthAmt;
        this._currentHealth = this._MaxHealth;
        this._Mana = 0;
        this._MaxMana = 100;
        this._Armour = Armour;
        this._MagResist = MagResist;


        this._TicksSinceLast = 0;
        this._shield = null;

        this.StatsMap = [];
        this.StatsMap["MaxHP"] = HealthAmt;
        this.StatsMap["HP"] = HealthAmt;
        this.StatsMap["Mana"] = 0;
        this.StatsMap["MaxMana"] = 100;
        this.StatsMap["Armour"] = Armour;
        this.StatsMap["MagicResist"] = MagResist;
        // Needs an ID and an amount.
        this.StatsMap["Shield"] = [null, 0];   
    }

    GetMaxHealth()
    {
        return this.StatsMap["MaxHP"];
    }

    GetCurrentHealth()
    {
        return this.StatsMap["HP"];
    }

    SetHealth(amt)
    {
        return this.StatsMap["HP"] = amt;
    }

    GetCurrentMana()
    {
        return this.StatsMap["Mana"];
    }

    SetMana(amt)
    {
        this.StatsMap["Mana"]  = amt;
    }

    GetMaxMana()
    {
        return this.StatsMap["MaxMana"];
    }

    GetCurrentArmour()
    {
        return this.StatsMap["Armour"];
    }

    SetCurrentArmour(value)
    {
        return this.StatsMap["Armour"] = value;
    }


    GetCurrentMagicResist()
    {
        return this.StatsMap["MagicResist"];
    }

    GetCurrentShield()
    {
        return this.StatsMap["Shield"];
    }

    SetShield(Id, Amt)
    {
        this.StatsMap["Shield"] = [Id, Amt];
    }

    GetBarWidth()
    {
        // TODO: get the Size of the Image 
        return TileW;
    }

    GetHealthPerc()
    {
        return (this.GetMaxHealth()/this.GetCurrentHealth());
    }

    GetShieldPerc()
    {
        if(this.GetCurrentShield() > this.GetMaxHealth())
        {
            return 100;
        }
        else
        {
            var Shieldamt = this.GetCurrentShield();
            return (this.GetMaxHealth()/Shieldamt[1]);
        }
        
    }

    GetManaPerc()
    {
        if(this.GetCurrentMana() > this.GetMaxMana())
            this.SetMana(this.GetMaxMana());
        return (this.GetMaxMana()/this.GetCurrentMana());
    }


    Damage(dmg, Type)
    {
        
        // 1% Premitigation
        var PreMit = dmg*0.01;

        if(Type == "Phys")
        {
           dmg =  Math.floor(dmg * (100/ (100 + this._Armour)));
        }
        else if(Type == "Mag")
        {
            dmg =  Math.floor(dmg * (100/ (100 + this._MagResist)));
        }
        else if(Type == "true")
        {
            dmg = dmg;
        }

        /// Mana Gain From Damage
        if(dmg > 0)
        {
            var Current = new Date().getTime();
            if(GetTicks(Current - this._TicksSinceLast) > 20)
            {
                // 7% Post mitigation
                var ManaGain = (Math.floor(PreMit + (dmg * 0.07)));

                if(ManaGain > 42)
                {
                    ManaGain = 42;
                }

                var currentMana = this.GetCurrentMana();
                currentMana += ManaGain;
                this.SetMana(currentMana);

                if(this._Mana > this._Owner.GetComponent("Attack")._Cost)
                {
                    this._Mana = this._Owner.GetComponent("Attack")._Cost;
                }
            }
        }

        // i've tied healing in as negative damage
        // I'm not sure if this is the best way to do it
        if(dmg < 0)
        {
            if((this.GetCurrentHealth() - dmg) > this.GetMaxHealth())
            {
                dmg = (this.GetMaxHealth() - this.GetCurrentHealth()) * - 1;
            }
        }

        var Shield = this.GetCurrentShield();
        var ShieldValue = Shield[1];
        var TakeDamage = true;

        if(ShieldValue > 0)
        {
            if(ShieldValue < dmg)
            {
                dmg = dmg - ShieldValue;
                ShieldValue = 0;
            }
            else
            {
                ShieldValue -= dmg;
                TakeDamage = false;
            }

            this.SetShield(Shield[0], ShieldValue);
        }

        if(TakeDamage)
        {
            var CurrentHealth = this.GetCurrentHealth();
            CurrentHealth -= dmg;
            this.SetHealth(CurrentHealth);
        }

        this._DamageNumbers.push(new HealthNumber(this._Owner.X + Math.floor(Math.random() * this.GetBarWidth()), this._Owner.Y, dmg))

        if(this.GetCurrentHealth() <= 0)
        {
            this.SetHealth(0);

            if(!this._Owner.GetComponent("CHARCONTROL").isDead)
            {
                this._Owner.GetComponent("CHARCONTROL").isDead = true;
                this._Owner._Animation = 4;
                this._Owner._Sprite.CurrentFrame = 0;
                this._playedDeath = true;
            }
        }
    }

    DrawHealth()
    {
        if(this._Owner.GetComponent("CHARCONTROL").isDead)
            return;

        var BarX =  this._Owner.X +  CameraXY.X;
        var BarY =  this._Owner.Y +  CameraXY.Y;
        C1.lineWidth = "1";

        var CurrentbarLength = this.GetBarWidth() / this.GetHealthPerc();

        var HPHei = 4;
        C1.fillStyle = '	black';
        C1.fillRect(BarX, BarY - HPHei - 2,  this.GetBarWidth(), HPHei)
        
        if(this._Owner._Ally)
        {
           C1.fillStyle = '	lime';
        }
        else
        {
            C1.fillStyle = '	red'; 
        }
        C1.fillRect(BarX, BarY - HPHei - 2,  CurrentbarLength, HPHei)
        C1.strokeRect(BarX, BarY- HPHei - 2, this.GetBarWidth(), HPHei);

        C1.fillStyle = '	white'; 
        var CurrentbarLength = this.GetBarWidth() / this.GetShieldPerc();
        C1.fillRect(BarX, BarY - HPHei - 2,  CurrentbarLength, HPHei)
        C1.strokeRect(BarX, BarY- HPHei - 2, this.GetBarWidth(), HPHei);

        var CurrentbarLength = this.GetBarWidth() / this.GetManaPerc();
        C1.fillStyle = '	blue';
        C1.fillRect(BarX, BarY - 2,  CurrentbarLength, 2)
        C1.strokeRect(BarX, BarY- 2, this.GetBarWidth(), 2);
    }

    DrawHealthNumbers()
    {
        for(var Num = 0; Num < this._DamageNumbers.length; Num++)
        {
            this._DamageNumbers[Num].Update();
        }
    }

    Update()
    {
        this.DrawHealth();
        this.DrawHealthNumbers();
    }
}

class _Unit extends Renderable
{
    _Sprite;
    _Animation;
    _OccupiedTile;
    lastTileOccupied;
    ID;
    DebugColour;
    _Ally;
    _TemporaryEffects = [];
    _myJson;

    // Stats
    Draw() {

       C1.save();
       var ExtraSize = 20;
       C1.drawImage(this._Sprite.Texture, SpriteImgSize * this._Sprite.CurrentFrame, SpriteImgSize * this._Animation, SpriteImgSize, SpriteImgSize, this.X +  CameraXY.X - ExtraSize/2, this.Y +  CameraXY.Y - ExtraSize, TileW + ExtraSize, TileW+ ExtraSize);
       C1.restore();
       C1.font = "bold 8px verdana, sans-serif";
       C1.fillStyle = "#FFFFFF"
       if(DoingDebug)
       {
        C1.fillText(this.GetComponent("CHARCONTROL")._state, this.X + 60, this.Y + 10);
        C1.fillText("Target " + this.GetComponent("CHARCONTROL")._Dest, this.X + 60, this.Y + 20);
        if(this.GetComponent("CHARCONTROL")._path.length > 0)
        {
            var PathTile = this.GetComponent("CHARCONTROL")._path[this.GetComponent("CHARCONTROL")._path.length-1].Tile;
            C1.fillText("Next " + PathTile, this.X + 60, this.Y + 30);

            C1.strokeStyle = 'black';
            C1.lineWidth = 0.5;
            C1.strokeText("Next " + PathTile, this.X + 60, this.Y + 30);

            C1.fillText("My ID " + this.ID, this.X + 60, this.Y + 40);
            if(this.GetComponent("CHARCONTROL")._targeted != null)
             C1.fillText("Target ID " + this.GetComponent("CHARCONTROL")._targeted.ID, this.X + 60, this.Y + 50);
        }
       }
       else
       {
            C1.fillText(this._ChampionName, this.X + 50, this.Y + 30); 
       }
       //C1.strokeRect(this.X + CameraXY.X, this.Y + CameraXY.Y, TileW, TileW);   
    }

    init()
    {
        this._OccupiedTile = Arena.Tiles[Arena.ConvertXAndYToTile(this.X , this.Y)];
        this._OccupiedTile.Occupied = this;
        console.log("My Occupied Tile is " + this._OccupiedTile)  
        //this.TargetNode = RetargetNode(this._OccupiedTile);
        console.log("Target Node is " + this.TargetNode)
    }

    constructor()
    {
        super();
        this._Animation = 0;
        this.ID = 0;
        this.CompletedMove = true;
        this._Ally = true;
    }

    // Should this be a function in a manager??
    removeFromWorld()
    {
        if(Renderables.includes(this))
        {
            for(var i = 0; i < Renderables.length; i++)
            {
                if(Renderables[i] == this)
                {
                    var Til =  Arena.GetContainingTile(this);
                    if(Til != null)
                    {
                        Til.Occupied = null;
                        GetActiveUnits--;
                    }
                    else
                    {
                        Til =  Bench.GetContainingTile(this); 
                        
                        if(Til != null)
                        {
                            Til.Occupied = null;
                            GetActiveUnits--;
                        }
                    }
                    this._OccupiedTile = null;
                    Renderables.splice(i, 1);
                }
            }
        }
    }

    Update()
    {
        super.Update();

        for(var i = 0; i < this._TemporaryEffects.length; i++)
        {
            this._TemporaryEffects[i].Update();
        }

        this._Sprite.Update();
    }
}


class _Champion extends _Unit
{

    _GoldCost;
    _Cost;
    _ChampionName;
    _traits;

    constructor()
    {
        super();
        this._GoldCost = null;
        this._Cost = null;
        this._ChampionName = null;
        this._traits = null;
    }
}

var MaxSpeed = 12;
var Speed = 5;
function handleKeyboard(event)
{
    var Pressed = false;

    if(event.keycode == '38')
    {   
        Arena.MapSizeY--;
    }
    if(event.key == "e")
    {
        Pos = Bench.ConvertXAndYToTile(MX, MY)
        //if(Pos = Bench.ConvertXAndYToTile(MX, MY))
        {
            if( Pos >= 0 && Pos < 8)
            {
                if(Bench.Tiles[Pos].Occupied)
                {
                    Bench.Tiles[Pos].Occupied.GetComponent("Shop").sell();
                }
            }
        }
    }
}


function RetargetNode(Me)
{
    var Nodes = Math.floor(Math.random() * 50);

    while(Arena.Tiles[Nodes].Occupied || Nodes === Me)
    {
        Nodes = Math.floor(Math.random() * 50);
    }

    console.log("I can Confirm: " + Nodes + " Is Not " + Me)
    return Nodes;
}


class TempEffect 
{
    _TimeStarted;
    _CurrentTime;
    _AffectedUnit;

    Update()
    {
        // Wait for Implimentation
        this._CurrentTime = new Date().getTime();
    }

    constructor(Unit)
    {
        this._TimeStarted = new Date().getTime();
        this._AffectedUnit = Unit;
    }

    clear()
    {
        // When its done
    }
}

