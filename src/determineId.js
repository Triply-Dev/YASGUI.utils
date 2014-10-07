/**
 * Determine unique ID of the YASQE object. Useful when several objects are
 * loaded on the same page, and all have 'persistency' enabled. Currently, the
 * ID is determined by selecting the nearest parent in the DOM with an ID set
 * 
 * @param doc {YASQE}
 * @method YASQE.determineId
 */
var root = module.exports = function(element) {
	if (element.closest) {
		return element.closest('[id]').attr('id');
	} else {
		var id = undefined;
		var parent = element;
		while (parent && id == undefined) {
			if (parent && parent.getAttribute && parent.getAttribute('id') && parent.getAttribute('id').length > 0) 
				id = parent.getAttribute('id');
			parent = parent.parentNode;
		}
		return id;
	}
};
