var ROOT = "b";
var filesystem  = {
	"a": {
		"id":"a",
		"parent": "b",
		"type": "folder",
		"name": "Folder-A",
		"lastModified": 1507211462,
		"children": ["f", "g"]
	},
	"b": {
		"id":"b",
		"parent": null,
		"type": "folder",
		"name": "Folder-B",
		"lastModified": 1507211462,
		"children": ["a", "c", "d"]
	},
	"d": {
		"id":"d",
		"parent": "b",
		"type": "folder",
		"name": "Folder-D",
		"lastModified": 1507211462,
		"children": []
	},
	"f": {
		"id":"f",
		"parent": "a",
		"type": "folder",
		"name": "folder-F",
		"lastModified": 1507211462,
		"children": ["c", "h"]
	},
	"c": {
		"id":"c",
		"parent": "f",
		"type": "folder",
		"name": "folder-C",
		"lastModified": 1507211462,
		"children": []
	},
	"g": {
		"id":"g",
		"parent": "a",
		"type": "folder",
		"name": "Folder-G",
		"lastModified": 1507211462,
		"children": []
	},	
	"h": {
		"id":"h",
		"parent": "f",
		"type": "folder",
		"name": "Folder-H",
		"lastModified": 1507211462,
		"children": ["i"]
	},
	"i": {
		"id":"i",
		"parent": "h",
		"type": "folder",
		"name": "Folder-I",
		"lastModified": 1507211462,
		"children": ["j"]
	},
	"j": {
		"id":"j",
		"parent": "i",
		"type": "folder",
		"name": "Folder-J",
		"lastModified": 1507211462,
		"children": ["k"]
	},
	"k": {
		"id":"k",
		"parent": "j",
		"type": "folder",
		"name": "Folder-K",
		"lastModified": 1507211462,
		"children": ["l", "m"]
	},
	"l": {
		"id":"l",
		"parent": "k",
		"type": "folder",
		"name": "Folder-L",
		"lastModified": 1507211462,
		"children": []
	},
	"m": {
		"id":"m",
		"parent": "k",
		"type": "folder",
		"name": "Folder-M",
		"lastModified": 1507211462,
		"children": []
	}
}
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
	drawJSONexplorer(id, getChildren(id));
   	displayTable(id, getChildren(id));
   	
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
	generateRandomFileSystem();
	setFolder(ROOT);
});
