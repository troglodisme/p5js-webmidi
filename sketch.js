/*
  Slider to Midi CC example
*/

let myOutput; 
let ccSlider1, ccSlider2, ccSlider3; 

function setup() {
  createCanvas(400, 300);

  // MIDI 
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

  ccSlider1 = createSlider(0, 127, 63);
  ccSlider1.position(10, 10);
  ccSlider1.style('width', '380px');
  ccSlider1.input(function() { 
    sendMidiControlChange(1, ccSlider1.value()); 
  });

  ccSlider2 = createSlider(0, 127, 63);
  ccSlider2.position(10, 50);
  ccSlider2.style('width', '380px');
  ccSlider2.input(function() { 
    sendMidiControlChange(2, ccSlider2.value()); 
  });

  ccSlider3 = createSlider(0, 127, 63);
  ccSlider3.position(10, 90);
  ccSlider3.style('width', '380px');
  ccSlider3.input(function() { 
    sendMidiControlChange(3, ccSlider3.value()); 
  });
}


function draw() {
  background(0, 0, 255);
  textFont('monospace');
  textSize('16');

  fill(255);
  text('CC1 Value: ' + ccSlider1.value(), 20, 35);
  text('CC2 Value: ' + ccSlider2.value(), 20, 75);
  text('CC3 Value: ' + ccSlider3.value(), 20, 115);
}

function sendMidiControlChange(ccNumber, ccValue) {
  
  if (myOutput) {
    myOutput.sendControlChange(ccNumber, ccValue); // Send CC number with value]
    console.log(ccNumber, ccValue);

  }
}
