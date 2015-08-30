/* Contents of this file handle all the general purpose program
 * functions such as loading, running and resetting.
 */
// INITIALISATION
function loadProgram() {
    var program = new Program("Canvas");
    
    setInterval(function(){ program.update();},program.refreshDelay);
    //program.audio.playMusic();
    //program.simulation.togglePause();
}
// OBJECT CLASS
function Program(canvasName) {
    this.refreshDelay = 50;

    this.audio = new SoundSystem();
    this.simulation = new Simulation(this.audio);
    this.control = new Control(canvasName, this.simulation, this.audio);
    this.display = new Display(canvasName, this.simulation, this.control);
}
//METHODS
Program.prototype.update = function() {
    this.control.update();
    this.simulation.update();
    this.display.update();   
};


