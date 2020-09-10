// ==UserScript==
// @name         艾利浩斯图书馆插件管理器
// @namespace    https://ailihaosi.xyz/
// @version      0.1.0
// @description  为图书馆的插件提供方便的设置和更新功能
// @author       nekosu
// @include      https://ailihaosi.xyz/**
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==

(function() {
	$.ajax({
		url: 'https://neko-para.github.io/ALHS/ALHSAddonManager.js',
		type: 'GET',
		dataType: 'text',
		success: function(result) {
			eval(result);
		}
	});
})();