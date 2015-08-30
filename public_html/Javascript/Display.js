/* Display object handles all canvas drawing events for
* player cursor and simulation objects.
*/
var palette = ["#A5988C","#DADD7F","#63CD2D","#008E42"];
// DISPLAY OBJECT CLASS
function Display(canvasName, simulation, player) {
    this.targetSim = simulation;
    this.targetPlayer = player;
    
    this.canvasName = canvasName;
    this.canvas = document.getElementById(canvasName);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    
    this.sqSize= 16;
    this.unitSize = 16;
    
    this.title = [];
    this.sprite = [];
    this.tileSet = [];
    this.getImages();
    this.loaded=0;
    this.background = document.createElement('canvas');
    this.map = document.createElement('canvas');
    this.miniMap = document.createElement('canvas');
    
    var t = this;
    for (var i=0; i<this.tileSet.length; i++) {
        this.tileSet[i].onload = function () {
            t.loaded++;
            if(t.loaded===t.tileSet.length) {
                //t.targetSim.togglePause();
                t.targetSim.gameState="playing";
                t.makeBackground(t.background);
                t.makeMap(t.map);
                t.makeMiniMap(t.miniMap);
            }
        };
    }
    
    
   
}
// METHODS
Display.prototype.getImages = function() {
    
    
    for (var i=0; i<3; i++) {
        this.title[i] = new Image();
    }
    this.title[0].src = "Assets/Images/Titles/Main Title.png";
    this.title[1].src = "Assets/Images/Titles/Defeat.png";
    this.title[2].src = "Assets/Images/Titles/Victory.png";
    
    for (var i=0; i<unitTypes.length; i++) {
        this.sprite[unitTypes[i].name] = new Image();
        this.sprite[unitTypes[i].name+"Dead"] = new Image();
        this.sprite[unitTypes[i].name].src = "Assets/Images/Units/"+unitTypes[i].species+"/"+unitTypes[i].name+".png";
        this.sprite[unitTypes[i].name+"Dead"].src = "Assets/Images/Units/"+unitTypes[i].species+"/"+unitTypes[i].name+"Dead.png";
    }
    for (var i=0; i<12; i++) {
        this.tileSet[i] = new Image();
    }
    
    this.tileSet[0].src = "Assets/Images/Terrain/Rock.png";
    this.tileSet[1].src = "Assets/Images/Terrain/RockEdges.png";
    this.tileSet[2].src = "Assets/Images/Terrain/Dirt.png";
    this.tileSet[3].src = "Assets/Images/Terrain/DirtEdges.png";
    this.tileSet[4].src = "Assets/Images/Terrain/Grass.png";
    this.tileSet[5].src = "Assets/Images/Terrain/GrassEdges.png";
    this.tileSet[6].src = "Assets/Images/Terrain/Tree.png";
    this.tileSet[7].src = "Assets/Images/Terrain/BareTree.png";
    this.tileSet[8].src = "Assets/Images/Terrain/Stump.png";
    this.tileSet[9].src = "Assets/Images/Terrain/Bones.png";
    this.tileSet[10].src = "Assets/Images/Terrain/Wreck.png";
    this.tileSet[11].src = "Assets/Images/Terrain/Sky.png";
};

Display.prototype.makeBackground = function(background) { 
    background.width = window.innerWidth;
    background.height = window.innerHeight;
    background.ctx = background.getContext("2d");
    
    var sx = Math.ceil(window.innerWidth/512);
    var sy = Math.ceil(window.innerWidth/512);
    for (var i=0; i<sx; i++) {
        for (var j=0; j<sy; j++) {
            background.ctx.drawImage(this.tileSet[11], i*512, j*512);
        }
    }
};
    
Display.prototype.makeMap = function(map) {   
    map.width = window.innerWidth;
    map.height = window.innerHeight;
    map.ctx = map.getContext("2d");
    
    var sqSize = this.sqSize;
    for (var i=0; i<this.targetSim.map.width; i++) {
        for (var j=0; j<this.targetSim.map.height; j++) {
            if (this.targetSim.map.tile[i][j].ground) {
                map.ctx.drawImage(this.tileSet[1], i*sqSize-2, j*sqSize-2);
            }
        }
    }
    for (var i=0; i<this.targetSim.map.width; i++) {
        for (var j=0; j<this.targetSim.map.height; j++) {
            if (this.targetSim.map.tile[i][j].ground) {
                if (this.targetSim.map.tile[i][j].tree) {
                    map.ctx.drawImage(this.tileSet[8], i*sqSize, j*sqSize);
                } else {
                    map.ctx.drawImage(this.tileSet[0], i*sqSize, j*sqSize);
                }
            }
        }
    }    
};

