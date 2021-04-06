define([
	"skylark-domx-eventer",
	"skylark-widgets-base/Widget",
	"./medias"
],function(eventer, Widget,medias){
	"use strict";

	var _context;

	var AudioContext = {

		getContext: function () {

			if ( _context === undefined ) {

				_context = new ( window.AudioContext || window.webkitAudioContext )();

			}

			return _context;

		},

		setContext: function ( value ) {

			_context = value;

		}

	};


	var AudioPlayer = Widget.inherit({

		_construct : function (parent){
			Widget.prototype._construct.call(this, parent, "div");

			this._elm.style.overflow = "visible";

			var self = this;

			//WebAudio context
			this.context = AudioContext.getContext();

			//Timer
			this.timer = document.createElement("div");
			this.timer.style.position = "absolute";
			this.timer.style.display = "flex";
			this.timer.style.justifyContent = "center";
			this.timer.style.alignItems = "center";
			this.timer.style.width = "40px";
			this.timer.style.height = "100%";
			this.timer.style.right = "0px";
			this._elm.appendChild(this.timer);

			//Text
			this.timerText = document.createTextNode("00:00");
			this.timer.appendChild(this.timerText);

			//Button
			this.button = document.createElement("button");
			this.button.style.position = "absolute";
			this.button.style.cursor = "pointer";
			this.button.style.background = "transparent";
			this.button.style.border = "none";
			this.button.style.outline = "none";
			this._elm.appendChild(this.button);
			this.button.onclick = function() {
				self.toggle();
			};

			//Icon
			this.icon = document.createElement("img");
			this.icon.style.position = "absolute";
			this.icon.style.left = "15%";
			this.icon.style.top = "15%";
			this.icon.style.width = "70%";
			this.icon.style.height = "70%";
			this.icon.src = Global.FILE_PATH + "icons/misc/play.png";
			this.button.appendChild(this.icon);

			//Track
			this.track = document.createElement("div");
			this.track.style.position = "absolute";
			this.track.style.backgroundColor = Editor.theme.audioTrack;
			this.track.style.cursor = "pointer";
			this._elm.appendChild(this.track);

			//Progress
			this.progress = document.createElement("div");
			this.progress.style.pointerEvents = "none";
			this.progress.style.position = "absolute";
			this.progress.style.backgroundColor = Editor.theme.audioProgress;
			this.progress.style.height = "100%";
			this.track.appendChild(this.progress);

			//Scrubber
			this.scrubber = document.createElement("div");
			this.scrubber.style.position = "absolute";
			this.scrubber.style.backgroundColor = Editor.theme.audioScrubber;
			this.scrubber.style.cursor = "pointer";
			this.scrubber.style.width = "6px";
			this.track.appendChild(this.scrubber);

			//Audio source and buffer
			this.buffer = null;
			this.source = null;

			//Playback control
			this.time = 0;
			this.startTime = 0;
			this.playing = false;
			this.loop = false;

			//Drag control
			this.seekStart = 0;
			this.seekTime = 0;
			this.seekProgress = 0;
			this.dragging = false;

			//Event manager
			//this.manager = new EventManager();
			//this.manager.add(window, "mousemove", function(event)
			eventer.on(window, "mousemove", function(event)
			{
				self.seekProgress = (event.pageX - self.seekStart) / (self.track.offsetWidth);
				self.seekProgress += self.seekTime / self.buffer.duration;

				if(self.seekProgress < 0)
				{
					self.seekProgress = 0;
				}
				else if(self.seekProgress > 1)
				{
					self.seekProgress = 1;
				}

				self.progress.style.width = (self.seekProgress * 100) + "%";
				self.scrubber.style.left = self.progress.style.width;
			});

			//this.manager.add(window, "mouseup", function(event)
			eventer.on(window, "mouseup", function(event)
			{	
				self.dragging = false;
				self.time = self.seekProgress * self.buffer.duration;

				if(self.playing)
				{
					self.play(self.time);
				}

				//self.manager.destroy();
			});

			this.scrubber.onmousedown = function(event) {
				self.seekStart = event.pageX;
				self.seekTime = self.time;
				self.dragging = true;
				self.manager.create();

				event.stopPropagation();
			};

			this.track.onmousedown = function(event) {
				var progress = event.layerX / this.offsetWidth;

				self.seekProgress = progress;
				self.time = progress * self.buffer.duration;

				self.progress.style.width = (self.seekProgress * 100) + "%";
				self.scrubber.style.left = self.progress.style.width;

				if(self.playing)
				{
					self.play(self.time);
				}

				self.scrubber.onmousedown(event);
			};

			//Update elements
			function draw() {
				if(self.playing) {
					self.time = self.context.currentTime - self.startTime;

					var seconds = Math.round(self.time % 60);
					if(seconds < 10)
					{
						seconds = "0" + seconds;
					}

					var minutes = Math.round(self.time / 60);
					if(minutes < 10) {
						minutes = "0" + minutes;
					}
					
					self.timerText.data = minutes + ":" + seconds;

					if(self.buffer !== null) {
						if(self.time >= self.buffer.duration)
						{
							self.stop();
						}

						var progress = (self.time / self.buffer.duration) * 100;

						if(!self.dragging)
						{
							self.progress.style.width = progress + "%";
							self.scrubber.style.left = progress + "%";
						}
					}
				}

				if(self.parent !== null) {
					requestAnimationFrame(draw);
				}
			}
			draw();
		},

		//Decode audio
		setAudioBuffer : function(buffer, onLoad) {
			var self = this;

			this.context.decodeAudioData(buffer.slice(0), function(buffer) 	{
				self.buffer = buffer;

				if(onLoad !== undefined) {
					onLoad(buffer);
				}
			}.bind(this));
		},

		//Connect audio source
		connect : function() {
			if(this.playing)
			{
				this.pause();
			}

			this.source = this.context.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(this.context.destination);
		},

		//Disconnect source
		disconnect : function() {
			this.source.disconnect();
		},

		//Play audio
		play : function(time){
			this.connect();

			if(time !== undefined)
			{
				this.time = time;
			}

			this.source.loop = this.loop;
			this.startTime = this.context.currentTime - this.time;
			this.source.start(this.context.currentTime, this.time);
			this.playing = true;

			this.icon.src = Global.FILE_PATH + "icons/misc/pause.png";
		},

		//Pause audio
		pause : function() 	{
			if(this.playing)
			{
				this.playing = false;
				this.source.stop();
				this.time = this.context.currentTime - this.startTime;

				this.icon.src = Global.FILE_PATH + "icons/misc/play.png";
			}
		},

		//Stop audio playback
		stop : function() {	
			if(this.playing) {
				this.source.stop();
				this.time = 0;
				this.playing = false;

				this.icon.src = Global.FILE_PATH + "icons/misc/play.png";
			}
		},

		//Seek time
		seek : function(time) {
			if(this.playing) {
				this.play(time);
			} else 	{
				this.time = time;
			}
		},

		//Toggle play/pause
		toggle : function() {
			if(!this.playing) {
				this.play();
			} else {
				this.pause();
			}
		},

		destroy : function() {
			try {
				this.disconnect();
				this.stop();
			}catch(e){}

			Widget.prototype.destroy.call(this);
		},

		_updateSize : function() {
			Widget.prototype._updateSize.call(this);

			//Button
			this.button.style.width = this._elm.style.height;
			this.button.style.height = this._elm.style.height;

			//Track
			this.track.style.top = (this.size.y * 0.25) + "px";
			this.track.style.left = (this.size.y * 1.05) + "px";
			this.track.style.width = (this.size.x - this.size.y * 1.5 - 35) + "px";
			this.track.style.height = (this.size.y * 0.5) + "px";

			//Scrubber
			this.scrubber.style.height = (this.size.y * 0.8) + "px";
			this.scrubber.style.top = (-this.size.y * 0.15) + "px";
		}
	});


	return medias.AudioPlayer = AudioPlayer;

});