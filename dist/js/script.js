// Hello World!

///////////////////////////////////////////////////////////////////////////////////////////

/* JS Media Queries (checks window resizing and runs funcs on breakpoints)
	Useful output - jsMediaQueries.stateIndex
	Params {obj}:
		mobile - some modules use this variable to check mobile or desktop view, make sure it matches with CSS.
		breakpoints - there is 1 more index than number of breakpoints (from 0px to 1st breakpoint)
*/
// @ @include('front/js_media_queries.js')
// jsMediaQueries.init({
// 	mobile: 768,
// 	breakpoints: {
// 		568: () => {},
// 		768: () => {
// 			// header.mobileViewService(); // this function makes header work properly
// 		}, 
// 		1228: () => {
// 			// gridSlider.buildSlides();
// 		}
// 	}
// })

///////////////////////////////////////////////////////////////////////////////////////////

/* Scroll lock (prevents window scrolling with menu, modals, etc.).
	By default script will find all body.children and set padding-right to them.
	If you want to add more items to list (if position: fixed / absolute), 
	add 'scroll-lock-item' class to them. They will get a margin-right property.
	Use: 
		scrollLock.lock()
		scrollLock.unlock( #timeout# )
*/
const scrollLock = {
	lockedClassName: '_locked',
	defaultItems: document.body.children,
	specialItems: document.querySelectorAll('.scroll-lock-item'),
	lock: function() {
		if (document.body.classList.contains(this.lockedClassName)) return;
		this.scrollbarWidth = window.innerWidth - document.body.offsetWidth;
		let that = this;
		function f(items, prop) {
			for (let i = 0; i < items.length; i++) {
				items[i][prop] = parseFloat(getComputedStyle(items[i])[prop]);
				items[i].style[prop] = items[i][prop] + that.scrollbarWidth + 'px';
			}
		}
		f(this.defaultItems, 'paddingRight');
		f(this.specialItems, 'marginRight');
		document.body.classList.add(this.lockedClassName);
	},
	unlock: function(timeout = 0) {
		let that = this;
		setTimeout(() => {
			function f(items, prop) {
				for (let i = 0; i < items.length; i++) {
					items[i].style[prop] = '';
				}
			}
			f(this.defaultItems, 'paddingRight');
			f(this.specialItems, 'marginRight');
			document.body.classList.remove(that.lockedClassName);
		}, timeout);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

/* Transition lock (prevents double-clicking on transitions, e.g. when menu slides)
	Use:
		if (transitionLock.check( #timeout# )) return;
*/
const transitionLock = {
	locked: false,
	check: function(timeout = 0) {
		let that = this,
		    result = this.locked;
		if (that.locked == false) {
			that.locked = true;
			setTimeout(function(){
				that.locked = false;
			}, timeout);
		}
		return result;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

/* Header
	Set transition timeout in CSS only
	Params {obj}: (defaults = false)
	- menu - add menu block
	- submenu - add submenu block
	- hidingHeader - add hidingHeader block
*/
// @ @include('front/header.js')
// header.init({
// 	menu: true,
// 	// submenu: true,
// 	hidingHeader: true
// })

///////////////////////////////////////////////////////////////////////////////////////////

/* Modal window
	Set transition timeout in CSS only
	Params {obj}: 
	- elem - element name (default = 'modal'),
	- linkName - modal link name (default = 'modal-link')
	- on: {'modal-window': {open, close}} - event function(event, content, timeout){}
*/
const modal = {
	refs: {
		translock: transitionLock,
		scrlock: scrollLock
	},
	init: function(params = {}){
		this.elemName = params.elem || 'modal';
		this.elem = document.querySelector('.' + this.elemName);
		if (!this.elem) return;
		this.timeout = parseFloat(getComputedStyle(document.body).getPropertyValue('--timer-modal'))*1000 || 0;
		this.windows = this.elem.querySelectorAll('.' + this.elemName + '__window');
		this.links = document.querySelectorAll(params.linkName ? '.' + params.linkName : '.modal-link');
		let that = this;
		for (let i = 0; i < this.links.length; i++) {
			this.links[i].addEventListener('click', this.open.bind(this));
		}
		this.elem.addEventListener('click', function(e) {
			if (!e.target.closest('.' + this.elemName + '__wrapper')) this.closeAll();
		}.bind(this));
		let closeButtons = this.elem.querySelectorAll('.' + this.elemName + '__close-button');
		for (let i = 0; i < closeButtons.length; i++) {
			closeButtons[i].addEventListener('click', this.closeThis.bind(this));
		}
		this.on = params.on || {};
	},
	open: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		e.preventDefault();
		let currentModal = this.elem.querySelector(e.currentTarget.getAttribute('href'));
		currentModal.classList.add('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].open)
			this.on[currentModal.id].open(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				this.timeout
			);
		modal.check();
	},
	closeThis: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		let currentModal = e.target.closest('.' + this.elemName + '__window');
		currentModal.classList.remove('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].close)
			this.on[currentModal.id].close(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				0
			);
		modal.check();
	},
	closeAll: function(){
		if (this.refs.translock.check(this.timeout)) return;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) {
				this.windows[i].classList.remove('_open');
				if (this.on[this.windows[i].id] && this.on[this.windows[i].id].close)
					this.on[this.windows[i].id].close(0,0,0);
			}
		}
		modal.check();
	},
	check: function(){
		let openedWindows = 0;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) openedWindows++;
		}
		if (openedWindows) {
			this.elem.classList.add('_visible');
			this.refs.scrlock.lock();
		}
		else {
			this.elem.classList.remove('_visible');
			this.refs.scrlock.unlock(this.timeout);
		}
	}
}
modal.init({
	on: {
		'modal-form': {
			close: function(event, content, timeout) {setTimeout(() => {formToEmail.clean(document.querySelector('.contact-form'))}, timeout)}
		},
	// 	'modal-imgpreview': {
	// 		open: function(event, content, timeout) {
	// 			let source = event.currentTarget.children[event.currentTarget.children.length-1];
	// 			let img = document.querySelector('#modal-imgpreview img');
	// 			img.src = source.getAttribute('src').replace('.','-preview.');
	// 			if (source.srcset) img.srcset = source.srcset.replace('@2x.','-preview@2x.');
	// 			else img.srcset = '';
	// 		},
	// 		close: function(event, content) {
	// 			let img = document.querySelector('#modal-imgpreview img');
	// 			setTimeout(() => {
	// 				img.src = img.srcset = '';
	// 			}, modal.timeout)
	// 		},
	// 	},
	// 	'modal-video': {
	// 		open: function(event, content, timeout) {setTimeout(() => {videoPlayer.play(content)}, timeout)},
	// 		close: function(event, content, timeout) {videoPlayer.pause(content)}
	// 	}
	}
})