Display.prototype.makeMiniMap = function(map) {
    map.width = this.targetSim.map.width;
    map.height = this.targetSim.map.height;
    map.ctx = map.getContext("2d");
    map.ctx.fillStyle = "#aaaaaa";
    
    for (var i=0; i<this.targetSim.map.width; i++) {
        for (var j=0; j<this.targetSim.map.height; j++) {
            if (this.targetSim.map.tile[i][j].ground) {
                map.ctx.fillRect(i,j,1,1);
            }
        }
    }
};

Display.prototype.update = function() {
    if (this.targetSim.gameState==="reset") {
        this.makeBackground(this.background);
        this.targetSim.gameState="playing";
            
    }
    this.drawBackground();
    this.drawMap();
    this.drawUnits();
    this.drawEffects();
    this.drawText();
    if (this.targetPlayer.showInterface) {
        this.drawStatusBar();
        this.drawMenuBar();
    }
    this.drawMiniMap();
    this.drawControl();
};

Display.prototype.drawBackground = function() {
    this.ctx.setTransform(1,0,0,1,0,0);
    this.ctx.fillStyle="#000000";
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    this.ctx.drawImage(this.background, 0, 0);
};

Display.prototype.drawMap = function() {
    var x = -this.targetPlayer.viewX;
    var y = -this.targetPlayer.viewY;
    var sqSize = this.sqSize;
    
    //draw lower layer
    this.ctx.drawImage(this.map, x, y);
    
    for (var layer=1; layer<4; layer++) {
        for (var i=0; i<this.targetSim.map.width; i++) {
            for (var j=0; j<this.targetSim.map.height; j++) {
                if (this.targetSim.map.tile[i][j].ground) {
                    if (this.targetSim.map.tile[i][j].flora===layer || layer===0) {
                        this.ctx.drawImage(this.tileSet[layer*2+1], x+i*sqSize-2, y+j*sqSize-2);
                    }
                }
            }
        }
        for (var i=0; i<this.targetSim.map.width; i++) {
            for (var j=0; j<this.targetSim.map.height; j++) {
                if (this.targetSim.map.tile[i][j].ground) {
                    if (this.targetSim.map.tile[i][j].flora===layer || layer===0) {
                        
                        if (this.targetSim.map.tile[i][j].tree) {
                            this.ctx.drawImage(this.tileSet[8-layer], x+i*sqSize, y+j*sqSize);
                        } else {
                            this.ctx.drawImage(this.tileSet[layer*2], x+i*sqSize, y+j*sqSize);
                        }
                    }
                }
            }
        }
    }
    
};



Display.prototype.drawEffects = function() {
    var eventList = this.targetSim.eventList;
    for (var i=0; i<eventList.length; i++) {
        if (eventList[i].timeLeft>0) {
            this.ctx.fillStyle= "#ff0000";
            this.ctx.beginPath(); 
            this.ctx.lineWidth=eventList[i].timeLeft;
            if( eventList[i].source.type.species==="Bug") {
                this.ctx.strokeStyle="#00ff00";
            } else {
                this.ctx.strokeStyle="#ff0000";
            }
            this.ctx.moveTo(eventList[i].source.x,eventList[i].source.y);
            this.ctx.lineTo(eventList[i].destination.x,eventList[i].destination.y);
            this.ctx.stroke();
        }
    }
};

