sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
  "use strict";
  return Controller.extend("app.Errors.NotAuthorizationApp", {
    onInit: function () {
      let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      let oTarget = oRouter.getTarget("NotAuthorizationApp");
      oTarget.attachDisplay(function (oEvent) {
        this._oData = oEvent.getParameter("data");
      }, this);
    },
    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },
    onNavBack: function () {
      var oHistory, sPreviousHash;

      oHistory = History.getInstance();
      sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("homepage", {}, true);
      }
    }
  });
});