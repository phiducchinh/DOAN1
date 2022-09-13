sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "app/globalformatter",
    "app/ext/Auth.Connector.Adal",
    "app/ext/CoreJsonModel",
    "sap/m/UploadCollectionParameter",
], function (Controller, Core, MessageBox, MessageToast, GlobalFormatter, Connector, CoreJsonModel, UploadCollectionParameter) {
    "use strict";
    return Controller.extend("app.Software.Server.Detail", {
        mainModel: new CoreJsonModel(),
        fileModel: new CoreJsonModel(),
        mainId: null,
        globalFormatter: GlobalFormatter,
        onInit: function () {
            if (Connector.checkPermission("ManageSoftware_View")) {
                this.bus = Core.getEventBus();
                this.getView().setModel(this.mainModel, "mainModel");
                this.bus.subscribe("SoftwareChannel", "loadDetailServerPage", this.loadDetailPage, this);
            } else {
                sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("NotAuthorization");
            }
        },
        onExit: function () {
            this.bus.unsubscribe("SoftwareChannel", "loadDetailServerPage", this.loadDetailPage, this);
        },
        closeArea: function () {
            this.bus.publish("SoftwareChannel", "onCloseServerSoftwareDetail");
        },
        loadDetailPage: function (sChanel, sEvent, oData) {
            if (oData && oData.Id) {
                this.mainId = oData.Id;
                this.mainModel.getFromSercureApi(sdConfig.adminApiEndpoint + "server/" + oData.Id,
                    {
                        fnProcessData: function (data) {
                            if (data && data.length > 0) {
                                return data[0];
                            }
                        }
                    });
            }
        },

        onEditButtonPress: function () {
            this.bus.publish("SoftwareChannel", "switchToDevHistoryEditPage", { Id: this.mainId });
            //this.bus.publish("SoftwareChannel", "onCloseDevHistorySoftwareDetail");
        },
        onDeleteButtonPress: function () {
            var root = this;
            if (this.mainId) {
                MessageBox.show(
                    "Bạn có chắc chắn muốn xóa?", {
                    icon: MessageBox.Icon.WARNING,
                    title: "Xác nhận",
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.DELETE) {
                            Connector.getFromSercureApi(sdConfig.adminApiEndpoint + "server/delete/" + root.mainId, {
                                fnSuccess: function (data) {
                                    MessageToast.show(data, { width: "25em", duration: 5000 });
                                    root.bus.publish("SoftwareChannel", "loadServer");
                                    root.bus.publish("SoftwareChannel", "onCloseServerSoftwareDetail");
                                }
                            });
                        }
                    }
                });
            }
        },

       
    });
});