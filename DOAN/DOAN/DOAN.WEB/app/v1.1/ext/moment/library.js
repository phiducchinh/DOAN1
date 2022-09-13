(function () {
    "use strict";
    jQuery.sap.declare("lib.vendors.moment");
    sap.ui.getCore().initLibrary({
        name: "lib.vendors.moment",
        noLibraryCSS:true
    });
    delete window.define;
    sap.ui.define(
        "source/vendors/moment",
        ["source/vendors/moment"],
        function () {
            return window.moment;
        }
    );
})();