///////////////////////////////////////////////////////////////////////////////////////////

/* Select
	Params {obj}:
	- elem - element name (default = 'select')
	- firstOptSelected (default = false)
	- onselect - event
*/
// @ @include('front/select.js')
// let form_select = new Select({
// 	elem: 'form__select', 
// 	firstOptSelected: true,
// 	onselect: (selection) => {console.log(selection)}
// })

///////////////////////////////////////////////////////////////////////////////////////////

/* Accordion (js version)
	Params:
	1) element name (default = 'accordion')
	2) isOpened (default = false)
*/
// @ @include('front/accordion_js.js')
// let accordion = new Accordion('js__accordion', true);

///////////////////////////////////////////////////////////////////////////////////////////

/* Random
	Use: 
		getRandomNumber(min, max) (default = 0, 99)
		getRandomId(length) (default = 10)
*/
// @ @include('front/random.js')

///////////////////////////////////////////////////////////////////////////////////////////

/* Onload counter
	Params:
	1) goal number
	2)	timeout in seconds
	3)	result element name
*/
// @ @include('front/onload_counter.js')
// let onloadCounter1 = new OnloadCounter(51806, 1 , 'test-counter--1');
// let onloadCounter2 = new OnloadCounter(35704, 2 , 'test-counter--2');

///////////////////////////////////////////////////////////////////////////////////////////

/* Input range colored (script for input's track gradient filling)
	Params {obj}:
	- elem - element name (default = 'input-range')
	- trackColorStart - color of the left track part (default = 'var(--track-color-start)')
	- trackColorEnd - color of the right track part (default = 'var(--track-color-end)')
*/
// @ @include('front/input_range_colored.js')
// let iRangeClr = new InputRangeColored({
// 	elem: 'input-range'
// })

///////////////////////////////////////////////////////////////////////////////////////////

/* Input range (full js version, may have 2 thumbs, no vertical orientation)
	Params {obj}:
	- elem - element name (default = 'input-range-jsv')
	- start - track scale start (default = 0)
	- end - track scale end (default = 100)
	- thumbs [] - thumbs base position (default = [0])
	- bubble - enable bubble (default = false)
	- results [] - result element (no default)
*/
// @ @include('front/input_range_double.js')
// let iRangeDbl = new InputRangeDouble({
// 	elem: 'form__input-range-dbl',
// 	start: 200,
// 	end: 492,
// 	thumbs: [250, 400],
// 	bubble: true,
// 	results: ['form__ir-result1', 'form__ir-result2']
// })

///////////////////////////////////////////////////////////////////////////////////////////

