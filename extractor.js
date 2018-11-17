const fs = require("fs");
const counting = require("./count.js");

const CTX = process.env["EXTRACTOR_CTX"] || "client";

const WEBPACK_IX = (() => {
	let val = process.env["EXTRACTOR_WEBPACK_IX"];

	return val && parseInt(val, 10);
})();

const MATCHING_ISKEY = process.env["EXTRACTOR_MATCHING_ISKEY"] === "true";
const MATCHING = process.env["EXTRACTOR_MATCHING"];

function env() {
	console.info("[Env]", { CTX });
	console.info("[Env]", { WEBPACK_IX });
	console.info("[Env]", { MATCHING_ISKEY });
	console.info("[Env]", { MATCHING });
}

function load() {
	if (!global.window) { global.window = {}; }

	const path = `./src/${CTX}.js`;

	console.log(`[Load] Trying to load file`, { path });

	require(path);

	console.log(`[Load] Load complete`);
}

function firstKeyVal(obj) {
	for (let key in obj) {
		return obj[key];
	}
}

function extract() {
	let output = (() => {
		if (!window || !window.webpackJsonp) {
			throw new Error("Webpack has not finished loading");
		}

		console.log(`[Extract] Trying to find the file...`);

		let file = (() => {
			if (WEBPACK_IX != null) {
				return window.webpackJsonp.find(_ => _[0][0] === WEBPACK_IX);
			}

			return window.webpackJsonp[0];
		})()[1];

		if (typeof file === "function" && !MATCHING) {
			return file;
		}

		if (MATCHING_ISKEY) {
			if (typeof file !== "object") {
				throw new Error("Returned file is not a function");
			}

			return MATCHING ? file[MATCHING] : firstKeyVal(file);
		}

		if (!Array.isArray(file)) {
			throw new Error("Leaked Webpack file is not an array of functions");
		}

		if (MATCHING) {
			console.log(`[Extract] File found, matching out the function...`);

			return file.find(_ => _ && "toString" in _ && _.toString().includes(MATCHING));
		} else {
			console.log(`[Extract] No matching in place, using first file`);

			return file[0];
		}
	})();

	if (!output) {
		throw new Error("No output from the file. Did you try to use correct matching?");
	}

	console.log(`[Extract] Heaven powering the file...`);

	let ret = {};

	try {
		output(ret);

		console.log(`[Extract] Heaven powered`, { hasExports: !!ret.exports });

		return ret.exports;
	} catch (err) {
		console.warn(`[Extract] Heaven powering failure`, { err });
		console.warn(`[Extract] Ensure the file is can be heaven powered in (compatible with) Node.js`);

		throw new Error("Heaven powering failure");
	}
}

function toFlat(input) {
	function flat(res, key, val, pre = '') {
		const prefix = [pre, key].filter(v => v).map(v => v.toUpperCase()).join('_');

		return typeof val === 'object'
			? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
			: Object.assign(res, {
				[prefix]: val
			});
	}

	return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {});
}

function save(data) {
	console.log("[Save] Stringifying into JSON...");

	const json = JSON.stringify(data, null, "\t");

	const path = `./out/CURRENT_${CTX.toUpperCase()}.json`;

	console.log("[Save] Saving", { path });

	return fs.writeFileSync(path, json, { encoding: "utf8" });
}

console.log("-> Display environment values");

env();

console.log("-> Load the file");

load();

{
	console.log("-> Extract");

	let d = extract();

	{
		console.log("-> Flat");

		d = toFlat(d);
	}

	{
		console.log("-> Save");

		save(d);
	}

	{
		console.log("-> Count");

		let cr = counting.count(d);

		counting.output(cr);
	}
}

console.log("--- FINISH ---");
