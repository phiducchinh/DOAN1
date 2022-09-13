sap.ui.define([
    "sap/ui/model/json/JSONListBinding"
], function (ListBinding) {
    "use strict";

    return ListBinding.extend("Sav.ListBinding", {
        getLength: function () {
            var path = "/TotalItem";
            var count = this.oModel.getProperty(path, this.oContext);
            return (count) ? count : ListBinding.prototype.getLength.call(this);
        }

    });

}); 