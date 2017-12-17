import _Storage from "./Storage";
export var Storage = _Storage;

export function drawSvgStringAsElement(svgString: string) {
  if (svgString && svgString.indexOf("<svg") == 0) {
    //no style passed via config. guess own styles
    var parser = new DOMParser();
    var dom = parser.parseFromString(svgString, "text/xml");
    var svg = dom.documentElement;

    var svgContainer = document.createElement("div");
    svgContainer.className = "svgImg";
    svgContainer.appendChild(svg);
    return svgContainer;
  }
}
