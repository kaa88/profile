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