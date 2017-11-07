var NO_MESSAGE = 0;
var GETTING_DETAILS = 1;
var DETAILS_ERROR = 2;
var ERROR_UPDATE = 3
var UPDATE_SUCCESS = 4;
$(document).ready(function() {
	$.ajaxSetup({
		method:"POST",
		dataType:"JSON"
	});
	$.ajax({
		url:"api/getUserDetails",
		success:function(data) {
			if (!data.success) {
				alert("There was an error getting your details");
				return;
			}
			showMessage(NO_MESSAGE);
			$("#name").val(data.name);
			$("#email").val(data.email);
		},
		error:function() {
			showMessage(DETAILS_ERROR);
		}
		
	});
});
function showMessage(m) {
	$(".panel").addClass("hidden");
	switch (m) {
		case GETTING_DETAILS:
			$("#getting-details").removeClass("hidden");
			break;
		case ERROR_UPDATE:
			$("#update-error").removeClass("hidden");
			break;
		case DETAILS_ERROR:
			$("#details-error").removeClass("hidden");
			break;
		case UPDATE_SUCCESS:
			$("#update-success").removeClass("hidden");
			break;
	}
}
function updateDetails() {
	var name = $("#name").val();
	var email = $("#email").val();
	$.ajax({
		url:"api/updateDetails",
		data:{"name":name, "email":email},
		success:function() {
			if (!data.success) {
				showMessage(ERROR_UPDATE);
			}
			showMessage(UPDATE_SUCCESS);
		},
		
	});
	return false;
}

