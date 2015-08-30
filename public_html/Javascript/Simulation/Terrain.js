/* Object to store the state of the terrain underneath the units. Bodies will
 * end up stored here and there will be vegetation on the surface too.
 * 
 */
// TERRAIN OBJECT CLASS
function Terrain(width,height) {
    this.width = width;
    this.height = height;
    this.tileSize = 16;
    
    this.tile = [];
    for (var i=0; i<this.width; i++) {
            this.tile[i] = [];
        for (var j=0; j<this.height; j++) {
            this.tile[i][j] = new Tile();
        }
    }
}
// METHODS
Terrain.prototype.clearMap = function() {
    for (var i=0; i<this.width; i++) {
        for (var j=0; j<this.height; j++) {
            this.tile[i][j] = new Tile();
        }
    }
    
};
Terrain.prototype.generateMap = function() {
    
    this.clearMap();
    for (var i=0; i<this.width; i++) {
        for (var j=0; j<this.height; j++) {
            this.tile[i][j].flora = random(3)+1;
            
        }
    }
    
    this.pruneEdges();
    this.relaxFloraDistribution(2);
    this.addTrees();
    
 
};

Terrain.prototype.pruneEdges = function() {
    var edge=random(10);
    for (var i=0; i<this.width; i++) {
            edge +=random(3)-1;
            if (edge<1) edge=1;
            for (var j=0; j<edge; j++) {
                this.tile[i][j].flora = 0;
                this.tile[i][j].ground=false;
            }        
    }
    edge=random(10);
    for (var i=0; i<this.width; i++) {
            edge +=random(3)-1;
            if (edge<1) edge=1;
            for (var j=0; j<edge; j++) {
                this.tile[i][this.height-(j+1)].flora = 0;
                this.tile[i][this.height-(j+1)].ground=false;
            }        
    }
    edge=random(10);
    for (var j=0; j<this.height; j++) {
            edge +=random(3)-1;
            if (edge<1) edge=1;
            for (var i=0; i<edge; i++) {
                this.tile[i][j].flora = 0;
                this.tile[i][j].ground=false;
            }        
    }
    edge=random(10);
    for (var j=0; j<this.height; j++) {
            edge +=random(3)-1;
            if (edge<1) edge=1;
            for (var i=0; i<edge; i++) {
                this.tile[this.width-(i+1)][j].flora = 0;
                this.tile[this.width-(i+1)][j].ground=false;
            }        
    }
};

Terrain.prototype.relaxFloraDistribution = function(repetitions) {
    for (var r=0; r<repetitions; r++) {
        for (var i=0; i<this.width; i++) {
            for (var j=0; j<this.height; j++) {
                this.tile[i][j].neighboursFlora = this.calculateAdjacent(i,j);
            }
        }
        for (var i=0; i<this.width; i++) {
            for (var j=0; j<this.height; j++) {
                var average = Math.floor(this.tile[i][j].neighboursFlora/5);
                if (average<1) this.tile[i][j].flora=1;
                if (average > this.tile[i][j].flora) this.tile[i][j].flora++;
                if (average > this.tile[i][j].flora) this.tile[i][j].flora--;
                this.tile[i][j].maxFlora = this.tile[i][j].flora;
            }
        }
    }
};

Terrain.prototype.addTrees = function() {
    for (var i=0; i<this.width; i++) {
        for (var j=0; j<this.height; j++) {
            if (this.tile[i][j].flora === 3) {
                var choice = random(2);
                if (choice===0) {
                    this.tile[i][j].tree=true;
                } else {
                    this.tile[i][j].tree=false;
                    
                }
                this.tile[i][j].flora=2;
            }   
        }
    }
};

Terrain.prototype.calculateAdjacent = function(x,y) {
    var direction = [[0,0],[0,-1],[-1,0],[1,0],[0,1]];
    var dx,dy;
    var total = 0;
    var edge=false;
    for (var e=0; e<direction.length; e++) {
        if (x+direction[e][0]>=0 && x+direction[e][0]<this.width) {
            if (y+direction[e][1]>=0 && y+direction[e][1]<this.height) {
                dx = x+direction[e][0];
                dy = y+direction[e][1];
                total += this.tile[dx][dy].flora;
                if (this.tile[dx][dy].ground===false) {
                    edge=true;
                }
            }
            
        }
    }
    if (edge) total=0;
    return total;
};

Terrain.prototype.depleteFlora = function(x,y) {
    var tileX= Math.floor(x/this.tileSize);
    var tileY= Math.floor(y/this.tileSize);
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            if (tileX+i>=0 && tileX+i<this.width) {
                    if (tileY+j>=0 && tileY+j<this.height) {
                    if (this.tile[tileX+i][tileY+j].flora>0) {
                        this.tile[tileX+i][tileY+j].flora--;
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

Terrain.prototype.isGround = function(x,y) {
    var tileX= Math.floor(x/this.tileSize);
    var tileY= Math.floor(y/this.tileSize);
    if (tileX>=0 && tileX<this.width) {
        if (tileY>=0 && tileY<this.height) {
            return (this.tile[tileX][tileY].ground);
        }
    }
    return false;
};

Terrain.prototype.totalFlora = function() {
    var total=0;
    for (var i=0; i<this.width; i++) {
            for (var j=0; j<this.height; j++) {
                total += this.tile[i][j].flora;
            }
        }
  return total;  
};


// TERRAIN TILE OBJECT CLASS
function Tile() {
    this.ground=true;
    this.flora=0;
    this.maxFlora=0;
    this.tree=false;
    this.bones = false;
    this.neighboursFlora = 0;
}

