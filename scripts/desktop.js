var windows = [];

$(document).ready(function(){

	//Setup top panel clock
	setInterval(function(){
		$( "#panelClockText").text(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" } ) );
	}, 1000);

	$( "#launcherHelpButton" ).click(function(){
		createWindow("PDFViewer", {url: "../pages/resume.pdf"});
	});

	createWindow("PDFViewer");

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
		var newWindow = $(data);
		initWindow(newWindow);
		$( "#screen" ).append(newWindow);
	}).fail(function(){
		console.log("Loading PDFViewer window from server failed. Are you running locally?");
	});
}

function orderWindows(){
	$(".window").each(function(index){
		if ( $(this).attr("windowID") === undefined ){
			var id = windows.length;
			$(this).attr("windowID", id);
			windows[id] = id;
		}
		$(this).css("z-index", 100 + windows.indexOf(parseInt($(this).attr("windowID"))));
	});
}

function initWindow(windowContainer){

	windowContainer.find( ".windowContents" ).each(function(index){
		$(this).mousedown(function(evt){
			evt.stopPropagation();
		}).mousedown( function() {
			windows.push(windows.splice(windows.indexOf(parseInt($(this).attr("windowID"))), 1)[0]);
			orderWindows();
		});
	});

	windowContainer.find( ".window" ).each(function(index){
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
		}).mousedown( function() {
			windows.push(windows.splice(windows.indexOf(parseInt($(this).attr("windowID"))), 1)[0]);
			orderWindows();
		});

		orderWindows();

	});

	windowContainer.find( ".headerClose" ).each(function(index){
		$(this).click(function(evt){
			windows.splice($(this).closest( ".window" ).attr("windowID"), 1);
			$(this).closest( ".windowContainer" ).remove();
		});
	});

}