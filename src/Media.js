define([
	"skylark-widgets-base/Widget",
	"./medias"
],function(Widget,medias){
	"use strict";

	/**
	 * Media element can be used to play media content.
	 *
	 * Should be used as a base for other multimedia elements like audio and video.
	 *
	 * @class Media
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */

	var Media = Widget.inherit({

		_construct : function (parent, type){
			Widget.prototype._construct.call(this, parent, "div");

			//Media
			this.media = document.createElement(type);
			this._elm.appendChild(this.media);
		},


		/**
		 * Set element Media volume.
		 * 
		 * @method setVolume
		 * @param {Number} volume Volume level from 0 to 1.
		 */
		setVolume : function(volume) {
			this.media.volume = volume;	
		},

		/**
		 * Set video to be played.
		 *
		 * @method setValue
		 * @param {Video} value Video resource to play.
		 */
		setValue : function(video) {
			this.media.src = video.data;
		},

		/**
		 * Set URL of the media to play.
		 *
		 * @method setURL
		 * @param {String} value Media url.
		 */
		setURL : function(value){
			this.media.src = value;
		},

		/**
		 * Set the playback time.
		 *
		 * @method setTime
		 * @param {Number} time Time to be set.
		 */
		setTime : function(time) {
			this.media.currentTime = time;
		},

		/**
		 * Set autoplay mode.
		 * 
		 * @method setAutoplay
		 * @param {Boolean} value If true the media starts playing automatically.
		 */
		setAutoplay : function(value) {
			this.media.autoplay = value;
		},

		/**
		 * Check if the media is playing.
		 * 
		 * @method isPlaying
		 * @return {Boolean} True if the media is playing.
		 */
		isPlaying : function(value) {
			return !this.media.paused;
		},

		/**
		 * Set loop mode.
		 * 
		 * @method setLoop
		 * @param {Boolean} value If true the media plays in loop.
		 */
		setLoop : function(value){
			this.media.loop = value;
		},

		/**
		 * Set playback rate.
		 * 
		 * @method setPlaybackRate
		 * @param {Number} setPlaybackRate The velocity of playback.
		 */
		setPlaybackRate : function(playbackRate) {
			this.media.playbackRate = playbackRate;
		},

		/**
		 * Play media playback.
		 * 
		 * @method play
		 */
		play : function() {
			this.media.play();
		},

		/**
		 * Stop media playback.
		 * 
		 * @method stop
		 */
		stop : function(){
			this.media.currentTime = 0;
			this.media.pause();
		},

		/**
		 * Pause media.
		 * 
		 * @method pause
		 */
		pause : function(){
			this.media.pause();
		},

		_updateSize : function() {
			Widget.prototype._updateSize.call(this);

			this.media.style.width = this.size.x + "px";
			this.media.style.height = this.size.y + "px";
		}
	});


	return medias.Media = Media;
});