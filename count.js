function count(d) {
	let empty = 0;
	let total = 0;

	for (const key in d) {
		if (d[key] === "") {
			empty++;
		}

		total++;
	}

	return { empty, total };
}

function output(res) {
	console.log(`Empty: ${res.empty} (${(100 * (res.empty / res.total)).toFixed(2)}%)`);
	console.log(`Total: ${res.total}`);
}

module.exports = {
	count,
	output
};
