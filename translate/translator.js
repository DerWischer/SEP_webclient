var ENGLISH = 0;
var SWEDISH = 1;
function translatePageText(dictionary) {
	var dictionary = dictionary || JSON.parse('{"Account":"Konto","Change Account":"Byt Konto","Logout":"Logga Ut","Login":"Logga In","Stop":"Sluta","Traces and Stuff":"Spårningar Och Saker","My Files":"Mina Filer","Shared With Me":"Delade Med Mig","Closed Files":"Stangda Filer","Opened Files":"Oppnade Filer","Last Modified Files":"Senast Andrade Filer","Trace":"Spåra","Notify Me Of Changes":"Meddela Mig Om Andringar","Close":"Stang","Name":"Namn","Date":"Datum","Build":"Bygg","Project":"Projekt","Design":"Design","Code":"Kod","Email":"Email","Customer":"Kund","Powder":"Pulver","Material":"Material","Printer":"Skrivare","File":"Fil","Files":"Filer","Build ID":"Bygg ID","Project ID":"Projekt ID","Design ID":"Design ID","Search":"Sok","Swedish":"Svenska","English":"Engelska"}');
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
