console.log("javascript is working");

var File = {
	fileID:0,
	name:"Sample",
    lastModifiedDate: new Date("October 13, 2014 11:13:00"), //Have a look at UNIX TIMESTAMP
	createdDate: new Date("October 13, 2014 11:13:00") //moment.js
};

function className {
	this.user = "";
	this.setUser = function(user) {
		this.user = user;
	}
	
}

window.storage = {
	currentPath:"",
	user:""
}


function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}
 
function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

function render() {
	
}

function el(name, options) {
	var el = doucment.createElement(name);
	if (options.id) {
		el.id = options.id;
	}
	if (options.class) {
		el.className = class;
	}
	if (options.html) {
		el.innerHTML = options.html;
	}
	$.each(options, function(key, value) {
		el.setAttribute(key, value);
	});
	return el;
}

function ConstructFile(id, title, fileType){
	
	if(fileType == undefined)
		fileType = "Folder";
	
	var returnedFile = {
		fileID:id,
		Title:title,
		fileType:fileType,
		lastModifiedDate: new Date("October 13, 2014 11:13:00"),
		createdDate: new Date("October 13, 2014 11:13:00")
	
	}
	return returnedFile;
};

//Creates a folder



var testString = "Test: ";

var tree = new Tree(ConstructFile(0, "ONE"));
  

 
 
tree._root.children.push(new Node(ConstructFile(1, "TWO")));
tree._root.children[0].parent = tree._root;
 
tree._root.children.push(new Node(ConstructFile(2, "THREE")));
tree._root.children[1].parent = tree._root;
 
tree._root.children.push(new Node(ConstructFile(3, "FOUR")));
tree._root.children[2].parent = tree._root;
 
tree._root.children[0].children.push(new Node(ConstructFile(4, "FIVE")));
tree._root.children[0].children[0].parent = tree._root.children[0];
 
tree._root.children[0].children.push(new Node(ConstructFile(5, "SIX")));
tree._root.children[0].children[1].parent = tree._root.children[0];
 
tree._root.children[2].children.push(new Node(ConstructFile(6, "SEVEN")));
tree._root.children[2].children[0].parent = tree._root.children[2];

tree._root.children[0].children[1].children.push(new Node(ConstructFile(7, "EIGHT", ".STL")));
tree._root.children[0].children[1].children[0].parent = tree._root.children[0].children[1];

tree._root.children[0].children[1].children.push(new Node(ConstructFile(8, "NINE", ".STL")));
tree._root.children[0].children[1].children[1].parent = tree._root.children[0].children[1];



var GridViewOn = true;
function ConstructFileElement(data){
	var start = "";
	var fileTitle = data.Title;
	var displayType = "file-icon";
	if(GridViewOn != true)
		displayType = "file-list-element";
		
	switch(data.fileType) { //Make Folder the default, overwrite with STL
    case "Folder":
		start = "<div class=\""+displayType+" folder\" id=" + "file-id-" + data.fileID + "> <i class=\"fa fa-folder fa-3x \"  aria-hidden=\"true\"></i>";
        break;
    case ".STL":
        start = "<div class=\""+displayType+" file\" id=" + "file-id-" + data.fileID + "> <i class=\"fa fa-file-o fa-3x \"  aria-hidden=\"true\"></i>";
		fileTitle = data.Title + ".STL";
        break;
    default:
        break;
}
	
	
	var end = "</div>";
	
	var title = "<div class=\"file-title\">" + fileTitle + "</div>";
	
	return start + title + end;
	
};


//Renders the file system on a given node
function RenderFileSystem(node){
	var fileBrowser = document.getElementById("file-browser");
	var nodeChildren = node.children;
	
	
	//Clears the FileSystem window
	while (fileBrowser.firstChild) {
		fileBrowser.removeChild(fileBrowser.firstChild);
	}
	
	console.log(node);
	for (var i = 0, len = nodeChildren.length; i < len; i++) {
		
		var content = ConstructFileElement(nodeChildren[i].data)
		fileBrowser.innerHTML += content;

	}
};

function RenderBreadCrumbPath(currentPath){
	var breadCrumb = document.getElementById("breadcrumb");
	
	//Clear the breadcrumb
	while ($("#breadcrumb > div").length > 2) {
		breadCrumb.removeChild(breadCrumb.lastChild);
	}

	for (var i = 0, len = currentPath.length-1; i <= len; i++) {
		//Skip if root
		if(currentPath[i].parent == null)
			continue;
		var breadCrumbElement = "<div class=\"parallelogram-breadcrumb btn btn-xs myBtn non-root-crumb \" id=\"breadcrumbIndex-"+i+"\"> <span>"+currentPath[i].data.Title+"</span> </div>";
		breadCrumb.innerHTML += breadCrumbElement;
		
	}
}

