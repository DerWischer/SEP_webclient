$(document).ready(function() {
	$("#search-box").on('keyup', function (e) {
		if ($(this).val().length == 0) {
			return;
		}
		if (e.keyCode == 13) {
		    CreateSearchCrumb($(this).val());
		    searchFileSystem($(this).val());
		}
	});
});
function searchFileSystem(m) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.name.indexOf(m) > -1) {
			found.push(value);
		}
	});
	console.log(found);
	drawJSONexplorer(null, found);
	displayTable(null, found);
}
