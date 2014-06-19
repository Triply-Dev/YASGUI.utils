window.console = window.console || {"log":function(){}};//make sure any console statements don't break IE
module.exports = {
	storage: require("./storage.js"),
	determineId: require("./determineId.js"),
	imgs: require("./imgs.js"),
	version: {
		"yasgui-utils" : require("../package.json").version,
	}
};
