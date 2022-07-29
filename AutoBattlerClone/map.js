function CalculateAbsoluteTileDistance(TileA, TileB)
{
    // Sqr Root of ((X2 - X1) Sq + (y2-y1)sq)

    let XEquation = Math.pow((TileB.X - TileA.X), 2);
    let YEquation = Math.pow((TileB.Y - TileA.Y), 2);

    let DotResult = Math.sqrt(XEquation + YEquation);

    return DotResult;

}



function EvaluateNodeCost(TileA, TileB)
{

    if(TileA > 63 || TileB > 63)
    {
        return 999999999;
    }

    let StartTile = Arena.Tiles[TileA];
    let EndTile = Arena.Tiles[TileB];

    let DistX =  Math.abs(StartTile.X - EndTile.X);

    let DistY = Math.abs(StartTile.Y - EndTile.Y);

    let Distance;

    if( DistX > DistY)
    {
        Distance = (DiagonalMoveCost * DistY) + (NonDiagonalMoveCost*(DistX - DistY));
    }
    else
    {
        Distance = (DiagonalMoveCost * DistX) + (NonDiagonalMoveCost*(DistY - DistX));
    }

    return Distance/TileW;
}

function GetFCost(Start, End, Current)
{
    let Gcost = EvaluateNodeCost(Start, Current);
    let Hcost = EvaluateNodeCost(End, Current);

    return Gcost + Hcost;
}

class PFNode
{
    FCost;
    Parent;
    // This is the Tile in our TileMap our node represents
    // It's the Tilemap index
    Tile;

    constructor(Tile)
    {
        this.Tile = Tile;
        this.Parent = null;
        this.FCost = 9999999;

    }
}


var NOT_SET = -1;

function CheckNotEval(array, Obj)
{
    for(var Size = 0; Size < array.length; Size++)
    {
        if(array[Size].Tile == Obj.Loc)
        {
            return Size;
        }
    }
    return NOT_SET;
}


function AstarPathfinder(ObjA, ObjB, Entity)
{
    // Map is a known quanitity
    var OpenSect = [];
    var ClosedSect = [];

    var StartNode = new PFNode(ObjA);
    if(ObjA == ObjB)
    return StartNode;
    StartNode.FCost = 0;
    OpenSect.push(StartNode);

    
    while(OpenSect.length > 0)
    {
        // Current Node E.g. the one we are checking
        let Current = new PFNode(NOT_SET);
        let TakenIndex = 0;

        // Calculate Node with Lowest F cost
        for(var N = 0; N < OpenSect.length; N++)
        {
            if(OpenSect[N].FCost < Current.FCost)
            {
                Current = OpenSect[N];
                TakenIndex = N;
            }
        }

        // Remove from Open and add to closed
        ClosedSect.push(Current);
        OpenSect.splice(TakenIndex, 1);

        // We found our target
        if(Current.Tile == ObjB)
        {
            // EndCase

            var FinishedList = [];

            let Done = false;

            FinishedList.push(Current);

            while(!Done)
            {
                if(Current.Parent.Tile == ObjA)
                {
                    Done = true;
                }
                else
                {
                    FinishedList.push(Current.Parent);
                    Current = Current.Parent;
                }
            }

           // console.log("Completed Nodes" + FinishedList)
            return FinishedList;
        }

        // Find the Neighbours
        let Neighbours = Arena.GetNeighbours(Current.Tile);

        for(let Neigh = 0; Neigh < Neighbours.length; Neigh++)
        {
            // If we haven't already evaluated it
            if((CheckNotEval(ClosedSect, Neighbours[Neigh]) == NOT_SET))
            {
                if( Neighbours[Neigh].Loc >= 64)
                {
                    //console.log("BAD");
                    continue;
                }

                if(!Arena.Tiles[Neighbours[Neigh].Loc].Occupied ||
                    Arena.Tiles[Neighbours[Neigh].Loc].Occupied == Entity
                    ||  
                    Arena.Tiles[Neighbours[Neigh].Loc].Occupied.GetComponent("CHARCONTROL").isDead )
                {
                    let FCost = GetFCost(ObjA, ObjB, Neighbours[Neigh].Loc)
                    var OpenSectEval = CheckNotEval(OpenSect, Neighbours[Neigh]);
                    // if its in open
                    if(OpenSectEval != NOT_SET)
                    {
                        if(FCost < OpenSect[OpenSectEval].FCost)
                        {
                            OpenSect[OpenSectEval].FCost = FCost;
                            OpenSect[OpenSectEval].Parent = Current;
                        }
                    }
                    else
                    {
                        let NewNode = new PFNode(Neighbours[Neigh].Loc);
                        NewNode.Parent = Current;
                        NewNode.FCost = FCost;

                        OpenSect.push(NewNode);
                    }
                }
                else
                {
                    var IsOccupied = false;
                }
            } 
        }           


    }

    console.log("Failed to Pathfind " + Entity.ID + "Trying to get too " + ObjB);
    var EmptyList = [];
    return EmptyList;
}

