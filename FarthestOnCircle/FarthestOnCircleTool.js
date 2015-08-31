define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "esri/opsdashboard/MapToolProxy",
  "esri/symbols/PictureMarkerSymbol",
  "esri/graphic",
  "esri/tasks/FeatureSet",
  "esri/tasks/RasterData",
  "esri/tasks/Geoprocessor",
  "esri/SpatialReference",
  "dojo/text!./farthestOnCircleTemplate.html"
], function (declare, lang, _WidgetBase, _TemplatedMixin,
  MapToolProxy,
  PictureMarkerSymbol, Graphic, FeatureSet, RasterData, Geoprocessor, SpatialReference, templateString
) {
	return declare("FarthestOnCircle", [_WidgetBase, _TemplatedMixin, MapToolProxy], {
		templateString: templateString,
		constructor: function () {
		
			// Create the graphic for the push pin
			var iconPath = location.href.replace(/\/[^/]+$/, '/');
			var symbol = new PictureMarkerSymbol(iconPath + "RedPin1LargeB.png", 15, 30);
			symbol.yoffset = 10;
			this.pushPinGraphic = new Graphic(null, symbol);
		},
		hostReady: function () {

			// Update the size of the user experience
			this.setDisplaySize({
				width: 750,
				height: 95
			});

			return this.mapWidgetProxy.createGraphicsLayerProxy().then(lang.hitch(this, function (graphicsLayerProxy) {
			  this.pushPinGraphicsLayerProxy = graphicsLayerProxy;

			  // Activate the drawing activity when the graphics layer is ready
			  this.activateMapDrawing({geometryType: "point"});
			}));
		},

		availableDisplaySizeChanged: function (availableSize) {
			// Update the size of the user experience
			this.setDisplaySize({
				width: Math.min(availableSize.width / 2, 600),
				height: 40
			});
		},
		mapDrawComplete: function (geometry) {
		  // When the drawing activity has been performed by the user, use the resulting point as the input parameter to the FarthestOnCircle service
		  if (!geometry)
			return;

		  this.pushPinGraphicsLayerProxy.clear();

		  // Immediately show a feedback for the user
		  this.showPushPin(geometry);

		},
		clickMap: function () {
			// Activate the drawing activity when the graphics layer is ready
			this.activateMapDrawing({geometryType: "point"});
		},
		showPushPin: function (geometry) {
  
		  // Update the position of the push pin graphic
		  this.pushPinGraphic.setGeometry(geometry);

		  // Update the host graphics layer
		  this.pushPinGraphicsLayerProxy.addOrUpdateGraphic(this.pushPinGraphic);
		},
		deactivateMapTool: function () {
		  // Deactivate the map tool when the Done button is clicked
		  // Clean up then deactivating
		  this.deactivateMapDrawing();
		  this.mapWidgetProxy.destroyGraphicsLayerProxy(this.pushPinGraphicsLayerProxy);

		  // Call the base function
		  this.inherited(arguments, []);
		},
		
		farthestOnCircleStatus: function (jobInfo) {
		  console.log(jobInfo.jobStatus);
		},
		
		farthestOnCircleJobComplete: function (jobInfo) {
		  console.log("getting data");
		  window.gp.getResultData(jobInfo.jobId, "Hours_of_Transit", lang.hitch(this, this.displayFarthestOnCircleResult));
		},
		
		displayFarthestOnCircleResult: function (result, messages) {
		  
		  //gpLayer = new ArcGISDynamicMapServiceLayer(result.value.url);
		  //gpLayer.ID = "Farthest On Circle";
          //gpLayer.Opacity = .65;
		  
		  // Add the gpLayer to the map
		  // This capability is currently not available in OpsDashboard API.  It does not support adding layers to the map.
		  // Vani Nellaiappan is going to discuss the addition of this capability with the OpsDashboard team as an enhancement request
		},
		
		runAnalysis: function () {
		
		  gp = new Geoprocessor("https://jfry-vm.esri.com/arcgis/rest/services/Military/FarthestOnCircle/GPServer/Farthest%20On%20Circle%20Image%20Service"); 
		  gp.OutputSpatialReference = new SpatialReference(102100);
		  var features = [];
		  features.push(this.pushPinGraphic);
		  var featureSet = new FeatureSet();
		  featureSet.spatialReference = new SpatialReference(102100);
		  featureSet.features = features;
		  var params = { "Input_Mask_Layer":"https://jfry-vm.esri.com/arcgis/rest/services/Military/WaterMaskWorld1kmAux/ImageServer", 
						 "Position_Last_Seen":featureSet,
						 "Range_for_Analysis_in_Nautical_Miles": "150",
						 "Average_Speed_in_Knots__kts__for_Analysis": "10"};
						 
		  gp.submitJob(params, lang.hitch(this, this.farthestOnCircleJobComplete), lang.hitch(this, this.farthestOnCircleStatus));
		},

		clearMap: function () {
		  // Deactivate the map tool when the Done button is clicked
		  // Clean up then deactivating
		  this.deactivateMapDrawing();
		  this.mapWidgetProxy.destroyGraphicsLayerProxy(this.pushPinGraphicsLayerProxy);

		  // Call the base function
		  this.inherited(arguments, []);
		}
		
	});
});