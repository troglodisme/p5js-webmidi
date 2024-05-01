/*

  Buttons, sliders and hand pose to web midi example in p5.js

*/


let handpose;
let video;
let hands = [];
let myOutput;

let midiButtons = [];
let buttonStates = []; // Array to store states of each button

let ccSlider1, ccSlider2, ccSlider3;
let sendMidiToggleButton; // Button to toggle MIDI sending
let ccSelect; // Dropdown for selecting CC number

let isHandSendingMidi = false;
let handFinger1 = 1; // Default CC number for hand tracking

function preload() {
  // Load the handpose model.
  handpose = ml5.handpose();
}

function setup() {
  createCanvas(800, 800);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handpose.detectStart(video, gotHands);

  WebMidi.enable()
    .then(onEnabled)
    .catch(function (err) {
      alert(err);
    });

  sendMidiToggleButton = createButton('OFF');
  sendMidiToggleButton.position(630, 10);
  sendMidiToggleButton.size(100, 60);
  sendMidiToggleButton.mousePressed(toggleSendMidi);

  let buttonSize = 60;
  let startX = 10;
  let startY = 10;
  let padding = 10;
  let baseCC = 10;

  for (let i = 0; i < 3; i++) {
    let x = startX + (i % 3) * (buttonSize + padding);
    let y = startY + Math.floor(i / 3) * (buttonSize + padding);
    let button = createButton(`CC ${baseCC + i}`);
    button.position(x, y);
    button.size(buttonSize, buttonSize);
    button.mousePressed(() => toggleButton(i, baseCC + i));
    midiButtons.push(button);
    buttonStates[i] = 0;
  }

  ccSlider1 = createSlider(0, 127, 0);
  ccSlider2 = createSlider(0, 127, 0);
  ccSlider3 = createSlider(0, 127, 0);
  ccSlider1.position(230, 30).size(100).input(() => sendMidiControlChange(1, ccSlider1.value()));
  ccSlider2.position(360, 30).size(100).input(() => sendMidiControlChange(2, ccSlider2.value()));
  ccSlider3.position(490, 30).size(100).input(() => sendMidiControlChange(3, ccSlider3.value()));

  // Dropdown to select CC number for hand tracking
  ccSelect = createSelect();
  ccSelect.position(645, 80);
  for (let i = 1; i <= 20; i++) {
    ccSelect.option(`CC ${i}`, i);
  }
  ccSelect.changed(() => handFinger1 = parseInt(ccSelect.value()));
}

function draw() {
  background(0);
  fill(255);
  text(`[CC 1]  ${ccSlider1.value()}`, 240, 70);
  text(`[CC 2]  ${ccSlider2.value()}`, 360, 70);
  text(`[CC 3]  ${ccSlider3.value()}`, 500, 70);
  text(`[Thumb Midi Status]: ${handFinger1}`, 620, 120);

  hands.forEach(hand => {
    hand.keypoints.forEach((keypoint, j) => {
      fill(isHandSendingMidi ? 0 : 255, 0, isHandSendingMidi ? 255 : 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 20);
      if (j === 4 && isHandSendingMidi) {
        sendMidiControlChange(handFinger1, Math.floor((keypoint.x / width) * 127));
      }
    });
  });
}


function gotHands(results) {
  hands = results;
}

function sendMidiControlChange(ccNumber, ccValue) {
  if (myOutput) {
    myOutput.sendControlChange(ccNumber, ccValue); // Send CC number with value
    console.log(ccNumber, ccValue);
  }
}

function toggleButton(index, ccNumber) {
  buttonStates[index] = buttonStates[index] === 0 ? 127 : 0;
  sendMidiControlChange(ccNumber, buttonStates[index]);
  console.log('Button', index, 'CC', ccNumber, 'State', buttonStates[index]);
}

function toggleSendMidi() {
  isHandSendingMidi = !isHandSendingMidi; // Toggle the state of MIDI sending
  if (isHandSendingMidi) {
    console.log("Sending MIDI");
    sendMidiToggleButton.elt.innerText = 'ON'; // Change button text using JavaScript
  } else {
    console.log("Not sending MIDI");
    sendMidiToggleButton.elt.innerText = 'OFF'; // Change button text using JavaScript
  }
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
}
