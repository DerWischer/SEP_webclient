$(document).ready(function() {
    $.ajax({
        url:"/getAccountDetails",
        method:"GET",
        dataType:"JSON",
        success:function(data) {
            if (!data.success) {
                alert("User not found, please contact admin");
                return;
            }
            $("#name").val(data.name);
        },
        error:function() {
            alert("could not reach server");
        }
    })
})