(function() {
	'use strict';

	function ALHSAM_AddMenuSection(title, id) {
		let root = $(`<fieldset class='ALHS_AM_FS'>
		<legend></legend>
		<div></div>
	</fieldset>`);
		if (id) {
			root.attr('id', id);
		}
		$('legend', root).text(title);
		$('#ALHS_AM_RIGHTPANNEL').append(root);
		return $('div', root);
	}
	
	let AddonConfig = {};
	AddonConfig = GM_getValue('AddonConfig', {});

	let PageInfo = (function() {
		let path = window.location.pathname;
		let host = window.location.host;
		if (path == '/') {
			return {
				type: 'idx',
				page: 1,
				pattern: `https://${host}/index.php/page/@/`
			};
		}
		let mat;
		mat = /^\/index\.php\/page\/(\d+)\/$/.exec(path);
		if (mat) {
			return {
				type: 'idx',
				page: Number(mat[1]),
				pattern: `https://${host}/index.php/page/@/`
			};
		}
		mat = /^\/index\.php\/archives\/tag\/(.+)(?:\/page\/(\d+))?\/$/.exec(path);
		if (mat) {
			return {
				type: 'idx',
				page: mat.length == 3 ? Number(mat[2]) : 1,
				pattern: `https://${host}/index.php/archives/tag/${mat[1]}/page/@/`
			};
		}
		mat = /^\/index\.php\/archives\/category\/(.+)(?:\/page\/(\d+))?\/$/.exec(path);
		if (mat) {
			return {
				type: 'idx',
				page: mat.length == 3 ? Number(mat[2]) : 1,
				pattern: `https://${host}/index.php/archives/category/${mat[1]}/page/@/`
			};
		}
		mat = /^\/index\.php\/archives\/\d{4}\/\d{2}\/\d+\/$/.exec(path);
		if (mat) {
			return {
				type: 'page'
			};
		}
		return {
			type: 'unknown'
		};
	})();

    let haveTopBar = $('#wpadminbar').length > 0;
	$('body').append($('<style></style>').text(`
#ALHS_AM_RIGHTDIV {
	display: flex;
	flex-direction: row;
	position: fixed;
	top: ${haveTopBar ? '32': '0'}px;
	right: -200px;
	width: 230px;
	z-index: 101;
	transition: all 0.5s;
	pointer-events: none;
}
#ALHS_AM_RIGHTPANNEL_BUTTON {
	width: 0px;
	height: 0px;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-right: 30px solid #FFFFFF;
	pointer-events: auto;
}
#ALHS_AM_RIGHTPANNEL {
	width: 200px;
	height: 100%;
	background: #FFFFFF7F;
	display: flex;
	flex-direction: column;
	scroll: auto;
	pointer-events: auto;
}
.ALHS_AM_FS {
	padding: 5px;
}
.ALHS_AM_FS legend {
	margin: 0px;
}
.ALHS_AM_FS > div {
	background: #EFEFEF;
	display: flex;
	flex-direction: column;
}
.ALHS_AM_CLICKABLE {
	cursor:url(https://wosn.net/zhizhen/link.cur),default;
}
.ALHS_AM_CONFIG {
	display: flex;
	flex-direction: column;
}
.ALHS_AM_CONFIG>input[type=text] {
	padding: 2px;
}
	`), $(`<div id='ALHS_AM_RIGHTDIV'>
	<div id='ALHS_AM_RIGHTPANNEL_BUTTON' class='ALHS_AM_CLICKABLE'></div>
	<div id='ALHS_AM_RIGHTPANNEL'></div>
</div>`));

	(function() {
		let state = false;
		$('#ALHS_AM_RIGHTPANNEL_BUTTON').click(() => {
			state = !state;
			$('#ALHS_AM_RIGHTDIV').css('right', state ? '0px' : '-200px');
		});
	})();

	let panel = ALHSAM_AddMenuSection('AddonManager');
	panel.append(`<span>版本: 0.1.0</span>`);
	panel.append(`<span>联系作者<a href='mailto:liao.hy@outlook.com'>nekosu</a></span>`);

	$.ajax({
		url: 'https://neko-para.github.io/ALHS/ALHSAM.json',
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			for (let k in result.info) {
				let obj = result.info[k];
				let panel = ALHSAM_AddMenuSection(k);
				panel.append(`<span>版本: ${obj.ver}</span>`);
				panel.append(`<span>联系作者<a href='mailto:${result.mail[obj.author]}'>${obj.author}</a></span>`);
				function updateConfig() {
					GM_setValue('AddonConfig', AddonConfig);
				}
				if (!(k in AddonConfig)) {
					AddonConfig[k] = {
						enable: false
					};
					updateConfig();
				}
				function loadScript(o) {
					if (o.act[PageInfo.type]) {
						$.ajax({
							url: `${result.root}${o.src}`,
							type: 'GET',
							dataType: 'text',
							success: function (script) {
								let config = AddonConfig[k];
								eval(script);
							}
						});
					} else {
						panel.append('<span>此页面不适用</span>');
					}
				}
				panel.append($('<span></span>').text(obj.desc));
				if (AddonConfig[k].enable) {
					let enableCtrl = $('<span class="ALHS_AM_CLICKABLE">已启用</span>');
					(function () {
						let name = k;
						enableCtrl.click(() => {
							AddonConfig[name].enable = false;
							GM_setValue('AddonConfig', AddonConfig);
							window.location.reload();
						});
					})();
					panel.append(enableCtrl);
					loadScript(obj);
				} else {
					let enableCtrl = $('<span class="ALHS_AM_CLICKABLE">已禁用</span>');
					(function () {
						let name = k;
						enableCtrl.click(() => {
							AddonConfig[name].enable = true;
							GM_setValue('AddonConfig', AddonConfig);
							loadScript(result.info[name]);
							enableCtrl.text('已启用');
							enableCtrl.unbind();
							enableCtrl.click(() => {
								AddonConfig[name].enable = false;
								GM_setValue('AddonConfig', AddonConfig);
								window.location.reload();
							});
						});
					})();
					panel.append(enableCtrl);
				}
			}
		}
	});
})();