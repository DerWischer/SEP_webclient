//Returns an array [[ID, FileInPath], ...] containing the steps necessary to reach root from 'startID'
function findPathToRoot(startID ,inputFileSystem){
	var currFile = inputFileSystem[startID];
	var path = [[startID, currFile]];

	while(currFile["parent"] != null){
		var nextID = currFile["parent"];
		currFile = inputFileSystem[nextID];
		path.unshift([nextID, currFile]);
	}
	return path;
}

//Draws the breadcrumb with the given path. INPUT FORMAT: [[RootID, RootFile], ... , [LastID, LastFile]]
function RenderBreadCrumbPath(id){
	var holder = $("#breadcrumb");
	
	
	
	$(holder).empty();
	breadcrumbs = [];
	var currentFolder = id;
	while (currentFolder != ROOT) {
		console.log("creating element" + currentFolder);
		var breadcrumb = el("div", {"class":"custom-breadcrumb btn btn-xs non-root-crumb", "data-id":currentFolder});
		var span = el("span", {html:filesystem[currentFolder].name});
		
		console.log(currentFolder);
		breadcrumb.appendChild(span);
		breadcrumb.oncontextmenu = function(e) {
			MoveDropdownItemsToElement(this);
			e.preventDefault();
		}
		breadcrumbs.unshift(breadcrumb);
		
	
		currentFolder = getParent(currentFolder).id;
	}
	
	//Remove the root
	//breadcrumbs.shift();
	
	console.log(breadcrumbs);
	
	$.each(breadcrumbs, function(key, value) {
		if(value["data-id"] != ROOT)
			holder.append(value);
		
	});
}


function onBreadcrumbPress(ev){
	console.log("press");
}


function MoveDropdownItemsToElement(inputElement){
	var rect = inputElement.getBoundingClientRect();
	console.log(rect.bottom);
	

	var recycledDropdown = document.getElementById('breadcrumb-dropdown');
	//recycledDropdown = $("#breadcrumb-dropdown").get();
	
	recycledDropdown.style.left = (rect.left-2)+"px";
	recycledDropdown.style.top = rect.bottom+"px";
	//recycledDropdown.style.display = "none";
	
}


$(document).ready(function() {


	
	
	//navtree is clicked
	$("#fileview").on("click", ".selectable", function(e){
		var dataId = this.getAttribute("data-id");
		setFolder(dataId);
	});
	//root folder is clicked
	$("#root-nav").on("click", function(){
		setFolder(ROOT);
	});
	//root folder is clicked
	$("#breadcrumb").on("click", ".non-root-crumb", function(){
		setFolder(this.getAttribute("data-id"));
	});
	
	$("#breadcrumb .custom-breadcrumb").on("click", function(){
		var id = this.getAttribute('data-id');
		alert("click");
		//MoveDropdownItemsToElement(this);
	});
	
	
	
	var rootCrumb = document.getElementById('root-nav');
	
	rootCrumb.oncontextmenu = function(e) {
		MoveDropdownItemsToElement(this);
		e.preventDefault();
	}
	
	
	
	
	
	RenderBreadCrumbPath(ROOT);
	
});
<<<<<<< HEAD
RenderBreadCrumbPath(ROOT);
=======











>>>>>>> cec6e0e073815603c5819b8fd3c6ed8c16225fe0
