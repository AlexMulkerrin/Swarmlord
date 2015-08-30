/* Unit object shared by all objects on map, including bodies and inanimate 
 * objects.
 */
var state = { stopped:0, idle:1, wander:2, going:3};
// UNIT OBJECT CLASS
function Unit(x, y, type, faction) {
    this.isAlive = true;
    
    
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radians = Math.random()*Math.PI*2;
    this.animationCycle = Math.random()*0.2-0.1;
    this.adirec=0.02;
    
    this.type = type;
//    this.size = 16;//random(30)+5; handled by unit types now!
//    this.maxVel = 10;
//    this.maxRange = 50;
//    this.maxEaten = 10;
//    this.maxHealth = 10;
//    this.foodWorth = 10;
    
    this.health = this.type.health;
    this.food = 0;
    this.eaten = 0;
    this.cooldown = 0;
    
    this.faction = faction;
    this.selected = false;
    this.action = state.idle;
    this.targX =0;
    this.targY =0;
}
// METHODS
Unit.prototype.update = function() {
    
    if (this.cooldown>0) this.cooldown--;
    
    // heal with food
    if (this.type.species==="Bug") {
        
        this.animationCycle+=this.adirec;
        if (this.animationCycle>0.1) this.adirec=-0.03;
        if (this.animationCycle<-0.1) this.adirec=0.03;
        
        if (this.health < this.type.health) {
            this.eaten-=0.1;
            this.health+=0.1;
        }

        this.eaten-=0.1; // always hungry
        if (this.eaten<0) {
            this.health-=0.5;
            this.eaten=0;
        } 
    }
    this.movement();
};

Unit.prototype.movement = function() {
    switch (this.action) {
        
        case state.going:
            if (this.isNearTarget()) {
                //this.x=this.targX; don't move to target exactly
                //this.y=this.targY; so lazy and poorly trained! :P
                this.action = state.wander;
            } else {
                var hop = Math.random();
                this.x+=this.vx*hop;
                this.y+=this.vy*hop;
                //if (this.x<0) this.x=window.innerWidth; no borders at screen edges anymore
                //if (this.x>window.innerWidth) this.x=0;
                //if (this.y<0) this.y=window.innerHeight;
                //if (this.y>window.innerHeight) this.y=0;
            }
            break;
            
        case state.wander:
            if (this.isNearTarget()) {
                this.x=this.targX;
                this.y=this.targY;
                this.action = state.idle;
            } else {
                this.x+=this.vx/2;
                this.y+=this.vy/2;
                //if (this.x<0) this.x=window.innerWidth;  no borders at screen edges anymore
                //if (this.x>window.innerWidth) this.x=0;
                //if (this.y<0) this.y=window.innerHeight;
                //if (this.y>window.innerHeight) this.y=0;
            }
            break;
        
        case state.idle:
            if (random(20)<1) {
                this.setRandomCourse();
                this.action = state.wander;
            }
            break;
            
        case state.stopped:
            break;
            
    }
};

Unit.prototype.setCourse = function() {
    var dx = this.targX - this.x;
    if (dx === 0) dx = 0.0001;
    var dy = this.targY - this.y;
    var ratio = dy/dx;
    var xComponent = Math.sqrt(Math.pow(this.type.speed,2)/(1+Math.pow(ratio,2)));
    if (dx<0) xComponent*=-1;
    
    this.vx = xComponent;
    this.vy = ratio*this.vx;
    this.radians = Math.atan(ratio)+Math.PI/2;
    if (dx>0) this.radians += Math.PI;
};

Unit.prototype.setRandomCourse = function() {
//    if (this.type.species==="Bug") {
        this.targX = this.x + random(this.type.speed*8)-this.type.speed*4;
        this.targY = this.y + random(this.type.speed*8)-this.type.speed*4;

    
    if (this.targX<0) this.targX=0;
    if (this.targX>window.innerWidth) this.targX=window.innerWidth;
    if (this.targY<0) this.targY=0;
    if (this.targY>window.innerHeight) this.targY=window.innerHeight;
    
    this.setCourse();
};

Unit.prototype.setDriveDirection = function() {

    var direction = [[0,1],[0,1],[-1,0],[0,-1]];
    var choice = random(direction.length);
    var dist = random(this.type.speed*8);
    this.targX = this.x + dist*direction[choice][0];
    this.targY = this.y + dist*direction[choice][1];

};

Unit.prototype.isNearTarget = function() {
    var dx = this.targX - this.x;
    var dy = this.targY - this.y;
    if (dx*dx+dy*dy < this.type.speed*this.type.speed) return true;
    return false;
};

Unit.prototype.die = function() {
    this.isAlive = false;
    this.vx = 0;
    this.vy = 0;
    
    this.health = 0;
    this.food = this.type.cost;
    
    this.faction = 0;
    this.selected = false;
    this.action = state.stopped;
    this.targX =0;
    this.targY =0;
};


