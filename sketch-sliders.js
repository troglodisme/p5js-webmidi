/*

  Slider to Midi CC example
  This can be used to control Ableton volume, or effects etc
  
  Want to make nicer sliders? Check this out https://www.gorillasun.de/blog/how-to-make-sliders-in-p5/
  
*/

let myOutput; 
let ccSlider1, ccSlider2, ccSlider3; 

function setup() {
  createCanvas(400, 200);

  // Enabling WebMIDI
  WebMidi
    .enable()
    .then(onEnabled)
    .catch(function(err) { alert(err); });
}

function onEnabled() {
  console.log("WebMIDI Enabled");

  WebMidi.inputs.forEach(function(input) {
    console.log("Input: ", input.manufacturer, input.name);
  });

  WebMidi.outputs.forEach(function(output) {
    console.log("Output: ", output.manufacturer, output.name);
  });

  myOutput = WebMidi.outputs[0];

  //slider 1
  ccSlider1 = createSlider(0, 127, 0);
  ccSlider1.position(10, 20);
  ccSlider1.style('width', '380px');

  ccSlider1.input(function() { 
    sendMidiControlChange(1, ccSlider1.value()); 
  });

  //slider 2
  ccSlider2 = createSlider(0, 127, 0);
  ccSlider2.position(10, 70);
  ccSlider2.style('width', '380px');
  ccSlider2.input(function() { 
    sendMidiControlChange(2, ccSlider2.value()); 
  });

  //slider 3
  ccSlider3 = createSlider(0, 127, 0);
  ccSlider3.position(10, 120);
  ccSlider3.style('width', '380px');
  ccSlider3.input(function() { 
    sendMidiControlChange(3, ccSlider3.value()); 
  });
}


function draw() {
  background(0);
  fill(255);
  text('[CC 1]  ' + ccSlider1.value(), 20, 60);
  text('[CC 2]  ' + ccSlider2.value(), 20, 105);
  text('[CC 3]  ' + ccSlider3.value(), 20, 160);
}

//function to send midi CC (you can connect it to anything else, not just sliders!)
function sendMidiControlChange(ccNumber, ccValue) {
  
  if (myOutput) {
    myOutput.sendControlChange(ccNumber, ccValue); // Send CC number and value
    console.log(ccNumber, ccValue);
  }

}
