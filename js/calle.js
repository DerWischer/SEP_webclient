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
	while (getParent(id) != ROOT) {
		var breadcrumb = el("div", {"class":"custom-breadcrumb btn btn-xs non-root-crumb", "data-id":id});
		var span = el("span", {html:getParent(id).name});
		breadcrumb.appendChild(span);
		breadcrumbs.unshift(breadcrumb);
		id = getParent(id).id;
	}
	$(breadcrumbs, function(key, value) {
		holder.appendChild(value);
	});
}

$(document).ready(function() {
	RenderBreadCrumbPath(null);
	//navtree is clicked
	$("#fileview").on("click", ".selectable", function(e){
		var dataId = this.getAttribute("data-id");
		setFolder(dataId);
	});
	//individual breadcrumb is clicked
	$("#breadcrumb .custom-breadcrumb").on("click", function(){
		setFolder(this.getAttribute("data-id"));
	});
	//root folder is clicked
	$(".custom-breadcrumb:first-child").on("click", function(){
		setFolder();
	});
});


var root = "b";
RenderBreadCrumbPath(findPathToRoot(root, filesystem));








