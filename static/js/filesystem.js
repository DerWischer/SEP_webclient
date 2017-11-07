var ROOT;
var filesystem;
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function generateGuid() {
	//http://guid.us/GUID/JavaScript
	return ("a" + S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}
function generateRandomFileSystem() {
	folderIds = ["a", "b", "m"];
	possibleChildren = [];
	for (var i=0;i<20;i++) {
		id = generateGuid();
		var type = Math.floor((Math.random() * 2) + 1) == 2 ? "folder" : "file";
		var children = [];
		var folder = folderIds.pop();
		if (!folder) {
			folder = ROOT;
		}
		filesystem[folder].children.push(id);
		for (var k=0;k<Math.floor((Math.random() * 4) + 1);k++) {
			if (possibleChildren.length == 0) {
				continue;
			}
			var child = possibleChildren.pop();
			if (child == folder) {
				continue;
			}
			children.push(child);
		}
		possibleChildren.push(id);
		filesystem[id] = {"id":id, "type":type, "parent":folder, "children":children, "name":generateGuid().split("-")[0], "lastModified":1507211462}
		if (type == "folder") {
			folderIds.push(id);
		}
	}
}
function exists(id) {
	return filesystem.hasOwnProperty(id);
}
function getChildren(id) {
	var children = [];
	$.each(filesystem[id].children, function(index, value) {
		children.push(filesystem[value]);
	});
	return children;
}

function getParent(id) {
	if (!filesystem[id].parent) {
		return filesystem[id];
	}
	return filesystem[filesystem[id].parent];
}
function setFolder(id) {
	var id = id || ROOT;
	if (!exists(id)) {
		return;
	}
	if (filesystem[id].type != "folder") {
		return;
	}
	RenderBreadCrumbPath(id);
   	displayList(id, getChildren(id));

}
function el(name, options) {
	var el = document.createElement(name);
	if (!options) {
		return el;
	}
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

$(document).ready(function() {
	var query = $.get("/filesystem")
	.done(function(data, status){
		ROOT = null;		
		filesystem = JSON.parse(data)['sent'];		
		$.each(filesystem, function(key, fileinfo) {
			 // iterate over files to find the root node
			if (fileinfo['parent'] === 'null') {												
				ROOT = key;					
				return false;
			}
		});		
	}).fail(function(data){
		filesystem = null;
		ROOT = null;		
	}).always(function(data){
		setFolder(ROOT);		
	});
});