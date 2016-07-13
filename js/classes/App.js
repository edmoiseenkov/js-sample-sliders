
define([
	'JSClass',
	'classes/Slider/Slider'
], function (JSClass, Slider) {

	return JSClass({
		run: function() {

			var images = [
					'./img/1.jpg',
					'./img/2.jpg',
					'./img/3.jpg',
					'./img/4.jpg'
				];

			var slider1 = new Slider('slider1', {
				images: images,
				mode: 'automanual',
				swipeSpeed: 500,
				swipeDelay: 3000
			});

			var slider2 = new Slider('slider2', {
				images: images,
				mode: 'manual',
				swipeSpeed: 1000,
				swipeDelay: 3000
			});
		}
	});

});