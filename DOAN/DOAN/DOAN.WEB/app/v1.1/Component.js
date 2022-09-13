sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (UIComponent, JSONModel, Device) {
  "use strict";
  return UIComponent.extend("app.Component", {
    metadata: {
      manifest: "json"
    },
    globalPermissionModel: new JSONModel(),
    init: function () {
      UIComponent.prototype.init.apply(this, arguments);
      var router = this.getRouter();
      //this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
      var oDeviceModel = new JSONModel(Device);
      oDeviceModel.setDefaultBindingMode("OneWay");
      this.setModel(oDeviceModel, "device");
      this.setModel(this.globalPermissionModel, "globalPermissionModel");
      this.globalPermissionModel.setData(this.buildPermission(appRuntime.Features));
      router.register("globalRouter");
      router.initialize();
    },
    getContentDensityClass: function () {
      if (!this._sContentDensityClass) {
        if (!Device.support.touch) {
          this._sContentDensityClass = "sapUiSizeCompact";
        } else {
          this._sContentDensityClass = "sapUiSizeCozy";
        }
      }
      return this._sContentDensityClass;
    },
    buildPermission: function (features) {
      var permissions = {};
      if (features && features.length) {
        jQuery.each(features, function (i, feature) {
          permissions[feature] = true;
        });
      }
      return permissions;
    }
  });
});