/* Video player
	Params:
	1) volume (default = 70)
*/
// @ @include('front/video_player.js')
// Include "Input range colored" script if track colored progress is required.
// iRange_seek = new InputRangeColored({
// 	elem: 'video-controls__seek-bar'
// });
// iRange_volume = new InputRangeColored({
// 	elem: 'video-controls__volume-bar'
// });
// videoPlayer.init(80);

///////////////////////////////////////////////////////////////////////////////////////////

// Swiper simple (Single Swiper in a project)
// const swiper = new Swiper('.swiper', {
// 	navigation: {
// 		prevEl: '.swiper-button-prev',
// 		nextEl: '.swiper-button-next'
// 	},
// 	loop: true,
// 	loopAdditionalSlides: 2,
// 	speed: 800,
// 	spaceBetween: 15,
// 	autoplay: {
// 		delay: 5000,
// 		disableOnInteraction: false,
// 		pauseOnMouseEnter: true
// 	},
// 	breakpoints: {
// 		600: {}
// 	}
// });

///////////////////////////////////////////////////////////////////////////////////////////

/* Swiper Customs (Swiper options, launcher & JSON functions)
	It is useful with many swipers in a project
	Settings are inside module
*/
// @ @include('front/swiper_customs.js')

///////////////////////////////////////////////////////////////////////////////////////////

/* Loadscreen
	Params {obj}:
	- timeout - timeout between document is loaded and loadscreen begins to fade (default = 0)
	- scrollToTop - force scroll document to top (default = false)
*/
// @ @include('front/loadscreen.js')
// loadscreen.init({
// 	timeout: 1000,
// 	scrollToTop: true
// })

///////////////////////////////////////////////////////////////////////////////////////////

// Spoiler
// @ @include('front/spoiler.js')
// spoiler.init();

///////////////////////////////////////////////////////////////////////////////////////////

// Up-button
const upButton = {
	init: function() {
		this.elem = document.querySelector('.up-button');
		if (!this.elem) return;

		this.prevPos = pageYOffset;
		this.visible = false;
		window.addEventListener('scroll', this.showButton.bind(this))
		this.elem.addEventListener('click', () => {
			window.scrollTo({top: 0, behavior: 'smooth'});
		});
	},
	showButton: function() {
		function show(that, show) {
			if (show) that.elem.classList.add('_visible');
			else that.elem.classList.remove('_visible');
			that.visible = show;
		}

		if (pageYOffset < window.innerHeight) { // page start
			if (this.visible == true) show(this, false);
			return;
		}
		if (pageYOffset >= document.body.scrollHeight - window.innerHeight) { // page end
			if (this.visible == false) show(this, true);
			return;
		}
		if (pageYOffset < this.prevPos) {
			if (this.visible == false) show(this, true);
		}
		if (pageYOffset > this.prevPos) {
			if (this.visible == true) show(this, false);
		}
		this.prevPos = pageYOffset;
	}
}
upButton.init();

///////////////////////////////////////////////////////////////////////////////////////////

