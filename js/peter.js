//JSON JavaScript Object Notation
var filesystem = {
	"a":{"parent":"b", "type":"folder", "name":"folder1","lastModified":1507211462, "children":[]},
	"b":{"parent":null, "type":"folder", "name":"folder2","lastModified":1507211462, "children":["a", "c"]},
	"c":{"parent":"b", "type":"file", "name":"file1","lastModified":1507211462, "children":[]}
}
window.settings = {
	currentFolder:null
}
function setFolder(folderId) {
	/*Set the current window folder*/
	windows.settings["currentFolder"] = folderId;
	//Rendering Functions Here
	
	//Calle's breadcrumb rendering
	RenderBreadCrumbPath(findPathToRoot(folderId, filesystem));
	
	//Rendering Function finish
}
function search(m) {
	$(filesystem, function(key, value) {
		
	});
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
		var section = el("section", {class:"file"});
		var h3 = el("h3", {html:item.name});
		var i = el("i", {class:"fa " + iconName + " fa-5x"});
		var h5 = el("h5", {html:"Folder Changed: " + moment(item.lastModified*1000).format("YYYY-MM-DD")});
		section.appendChild(h3);
		section.appendChild(i);
		section.appendChild(h5);
		holder.appendChild(section);
	});
}
$(document).ready(function() {
	var fileview = document.getElementById("fileview"); //equivalant to $("#fileview")[0];
	$(fileview).empty();
 	drawJSONfileSystem(fileview, filesystem);
 	$("#search-type").resizeselect();
});
(function($, window){
  var arrowWidth = 30;

  $.fn.resizeselect = function(settings) {  
    return this.each(function() { setFolder

      $(this).change(function(){
        var $this = $(this);

        // create test element
        var text = $this.find("option:selected").text();
        var $test = $("<span>").html(text).css({
            "font-size": $this.css("font-size"), // ensures same size text
            "visibility": "hidden"               // prevents FOUC
        });


        // add to parent, get width, and get out
        $test.appendTo($this.parent());
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + arrowWidth);

        // run on start
      }).change();

    });
  };

  // run by default
  $("select.resizeselect").resizeselect();                       

})(jQuery, window);
