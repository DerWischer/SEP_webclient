/* =========================================================
 * reem.js v1.0.0
 * =========================================================
 * ========================================================= */
// <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>


var FileTraceability = 
{"12345": 
{
   "name":"Volvo",
   "project_name":"P01", 
   "project_id":"12345",
   "id":"12345",
   "File1":[{ "type":"CAD","id": "1234111", "project_id":"12345","name":"1.prt", "path":"c:-Documents-prt1-1.prt"},
            { "type":"CAD","id": "123454", "project_id":"12345","name":"2.prt", "path":"c:-Documents-prt1-2.prt"}, 
            { "type":"CAD","id": "123455", "project_id":"12345","name":"3.prt", "path":"c:-Documents-prt1-3.prt"}],

   "File2": [{"type":"STL",  "id": "1234","project_id":"12345" ,"name":"1.stl" ,"path":"c:-Documents-stl1-1.stl"} , 
             {"type":"STL",  "id": "12343","project_id":"12345" ,"name":"2.stl" ,"path":"c:-Documents-stl1-2.stl"} , 
		     {"type":"STL",  "id": "12344","project_id":"12345" ,"name":"3.stl" ,"path":"c:-Documents-stl1-3.stl"} ],

   "File3": [{"type":"Build", "id": "1234666","project_id":"12345", "name":"B001"} ,
             {"type":"Build", "id": "1534556","project_id":"12345", "name":"B002"} ],

   "image":[{"type":"Image", "id": "12345645", "project_id":"12345","Build_id":"B001" , "path":"c:-Documents-img1-1.img"} ,
            {"type":"Image", "id": "12346666645", "project_id":"12345","Build_id":"B002" , "path":"c:-Documents-img1-1.img"} ],

   "material":[{"type":"material","id": "12345621", "project_id":"12345" ,"Build_id":"B001" ,"material_name":"carbon"} ,
               {"type":"material","id": "1234500041", "project_id":"12345" ,"Build_id":"B002" ,"material_name":"Powder"}],

   "measures":[{ "type":"material_measure","id": "1234588", "project_id":"12345","Build_id":"B001","material_name":"carbon", "measure":"measure1.pdf"},
               { "type":"material_measure","id": "121234588", "project_id":"12345","Build_id":"B002","material_name":"Powder", "measure":"measure1.pdf"}    ],    

   "File4":[{"type":"SLM", "id": "12345111","project_id":"12345",  "Build_id":"B001", "SLM_id":"Boo1.slm", "name":"B0343",  "path":"c:-Documents-slm1-B001.slm"} ,
            {"type":"SLM","id": "12345222", "project_id":"12345", "Build_id":"B001", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B001.slm"} ,
			{"type":"SLM","id": "1234577722", "project_id":"12345", "Build_id":"B002", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B002.slm"}]
} ,

"12346": 
{
   "name":"SKF",
   "project_name":"P02", 
   "project_id":"12346",
   "id":"12346",
   "File1":[{ "type":"CAD","id": "2234111", "project_id":"12346","name":"1.prt", "path":"c:-Documents-prt1-1.prt"},
            { "type":"CAD","id": "2123454", "project_id":"12346","name":"2.prt", "path":"c:-Documents-prt1-2.prt"}, 
            { "type":"CAD","id": "223455", "project_id":"12346","name":"3.prt", "path":"c:-Documents-prt1-3.prt"}],

   "File2": [{"type":"STL",  "id": "2234","project_id":"12346" ,"name":"1.stl" ,"path":"c:-Documents-stl1-1.stl"} , 
             {"type":"STL",  "id": "22343","project_id":"12346" ,"name":"2.stl" ,"path":"c:-Documents-stl1-2.stl"} , 
		     {"type":"STL",  "id": "22344","project_id":"12346" ,"name":"3.stl" ,"path":"c:-Documents-stl1-3.stl"} ],

   "File3": [{"type":"Build", "id": "2234666","project_id":"12346", "name":"B001"} ,
             {"type":"Build", "id": "2534556","project_id":"12346", "name":"B002"} ],

   "image":[{"type":"Image", "id": "22345645", "project_id":"12346","Build_id":"B001" , "path":"c:-Documents-img1-1.img"} ,
            {"type":"Image", "id": "22346666645", "project_id":"12346","Build_id":"B002" , "path":"c:-Documents-img1-1.img"} ],

   "material":[{"type":"material","id": "212345621", "project_id":"12346" ,"Build_id":"B001" ,"material_name":"carbon"} ,
               {"type":"material","id": "2234500041", "project_id":"12346" ,"Build_id":"B002" ,"material_name":"Powder"}],

   "measures":[{ "type":"material_measure","id": "2234588", "project_id":"12346","Build_id":"B001","material_name":"carbon", "measure":"measure1.pdf"},
               { "type":"material_measure","id": "221234588", "project_id":"12346","Build_id":"B002","material_name":"Powder", "measure":"measure1.pdf"}    ],    

   "File4":[{"type":"SLM", "id": "22345111","project_id":"12346",  "Build_id":"B001", "SLM_id":"Boo1.slm", "name":"B0343",  "path":"c:-Documents-slm1-B001.slm"} ,
            {"type":"SLM","id": "22345222", "project_id":"12346", "Build_id":"B001", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B001.slm"} ,
			{"type":"SLM","id": "2234577722", "project_id":"12346", "Build_id":"B002", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B002.slm"}]
}

}



function fileTraceabilityToArr(FileTraceability){
   var retarray = [];
   var keys = Object.keys(FileTraceability);
   keys.forEach(function(key) {
      retarray.push(FileTraceability[key]);
   });
   return retarray;
 }


var fileTrace = fileTraceabilityToArr(FileTraceability);
var id = "2234111"; // to be changed 

function getprojectid(id)
{
 
     for (i = 0; i < fileTrace.length; i++) {	
	   if (fileTrace.id == id)
		   return(fileTrace.project_id);
     for (j = 0; j < fileTrace[i].File1.length; j++)
          if (fileTrace[i].File1[j].id == id)
            return(fileTrace[i].File1[j].project_id);
	 for (j = 0; j < fileTrace[i].File2.length; j++)
          if (fileTrace[i].File2[j].id == id)
            return(fileTrace[i].File1[j].project_id);
		
	 for (j = 0; j < fileTrace[i].File3.length; j++)
          if (fileTrace[i].File3[j].id == id)
            return(fileTrace[i].File1[j].project_id);
	  
     for (j = 0; j < fileTrace[i].File4.length; j++)
          if (fileTrace[i].File4[j].id == id)
             return(fileTrace[i].File4[j].project_id);
	 for (j = 0; j < fileTrace[i].image.length; j++)
          if (fileTrace[i].image[j].id == id)
             return(fileTrace[i].image[j].project_id);	
	 for (j = 0; j < fileTrace[i].material.length; j++)
          if (fileTrace[i].material[j].id == id)
             return(fileTrace[i].material[j].project_id);	 	
     for (j = 0; j < fileTrace[i].measures.length; j++)
          if (fileTrace[i].measures[j].id == id)
             return(fileTrace[i].measures[j].project_id);	 	
	}
     
}


function getFinaljson(project_id)
{
	  
     for (i = 0; i < fileTrace.length; i++) 
	 {
      if (fileTrace[i].project_id == project_id)
        return (fileTrace[i]);
     }
     
}

var fileTraceArr = getFinaljson(getprojectid(id));


function getname()
{    
  return fileTraceArr.name;
}


function getCADlist(project_id)
{   var listfiles = [];
      for (j = 0; j < fileTraceArr.File1.length; j++)
	  { 
          if (fileTraceArr.File1[j].project_id == project_id)
			  listfiles.push(fileTraceArr.File1[j].name ); 
      }
     return listfiles;
}

function getPRTlist(project_id)
{
	var listfiles = [];
       for (j = 0; j < fileTraceArr.File2.length; j++)
	   {   
          if (fileTraceArr.File2[j].project_id == project_id)
		   listfiles.push(fileTraceArr.File2[j].name );
		   
        }
     return listfiles;
}

function getBuildlist(project_id)
{
	var listfiles = [];
        //console.log(" 1234" ,fileTraceArr[i].File1);
       for (j = 0; j < fileTraceArr.File3.length; j++)
	    { 
	      if (fileTraceArr.File3[j].project_id == project_id)
		    listfiles.push(fileTraceArr.File3[j].name);   
        }
     return listfiles;
}

function getImage(project_id,build_id)
{
	 var listfiles = [];
      for (j = 0; j < fileTraceArr.image.length; j++)
	   { 
          if (fileTraceArr.image[j].project_id == project_id && fileTraceArr.image[j].Build_id == build_id)
			  listfiles.push(fileTraceArr.image[j].path);  
		      //console.log(" 1234" ,fileTraceArr[i].File1[j].project_id);
       }
     return listfiles;
}

function getMaterial(project_id,build_id)
{
	 var listfiles = [];
     for (j = 0; j < fileTraceArr.material.length; j++)
	  { 
        if (fileTraceArr.material[j].project_id == project_id  && fileTraceArr.material[j].Build_id == build_id)  
 			listfiles.push(fileTraceArr.material[j].material_name);  
			 
      }
     return listfiles;
}

function getMaterialMeasures(project_id,build_id,material_name)
{
	 var listfiles = [];
        for (j = 0; j < fileTraceArr.measures.length; j++)
		{ if (fileTraceArr.measures[j].project_id == project_id  && fileTraceArr.measures[j].Build_id == build_id
              	  && fileTraceArr.measures[j].material_name  == material_name)
			  listfiles.push(fileTraceArr.measures[j].measure);  
		      //console.log(" 1234" ,fileTraceArr[i].File1[j].project_id);
        }
     return listfiles;
} 


function getSLM(project_id,build_id)
{
	 var listfiles = [];
     for (j = 0; j < fileTraceArr.File4.length; j++)
	    {  if (fileTraceArr.File4[j].project_id == project_id  && fileTraceArr.File4[j].Build_id == build_id)
			  listfiles.push(fileTraceArr.File4[j].name );  
        }
     return listfiles;
}


 function createHREF(text){
      var a = document.createElement('a');
      var linkText = document.createTextNode(text);
      a.appendChild(linkText);
      a.setAttribute('href', "");
      a.setAttribute('class', 'list-group-item');
      return a;
    }
	
  function createHREFSUB(text){
      var a = document.createElement('a');
      var linkText = document.createTextNode(text);
      a.appendChild(linkText);
      a.setAttribute('href', "#");
      a.setAttribute('class', 'list-group-item');
	  a.setAttribute('data-parent','#SubMenu1'); 
      return a;
    }
	
   function appendItem(fileview, value, group){
    if (group == "1" )
	  var ahref = createHREF(value);
	else if (group == "0" )
	  var ahref = createHREFSUB(value);
    fileview.appendChild(ahref);
   }

  
   function createHREFMAIN(text,id_name,dataparent)
   {
      var a = document.createElement('a');
      var linkText = document.createTextNode(text);
	  var i = document.createElement('i');
	  i.setAttribute('class','fa fa-caret-down');
      a.appendChild(linkText);
	  a.appendChild(i);
      a.setAttribute('href', id_name);
      a.setAttribute('class', 'list-group-item');
      a.setAttribute('data-toggle','collapse');
	  a.setAttribute('data-parent',dataparent); 
	  return a ;
    } 
	
	 function createDIV(id_name)
   {
  	  var div = document.createElement('div');
	  div.setAttribute('class','collapse list-group-submenu');
	  div.setAttribute('id', id_name); 
	  return div; 
   }
 
				  
   function createsublist(fileview,href_id,project_id, build_id)
   {    
        var id_name = "SubMenu"+href_id;
  	    var href = createHREFMAIN(build_id,'#'+id_name,'#SubMenu');
		fileview.appendChild(href);
		var div = createDIV(id_name);
		fileview.appendChild(div);
		 
			
		// view SLM files
		var id_name = "SubMenu5"+href_id; 		   
		var href6 = createHREFMAIN("SLMs",'#'+id_name,'#SubMenu1');
		div.appendChild(href6);
		var div6 = createDIV(id_name);
		div.appendChild(div6);
        var files = getSLM(project_id,build_id); 	
        
		for (i = 0; i < files.length; i++) {
		   var ahrefl = createHREFSUB(files[i]);
           div6.appendChild(ahrefl);
        } 
		 
	    // view Images
	    var id_name = "SubMenu4"+href_id;   
		var href5 = createHREFMAIN("Images",'#'+id_name,'#SubMenu1');
		div.appendChild(href5);
		var div5 = createDIV(id_name);
		div.appendChild(div5);
        var xx = getImage(project_id,build_id); 
        for (f = 0; f < xx.length; f++) {
		   var ahrefl = createHREFSUB(xx[f]);
           div5.appendChild(ahrefl);
         }
		
	 
		// view Material 
		var id_name = "SubMenu6"+href_id;   
		var href4 = createHREFMAIN("Material",'#'+id_name,'#SubMenu1');
		div.appendChild(href4);
		var div4 = createDIV(id_name);
		div.appendChild(div4);
	    var material = getMaterial(project_id,build_id);
        var ahrefl = createHREFSUB(material);
        div4.appendChild(ahrefl);
		 
		 
		 
		 // view Measures 
		var id_name = "SubMenu2"+href_id;   
		var href3 = createHREFMAIN("Measures",'#'+id_name,'#SubMenu1');
		div.appendChild(href3);
		var div3 = createDIV(id_name);
		div.appendChild(div3);
        var files = getMaterialMeasures(project_id,build_id,material);  
        for (i = 0; i < files.length; i++) {
		   var ahrefl = createHREFSUB(files[i]);
           div3.appendChild(ahrefl);
         } 
	 
        
   }
   
   function createBuildNode(fileview,project_id)
   {    

	    var build_id = getBuildlist(project_id);
        console.log(build_id);
		for (t = 0; t < build_id.length; t++)  
		{  
	       createsublist(fileview,t,project_id, build_id[t]);
		}
   }



////////////////////////////////////////////////////////////


var myuser = "mazen" ; // example to be replaced with current user

function filesystemToArr(filesystem){
   var retVal = [];
   var keys = Object.keys(filesystem);
   keys.forEach(function(key) {
      retVal.push(filesystem[key]);
   });
   return retVal;
 }

var fileArr = filesystemToArr(filesystem);


 // return array of files names according to status ( return open files,  return closed files, or owner)
 function getFilesStatus(filesystem, status){
    var listfiles = [];
    for (i = 0; i < fileArr.length; i++) {
      if (fileArr[i].status == status || fileArr[i].owner == status )
          listfiles.push(fileArr[i].name);
       }
    return listfiles;
  } 

  // return array of files names according to user (return files shared with me)
  function getFilesUser(filesystem, user){
     var listfiles = [];
     for (i = 0; i < fileArr.length; i++) {
       //console.log(" 1234" ,fileArr[i].status);
         for (j = 0; j < fileArr[i].user.length; j++)
          if (fileArr[i].user[j] == user)
           listfiles.push(fileArr[i].name);
        }
     return listfiles;
   }


   // return array of files names according to lastModified date 
   function getFilesLastModified(filesystem, monthcnt){
     var listfiles = [];
     var cur = new Date();
     var beforedayscnt = new Date(cur.setMonth(cur.getMonth() - monthcnt)).toISOString().slice(0,10); // setDate, getDate can be used
     for (i = 0; i < fileArr.length; i++) {
       if ( fileArr[i].lastModified >= beforedayscnt)
           listfiles.push(fileArr[i].name);
        }
     return listfiles;
    }

   
 $(document).ready(function() {
      var fileview = document.getElementById("fileview4");
      $(fileview).empty();
      var users = getFilesUser(filesystem, myuser);
      for (i = 0; i < users.length; i++) {
        appendItem(fileview, users[i],"1");
      }
      var fileview = document.getElementById("fileview2");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, "closed");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
      var fileview = document.getElementById("fileview3");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, "open");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
      var fileview = document.getElementById("fileview1");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, myuser);
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }

      var fileview = document.getElementById("fileview5");
      $(fileview).empty();
      var files = getFilesLastModified(filesystem, 1); // 1 means one month
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
	  
/////// traceability 
	  var project_id =  getprojectid("2234111");  
	  var name = getname();
	  
	  var fileview = document.getElementById("fileview6");
      $(fileview).empty();
      var files = getCADlist(project_id);  
	  console.log(files);
      for (i = 0; i < files.length; i++) {
		  
        appendItem(fileview, files[i],"1");
      }
	   
	  var fileview = document.getElementById("fileview11");
      $(fileview).empty();
      appendItem(fileview, name,"1");
       
	  var fileview = document.getElementById("fileview12");
      $(fileview).empty();
      var files = getPRTlist(project_id);  
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"0"); 
      }
	  
	 var fileview = document.getElementById("demo7");
     $(fileview).empty();
	 createBuildNode(fileview,project_id); 
	  
 });
