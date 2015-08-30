/* Control object deals with player mouse and keyboard input
 * sending events to relevant parts of the program or simulation
*/
// OBJECT CLASS
function Control(canvasName, simulation, audio) {
    this.targetCanvas = document.getElementById(canvasName);
    this.targetSim = simulation;
    this.targetAudio = audio;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseOver = false;
    this.mouseIsPressed = false;
    this.mouseButton = 0;
    
    this.viewX =0;
    this.viewY =0;
    this.viewPanX = false;
    this.viewPanY = false;
    this.viewVel = 20;
    
    this.zoom = 16;
    
    this.showInterface = false;//true;
    
    this.selection = new SelectBox();   
    var t = this;
    // MOUSE CONTROLS
    this.targetCanvas.onmouseenter = function(event) {t.mouseOver=true;};
    this.targetCanvas.onmouseleave = function(event) {t.mouseExits(event);};
    
    this.targetCanvas.onmousemove = function(event) {t.mouseUpdateCoords(event);};
    
    this.targetCanvas.onmousedown = function(event) {t.mousePressed(event);};
    this.targetCanvas.onmouseup = function(event) {t.mouseReleased(event);};
    
    // dummy functions to avoid rightclicking bringing up edit menu
    this.targetCanvas.oncontextmenu= function(event) {return false;};
    this.targetCanvas.onselectstart= function(event) {return false;};
    
    // KEYBOARD CONTROLS using unicode keycodes
    document.onkeydown = function(event) {
        if (event===null) keyCode = window.event.keyCode;
	else keyCode = event.keyCode;
        
        switch (keyCode) {
            case 78: // n start new game
                t.targetSim.restart();
                break;
            case 72: // h hide interface
                t.toggleInterface(); 
                break;
            case 77: // m mute sound
                t.targetAudio.toggleMute();
                break;
            case 80: // p pause game
                t.targetSim.togglePause();
                t.targetAudio.toggleMute();
                break;
                
            case 81: // q select Swarmlord
                t.targetSim.selectCommander();
                break;
            case 82: // r select combat
                t.targetSim.selectMilitary();
                break;
            case 69: // e select all
                t.targetSim.selectAll();
                break;
            
            case 87: // w pan up
                t.viewPanY = -1;
                break;
            case 65: // a pan left
                t.viewPanX = -1;
                break;
            case 83: // s pan down
                t.viewPanY = 1;
                break;
            case 68: // d pan up
                t.viewPanX = 1;
                break;
        }
 
        for (var i=1; i<=buildNum; i++) {
            if (keyCode === (48+i)) { //1-9 keys 
                t.targetSim.build(i);
            }
            if (keyCode === 48) { // 0 key
                t.targetSim.build(10);
            }
        }
    };
    
    document.onkeyup = function(event) {
        if (event===null) keyCode = window.event.keyCode;
	else keyCode = event.keyCode;
        
        switch (keyCode) {
            case 87: // w pan up
                t.viewPanY = 0;
                break;
            case 65: // a pan left
                t.viewPanX = 0;
                break;
            case 83: // s pan down
                t.viewPanY = 0;
                break;
            case 68: // d pan up
                t.viewPanX = 0;
                break;
        }
        
    };
}
// METHODS
// mouse controls
Control.prototype.mouseUpdateCoords = function(event) {
    this.mouseX = event.layerX;
    this.mouseY = event.layerY;
    if (this.mouseIsPressed) {
        this.selection.right = this.mouseX;
        this.selection.bottom = this.mouseY;
    }
};

Control.prototype.mouseExits = function(event) {
    this.mouseOver=false;
    this.mouseReleased();
};

Control.prototype.mousePressed = function(event) {
    this.mouseButton = event.which;
    if (this.mouseButton === 1 && this.mouseY>window.innerHeight-80 && this.targetSim.showInterface) { // left mouse button over menu
        this.checkInterfaceButtons();
    } else {
        if (this.mouseButton === 3 ) { //right mouse button
            this.giveMoveOrder();
        } else {
            this.selection.left = Math.floor(event.layerX);
            this.selection.top = Math.floor(event.layerY);
            this.selection.right= this.selection.left;
            this.selection.bottom = this.selection.top;
            this.mouseIsPressed=true;
        }
    }
};

Control.prototype.mouseReleased = function(event) {
    this.mouseIsPressed=false;
    if (this.mouseButton === 1) { //left mouse button
        this.lassoUnits();
    }
};
// unit commanding
Control.prototype.lassoUnits = function() {
    var left,right,top,bottom;
    if (this.selection.left > this.selection.right) {
        left = this.selection.right;
        right = this.selection.left;
    } else {
        left = this.selection.left;
        right = this.selection.right;
    }
    if (this.selection.top > this.selection.bottom) {
        top = this.selection.bottom;
        bottom = this.selection.top;
    } else {
        top = this.selection.top;
        bottom = this.selection.bottom;
    }
    this.targetSim.setSelected(left,top,right,bottom);
};

Control.prototype.giveMoveOrder = function() {
    this.targetSim.setTarget(this.mouseX,this.mouseY);
};

Control.prototype.checkInterfaceButtons = function() {
  // kludge to check collision on buttons 
  var found = -1;
  for (var i = 1; i<11; i++) { // only first 10 units are bugs...for now :?
        if (this.mouseX > i*78-78) {
            found = i;
        }
    }
    if (this.mouseX> 10*78 ) found =-1;
    if (found !== -1) this.targetSim.build(found);
};

Control.prototype.toggleInterface = function() {
    if (this.showInterface) {
        this.showInterface = false;
    } else {
        this.showInterface = true;
    }
};

Control.prototype.update = function() {
    var maxX = this.targetSim.map.width*this.zoom-window.innerWidth;
    var maxY = this.targetSim.map.height*this.zoom-window.innerHeight;
    this.viewX+= this.viewPanX*this.viewVel;
    if (this.viewX<0) this.viewX=0;
    if (this.viewX>maxX) this.viewX = maxX;
    this.viewY+= this.viewPanY*this.viewVel;
    if (this.viewY<0) this.viewY=0;
    if (this.viewY>maxY) this.viewY = maxY;
    
};


// SELECTION BOX OBJECT CLASS
function SelectBox() {
    this.top=0;
    this.left;
    this.right;
    this.bottom;
}

