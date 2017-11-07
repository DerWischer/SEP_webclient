function login() {
	$.ajax({
		url:"api/login.php",
		data:{"code":$("#operatorCode").val()},
		success:function(data) {
			if (!data.success) {
				$("#failedLogin").removeClass("hidden");
				return;
			}
			window.location.url = "index.php";
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
