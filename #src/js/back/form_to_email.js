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