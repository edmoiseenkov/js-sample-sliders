
define([
	'classes/Slider/effects/Animation'
], function (Animation) {

	return Animation.extend({
		next: function(activeImage, nextImage) {
			this.fade(activeImage, nextImage);
		},
		prev: function(activeImage, prevImage) {
			this.fade(activeImage, prevImage);
		},

		fade: function(imageOld, imageNew) {
			imageOld.style.transition = this.swipeSpeedMilliseconds + 's';
			imageNew.style.transition = this.swipeSpeedMilliseconds + 's';

			imageOld.className = '';
			imageNew.className = 'active';

			this.resetImagesTransition([imageOld, imageNew]);
		}
	});

});