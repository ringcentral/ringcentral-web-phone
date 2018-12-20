
(function(root, mediaEngine) {
  rcWPLogdme("Start RingCentral WebPhone Media Extension");
  root.RCMediaEngine = mediaEngine();
  rcWPLogdme(root.RCMediaEngine.version);
  rcWPLogdme(root.RCMediaEngine.media.getRCSDP("originalSDP"));
  rcWPLogdme(root.RCMediaEngine.audioDevice.setPlayoutVolume(5));
  root.RCMediaEngine.release();
}(this, function() {
  rcWPLogdme("Set up RingCentral MediaEngine");	

  var version = "Media Engine V0.0.1";
  var media;
  var audioDevice;


  function MediaEngine() {
  	this.tag = "MediaEngine";
  	this.version = version;
  	rcWPLogdme(this.tag + " is created.");
  	this.media = media;
  	this.audioDevice = audioDevice;
  	this.release = MediaEngine._release;
  }

  media = {

  	getRCSDP: function(sdp) {
      return "rc sdp from " + sdp;
  	},

    onStats: async function(session, callback) {
    },

  	getStats: function(session, callback) {
  		
  	}

  }

  audioDevice = {
  	setPlayoutVolume: function(volume) {
  		return "set volume " + volume;
  	}
  }

  MediaEngine._release = function() {
  	rcWPLogdme("RingCentral MediaEngine is released.");
  }
  
  return new MediaEngine();
}))