
function el(name, options) {
    var el = document.createElement(name);
    if (options.id) {
        el.id = options.id;
    }
    if (options.class) {
        el.className = options.class;
    }
    if (options.html) {
        el.innerHTML = options.html;
    }
    if (options.scope) {
        el.scope = options.scope;
    }

    $.each(options, function(key, value) {
        el.setAttribute(key, value);
    });
    return el;
}
function drawJSONexplorer(childrenObjects) {
    var holder = $("#gridView")[0];
    $(holder).empty();
    var iconName;

    var getBack = el("section", {"data-id":childrenObjects[0].parent, class:"file-block"});
    var b1 = el("h3", {html:"back"});
    var b2 = el("i", {class:" fa fa-folder-open fa-5x"});
    var b3 = el("h5", {html:"Get back lol"});
    getBack.appendChild(b1);
    getBack.appendChild(b2);
    getBack.appendChild(b3);
    holder.appendChild(getBack);
    getBack.onclick = function() {
        var id = this.getAttribute("data-id");
        if(id == null) {
            alert("it's null ffs");
        }
        else {
            drawJSONexplorer(getChildren(id));
        }
    }

    $.each(childrenObjects, function(id, value) {
        var item = value;
        if (item.type == "folder") {
            iconName = "fa-folder-open";
        }
        if (item.type == "file") {
            iconName = "fa-file-o";
        }
        var section = el("section", {"data-id":value.text, class:"file-block"});
        section.onclick = function() {
            var id = this.getAttribute("data-id");
            drawJSONexplorer(getChildren(id));
        }
        var h3 = el("h3", {html:item.name});
        var i = el("i", {class:"fa " + iconName + " fa-5x"});
        var h5 = el("h5", {html:"Folder Changed" + item.lastModified});
        section.appendChild(h3);
        section.appendChild(i);
        section.appendChild(h5);
        holder.appendChild(section);
    });
}

function displayTable(JSONObject) {
    var holder = $("#tableView")[0];
    $(holder).empty();
    var iconName;
    var table = el("table", {class:"table"});
    var thead = el("thead", {});
    var tbody = el("tbody", {});
    var tr = el("tr", {});
    tr.appendChild(el("th", {html:"Name"}));
    tr.appendChild(el("th", {html:"Last changed"}));
    thead.appendChild(tr);
    table.appendChild(thead);	
    $.each(JSONObject, function(id, value) {
        var item = filesystem[id];
        var tr = el("tr", {"data-id":id});
        var t2 = el("td", {html:item.name});
        var t3 = el("td", {html:moment(item.lastModified*1000).format("YYYY-MM-DD")});
        tr.appendChild(t2);
        tr.appendChild(t3);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    holder.appendChild(table);
    $(table).DataTable();
}


$(document).ready(function() {
   	displayTable(filesystem);
   	drawJSONexplorer(getChildren(null));
    // Change to a table view on the explorer
    $("#btnList").click(function() {
    	alert("goodbye");
        $("#gridView").addClass("hidden");
        $("#tableView").removeClass("hidden");
    });
    // Change to a block view on the explorer
    $("#btnBlock").click(function() {
    	alert("hello");
        $("#gridView").removeClass("hidden");
        $("#tableView").addClass("hidden");
    });

    $("table.table tbody tr").on("click", function() {
        alert(this.getAttribute("data-id"));
    });
    $("section.gridView section").on("click", function() {
        alert(this.getAttribute("data-id"));
    });

});
