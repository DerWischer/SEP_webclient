$(document).ready(function() {
	$("#search-bar").on('keyup', function (e) {
		if ($(this).val().length == 0) {
			return;
		}
		if (e.keyCode == 13) {
			alert("hello");
		    CreateSearchCrumb($(this).val());
		}
	});
});
