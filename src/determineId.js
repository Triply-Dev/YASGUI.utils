/**
 * Determine unique ID of the YASQE object. Useful when several objects are
 * loaded on the same page, and all have 'persistency' enabled. Currently, the
 * ID is determined by selecting the nearest parent in the DOM with an ID set
 * 
 * @param doc {YASQE}
 * @method YASQE.determineId
 */
var root = module.exports = function(element) {
	return require("jquery")(element).closest('[id]').attr('id');
};