function GetPositionOnTileMap(X,Y)
{

    var tileMap = null;
    var Location = null;

    var Convert = Arena.ConvertXAndYToTile(X,Y);
    var CheckBench = (Y > Arena.MapY + (TileW * Arena.MapSizeY));

    if(Convert >= 0 && Convert < 64 && !CheckBench)
    {
        tileMap = Arena;
    }
    else
    {
        Convert = Bench.ConvertXAndYToTile(X,Y);
        tileMap = Bench;
    }

    Location = Convert;
    return { tileMap, Location};
}


class Tile
{
    X
    Y
    Width
    Height
    Occupied;
    Hovered;
    CurrentColour;
    HoverColour;

    constructor(_X, _Y, _Width, _height)
    {
        this.X= _X;
        this.Y= _Y;
        this.Width = _Width;
        this.Height = _height;
        this.Occupied = null;
        this.CurrentColour = "Default";
        this.HoverColour = "blue";
        this.Hovered = false;
    }
}


class TileMap
{
    Tiles = [];
    MapX
    MapY
    MapSizeX;
    MapSizeY;
    defaultColour;

    GetNumOccupied()
    {
        var Occ = 0;
        this.Tiles.forEach(tile => {

            if(tile.Occupied != null)
            {
                if(!tile.Occupied.GetComponent("CHARCONTROL").isDead)
                    Occ++;
            }
        });

        return Occ;
    }

    GetTileFromEntity(Entity)
    {
        var found = null;
        var Loc = 0;

        for(var tile = 0; tile < this.Tiles.length; tile++)
        {
            if(this.Tiles[tile].Occupied != null)
            {
                if(this.Tiles[tile].Occupied == Entity)
                {
                    found = tile;
                }
            }
        }

        return found;
    }

    getLowestFCostFromNeighbourList(list, me)
    {
        var tile = null;
        if(list.length > 0)
        {
            var lowest = 0;
            var OtherCost = 999999;

            for(var i = 0; i < list.length; i++)
            {
                var fCost = GetFCost(me, list[i].Loc, me);

                
                if(fCost < OtherCost && (this.Tiles[list[i].Loc].Occupied == null || list[i].Loc== me))
                {
                    lowest = i;
                    OtherCost = fCost;
                }
            }

            tile = lowest;
            return list[tile].Loc;
        }
    }

    getClosestTileWithinRange(Target, Us, Range)
    {
        var LowestTile;
        var TargetedTile;

        for(var i = 0; i < Range; i++)
        {
            if(i == 0)
            {
                TargetedTile = Target;
            }
            else
            {
                TargetedTile = LowestTile;
            }

            var NeighList = this.GetNeighbours(TargetedTile);
            LowestTile = this.getLowestFCostFromNeighbourList(NeighList, Us);
        }

        return LowestTile;
    }

    Draw()
    {
       
        var Loc = 0;
        this.Tiles.forEach(tile => {

        

            if((tile.Occupied != null) && DoingDebug)
            {
                C1.fillStyle = tile.HoverColour;
            }
            else
            {
                C1.fillStyle = this.defaultColour;
            }

            if(CurrentlySelecting != null)
            {
                var Hovered = GetPositionOnTileMap(CurrentlySelecting.X, CurrentlySelecting.Y);

                if(Hovered.tileMap == this && Hovered.Location == Loc)
                {
                    if(Hovered.tileMap == Bench)
                    {
                        C1.fillStyle = tile.HoverColour;
                    }
                    else if(Hovered.Location > 32)
                    {
                        C1.fillStyle = tile.HoverColour;
                    }
                    
                }
            }
            
            C1.fillRect(this.MapX + tile.X + CameraXY.X, this.MapY + tile.Y + CameraXY.Y, tile.Width, tile.Height);
            C1.lineWidth = "2";
            C1.strokeStyle = 'black';
            if(CurrentlySelecting != null && (Loc >= 32 || this.MapSizeY * this.MapSizeX == 8))
            {
                C1.strokeRect(this.MapX + tile.X + CameraXY.X, this.MapY + tile.Y + CameraXY.Y, tile.Width, tile.Height);
            }
            C1.fillStyle = "rgba(255, 0, 0, 1)";
            C1.font = '20px serif';
            if(DoingDebug)
                C1.fillText(Loc, this.MapX + tile.X + CameraXY.X + TileW/2 - 10,  this.MapY + tile.Y + CameraXY.Y + TileW/2 + 10);



            Loc++;
           
        });
    }


