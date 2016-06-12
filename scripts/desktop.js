$(document).ready(function(){

	//Setup top panel clock
	setInterval(function(){
		$( "#panelClockText").text(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" } ) );
	}, 1000);

	$( "#launcherHelpButton" ).click(function(){
		createWindow("PDFViewer", {url: "../pages/resume.pdf"});
	});

	initWindows();

});

function createWindow(windowType, windowVars){
	switch(windowType){
		case "PDFViewer":
			createPDFViewerWindow(windowVars);
			break;
		default:
			console.log("Error: tried to create unimplemented window type: " + windowType);
	}
}

function createPDFViewerWindow(windowVars){
	$.get("../windows/pdfViewerWindow.html", function(data){
		$( "#screen" ).append(data).promise().done(function(){
			initWindows();
		});
	}).fail(function(){
		console.log("Loading PDFViewer window from server failed. Are you running locally?");
	});
}

//Setup all windows with draggable and resizable
//(will eventually be changed to target newly created windows only)
function initWindows(){

	$( ".windowContents" ).each(function(index){
		$(this).mousedown(function(evt){
			evt.stopPropagation();
		});
	});

	$( ".window" ).each(function(index){
		$(this).draggable({
			//TODO: dynamically update containment to prevent windows being dragged off the bottom of the screen
			containment: [-10000, 24, 10000, 10000],
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			stop: function(event, ui) {
				$('iframe').css('pointer-events','auto');
			}
		}).resizable({
			handles: "n, s, e, w, ne, se, nw, sw",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			stop: function(event, ui) {
				$('iframe').css('pointer-events','auto');
			}
		});
	});

	$( ".headerClose" ).each(function(index){
		$(this).click(function(evt){
			$(this).closest( ".windowContainer" ).remove();
		});
	});

}