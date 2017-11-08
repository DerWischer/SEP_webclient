function login() {
	$.ajax({
		url:"login",
		data:{"code":$("#operatorCode").val()},
		success:function(data) {
			if (!data.success) {
				$("#failedLogin").removeClass("hidden");
				return;
			}
			window.location.url = "";
		},
		error:function() {
			$("#errorLogin").removeClass("hidden");
		}
	});
	return false;
}
$(document).ready(function() {
	$.ajaxSetup({
		dataType:"JSON",
		method:"POST"
	});
});
