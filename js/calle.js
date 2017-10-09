function findPathToRoot(startID ,inputFileSystem){
	
	console.log(startID);
	
	var currFile = inputFileSystem[startID];
	var path = [[startID, currFile]];
	
	while(currFile["parent"] != null){
		var nextID = currFile["parent"];
		currFile = inputFileSystem[nextID];
		path.unshift([nextID, currFile]);
	}
	return path;
}

function RenderBreadCrumbPath(path){
	var breadCrumb = document.getElementById("breadcrumb");
	
	//Clear the breadcrumb
	while ($("#breadcrumb > div").length > 2) {
		breadCrumb.removeChild(breadCrumb.lastChild);
	}

	for (var i = 0, len = path.length-1; i <= len; i++) {
		//Skip if root
		if(path[i][1].parent == null)
			continue;
		var breadCrumbElement = "<div class=\"parallelogram-breadcrumb btn btn-xs myBtn non-root-crumb \" id=\"breadcrumbIndex-"+i+"\" data-id=\""+path[i][0]+"\"> <span>"+path[i][1]["name"]+"</span> </div>";
		breadCrumb.innerHTML += breadCrumbElement;
		
	}
}

$(document).ready(function() {
	RenderBreadCrumbPath(findPathToRoot("a", filesystem));
	
	
	$("#fileview").on("click", ".selectable", function(e){
		var dataId = this.getAttribute("data-id");
		RenderBreadCrumbPath(findPathToRoot(dataId, filesystem));
	});
	
	$(".breadcrumb-element").on("click", ".non-root-crumb", function(){
		var dataId = this.getAttribute("data-id");
		drawJSONexplorer(filesystem[dataId]);
		RenderBreadCrumbPath(findPathToRoot(dataId, filesystem));
		
	});
	
	$(".breadcrumb-element").on("click", ".breadcrumb-base", function(){
		drawJSONexplorer(filesystem[root]);
		RenderBreadCrumbPath(findPathToRoot(root, filesystem));
	});
	
	
	
});

var root = "b";









