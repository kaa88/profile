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
@@include('front/scroll_lock.js')

///////////////////////////////////////////////////////////////////////////////////////////

/* Transition lock (prevents double-clicking on transitions, e.g. when menu slides)
	Use:
		if (transitionLock.check( #timeout# )) return;
*/
@@include('front/trans_lock.js')

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
@@include('front/modal.js')
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
@@include('front/up_button.js')
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
@@include('back/form_to_email.js')
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