// Tabs
// @ @include('front/tabs.js')

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/* Send form to email
	Params:
	1) demo mode: all checks and response messages, but disabled php (default = false)
*/
const formToEmail = {

	messages: {
		ok: 'Сообщение отправлено',
		okDemo: 'Your message has been sent (demo)',
		error: 'Ошибка при отправке сообщения',
		emptyReqField: 'Пожалуйста, заполните все поля',
		incorrectName: 'Некорректное имя',
		// incorrectPhone: 'Incorrect phone number',
		incorrectEmail: 'Некорректный email',
	},
	
	init: function(demo = false){
		this.demo = demo;
		this.inputs = document.querySelectorAll('form input, form textarea');
		for (let i = 0; i < this.inputs.length; i++) {
			this.inputs[i].addEventListener('input', function(){
				this.classList.remove('_error');
			})
			if (this.inputs[i].getAttribute('name') == 'phone') {
				this.inputs[i].addEventListener("input", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("focus", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("blur", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("keydown", this.editPhoneByMask, false)
			}
		}
		for (let i = 0; i < document.forms.length; i++) {
			document.forms[i].addEventListener('submit', this.send.bind(this));
		}
	},

	send: async function(e) {
		e.preventDefault();
		let report = e.target.querySelector('.form-report');
		report.classList.remove('ok');
		report.classList.remove('er');

		let errors = this.check(e.target);
		if (errors[0]) {
			report.classList.add('er');
			if (errors[0] == 1)
				report.innerHTML = errors[1][0];
			else
				report.innerHTML = this.messages.emptyReqField;
			return;
		}
		else report.innerHTML = '';

		let formData = new FormData(e.target);
		formData.append('form', e.target.getAttribute('name'));
		// Add elems that ignored by new FormData 
		this.addCustomInputs(e, formData, 'input-range');
		// /

		this.log(formData); // Console log to check the correctness

		e.target.classList.add('_sending');
		let response;

		if (this.demo) { // demo code
			response = await new Promise(function(resolve, reject) {
				setTimeout(() => resolve(), 2000);
			});
			response = {ok: true};
		}
		else {
			response = await fetch('php/sendmail.php', {
				method: 'POST',
				body: formData
			});
		}
		if (response.ok) {
			report.classList.add('ok');
			if (this.demo) report.innerHTML = this.messages.okDemo;
			else report.innerHTML = this.messages.ok;
			this.clean(e.target, false);
		}
		else {
			report.classList.add('er');
			report.innerHTML = this.messages.error;
		}
		e.target.classList.remove('_sending');
	},

	check: function(form) {
		let errors = [];
		let inputs = form.querySelectorAll('input, textarea');
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].classList.remove('_error');
			if (inputs[i].classList.contains('_req') && inputs[i].value == '') {
				inputs[i].classList.add('_error');
				errors.push(this.messages.emptyReqField);
				continue;
			}
			switch (inputs[i].getAttribute('name')) {
				case 'name':
					if (inputs[i].value && /^.{2,}$/.test(inputs[i].value) == false) {
						inputs[i].classList.add('_error');
						errors.push(this.messages.incorrectName);
					}
					break;
				case 'email':
					if (inputs[i].value && /^[0-9a-zA-Z-.]{3,}@[a-z]{3,}\.[a-z]{2,5}$/.test(inputs[i].value) == false) {
						inputs[i].classList.add('_error');
						errors.push(this.messages.incorrectEmail);
					}
					break;
				case 'phone':
					// if (inputs[i].value && /^[0-9]{10,}$/.test(inputs[i].value) == false) {
					if (inputs[i].value && /^\+\d\s\(\d{3}\)\s\d{3}(-\d\d){2}$/.test(inputs[i].value) == false) {
						inputs[i].classList.add('_error');
						errors.push(this.messages.incorrectPhone);
					}
					break;
			}
		}
		return [errors.length, errors];
	},

	log: function(formData) {
		for (let pair of formData.entries()) {
			console.log(pair[0] + ': ' + pair[1]);
		}
	},

	addCustomInputs: function(e, form, elemName) {
		let elem = e.target.querySelectorAll('.' + elemName);
		for (let i = 0; i < elem.length; i++) {
			form.append(elem[i].getAttribute('name'), elem[i].getAttribute('value'));
		}
	},

	clean: function(form, all = true) {
		if (!form) return;
		let inputs = form.querySelectorAll('input, textarea');
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].hasAttribute('name'))
				inputs[i].value = '';
			if (all) inputs[i].classList.remove('_error');
		}
		if (all) {
			let report = form.querySelector('.form-report');
			report.classList.remove('ok');
			report.classList.remove('er');
			report.innerHTML = '';
		}
	},

	// Phone mask
	editPhoneByMask: function(event) {
		event.keyCode && (keyCode = event.keyCode);
		var pos = this.selectionStart;
		if (pos < 3) event.preventDefault();
		var matrix = "+7 (___) ___-__-__",
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, ""),
			new_value = matrix.replace(/[_\d]/g, function(a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			});
		i = new_value.indexOf("_");
		if (i != -1) {
			i < 5 && (i = 3);
			new_value = new_value.slice(0, i)
		}
		var reg = matrix.substr(0, this.value.length).replace(/_+/g,
			function(a) {
				return "\\d{1," + a.length + "}"
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
		if (event.type == "blur" && this.value.length < 5)  this.value = ""
	},

}
formToEmail.init();

///////////////////////////////////////////////////////////////////////////////////////////

/* JSON Load (loads data from .json file & returns Promise)
	Params:
	1) file path (example: 'contenfront/news.json')
*/
// @ @include('back/json_load.js')
// jsonLoad('news.json').then((result) => console.log(result)) // example

///////////////////////////////////////////////////////////////////////////////////////////

/* Module check & load (2 variants)
	instant / delayed Arrays must contain 2 things: 
	1) DOM query name, 2) callback
*/
// @ @include('front/module_check_and_load.js')
// moduleCheckAndLoad.init({
// 	instant: [
// 		// ['.side-menu', sideMenu.init],
// 	],
// 	delayed: [
// 		// ['.gridslider__slider', gridSlider.init],
// 	]
// });

///////////////////////////////////////////////////////////////////////////////////////////

// Portfolio button
let portfolioElement = document.querySelector('.portfolio');
let portfolioButton = document.querySelector('.profile__portfolio-button');
portfolioButton.addEventListener('click', function() {portfolioElement.scrollIntoView({behavior: "smooth"});})
// /

// Portfolio count
document.querySelector('.portfolio__counter').innerHTML = ' (' + document.querySelectorAll('.site').length + ')';
// /