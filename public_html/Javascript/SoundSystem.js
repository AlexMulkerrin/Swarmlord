/* sound system object handles playing of background music and 
 * individual sounds.
 */
// AUDIO OBJECT CLASS
function SoundSystem() {
    this.muted = false;
    
    this.music = [];
    this.track = 0;
    this.currentTrack;
    this.loadMusic();
    this.playMusic();
    this.toggleMute();
    
    this.sound = [];
    this.loadSound();    
}


SoundSystem.prototype.loadMusic = function() {
    this.music[0] = new Audio("Assets/Music/01 Menu.wav");
    this.music[1] = new Audio("Assets/Music/02 Start_tiny swarm.wav");
    this.music[2] = new Audio("Assets/Music/03 Small Swarm.wav"); 
    this.music[3] = new Audio("Assets/Music/04 Big Swarm (longer).wav"); 
    this.music[4] = new Audio("Assets/Music/05 Biggest Swarm (evil).wav"); 
    
    this.currentTrack = this.music[0];
    
    var t = this;
    for (var i=0; i<this.music.length; i++) {
        this.music[i].volume = 0.1;
        this.music[i].onended = function() {
            t.nextMusic();
        };
    }
};

SoundSystem.prototype.playMusic = function() {
    if (this.muted===false) {
        this.currentTrack = this.music[this.track];
        this.music[this.track].play();
    }
};

SoundSystem.prototype.nextMusic = function() {
    this.track++;
    if (this.track>4) this.track=0;
    this.music[this.track].play();
    this.currentTrack = this.music[this.track];
};

SoundSystem.prototype.toggleMute = function() {
    if (this.muted) {
        this.muted=false;
        this.currentTrack.play();
    } else {
        this.muted=true;
        this.currentTrack.pause();
    }
};


SoundSystem.prototype.loadSound = function() {
    this.sound[0] = new Audio("Assets/Sounds/Bug/Worker.wav");
    this.sound[1] = new Audio("Assets/Sounds/Bug/Flyer.wav");
    this.sound[2] = new Audio("Assets/Sounds/Bug/Worker.wav"); 
    this.sound[3] = new Audio("Assets/Sounds/Bug/Striker.wav"); 
    this.sound[4] = new Audio("Assets/Sounds/Bug/Bastion.wav"); 
    this.sound[5] = new Audio("Assets/Sounds/Bug/Mite.wav");
    this.sound[6] = new Audio("Assets/Sounds/Bug/Spitter.wav");
    this.sound[7] = new Audio("Assets/Sounds/Bug/Slasher.wav");
    
    this.sound[8] = new Audio("Assets/Sounds/Control/Select All.wav");
    this.sound[9] = new Audio("Assets/Sounds/Control/Select Lord.wav");
    this.sound[10] = new Audio("Assets/Sounds/Control/Select Military.wav");
    
    this.sound[11] = new Audio("Assets/Sounds/Control/Left Click.wav");
    this.sound[12] = new Audio("Assets/Sounds/Control/Right Click.wav");
    
    this.sound[13] = new Audio("Assets/Sounds/Bug/Bug Death.wav");
    this.sound[14] = new Audio("Assets/Sounds/Bug/Bug Spit.wav");
    
    
    this.sound[15] = new Audio("Assets/Sounds/Robot/Explosion.wav");
    this.sound[16] = new Audio("Assets/Sounds/Robot/Laser.wav");
    
    this.sound[15] = new Audio("Assets/Sounds/Robot/Explosion.wav");
    this.sound[16] = new Audio("Assets/Sounds/Robot/Laser.wav");
    
    this.sound[17] = new Audio("Assets/Music/Defeat.wav");
    this.sound[18] = new Audio("Assets/Music/Victory.wav");
    this.sound[18].volume = 0.2;
    
    
};

SoundSystem.prototype.playSound = function(id) {
    if (this.muted===false) {
        this.sound[id].play();
    }
    
};


