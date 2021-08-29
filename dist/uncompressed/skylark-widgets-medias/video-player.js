define([
	"./medias",
	"./media"
],function(medias,media){
	"use strict";

	/**
	 * Video player element, based on the video tag.
	 *
	 * @class VideoPlayer
	 * @extends {Element}
	 * @param {Element} parent Parent element.
	 */
	var VideoPlayer = Media.inherit({

		_construct : function (parent){
			Media.prototype._construct.call(this, parent, "video");

			this.media.playbackRate = 1.0;
			this.media.loop = true;
			this.media.volume = 0.0;
			this.media.autoplay = true;
		}
	});

	return medias.VideoPlayer = VideoPlayer;
});