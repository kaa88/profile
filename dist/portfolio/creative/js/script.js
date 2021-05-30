function closeMenu() {
	var menu = document.getElementById('menu-button');
	menu.checked = false;
}
function ie_fix() {
	var ua = detect.parse(navigator.userAgent);
	if (ua.browser.family == 'IE'){
		var newLinkCss = document.createElement('link');
		newLinkCss.rel = 'stylesheet';
		newLinkCss.href = 'css/adaptive-ie.css';
		document.head.appendChild(newLinkCss);
	}
}