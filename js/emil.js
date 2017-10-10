//JSON JavaScript Object Notation
var filesystem = {
    "a":{"parent":"b", "type":"folder", "name":"folder1","lastModified":1507211462, "children":[]},
    "b":{"parent":null, "type":"folder", "name":"folder2","lastModified":1507211462, "children":["a", "c"]},
    "c":{"parent":"b", "type":"file", "name":"file1","lastModified":1507211462, "children":[]}
}

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
    container.appendChild(ul);
}
function drawJSONexplorer(JSONObject) {
    var holder = $("#explorer")[0];
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
    var holder = $("#explorer")[0];
    $(holder).empty();
    var iconName;
    var table = el("table", {class:"table"});
    var thead = el("thead", {});
    var tbody = el("tbody", {});
    holder.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    var theadTitle = el("tr", {});
    thead.appendChild(theadTitle);

    var t0 = el("th", {html:"Row"});
    var t1 = el("th", {html:"Name"});
    var t2 = el("th", {html:"Last changed"});
    theadTitle.appendChild(t0);
    theadTitle.appendChild(t1);
    theadTitle.appendChild(t2);
    var nr = 0;


    $.each(JSONObject.children, function(id, value) {

        var item = filesystem[value];
        console.log(item);
        var tr = el("tr", {});
        var t1 = el("th", {html:"1"});
        var t2 = el("td", {html:item.name});
        var t3 = el("td", {html:"Folder Changed" + item.lastModified});

        tr.appendChild(t1);
        tr.appendChild(t2);
        tr.appendChild(t3);

        tbody.appendChild(tr);
    });
}


$(document).ready(function() {

    var fileview = document.getElementById("fileview"); //equivalant to $("#fileview")[0];
    $(fileview).empty();
    drawJSONfileSystem(fileview, filesystem);

    // Change to a list view on the explorer
    $("#btnList").on("click", function() {
        //$("#explorer .file-block").attr("class", "file-list");
        $(fileview).empty();
        var id = this.getAttribute("data-id");
        displayTable(filesystem[id]);
    });
    // Change to a block view on the explorer
    $("#btnBlock").on("click", function() {
        //$("#explorer .file-list").attr("class", "file-block");
        $(fileview).empty();
        drawJSONfileSystem(fileview, filesystem);
    });

});