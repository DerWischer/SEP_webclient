function setFolder(id) {
	/*Set the current window folder*/
	//windows.settings["currentFolder"] = folderId;
	//Rendering Functions Here

	//Calle's breadcrumb rendering
	RenderBreadCrumbPath(id);

	//Rendering Function finish
}
(function($, window){
  var arrowWidth = 30;

  $.fn.resizeselect = function(settings) {
    return this.each(function() { setFolder

      $(this).change(function(){
        var $this = $(this);

        // create test element
        var text = $this.find("option:selected").text();
        var $test = $("<span>").html(text).css({
            "font-size": $this.css("font-size"), // ensures same size text
            "visibility": "hidden"               // prevents FOUC
        });


        // add to parent, get width, and get out
        $test.appendTo($this.parent());
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + arrowWidth);

        // run on start
      }).change();

    });
  };

  // run by default
  $("select.resizeselect").resizeselect();

})(jQuery, window);
