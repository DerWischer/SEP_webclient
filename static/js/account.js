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
    $("#btnChangeAccount").on("click", function() {
        $.ajax({
            url:"/checkPrivilege",
            method:"GET",
            dataType:"JSON",
            success:function(data) {
                alert(data.privilege)
                if (!data.success) {
                    alert("User not found, please contact admin");
                    return;
                }
                if (data.privilege == 3) {
                    window.location.href("http://localhost:8888/account")
                }
                else {
                    alert("You do not have permission to do this ("+data.privilege+")")
                }
            },
            error:function() {
                alert("could not reach server");
            }
        })
    });
})