/* =========================================================
 * reem.js v1.0.0
 * =========================================================
 * ========================================================= */
// <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>

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
 		"children": ["a", "c"]
 	},
 	"d": {"text":"d",
 		"parent": null,
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

 // function to convert from one JSON shape to other (to be input to tree view (left side bar))
 unflatten = function( filesystem, parent, tree )
 {
 tree = typeof tree !== 'undefined' ? tree : [];
 parent = typeof parent !== 'undefined' ? parent : { text: null };
 var nodes = _.filter(filesystem, function(child)  { return child.parent == parent.text; });
 if( !_.isEmpty(nodes) ){
 		if( parent.text == null ){
 			 tree = nodes;
 		} else
 		{
 			 parent['nodes'] = nodes
 		}
 		_.each( nodes, function( child ){ 
 			unflatten( filesystem, child ) 
 		} );
  }
 	return tree;
 }


 var test_tree = unflatten(filesystem);

 $(document).ready(function() {

 	$('#tree').treeview({
 		data: test_tree,
 		levels: 5,
 		backColor: 'hsla(290,60%,70%,0.3)'
 	});

 	$('#tree').treeview('collapseAll', {
 		silent: true
 	});
 });
