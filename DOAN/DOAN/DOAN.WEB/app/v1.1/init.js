sap.ui.define(
    [
        "sap/ui/core/ComponentContainer",
        "app/ext/Auth.Connector.Adal",
        "sap/ui/core/Busyindicator",
    ],
    function (ComponentContainer, Connector, Busyindicator) {
        "use strict";

        //Busyindicator.show();
        //let _roleLoaded = false, _featureLoaded = false;
        new ComponentContainer({
            name: "app",
            settings: {
                id: "app.init",
            },
            async: true,
        }).placeAt("hmibodyContent");
        //}
        //Connector.getFromSercureApi(sdConfig.adminApiEndpoint + "user/features", {
        //    dataType: "json",
        //    fnSuccess: function (data) {
        //        appRuntime.Features = data.Features;
        //        appRuntime.Menus = data.Menus;
        //    },
        //    fnCompleted: function () {
        //        _featureLoaded = true;
        //        onCompletedAll();
        //    },
        //});
        //Connector.getFromSercureApi(sdConfig.adminApiEndpoint + "self/role", {
        //    fnSuccess: function (data) {
        //        appRuntime.roleToken = data;
        //    },
        //    fnCompleted: function () {
        //        _roleLoaded = true;
        //        onCompletedAll();
        //    },
        //});
    }
);