Display.prototype.drawUnits = function() {
    var size = this.unitSize;
    var colour = "#0000ff", secondColour = "#ff00ff";
    for(var i=0; i<this.targetSim.unitNum; i++) {
        var unit = this.targetSim.unit[i];
        size = unit.type.size;
        if (unit.isAlive === false && unit.food <1 ) {
           colour = "#cfcfcf"; 
           secondColour ="#afafaf";
        } else {
        colour = this.targetSim.faction[unit.faction].colour;
        secondColour = this.targetSim.faction[unit.faction].secondColour;
        }
        this.drawRotated(unit, colour, secondColour);
        
        if (unit.health < unit.type.health && unit.isAlive) {
            var fraction = unit.health/unit.type.health;
            var sx = Math.floor(unit.x);
            var sy = Math.floor(unit.y);
            this.ctx.fillStyle= "#ff0000";
            this.ctx.fillRect(sx,sy-5,unit.type.size,1);
            this.ctx.fillStyle= "#00ffff";
            this.ctx.fillRect(sx,sy-5,fraction*unit.type.size,1);
        } 
        if (unit.type.name==="Swarmlord" && unit.isAlive) {
            var fraction = unit.eaten/unit.type.store;
            var sx = Math.floor(unit.x);
            var sy = Math.floor(unit.y);
            this.ctx.fillStyle= "#cccccc";
            this.ctx.fillRect(sx,sy,unit.type.size,1);
            this.ctx.fillStyle= "#ffff00";
            this.ctx.fillRect(sx,sy,fraction*unit.type.size,1);
        }
        if (unit.food>0) {
            var fraction = unit.food/unit.type.cost;
            var sx = Math.floor(unit.x);
            var sy = Math.floor(unit.y);
            this.ctx.fillStyle= "#cccccc";
            this.ctx.fillRect(sx,sy-5,unit.type.size,1);
            this.ctx.fillStyle= "#ffff00";
            this.ctx.fillRect(sx,sy-5,fraction*unit.type.size,1);
        }
    
    }   
};

Display.prototype.drawRotated = function(unit, colour, secondColour) {
    var x = unit.x - this.targetPlayer.viewX;
    var y = unit.y - this.targetPlayer.viewY;
    this.ctx.translate(x,y);
    var rotation = unit.radians+unit.animationCycle;
    if (unit.isAlive) rotation+=this.targetSim.winAnimation; 
    this.ctx.rotate(rotation);
    //this.drawBug(unit, colour, secondColour);
    this.drawSprite(unit);
    this.ctx.rotate(-rotation);
    this.ctx.translate(-x,-y);
};

Display.prototype.drawBug = function(unit, colour,secondColour) {
    var cycle = unit.animationCycle;
    var size = unit.type.size/2;
    var tempSize=size;
    this.ctx.fillStyle = secondColour;
    if (cycle>5) tempSize=size*1.2;
    //middle legs
    if (unit.type.legPairs===1 || unit.type.legPairs===3) {
        this.ctx.fillRect(-tempSize,0,tempSize*2,2);
    } else if (unit.type.legPairs===4) {
        this.ctx.fillRect(-tempSize,-2,tempSize*2,2);
        this.ctx.fillRect(-tempSize,2,tempSize*2,2);
    }
    
    if (unit.type.legPairs>1) {
        this.ctx.rotate(Math.PI/4);
        //front and back leg pairs
        this.ctx.fillRect(-tempSize,0,tempSize*7/3,2);
        this.ctx.fillRect(0,-tempSize,2,tempSize*7/3);
        this.ctx.rotate(-Math.PI/4);
    }

    this.ctx.fillStyle= colour;
    switch (unit.type.shape) {
        case "wide":
        this.ctx.fillRect(-size/2,-size*1,size,size*2);
        break;
        case "long":
        this.ctx.fillRect(-size/3,-size*1.5,2*size/3,size*2.5);
        break;
        case "square":
        this.ctx.fillRect(-size/2,-size/2,size,size*2);
        break;
        case "rectangle":
        this.ctx.fillRect(-size/3,-size*1.5,2*size/3,size*2.5);
        break;
    }
    
    // select box?
    if (unit.selected) {
        this.drawHighlight(unit.type.size*0.75,"#ffffff");
    }   
};

Display.prototype.drawSprite = function(unit) {
    if (unit.isAlive) {
        this.ctx.drawImage(this.sprite[unit.type.name], -unit.type.size/2, -unit.type.size/2);
    } else {
        this.ctx.drawImage(this.sprite[unit.type.name+"Dead"], -unit.type.size/2, -unit.type.size/2);
    }

    if (unit.selected) {
        this.drawHighlight(unit.type.size*0.75,"#ffffff");
    }
};

Display.prototype.drawHighlight = function(size,colour) {
    this.ctx.fillStyle = colour;
    
    this.ctx.fillRect(-size,-size,1,size*2);
    this.ctx.fillRect(-size,-size,size*2,1);
    this.ctx.fillRect(-size,+size,size*2,1);
    this.ctx.fillRect(size,-size,1,size*2);
};