    AddToMap(Entity)
    {
        for(var til = 0; til < this.Tiles.length; til++)
        {
            if(!this.Tiles[til].Occupied)
            {
                Entity.X = this.Tiles[til].X + this.MapX;
                Entity.Y = this.Tiles[til].Y + this.MapY;
                Entity._OccupiedTile = this.Tiles[til];
                this.Tiles[til].Occupied = Entity;
                break;
            }
        }
    }

    GetNeighbours(TargetTile)
    {
        var NeighbourList = [];
        var MapSizeX = this.MapSizeX;
        var MapSizeY = this.MapSizeY;

        if(TargetTile == 33)
        {
            var Debug = 0;
        }

        // North Neighbour
        if(TargetTile != 0 && ((TargetTile%MapSizeX) != 0))
        {
            // Go left one.
            //NeighbourList["North"] = TargetTile-1;
            NeighbourList.push({Loc: TargetTile-1, Res: 0});

        }
        // South Neighbour
        if(TargetTile != (MapSizeX*MapSizeY) && (((TargetTile+1)%MapSizeX) != 0))
        {
            // Go left one.
            //NeighbourList["South"] = TargetTile+1;
            NeighbourList.push({Loc:TargetTile+1,  Res: 0});
        }
         // Left Neighbour
         if(TargetTile-MapSizeX >= 0)
            NeighbourList.push({Loc:TargetTile-MapSizeX, Res: 0});
            //NeighbourList["Left"] = TargetTile - MapSizeX;
        
         // Right Neighbour
        if(TargetTile+MapSizeX < MapSizeX*MapSizeY)
            NeighbourList.push({Loc:TargetTile+MapSizeX, Res: 0});

         // Bottom Right
         NeighbourList.push({Loc:TargetTile+1+MapSizeX, Res: 1});

         // Bottom Left
         if(TargetTile != (MapSizeX*MapSizeY) && (((TargetTile+1)%MapSizeX) != 0) && TargetTile-MapSizeX >= 0)
            NeighbourList.push({Loc:TargetTile+1-MapSizeX, Res: 1});

         // Top Left
         if(TargetTile != 0 && ((TargetTile%MapSizeX) != 0) && TargetTile-1-MapSizeX > 0)
            NeighbourList.push({Loc:TargetTile-1-MapSizeX, Res: 1});

        // Top right
        if(TargetTile != 0 && ((TargetTile%MapSizeX) != 0) )
            NeighbourList.push({Loc: TargetTile-1+MapSizeX, Res: 1});


        

         return NeighbourList;
    }

    GetNeighboursDict(TargetTile)
    {
        var NeighbourList = {};
        var MapSizeX = this.MapSizeX;
        var MapSizeY = this.MapSizeY;

        // Left Neighbour
        if(TargetTile != 0 && ((TargetTile%MapSizeX) != 0))
        {
            // Go left one.
            NeighbourList["North"] = TargetTile-1;
        }
        // Right Neighbour
        if(TargetTile != (MapSizeX*MapSizeY) && (((TargetTile+1)%MapSizeX) != 0))
        {
            // Go left one.
            NeighbourList["South"] = TargetTile+1;
        }
         // Up Neighbour
         if(TargetTile-MapSizeX > 0)
            NeighbourList["Left"] = TargetTile - MapSizeX;
        
         // South Neighbour
        if(TargetTile+MapSizeX < MapSizeX*MapSizeY)
         NeighbourList["Right"] = TargetTile + MapSizeX;

         return NeighbourList;
    }


    ConvertXAndYToTile(_colX,_colY)
    {

        var PosX = Math.round(((_colX-this.MapX-(TileW/2))/TileW));
        var PosY = Math.round(((_colY-this.MapY)/TileW));

        if(PosY < 0)
            PosY = 0;
        
        if(PosX < 0)
        {
            PosX = 0;
        }

        var DonePos = (PosY*this.MapSizeX)+PosX;

        //if(DonePos >= (this.MapSizeX*this.MapSizeY) || DonePos < 0)
            //throw 'Parameter is not on map'

        return DonePos;

    }

  
    TileFromWorldPoint(X, Y) {

        var PosX = Math.round(((X)/TileW));
        var PosY = Math.round(((Y)/TileW));

        var TileIndex = (PosX*this.MapSizeY) + PosY;

        if(TileIndex >= (this.MapSizeX*this.MapSizeY) || TileIndex < 0)
         throw 'Parameter is not on map'


        return this.Tiles[TileIndex];
        
    }

