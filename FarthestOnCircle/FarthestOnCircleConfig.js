define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/store/Memory",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "esri/opsdashboard/MapToolConfigurationProxy",
  "dojo/text!./FarthestOnCircleConfigTemplate.html",
  "dojox/form/CheckedMultiSelect",
  "dijit/form/TextBox"
], function (declare, lang, Memory, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, MapToolConfigurationProxy, templateString) {

  return declare("FarthestOnCircleConfig", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, MapToolConfigurationProxy], {
    templateString: templateString,

    postCreate: function () {

    },
	
	hostReady: function () {
	   this.config.myServiceUrl = this.serviceUrl;
	   this.readyToPersistConfig(true);
	}
  });
});
















