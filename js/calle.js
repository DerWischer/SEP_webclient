var currentPath = [];


function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}

function convertFileSystemToTree(fileSystem){
	var root = null;

	$.each(fileSystem, function(id, value) {
		if (value == null) 
			return;
		
		var newNode = new Node(value);
		newNode.parent = fileSystem[value["parent"]];
		
		for (i = 0; i < value["children"].length; i++) { 
			newNode.children.push(fileSystem[(value["children"][i])]);
		}
		
		newNode.data["id"] = id;
		
		if(newNode.parent == null) 
			root = newNode;
	});
	
	return root;
}

currentPath = [convertFileSystemToTree(filesystem)];


