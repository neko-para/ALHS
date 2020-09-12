(function() {
	let style = $('<style />');
	let font = '';
	let cfg = config;
	function updateStyle() {
		let res = '';
		if (font.length > 0) {
			res += `* { font-family: ${font}; }`;
		}
		style.text(res);
	}
	let root = $(`<div class="ALHS_AM_CONFIG"><span>字体</span><input type="text" /></div>`);
	let input = $('input', root);
	input.on('input', function () {
		font = input.val().replace(/^\s*/, '').replace(/\s*$/, '');
		cfg.font = font;
		updateConfig();
		updateStyle();
	});
	panel.append(root);
	$('body').append(style);
})();