Display.prototype.drawMiniMap = function() {
    var x = window.innerWidth - this.targetSim.map.width;
    var y = window.innerHeight - this.targetSim.map.height;
    this.ctx.drawImage(this.miniMap, x, y);
    
    // draw view box
    var vx = x+this.targetPlayer.viewX/this.sqSize;
    var vy = y+this.targetPlayer.viewY/this.sqSize;
    var w = window.innerWidth/this.sqSize;
    var h = window.innerHeight/this.sqSize;
    this.ctx.fillStyle = "#ffffff";
    
    this.ctx.fillRect(vx,vy,1,h);
    this.ctx.fillRect(vx,vy,w,1);
    this.ctx.fillRect(vx,vy+h,w,1);
    this.ctx.fillRect(vx+w,vy,1,h);
    
};

Display.prototype.drawText = function() {
    if (!this.targetSim.running) {
        this.ctx.fillStyle="#0040bF";
        this.ctx.fillRect(window.innerWidth/2-70,window.innerHeight/2-50,165,40);
        this.ctx.fillStyle="#ffffff";
        this.ctx.font="bold 30px Arial";
        //switch (this.targetSim.gameState)
        this.ctx.drawImage(this.title[0],window.innerWidth/2-120,window.innerHeight/2-140);
        if (this.targetSim.gameState==="loading") {
            this.ctx.fillText("LOADING",window.innerWidth/2-50,window.innerHeight/2-20);
  
        } else {
            this.ctx.fillText("PAUSED",window.innerWidth/2-50,window.innerHeight/2-20);
            
            this.ctx.fillStyle="#467596";
            this.ctx.fillRect(0,60,180,190);
            
            this.ctx.fillStyle="#ffffff";
            this.ctx.font="16px Arial";
            this.ctx.fillText("HOTKEYS",25,80);
            this.ctx.fillText("P to unpause",5,100);
            this.ctx.fillText("M to mute",5,120);
            this.ctx.fillText("H to hide interface",5,140);
            this.ctx.fillText("Q to select SwarmLord",5,160);
            this.ctx.fillText("W to select warriors",5,180);
            this.ctx.fillText("E to select all",5,200);
            this.ctx.fillText("1-7 to build",5,220);
            this.ctx.fillText("and N to restart :)",5,240);
            
            this.ctx.fillStyle="#467596";
            this.ctx.fillRect(window.innerWidth-205,60,205,120);
            
            this.ctx.fillStyle="#ffffff";
            this.ctx.fillText("CREDITS",window.innerWidth-180,80);
            this.ctx.fillText("Alex Mulkerrin - Code",window.innerWidth-200,110);
            this.ctx.fillText("David Mulkerrin - Graphics",window.innerWidth-200,130);
            this.ctx.fillText("Iain Mulkerrin - Sounds",window.innerWidth-200,150);
            this.ctx.fillText("David Devereux - Music",window.innerWidth-200,170);
            
            
        }
    }
    
    if (this.targetSim.gameState==="Defeat") {
        this.ctx.drawImage(this.title[1],window.innerWidth/2-120,window.innerHeight/2-140);
        this.ctx.fillStyle="#0040bF";
        this.ctx.fillRect(window.innerWidth/2-120,window.innerHeight/2-50,270,40);
        this.ctx.fillStyle="#ffffff";
        this.ctx.font="bold 30px Arial";
        this.ctx.fillText("Press N to retry",window.innerWidth/2-100,window.innerHeight/2-20);
    } else if (this.targetSim.gameState==="Victory") {
        this.ctx.drawImage(this.title[2],window.innerWidth/2-120,window.innerHeight/2-140);
        this.ctx.fillStyle="#0040bF";
        this.ctx.fillRect(window.innerWidth/2-120,window.innerHeight/2-50,340,40);
        this.ctx.fillStyle="#ffffff";
        this.ctx.font="bold 30px Arial";
        this.ctx.fillText("Press N to play again",window.innerWidth/2-100,window.innerHeight/2-20);
    }
    
    
    //this.ctx.drawImage(this.title[0],window.innerWidth/2-50,window.innerHeight/2-20);
    
    this.ctx.fillStyle="#000000";
    this.ctx.font="16px Arial";
    var string ="View: "+this.targetPlayer.viewX+","+this.targetPlayer.viewY;// + this.targetSim.eventList[1].source.x;
    this.ctx.fillText(string,5,80);
};

