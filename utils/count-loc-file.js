const counting = require("../count.js");

let file = (() => {
	const FILE_ARG = "file=";
	const args = process.argv;

	for (let i = 0, l = args.length; i < l; i++) {
		const arg = args[i];
		if (arg.startsWith(FILE_ARG)) {
			return arg.slice(FILE_ARG.length);
		}
	}
})();

if (!file) {
	throw new Error("No file to count");
}

file = require(require("path").join(process.cwd(), file));

counting.output(counting.count(file));
