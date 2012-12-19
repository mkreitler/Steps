ig.module( 
	'game.smart-sound' 
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

SmartSound = ig.Class.extend({
  sound:        null,
  replayDelay:  0,
  lastPlayed:   -1,

  init: function(sound, replayDelay) {
    this.sound = sound;
    this.replayDelay = replayDelay;
  },

  reset: function() {
    this.lastPlayed = -1;
  },

  play: function() {
    if (this.sound) {
      var playTime = (new Date()).getTime();

      if (this.lastPlayed < 0 || (playTime - this.lastPlayed) * 0.001 > this.replayDelay) {
        this.lastPlayed = playTime;
        this.sound.play();
      }
    }
  },

  stop: function() {
    if (this.sound) {
      this.sound.stop();
    }
  },

  setVolume: function(volume) {
    if (this.sound) {
      this.sound.volume = volume;
    }
  }

});

});
