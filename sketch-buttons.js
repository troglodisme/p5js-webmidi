/*

  Buttons to Midi CC example

*/

let myOutput; 
let midiButtons = []; 
let buttonStates = []; // Array to store states of each button 

function setup() {
  createCanvas(400, 250); 

  // Enabling WebMIDI
  WebMidi
    .enable()
    .then(onEnabled)
    .catch(function(err) { alert(err); });
}

function onEnabled() {
  console.log("WebMIDI Enabled");

  WebMidi.inputs.forEach(input => {
    console.log("Input: ", input.manufacturer, input.name);
  });
  WebMidi.outputs.forEach(output => {
    console.log("Output: ", output.manufacturer, output.name);
  });

  myOutput = WebMidi.outputs[0];

  // Create a 3x3 grid of buttons for CC messages
  let buttonSize = 60;
  let startX = 10;
  let startY = 10; // start position for creating our buttons
  let padding = 10;
  let baseCC = 20; // Base CC number for buttons, we start counting from...

  for (let i = 0; i < 9; i++) {

    let x = startX + (i % 3) * (buttonSize + padding);
    let y = startY + Math.floor(i / 3) * (buttonSize + padding);
    let button = createButton(`CC ${baseCC + i}`);
    button.position(x, y);
    button.size(buttonSize, buttonSize);
    button.mousePressed(() => toggleButton(i, baseCC + i));
    midiButtons.push(button);
    buttonStates[i] = 0; // Initialize state to 0
    
  }
}

function draw() {
  background(0, 0, 255);
  textFont('monospace');
  textSize(16);

  fill(255);
  text("MIDI CC Button Panel", 10, 230); // Updated text to reflect button only setup
}

function sendMidiControlChange(ccNumber, ccValue) {
  if (myOutput) {
    myOutput.sendControlChange(ccNumber, ccValue);
    console.log('CC', ccNumber, 'Value', ccValue);
  }
}

function toggleButton(index, ccNumber) {
  // Toggle between sending 127 and 0
  buttonStates[index] = buttonStates[index] === 0 ? 127 : 0;
  sendMidiControlChange(ccNumber, buttonStates[index]);
  console.log('Button', index, 'CC', ccNumber, 'State', buttonStates[index]);
}
