// ==UserScript==
// @name         艾利浩斯图书馆插件管理器
// @namespace    https://ailihaosi.xyz/
// @version      0.2.0
// @description  为图书馆的插件提供方便的设置和更新功能
// @author       nekosu
// @include      https://ailihaosi.xyz/**
// @include      https://alhs.live/**
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==

(async function() {
	let cache = GM_getValue('cache', {});
	async function request(url) {
		return new Promise((res, rej) => {
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'text',
				success: function(result) {
					res(result);
				},
				error: function(e) {
					rej(e);
				}
			});
		});
	}
	async function updateScript(name, version, url) {
		if (!(name in cache) || cache[name].ver != version) {
			cache[name] = {
				ver: version,
				src: await request(url)
			};
		}
	}
	function runScript(name, config) {
		eval(cache[name].src);
	}
	let AddonInfo = JSON.parse(await request('https://neko-para.github.io/ALHS/ALHSAM.json'));
	function queryAddonNames() {
		return Object.keys(AddonInfo.info).filter(k => { return k != 'ALHSAddonManager'; });
	}
	function queryInfo(name) {
		let obj = AddonInfo.info[name];
		obj.mail = AddonInfo.mail[obj.author];
		return obj;
	}
	let pros = [];
	for (let key in AddonInfo.info) {
		let obj = AddonInfo.info[key];
		pros.push(updateScript(key, obj.ver, AddonInfo.root + obj.src));
	}
	await Promise.all(pros);
	GM_setValue('cache', cache);
	runScript('ALHSAddonManager', null);
})();