
define([
	'JSClass',
	'lodash',
	'classes/Slider/effects/Slide',
	'classes/Slider/effects/Fade'
], function (JSClass, _, Slide, Fade) {

	return JSClass({

		el: null,
		config: {
			images: [],
			mode: 'auto',
			swipeSpeed: 500,
			swipeDelay: 3000
		},
		effectsMap: {
			'slide-effect': Slide,
			'fade-effect': Fade
		},
		effect: null,
		activeImageIndex: 0,
		lockSwipe: false,
		autoSwipingIntervalId: null,

		fingerCount: 0,
		startX: 0,
		startY: 0,
		curX: 0,
		curY: 0,
		minLength: 72, // минимальное растояние для swipe
		swipeLength: 0,
		swipeAngle: null,
		swipeDirection: null,

		// *** инициализация *******************************************************************************************
		create: function (elementId, config) {

			this.config = _.defaults(config || {}, this.config);

			this.el = document.getElementById(elementId);

			// Опеределяем еффект по классу
			var sliderClasses = this.el.className.split(' ');

			for(var effectName in this.effectsMap) {
				if (_.indexOf(sliderClasses, effectName) != -1) {
					this.effect = new this.effectsMap[effectName](this.config.swipeDelay, this.config.swipeSpeed);
					break;
				}
			}

			this.delegateEvents();
			this.renderImages();
			this.autoSwiping();
		},

		renderImages: function() {

			_.each(this.config.images, _.bind(function(imageUrl) {
				var img = document.createElement('img');
				img.src = imageUrl;

				this.el.appendChild(img);
			}, this));

			var activeImage = this.getActiveImage();
			activeImage.className = 'active';
		},

		delegateEvents: function() {

			// touch events
			this.el.addEventListener('touchstart', _.bind(this.touchStart, this), false);
			this.el.addEventListener('touchend', _.bind(this.touchEnd, this), false);
			this.el.addEventListener('touchmove', _.bind(this.touchMove, this), false);
			this.el.addEventListener('touchcancel', _.bind(this.touchCancel, this), false);

			// mouse events
			this.el.addEventListener('mousedown', _.bind(this.mouseStart, this), false);
			this.el.addEventListener('mouseup', _.bind(this.mouseEnd, this), false);
			this.el.addEventListener('mousemove', _.bind(this.mouseMove, this), false);
		},

		autoSwiping: function() {
			if (this.config.mode != 'auto' && this.config.mode != 'automanual') {
				return;
			}

			this.autoSwipingIntervalId = setInterval(_.bind(function() {
				if (!this.lockSwipe) {
					this.nextSlide();
				}
			}, this), this.config.swipeDelay);
		},

		// функция для того, чтоб если в режиме automanual пользовательно перелестнул слайд,
		// то слайд продержался нужное время
		updateAutoSwiping: function() {
			this.autoSwipingIntervalId && clearInterval(this.autoSwipingIntervalId);
			this.autoSwiping();
		},

		// *** Обработка touch событий *********************************************************************************
		touchStart: function(e) {
			e.preventDefault();

			this.fingerCount = e.touches.length;

			if (this.fingerCount == 1) {
				this.startX = e.touches[0].pageX;
				this.startY = e.touches[0].pageY;
			} else {
				this.touchCancel(e);
			}
		},
		touchMove: function(e) {
			e.preventDefault();

			if (e.touches.length == 1) {
				this.curX = e.touches[0].pageX;
				this.curY = e.touches[0].pageY;
			} else {
				this.touchCancel(e);
			}
		},
		touchEnd: function(e) {
			e.preventDefault();

			if (this.fingerCount == 1 && this.curX != 0 ) {

				this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX, 2) + Math.pow(this.curY - this.startY, 2)));

				if (this.swipeLength >= this.minLength) {
					this.calculateAngle();
					this.determineSwipeDirection();
					this.handleSwipe();
					this.touchCancel(e);
				} else {
					this.touchCancel(e);
				}
			} else {
				this.touchCancel(e);
			}
		},
		touchCancel: function() {
			this.fingerCount = 0;
			this.startX = 0;
			this.startY = 0;
			this.curX = 0;
			this.curY = 0;
			this.swipeLength = 0;
			this.swipeAngle = null;
			this.swipeDirection = null;
		},

		mouseStart: function(e) {
			e.preventDefault();

			this.startX = e.pageX;
			this.startY = e.pageY;
		},
		mouseMove: function(e) {
			e.preventDefault();

			this.curX = e.pageX;
			this.curY = e.pageY;
		},
		mouseEnd: function(e) {
			e.preventDefault();

			if (this.curX != 0 ) {

				this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX, 2) + Math.pow(this.curY - this.startY, 2)));

				if (this.swipeLength >= this.minLength) {
					this.calculateAngle();
					this.determineSwipeDirection();
					this.handleSwipe();
					this.touchCancel(e);
				} else {
					this.touchCancel(e);
				}
			} else {
				this.touchCancel(e);
			}
		},

		calculateAngle: function() {
			var X = this.startX - this.curX;
			var Y = this.curY - this.startY;
			var r = Math.atan2(Y, X);
			this.swipeAngle = Math.round(r * 180 / Math.PI);

			if (this.swipeAngle < 0) {
				this.swipeAngle = 360 - Math.abs(this.swipeAngle);
			}
		},
		determineSwipeDirection: function() {
			if ((this.swipeAngle <= 45) && (this.swipeAngle >= 0)) {
				this.swipeDirection = 'left';
			} else if ((this.swipeAngle <= 360) && (this.swipeAngle >= 315)) {
				this.swipeDirection = 'left';
			} else if ((this.swipeAngle >= 135) && (this.swipeAngle <= 225)) {
				this.swipeDirection = 'right';
			} else if ((this.swipeAngle > 45) && (this.swipeAngle < 135)) {
				this.swipeDirection = 'down';
			} else {
				this.swipeDirection = 'up';
			}
		},
		handleSwipe: function() {
			if (this.config.mode != 'manual' && this.config.mode != 'automanual') {
				return;
			}

			if (this.lockSwipe) {
				return;
			}

			this.lockSwipe = true;

			switch(this.swipeDirection) {
				case 'left':
					this.nextSlide();
					break;
				case 'right':
					this.prevSlide();
					break;
			}

			this.unlockSwipe();
			this.updateAutoSwiping();
		},

		// *************************************************************************************************************

		getImageObjs: function() {
			return this.el.getElementsByTagName('img');
		},
		getImageByIndex: function(index) {
			return this.getImageObjs()[index];
		},
		getActiveImage: function() {
			return this.getImageByIndex(this.activeImageIndex);
		},
		getNextImageIndex: function() {
			return (this.activeImageIndex + 1 >= this.config.images.length) ? 0 : this.activeImageIndex + 1;
		},
		getPrevImageIndex: function() {
			return (this.activeImageIndex - 1 < 0) ? this.config.images.length - 1 : this.activeImageIndex - 1;
		},

		nextSlide: function() {
			var activeImage = this.getActiveImage(),
				nextImageIndex = this.getNextImageIndex(),
				nextImage = this.getImageByIndex(nextImageIndex);

			this.effect.next(activeImage, nextImage);

			this.activeImageIndex = nextImageIndex;
		},
		prevSlide: function() {
			var activeImage = this.getActiveImage(),
				prevImageIndex = this.getPrevImageIndex(),
				prevImage = this.getImageByIndex(prevImageIndex);

			this.effect.prev(activeImage, prevImage);

			this.activeImageIndex = prevImageIndex;
		},
		unlockSwipe: function() {
			_.delay(_.bind(function() {
				this.lockSwipe = false;
			}, this), this.effect.animationPreDelay + this.effect.swipeSpeed);
		}
	});

});