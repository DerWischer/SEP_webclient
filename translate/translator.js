var ENGLISH = 0;
var SWEDISH = 1;
function translatePageText(dictionary) {
	var dictionary = dictionary || JSON.parse('{"account":"konto", "name":"namn", "date":"datum", "shared with me":"delat med mig"}');
	$("body .translate").each(function() {
		$(this).text(dictionary[$(this).text().trim().toLowerCase()]);
	});
}
function translatePage(language) {
	var languageFile;
	switch (language) {
		case ENGLISH:
			languageFile = "languages/english.json"; 
			break;
		case SWEDISH:
			languageFile = "languages/swedish.json"; 
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
