function setRandomTheme() {
	var x = Math.floor(Math.random() * 5 + 1);
	var checkbox = document.getElementById('rad' + x);
	checkbox.checked = '1';
}
setRandomTheme();

// RegExp Check
function checkInput() { 
	var input = document.querySelector('.subscribe input');
	return /[-.\w]{2,30}@[-\w]{2,30}(\.[a-z]{2,10}){1,2}$/.test(input.value);
}
function subscribeResponse(checkResult) {
	var response, clear, add;
	if (checkResult == false) {
		response = document.getElementById("response-false");
		clear = document.getElementById("response-true");
	}
	else {
		response = document.getElementById("response-true");
		clear = document.getElementById("response-false");
		add = checkResult;
	}
	response.style.opacity = '1';
	clear.style.opacity = '0';
}

// Slider Buttons
function sliderButton(side) {
	var elem, sliderPosition;
	for (var i = 1; i <= 3; i++) {
		elem = document.getElementById('sli' + i);		
		if (elem.checked == '1') {
			sliderPosition = i;
			break;
		}
	}
	if (side == 'l') {
		if (sliderPosition == 1)
			sliderPosition = 3;
		else
			sliderPosition--;
	}
	if (side == 'r') {
		if (sliderPosition == 3)
			sliderPosition = 1;
		else
			sliderPosition++;
	}
	var elem = document.getElementById('sli' + sliderPosition);
	elem.checked = '1';
}