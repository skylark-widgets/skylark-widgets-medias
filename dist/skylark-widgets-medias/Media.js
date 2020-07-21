/**
 * skylark-widgets-medias - The skylark media widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-medias/
 * @license MIT
 */
define(["skylark-widgets-base/Widget","./medias"],function(t,i){"use strict";var e=t.inherit({_construct:function(i,e){t.prototype._construct.call(this,i,"div"),this.media=document.createElement(e),this._elm.appendChild(this.media)},setVolume:function(t){this.media.volume=t},setValue:function(t){this.media.src=t.data},setURL:function(t){this.media.src=t},setTime:function(t){this.media.currentTime=t},setAutoplay:function(t){this.media.autoplay=t},isPlaying:function(t){return!this.media.paused},setLoop:function(t){this.media.loop=t},setPlaybackRate:function(t){this.media.playbackRate=t},play:function(){this.media.play()},stop:function(){this.media.currentTime=0,this.media.pause()},pause:function(){this.media.pause()},_updateSize:function(){t.prototype._updateSize.call(this),this.media.style.width=this.size.x+"px",this.media.style.height=this.size.y+"px"}});return i.Media=e});
//# sourceMappingURL=sourcemaps/Media.js.map
