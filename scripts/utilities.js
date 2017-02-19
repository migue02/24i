define(function(Utilities) {

	var Utilities = {
		TryParseInt: TryParseInt,
		CreateButton: CreateButton
	}

	return Utilities;

	//////////////////////////

	/**
	 * Return the int value of a string if it's possible, if not returns the value defaultValue
	 * @param {String} String to parse
	 * @param {Int} Default value if the parse cannot be done
	 */
	function TryParseInt(str, defaultValue) {
		var retValue = defaultValue;
		if (str !== null) {
			if (str.length > 0) {
				if (!isNaN(str)) {
					retValue = parseInt(str);
				}
			}
		}
		return retValue;
	}

	/**
	 * Instantiates a button
	 * @param {String} Value of the button
	 * @param {Boolean} If the button is disabled
	 * @param {Function} Click function of the button
	 * @return {Element} The button
	 */
	function CreateButton(text, disabled, clickCallback) {
		var button = document.createElement('button');
		button.addEventListener('click', clickCallback);
		button.innerHTML = text;
		button.disabled = disabled;
		return button;
	}
});