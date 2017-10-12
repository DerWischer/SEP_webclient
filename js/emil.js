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
function drawJSONfileSystem(container, JSONObject) {
    var ul = document.createElement("ul");
    ul.className = "sub-section";
    $.each(JSONObject, function(id, value) {
        if (value == null) {
            return;
        }
        if (value.type != "folder") {
            return;
        }
        var li_el = document.createElement("li");
        li_el.setAttribute("data-id", id);
        var p = document.createElement("p");
        p.innerHTML = value.name;
        li_el.appendChild(p);
        li_el.className = "selectable";
        for (var i=0;i<value.children.length;i++) {
            drawJSONfileSystem(li_el, filesystem[value[i]]);
        }
        li_el.onclick = function() {
            var id = this.getAttribute("data-id");
            drawJSONexplorer(filesystem[id]);
        }
        ul.appendChild(li_el);
    });
    if (!container) {
    	return;
    }
    container.appendChild(ul);
}
function drawJSONexplorer(JSONObject) {
    var holder = $("#gridView")[0];
    $(holder).empty();
    var iconName;
    $.each(JSONObject.children, function(id, value) {
        var item = filesystem[value];
        if (item.type == "folder") {
            iconName = "fa-folder-open";
        }
        if (item.type == "file") {
            iconName = "fa-file-o";
        }
        var section = el("section", {class:"file-block"});
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
        var tr = el("tr", {});
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

    var gridview = document.getElementById("gridView");
    var tableView = document.getElementById("tableView");//equivalant to $("#gridview")[0];
   	displayTable(filesystem);
   	drawJSONfileSystem(gridview, filesystem);

    // Change to a table view on the explorer
    $("#btnList").on("click", function() {
        gridview.className ="hidden";
        tableView.className = "";
    });
    // Change to a block view on the explorer
    $("#btnBlock").on("click", function() {
        tableView.className = "hidden";
        gridview.className = "";
    });

});