function RenderNavTree(root){
	var navTree = document.getElementById("nav-tree");
	var rootCoordinate = "-root";
	
	navTree.innerHTML += RecursivelyConstructNavTree(root, rootCoordinate);
}

function RecursivelyConstructNavTree(node, currentCoordinates){
	var returnString = "";

	for (var i = 0, length = node.children.length; i < length; i++) {
		//If anything but a folder, don't draw it onto the nav-tree.
		if(node.children[i].data.fileType != "Folder")
			continue;
		returnString += ("<li class=\"nav-item\" id=\"node-id"+(currentCoordinates+"-"+i)+"\">" + node.children[i].data.Title + RecursivelyConstructNavTree(node.children[i], (currentCoordinates+"-"+i)) + "</li>");
	}
	
	return "<ul class=\"nav-list-container\">" + returnString + "</ul>";
}

//https://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
var searchNode; 
function SearchTitleDF(searchString){
	var stack = [], node, ii;
	stack.push(tree._root);

	while (stack.length > 0) {
		node = stack.pop();
		if (node.data.Title == searchString) {
			console.log(node);
			return node.parent;
			break;
		} 
		else if (node.children && node.children.length) {
			for (i = 0; i < node.children.length; i += 1) {
				stack.push(node.children[i]);
			}
		}
	}
}






var currentPath = [tree._root];

function traverseToIndexInPath(index){

	var path = currentPath;
	
	//Returns if already at root
	if(path[path.length-1].parent == null)
			return;
	
	;
	
	//Set Path to include only root
	path = path.slice(0, index+1);
	console.log(index + 1);
	
	renderAll(path[path.length-1], path);
};

function traverseParent(){
	var path = currentPath;
	
	//Exits if there is no parent to current open folder
	if(path[path.length-1].parent == null)
			return;
	
	path.pop();
	renderAll(path[path.length-1], path);
};

function traverseChild(childNodeID){
		var path = currentPath;
	
		var currentFolder = currentPath[currentPath.length-1];
		//Iterate through each Child in current path
		for (var i = 0, length = currentFolder.children.length; i < length; i++) {
			if(currentFolder.children[i].data.fileID == childNodeID){
					path.push(currentFolder.children[i]);
					renderAll(currentFolder.children[i], path);
					return;
			}
        }
	

};


function traverseByCoordinates(coordinates, root){
	var path = [root];
	
	for (var i = 0, length = coordinates.length-1; i <= length; i++) {
		path.push(path[path.length-1].children[Number(coordinates[i])]);
	}
	
	renderAll(path[path.length-1], path);
};

function traverseToNode(node){
	renderAll(node, getPathToNode(node));
}

function getPathToNode(node){
	
	
	var path = [node];
	
	while(path[0].parent != null){
		path.unshift(path[0].parent);
	}
	console.log(path);
	return path;
};




function renderAll(node, path){
	currentPath = path;
	RenderFileSystem(node, true);
	RenderBreadCrumbPath(path);
	
}

function reRenderAll(){
	
	RenderFileSystem(currentPath[currentPath.length-1], true);
	RenderBreadCrumbPath(currentPath);
}

function NavTreeIdToCoords(id){
	var parsedID = id.split((id.indexOf("-root") + 5)); 
	var coords = id.substring(id.indexOf("-root")+6, id.length).split('-');
	
	return coords;
}

 


Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

/*ELEMENT TRIGGERS*/

$('.file-browser').on('click', ".folder", function(){
	var id = this.id[this.id.length-1];
	traverseChild(id);
});

$(".breadcrumb-element").on("click", "#root-nav", function(){
	traverseToIndexInPath(Number(0));
});

$(".breadcrumb-element").on("click", ".non-root-crumb", function(){
	//16 is the position for the index value in the breadcrumbIndex- ID.
	var index = this.id.slice(16);
	
	traverseToIndexInPath(Number(index));
	
});


$("#nav-tree").on("click", ".nav-item", function(e){
	//do not trigger event if parent is clicked
	if (e.target == this) {
		var parsedCoords = NavTreeIdToCoords(this.id);
		traverseByCoordinates(parsedCoords, tree._root);
    }
});

$("#grid-btn").click( function(e){
	GridViewOn = true;
	reRenderAll();
});

$("#list-btn").click( function(e){
	GridViewOn = false;
	reRenderAll();
});

$("#search-btn").click( function(e){
	var result = SearchTitleDF(document.getElementById("search-field").value);
	if(result == undefined)
		alert("No File Found")
	else
		traverseToNode(result);
});

/*END OF TRIGGERS*/


ConstructFileElement(tree._root.data);


renderAll(tree._root, currentPath);
RenderNavTree(tree._root);


