/* =========================================================
 * reem.js v1.0.0
 * =========================================================
 * ========================================================= */
// <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>


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
      //console.log(" 1234" ,fileArr[i].status);
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
     //console.log(beforedayscnt);
     for (i = 0; i < fileArr.length; i++) {
       if ( fileArr[i].lastModified >= beforedayscnt)
           listfiles.push(fileArr[i].name);
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

   function appendItem(fileview, value){
    var ahref = createHREF(value);
    fileview.appendChild(ahref);
   }

  function drawfile(fileview){
    var users =  getFilesUser(filesystem,myuser);
    for (i = 0; i < users.length; i++) {
      appendItem(fileview , users[i]);
     }
  }

 $(document).ready(function() {
      var fileview = document.getElementById("fileview4");
      $(fileview).empty();
      var users = getFilesUser(filesystem, myuser);
      for (i = 0; i < users.length; i++) {
        appendItem(fileview, users[i]);
      }
      var fileview = document.getElementById("fileview2");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, "closed");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i]);
      }
      var fileview = document.getElementById("fileview3");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, "open");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i]);
      }
      var fileview = document.getElementById("fileview1");
      $(fileview).empty();
      var files = getFilesStatus(filesystem, myuser);
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i]);
      }

      var fileview = document.getElementById("fileview5");
      $(fileview).empty();
      var files = getFilesLastModified(filesystem, 1); // 1 means one month
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i]);
      }
 });
