sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "app/ext/SavListBinding"
], function (JSONModel, SavListBinding) {
    "use strict";

    return JSONModel.extend("Sav.JSONModel", {
        bindList: function (path, context, sorters, filters, parameters) {
            return new SavListBinding(this, path, context, sorters, filters, parameters);
        }
    });

});