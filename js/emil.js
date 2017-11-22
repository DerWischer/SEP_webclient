function displayList(parent, childrenObjects) {
    var holder = $("#tableView")[0];
    $(holder).empty();
    var iconName;
    $.each(childrenObjects, function(id, value) {
        var row = el("section", {"data-id":value.id, class:"row listViewItem"});
        if (value.type == "folder") {
            iconName = "fa fa-folder-open fa-3x";
        }
        if (value.type == "file") {
            iconName = "fa fa-file-o fa-3x";
        }
        var icon = el("section", {class:"col-lg-1 col-md-1"});
        var fa = el("i", {class:iconName});
        icon.appendChild(fa);
        var name = el("section", {class:"col-lg-6 col-md-6"});
        var h4 = el("h4", {html:value.name});
        name.appendChild(h4);
        var date = el("section", {class:"col-lg-5 col-md-5"});
        var h4 = el("h4", {html:moment(value.lastModified*1000).format("YYYY-MM-DD")});
        date.appendChild(h4);
        row.appendChild(icon);
        row.appendChild(name);
        row.appendChild(date);
        holder.appendChild(row);
    });
}

// Login functions etc.
var userData = {
    "ragnar": {
        "id":"ragnar",
        "password":"lol"
    },
    "roger": {
        "id":"roger",
        "password":"hello"
    }
}
function correctPW(userName, inputPassword) {
    var user = userData.hasOwnProperty(userName);
    if(user == true) {
        var pw = userData[userName].password;
        if(inputPassword == pw ) {
            alert("yay");
        }
        else {
            alert("incorrect pw")
        }
    }
    if(user == false) {
        alert("incorrect username");
    }
}


(function($, window){

    $.fn.contextMenu = function(settings) {
        return this.each(function() {
            // Code Goes Here
            $(this).on("contextmenu", function (e) {
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                    })
                    .off('click')
                    .on('click', 'a', function (e) {
                        $menu.hide();

                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);

                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

                return false;
            });
            //make sure menu closes on any click
            $('body').click(function () {
                $(settings.menuSelector).hide();
            });
        });

        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }
    };

})(jQuery, window);


$(document).ready(function() {
    //Handles menu drop down
    $('.dropdown-menu').find('form').click(function (e) {
        e.stopPropagation();
    });

    //Logout button
    $("#btnLogout").click(function() {
        //alert("Value: " + $("#emailInput").val() + " Password: " + $("#passwordInput").val());
        correctPW($("#emailInput").val(), $("#passwordInput").val());
    });
    $("#tableView").on("click", ".listViewItem", function() {
        setFolder(this.getAttribute("data-id"));
    });
    $("#gridView").on("click", "section.file-block", function() {
        setFolder(this.getAttribute("data-id"));
    });
    $("#tableView").contextMenu({
        menuSelector: "#contextMenu",
        menuSelected: (function (invokedOn, selectedMenu) {
            // context menu clicked
            var msg = "You selected the menu item '" + selectedMenu.text() +
                "' on the value '" + invokedOn.text() + "'";
            if (selectedMenu.text() == "Trace") {
               // $("#traceModal").modal();
            }
        })
    });

});