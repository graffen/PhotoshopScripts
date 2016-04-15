var doc = app.activeDocument; // remember the document, the selected layer, the visibility setting of the selected layer
var currentLayer = doc.activeLayer; // remember the selected layer
var currentVisible = currentLayer.visible;// remember the visibility setting of the selected layer
var currentUnits = preferences.rulerUnits;// remember the current units

// Snapshot
var background = doc.artLayers[0]
var foreground = duplicateBackground(background);
transformForegroundLayer(foreground);
applyGaussianBlur(background, 100);
resizeAndCrop();
flatten();

// Select layer "Foreground"
// Canvas Size: Square from short edge length
// Merge layers

function duplicateBackground(layer) {
	// Duplicate layer - name "Foreground"
	var fg = layer.duplicate();
	fg.name = "Foreground";
	return fg;
}

function transformForegroundLayer(layer) {
	var userResampleMethod = app.preferences.interpolation;
	app.preferences.interpolation = ResampleMethod.BILINEAR;          // resample interpolation biliner
	layer.resize(60, 60, AnchorPosition.MIDDLECENTER);
	app.preferences.interpolation = userResampleMethod;	
}

function applyGaussianBlur(layer, amount) {
	layer.applyGaussianBlur(amount);
}

function resizeAndCrop() {
	var savedRuler= app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;
	var w = app.activeDocument.width;
	var h = app.activeDocument.height;
	if(w<h) app.activeDocument.resizeCanvas (w, w, AnchorPosition.MIDDLECENTER);
	if(w>h) app.activeDocument.resizeCanvas (h, h, AnchorPosition.MIDDLECENTER);
	//if w==h already square
	app.preferences.rulerUnits = savedRuler;
}

function flatten() {
	app.activeDocument.mergeVisibleLayers();
}