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
		var breadcrumb = el("div", {"class":"custom-breadcrumb btn btn-xs non-root-crumb", "data-id":currentFolder});
		var span = el("span", {html:filesystem[currentFolder].name});
		breadcrumb.appendChild(span);
		breadcrumb.oncontextmenu = function(e) {
			console.log(this);
			MoveDropdownItemsToElement(this);
			e.preventDefault();
		}
		breadcrumbs.unshift(breadcrumb);
		currentFolder = getParent(currentFolder).id;
	}
	//Remove the root
	//breadcrumbs.shift();
	$.each(breadcrumbs, function(key, value) {
		holder.append(value);
	});
}


function MoveDropdownItemsToElement(inputElement){
	createDropdownMenu(inputElement);
	var rect = inputElement.getBoundingClientRect();
	var recycledDropdown = document.getElementById('breadcrumb-dropdown');
	
	
	
	
	recycledDropdown.style.left = (rect.left)+"px";
	recycledDropdown.style.top = (rect.bottom)+"px";
	
	if(recycledDropdown.childElementCount > 0)
		recycledDropdown.style.display = "block";
	else
		recycledDropdown.style.display = "none";
	
		
	
	
}

function createDropdownMenu(elem){
	var id = elem.getAttribute('data-id');
	var newElem = [];
	$.each(getChildren(id), function(key, value){
		if (value.type != "folder") {
			return;
		}
		var listTag = el("li", {"class":"dropdown-element", "data-id":value.id});
		var tag = el("a", {"href":"#", html:value.name});
		listTag.appendChild(tag);
		newElem.push(listTag);
	});
	
	var holder = $("#breadcrumb-dropdown");
	$(holder).empty();
	
	$.each(newElem, function(key, value) {
		holder.append(value);
	});	
}

function HideDropdownElement(){
	var recycledDropdown = document.getElementById('breadcrumb-dropdown');
	recycledDropdown.style.display = "none";
}

function CreateSearchCrumb(searchTerm){
	var holder = $("#breadcrumb");
	$(holder).empty();
	var breadcrumb = el("div", {"class":"custom-breadcrumb btn btn-xs non-root-crumb", "data-id":ROOT});
	var span = el("span", {html:"\""+searchTerm+"\""});
	breadcrumb.appendChild(span);
	holder.append(breadcrumb);
}



$(document).ready(function() {
	
	$(document).click(function() {
		HideDropdownElement();
	});
	
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
	//breadcrumb dropdown element is clicked
	$("#breadcrumb-dropdown").on("click", ".dropdown-element", function(){
		console.log(this.getAttribute("data-id"));
		setFolder(this.getAttribute("data-id"));
	});
	
	
	$("#breadcrumb .custom-breadcrumb").on("click", function(){
		var id = this.getAttribute('data-id');
		setFolder(id);
	});
	var rootCrumb = document.getElementById('root-nav');
	rootCrumb.oncontextmenu = function(e) {
		createDropdownMenu(rootCrumb);
		MoveDropdownItemsToElement(this);
		e.preventDefault();
	}
	
	RenderBreadCrumbPath(ROOT);
});
