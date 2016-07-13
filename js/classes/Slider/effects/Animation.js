
define([
	'JSClass',
	'lodash'
], function (JSClass, _) {

	return JSClass({

		swipeDelay: 0,
		swipeSpeed: 0,
		swipeSpeedMilliseconds: 0,

		animationPreDelay: 50,

		create: function (swipeDelay, swipeSpeed) {
			this.swipeDelay = swipeDelay;
			this.swipeSpeed = swipeSpeed;
			this.swipeSpeedMilliseconds = this.swipeSpeed / 1000;
		},
		next: function() {},
		prev: function() {},

		resetImagesTransition: function(images) {
			_.delay(function() {
				_.each(images, function(image) {
					image.style.transition = 'none';
				});
			}, this.swipeSpeed);
		}

	});

});