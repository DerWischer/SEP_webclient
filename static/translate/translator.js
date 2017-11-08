var ENGLISH = 0;
var SWEDISH = 1;
function translatePageText() {
	var dictionary = SWEDISH_LANGUAGE;
	$("body .translate").each(function() {
		$(this).text(dictionary[$(this).text().trim()]);
	});
	$("body input.translate").each(function() {
		$(this).attr("placeholder", dictionary[$(this).attr("placeholder").trim()]);
	});
}
function translatePage(language) {
	var languageFile;
	switch (language) {
		case ENGLISH:
			languageFile = "languages/english.json"; 
			break;
		case SWEDISH:
			languageFile = "languages/swedish.js";
			break;
	}
	$.ajax({
		url:languageFile,
		crossOrigin:true,
		dataType:"jsonp",
		success: function(json) {
			translatePageText(json);
		}
	});
}

$(document).ready(function() {
    $("#swedish-btn").click(function() {
        translatePageText();
    });
});
