var rootNodeId = "b";
var filesystem  = {
	"a": {"text":"a",
		"parent": "b",
		"type": "folder",
		"name": "foldera",
		"lastModified": 1507211462,
		"children": ["f"]
	},
	"b": {"text":"b",
		"parent": null,
		"type": "folder",
		"name": "folderb",
		"lastModified": 1507211462,
		"children": ["a", "c", "d"]
	},
	"d": {"text":"d",
		"parent": "b",
		"type": "folder",
		"name": "folderd",
		"lastModified": 1507211462,
		"children": []
	},
	"f": {"text":"f",
		"parent": "a",
		"type": "file",
		"name": "filef",
		"lastModified": 1507211462,
		"children": []
	},
	"c": {"text":"c",
		"parent": "b",
		"type": "file",
		"name": "filec",
		"lastModified": 1507211462,
		"children": []
	}
}
function getChildren(id) {
	var children = [];
	$.each(filesystem[id].children, function(index, value) {
		children.push(filesystem[value]);
	});
	return children;
}
function getParent(id) {
	if (id == null) {
		return filesystem;
	}
	return filesystem[filesystem[id].parent];
}
function setFolder(id) {
	/*Set the current window folder*/
	//windows.settings["currentFolder"] = folderId;
	//Rendering Functions Here
	
	//Calle's breadcrumb rendering
	RenderBreadCrumbPath(id);
	
	//Rendering Function finish
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
