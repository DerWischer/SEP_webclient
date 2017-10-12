/* =========================================================
 * reem.js v1.0.0
 * =========================================================
 * ========================================================= */
// <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>



$(document).ready(function() {
	$("#sidebar").css("height", $(window).height()-40 + "px");
	return;
  var fileview = document.getElementById("fileview"); //equivalant to $("#fileview")[0];
  $(fileview).empty();
  //var el = document.createElement("button");
  //var txt = document.createTextNode("Home");
  var ul = el("ul",{class:"naviagtion"});
  var il1 = el("li", {});
  var el1 = el("p",{"html":"Home",class:"selectable"});
  il1.appendChild(el1);
  var il2 = el("li",{});
  var el2 = el("p",{"html":"Shared With me",class:"selectable"});
  il2.appendChild(el2);
  ul.appendChild(il1);
  ul.appendChild(il2);
  fileview.appendChild(ul);

  $(il1).on("click", function () {
    setFolder(null);
    console.log("set folder to null");
  });

});
