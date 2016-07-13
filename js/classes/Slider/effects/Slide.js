
define([
	'lodash',
	'classes/Slider/effects/Animation'
], function (_, Animation) {

	return Animation.extend({

		next: function(activeImage, nextImage) {

			nextImage.className = 'slide-right';

			_.delay(_.bind(function() {
				activeImage.style.transition = this.swipeSpeedMilliseconds + 's';
				nextImage.style.transition = this.swipeSpeedMilliseconds + 's';

				activeImage.className = '';
				nextImage.className = 'active';

				this.resetImagesTransition([activeImage, nextImage]);

			}, this), this.animationPreDelay);
		},
		prev: function(activeImage, prevImage) {

			prevImage.className = '';

			_.delay(_.bind(function() {
				activeImage.style.transition = this.swipeSpeedMilliseconds + 's';
				prevImage.style.transition = this.swipeSpeedMilliseconds + 's';

				activeImage.className = 'slide-right';
				prevImage.className = 'active';

				this.resetImagesTransition([activeImage, prevImage]);

			}, this), this.animationPreDelay);
		}

	});

});