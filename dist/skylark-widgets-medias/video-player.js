/**
 * skylark-widgets-medias - The skylark media widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-medias/
 * @license MIT
 */
define(["./medias","./media"],function(i,e){"use strict";var t=Media.inherit({_construct:function(i){Media.prototype._construct.call(this,i,"video"),this.media.playbackRate=1,this.media.loop=!0,this.media.volume=0,this.media.autoplay=!0}});return i.VideoPlayer=t});
//# sourceMappingURL=sourcemaps/video-player.js.map