Display.prototype.drawStatusBar = function() {
    var string;
    var bugBoss = this.targetSim.unit[0];
    var health = Math.floor(bugBoss.health);
    var biomass = Math.floor(bugBoss.eaten);
    
    this.ctx.fillStyle="#0040bF";
    this.ctx.fillRect(0,0,window.innerWidth,60);
    
    this.ctx.fillStyle="#ffffff";
    this.ctx.font="bold 20px Arial";
    this.ctx.fillText("SwarmLord",5,24);
    this.ctx.font="20px Arial";
    string = "Health: "+health+"/"+bugBoss.type.health;
    this.ctx.fillText(string,130,24);
    
    string = "Biomass: "+biomass+"/"+bugBoss.type.store;
    this.ctx.fillText(string,130,48);
    
    string = "Bugs: "+this.targetSim.faction[1].totalUnits;
    this.ctx.fillText(string,window.innerWidth-100,24);
    string = "Bots: "+(this.targetSim.totalUnits-this.targetSim.faction[1].totalUnits);
    this.ctx.fillText(string,window.innerWidth-100,48);
    
    var fraction = health/bugBoss.type.health;
    this.ctx.fillStyle= "#ff0000";
    this.ctx.fillRect(280,6,window.innerWidth-400,20);
    this.ctx.fillStyle= "#00ffff";
    this.ctx.fillRect(280,6,fraction*(window.innerWidth-400),20);
    
    fraction = biomass/bugBoss.type.store;
    this.ctx.fillStyle= "#cccccc";
    this.ctx.fillRect(280,32,window.innerWidth-400,20);
    this.ctx.fillStyle= "#ffee00";
    this.ctx.fillRect(280,32,fraction*(window.innerWidth-400),20);
    
    
    
    
};

Display.prototype.drawMenuBar = function() {
    var bottom = window.innerHeight;
    this.ctx.fillStyle="#0040bF";
    this.ctx.fillRect(0,bottom-120,buildNum*78,120);
    
    this.ctx.fillStyle="#ffffff";
    this.ctx.font="20px Arial";
    var string = "Create: ";
    this.ctx.fillText(string,5,bottom-100);
    
    this.ctx.font="16px Arial";
    for (var i=1; i<=buildNum; i++) { // only first 10 units are bugs...for now :?
        this.ctx.fillStyle="#D1EDFF";
        this.ctx.fillRect(i*78-74,bottom-95,68,90);
        
        
        
        var dummy = new Unit(i*78-40,bottom-40,unitTypes[i],1);
        dummy.radians=0;
        dummy.animationCycle=0;
        var colour = this.targetSim.faction[1].colour;
        var secondColour = this.targetSim.faction[1].secondColour;
        this.drawRotated(dummy, colour, secondColour);
        
        this.ctx.fillStyle="#0000ff";
        this.ctx.fillText(i+":"+unitTypes[i].name,i*78-74,bottom-80);
        
        if (this.targetSim.unit[0].eaten> unitTypes[i].cost) {
            this.ctx.fillStyle="#ffaa00";
        }
        this.ctx.fillText(+unitTypes[i].cost,i*78-72,bottom-10);
    }    
};

Display.prototype.drawControl = function() {
    if (this.targetPlayer.mouseOver) {
        this.ctx.fillStyle= RGB(255,0,0);
        var x = this.targetPlayer.mouseX;
        var y = this.targetPlayer.mouseY;
        this.ctx.fillRect(x-5,y,13,3);
        this.ctx.fillRect(x,y-5,3,13);
    }
    // draw selection box
    if (this.targetPlayer.mouseIsPressed) {
        var left = this.targetPlayer.selection.left;
        var top = this.targetPlayer.selection.top;
        var right = this.targetPlayer.selection.right;
        var bottom = this.targetPlayer.selection.bottom;
        this.ctx.fillStyle= RGB(255,255,255);
        this.ctx.beginPath(); 
        this.ctx.lineWidth="1";
        this.ctx.strokeStyle="white";
        this.ctx.moveTo(left,top);
        this.ctx.lineTo(right,top);
        this.ctx.lineTo(right,bottom);
        this.ctx.lineTo(left,bottom);
        this.ctx.lineTo(left,top);
        this.ctx.stroke(); // Draw it
    }
};

