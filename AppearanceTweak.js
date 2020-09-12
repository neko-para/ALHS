(function() {
	let style = $('<style />');
	let font = 'SIMKAI';
	function updateStyle() {
		let res = '';
		if (font.length > 0) {
			res += `* { font-family: ${font}; }`;
		}
	}
	let root = $(`<div class="ALHS_AM_CONFIG_ROW"><span style="margin-right: 5px">字体:</span><input type="text" /></div>`);
	let input = $('input', root);
	input.value(font);
	input.input(function () {
		font = input.value().replace(/^\s*/, '').replace(/\s*$/, '');
		updateStyle();
	});
	panel.append(root);
	$('body').append(style);
})();