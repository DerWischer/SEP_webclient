$(document).ready(function() {
	$("#search-box").on('keyup', function (e) {
		if ($(this).val().length == 0) {
			$("#clear-btn").attr("disabled", true);
			return;
		}
		$("#clear-btn").attr("disabled", false);
		if (e.keyCode == 13) {
		    CreateSearchCrumb($(this).val());
		    searchFileSystem($(this).val());
		}
	});
	$("#clear-btn").click(function() {
		$("#search-box").val("").focus();
		$("#clear-btn").attr("disabled", true);
	});
});
function searchFileSystem(m) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.name.indexOf(m) > -1) {
			found.push(value);
		}
	});
	drawJSONexplorer(null, found);
	displayList(null, found);
}
