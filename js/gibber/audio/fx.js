(function() {
  "use strict"
  
  Gibber.FX = {}

  var types = [
    'Reverb',
    'Delay',
    'Flanger',
    'Vibrato',
    'Distortion',
    'Biquad',
    'Filter24',    
    [ 'RingModulation', 'RingMod' ],
    [ 'BufferShuffler', 'Schizo' ],
    [ 'Decimator', 'Crush' ],
  ],
  _mappingProperties = {
    Reverb: {
      roomSize: {
        min: .5, max: .995,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      damping: {
        min: 0, max: 1,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
    },
    Delay : {
      feedback: {
        min: 0, max: 1,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      time : {
        min: 50, max: 88200, // TODO: Fix... problem with loading order, should be : Gibberish.context.sampleRate * 2,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    RingMod : {
      frequency : {
        min: 20, max: 3000,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      amp: {
        min: 0, max: 1,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    Flanger : {
      rate : {
        min: .01, max: 20,
        output: Gibber.LOGARITHMIC,
        timescale: 'audio',
      },
      amount: {
        min: 25, max: 300,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      feedback: {
        min: 0, max: .99,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    Vibrato : {
      rate : {
        min: .2, max: 8,
        output: Gibber.LOGARITHMIC,
        timescale: 'audio',
      },
      amount: {
        min: 25, max: 300,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      feedback: {
        min: .45, max: .55,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    Filter24 : {
      cutoff : {
        min: 0, max: .7,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      resonance: {
        min: 0, max: 5.5,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    LPF : {
      cutoff : {
        min: 0.05, max: .7,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      resonance: {
        min: 0, max: 5.5,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    HPF : {
      cutoff : {
        min: 0, max: .7,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      resonance: {
        min: 0, max: 5.5,
        output: Gibber.LINEAR,
        timescale: 'audio',
      }
    },
    Crush : {
      bitDepth : {
        min: 1, max: 16,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      sampleRate: {
        min: 0, max: 1,
        output: Gibber.LINEAR,
        timescale: 'audio',
      },
      amp: {
        min: 0, max: 1,
        output: Gibber.LOGARITHMIC,
        timescale: 'audio',
      },
    },
    Schizo: {
      amp: {
        min: 0, max: 1,
        output: Gibber.LOGARITHMIC,
        timescale: 'audio',
      },
    }
  };

  for( var i = 0; i < types.length; i++ ) {
  
    (function() {
      var type = Array.isArray( types[ i ] ) ? types[ i ][ 0 ] : types[ i ],
          name = Array.isArray( types[ i ] ) ? types[ i ][ 1 ] : types[ i ]
     
      Gibber.FX[ name ] = function() {
        var args = Array.prototype.slice.call(arguments, 0),
            obj = Gibber.processArguments( arguments, name )
        
        if( typeof obj !== 'undefined' && obj[0] ) {
          if( typeof obj[0].length !== 'undefined') {
            // multiple arguments passed as an array
            obj.unshift(0) // insert a 0 to be a placeholder for input
            obj = Gibber.construct( Gibberish[ type ], obj )
          }else{
            // a dictionary is passed to constructor
            obj =  new Gibberish[ type ]( obj[0] )
          }
        }else{
          // nothing is passed
          obj = new Gibberish[ type ]()
        }
      
        obj.type = 'FX'
      
        $.extend( true, obj, Gibber.ugen )
        
        // TODO: this is a horrible hack for a bug in the delay fx. please fix, although I guess it won't hurt too much if it stays.
        if( obj.time ) obj.time = Gibber.Clock.time( obj.time )
        
        Gibber.createMappingAbstractions( obj, _mappingProperties[ name ] )
 
        return obj
      }
    })()
  }
  
  Gibber.FX.Chorus = function( rate, amount ) {
  	var _rate = rate || 1, 
    	_amount = amount || ms( 1 ),
  	  that = Flanger( rate, amount, .5, Math.round( 44.1 * 30 ) )
      
  	that.name = 'Chorus'
    that.type = 'FX'
    
  	return that
  }
  
  Gibber.FX.LPF = function( cutoff, resonance ) {
  	var that = Filter24( cutoff, resonance, true )
    
  	that.name = 'LPF'
    that.type = 'FX'
    
  	return that
  }
  
  Gibber.FX.HPF = function( cutoff, resonance ) {
  	var that = Filter24( cutoff, resonance, false )
    
    that.isLowPass = false
  	that.name = 'HPF'
    that.type = 'FX'
    
  	return that
  }
  
  Gibber.Presets.Reverb = {
  	space : {
  		roomSize:.99,
  		damping:.23,
  		wet:.75,
  		dry:.25,
  	},
    small : {
      roomSize:.6,
      damping:.75,
      wet:.15,
      dry:.85,
    },
    medium: {
      roomSize:.8,
      damping:.5,
      wet:.35,
      dry:.65,
    },
    large: {
      roomSize:.85,
      damping:.3,
      wet:.55,
      dry:.45,
    }
  }
})()