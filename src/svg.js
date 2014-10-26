module.exports = {
	draw: function(parent, svgString, config) {
		if (!parent) return;
		var el = root.getElement(svgString, config);
		if (el) {
			$(parent).append(el);
		}
	},
	getElement: function(svgString, config) {
		if (svgString && svgString.indexOf("<svg") == 0) {
			if (!config.width) config.width = "100%";
			if (!config.height) config.height = "100%";
			
			var parser = new DOMParser();
			var dom = parser.parseFromString(svgString, "text/xml");
			var svg = dom.documentElement;
			
			var svgContainer = document.createElement("div");
			svgContainer.style.display = "inline-block";
			svgContainer.style.width = config.width;
			svgContainer.style.height = config.height;
			svgContainer.appendChild(svg);
			return svgContainer;
		}
		return false;
	}
};