    GetTileDistance(A, B)
    {
        var ActualTileXA = Arena.Tiles[A].X/TileW;
        var ActualTileYA = Arena.Tiles[A].Y/TileW;

        var ActualTileXB = Arena.Tiles[B].X/TileW;
        var ActualTileYB = Arena.Tiles[B].Y/TileW;

        var DistanceX = Math.abs(ActualTileXA- ActualTileXB);
        var DistanceY = Math.abs(ActualTileYA- ActualTileYB);
        

        return Math.max(DistanceX,DistanceY);
    }

    GetContainingTile(Entity)
    {
        var Container = null;
        for(var til = 0; til < this.Tiles.length; til++)
        {
            if(this.Tiles[til].Occupied == Entity)
            {
                Container = this.Tiles[til];
                break;
            }
        }

        return Container;
    }

    constructor(X,Y, SX, SY)
    {
        this.MapX = SX;
        this.MapY = SY;
        for(var _x = 0; _x < X; _x++)
        {
            for(var _y = 0; _y < Y; _y++) 
            {
                this.Tiles.push(new Tile(_y* TileW, _x * TileW, TileW, TileW));
            }
        }

        this.MapSizeX = X;
        this.MapSizeY = Y;
    }

    Update()
    {

        this.Draw();  
    }
}

var Saved = [];
function SaveMap()
{
    for(var i = 0; i < Arena.Tiles.length; i++)
    {
        if(Arena.Tiles[i].Occupied != null)
        {
            // Delete Enemies
            if(Arena.Tiles[i].Occupied._Ally)
            {
                var PushObject = { X: Arena.Tiles[i].Occupied, Y: i}
                Saved.push(PushObject);
            }
        }
    }
}

function CleanUpArena()
{
    var NeedsToBeRemoved =[];
    // Loop through all our renderable objects to find our units on the board
    for(var i = 0; i < Renderables.length; i++)
    {
        var Name = Renderables[i].constructor.name;
        if(Name == "_Champion")
        {
            var TempEffectLength = Renderables[i]._TemporaryEffects.length;

            // First clear any temporary effects
            for(var Temps = 0; Temps < TempEffectLength; Temps++)
            {
                Renderables[i]._TemporaryEffects[Temps].clear();
            }
            // Empty all the effects when we are done with them
            Renderables[i]._TemporaryEffects = [];

            if(!Renderables[i]._Ally)
            {
                Renderables[i]._OccupiedTile = null;

                NeedsToBeRemoved.push(i);
                // Renderables[i].removeFromWorld();
            }
        }
        else if(Name == "Particle" || Name == "Line")
        {
            //NeedsToBeRemoved.push(i);
            // Renderables[i].removeFromWorld();
        }
    }

    for(var deleter = 0; deleter < NeedsToBeRemoved.length; deleter++)
    {
        Renderables[NeedsToBeRemoved[deleter]].removeFromWorld();
    }

    // Loop through our saved Map,
    // Reset Everythings Health
    // Move it back to where it was
    for(var o = 0; o < Saved.length; o++)
    {
        var SavedUnit =  Saved[o].X;

        SavedUnit.GetComponent("CHARCONTROL").isDead = false;
        SavedUnit.GetComponent("Stats").SetHealth(SavedUnit.GetComponent("Stats").GetMaxHealth());
        SavedUnit.GetComponent("Stats").SetMana(SavedUnit._myJson.StartMana);
        SavedUnit.GetComponent("Stats")._playedDeath = false;


        SavedUnit._Sprite.playing = true;
        SavedUnit._Sprite._Animation = 0;

        var Tile = Arena.Tiles[Saved[o].Y];

        console.log("I was in " + Saved[o].Y)
        var PreviousTile =  Arena.Tiles[Arena.GetTileFromEntity(SavedUnit)];

        if(PreviousTile != null)
        {
            PreviousTile.Occupied = null;
            console.log(PreviousTile);
        }

        SavedUnit._OccupiedTile = Tile;
        SavedUnit.GetComponent("CHARCONTROL")._Current = Saved[o].Y;
        SavedUnit.GetComponent("CHARCONTROL")._targeted = null;
        SavedUnit.X = Tile.X;
        SavedUnit.Y = Tile.Y;
        Tile.Occupied = Saved[o].X;
    }

    Saved = [];
    
    RefreshButtons(true);
}