/* 	
Charlie Roberts 2012 MIT License
Requires gibber.js and chord.js found in the Gibber download.

Usage (assume s is a sine oscillator that has the Gibber mod method) :
a = audioLib.Arp(s, "Cm7", 2, .25, "updown");
*/

(function myPlugin(){

function initPlugin(audioLib){
(function(audioLib){

function Arp(gen, notation, octave, beats, mode, mult) {
	this.speed = isNaN(beats) ? _4 : beats;
	this.mode = mode || "up";
	
	this.gen = gen,
	this.notation = notation || "Cm7",
	this.octave = (isNaN(octave)) ? 2 : octave,
	this.mult = mult || 1;
	
	var arr = [];
	for(var i = 0; i < this.mult; i++) {
		var tmp = Chord(this.notation, this.octave + i);
		arr = arr.concat(tmp);
	}
	
	this.freqs 		= this.modes[this.mode]( arr );
	this.original 	= this.freqs.slice(0);
	this.step 		= Step(this.freqs, this.speed);
	
	this.gen.mod("freq", this.step, "=");
	
	function bpmCallback() {
		var that = this;
		return function(percentageChangeForBPM) {
			that.speed *= percentageChangeForBPM
			that.step.stepLength = that.speed;
		}
	}
	
	if(this.usesBPM) {
		Gibber.registerObserver("bpm", bpmCallback.call(this));
	}
	
}

Arp.prototype = {
	modes : {
		up : function(array) {
			return array;
		},
		down : function(array) {
			return array.reverse();
		},
		updown : function(array) {
			var _tmp = array.slice(0);
			_tmp.reverse();
			return array.concat(_tmp);
		}
	},
	
	freqs: [],
	shuffle: function() { this.freqs.shuffle(); this.step.steps = this.freqs;},
	reset: function() { this.freqs = this.original.slice(0); this.step.steps = this.freqs; },
}

audioLib.Arpeggiator = Arp;
		
}(audioLib));
audioLib.plugins('Arpeggiator', myPlugin);
}

if (typeof audioLib === 'undefined' && typeof exports !== 'undefined'){
	exports.init = initPlugin;
} else {
	initPlugin(audioLib);
}

}());

function Arp(gen, notation, octave, beats, mode, mult) {
	return new audioLib.Arpeggiator(gen, notation, octave, beats, mode, mult);
}