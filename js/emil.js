function drawJSONexplorer(id, childrenObjects) {
    var holder = $("#gridView")[0];
    $(holder).empty();
    var iconName;
	if (childrenObjects.length == 0) {
		var panel = el("section", {class:"panel panel-default"});
		var panelBody = el("section", {class:"panel-body"});
		panelBody.appendChild(document.createTextNode("There is nothing here"));
		panel.appendChild(panelBody);
		holder.appendChild(panel);
		return;
	}
    $.each(childrenObjects, function(id, value) {
        var item = value;
        if (item.type == "folder") {
            iconName = "fa-folder-open";
        }
        if (item.type == "file") {
            iconName = "fa-file-o";
        }
        var section = el("section", {"data-id":value.id, class:"file-block"});
        var h3 = el("h3", {html:item.name});
        var i = el("i", {class:"fa " + iconName + " fa-5x"});
        var h5 = el("h5", {html:"Modified: " + moment(item.lastModified*1000).format("YYYY-MM-DD")});
        section.appendChild(h3);
        section.appendChild(i);
        section.appendChild(h5);
        holder.appendChild(section);
    });
}

function displayTable(parent, childrenObjects) {
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
    $.each(childrenObjects, function(id, value) {
        var tr = el("tr", {"data-id":value.id});
        var t2 = el("td", {html:value.name});
        var t3 = el("td", {html:moment(value.lastModified*1000).format("YYYY-MM-DD")});
        tr.appendChild(t2);
        tr.appendChild(t3);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    holder.appendChild(table);
    $(table).DataTable();
}


$(document).ready(function() {
    // Change to a table view on the explorer
    $("#btnList").click(function() {
        $("#gridView").addClass("hidden");
        $("#tableView").removeClass("hidden");
    });
    // Change to a block view on the explorer
    $("#btnBlock").click(function() {
        $("#gridView").removeClass("hidden");
        $("#tableView").addClass("hidden");
    });
    $("#tableView").on("click", "table.table tbody tr", function() {
        setFolder(this.getAttribute("data-id"));
    });
    $("#gridView").on("click", "section.file-block", function() {
        setFolder(this.getAttribute("data-id"));
    });

});
