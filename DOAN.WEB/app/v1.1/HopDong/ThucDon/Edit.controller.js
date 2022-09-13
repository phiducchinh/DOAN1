sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/Core',
    'sap/m/MessageToast',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'sap/ui/core/Fragment'
], function (Controller, Core, MessageToast, Connector, CoreJsonModel, Fragment) {
    'use strict';
        return Controller.extend('app.Software.DevHistory.Edit', {
        mainModel: new CoreJsonModel(),
        mainId: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('SoftwareChannel', 'loadEditDevHistoryPage', this.loadEditPage, this);
        },
        onExit: function () {
            this.bus.unsubscribe('SoftwareChannel', 'loadEditDevHistoryPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                this.mainId = oData.Id;
                this.mainModel.getFromSercureApi(sdConfig.adminApiEndpoint + 'sofwaredevhistory/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            return data[0];
                        }
                    },
                    fnSuccess: function (data) { },
                });
            }
        },
        closeArea: function () {
            this.bus.publish('SoftwareChannel', 'onCloseDevHistorySoftwareEdit');
        },
        clearForm: function () {
            this.getView().byId("doiTuongThucHien").setValue("");
            this.getView().byId("noiDung").setValue("");
            this.getView().byId("ghiChu").setValue("");
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('noiDung');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            return isValid;
        },
        save: function () {
            const root = this;
            if (this.validateForm()) {
                Connector.postToSercureApi(sdConfig.adminApiEndpoint + 'sofwaredevhistory/update', {
                    oParameters: {
                        Id: this.mainId,
                        NoiDung: this.getView().byId('noiDung').getValue(),
                        DoiTuongThucHien: this.getView().byId('doiTuongThucHien').getValue(),
                        GhiChu: this.getView().byId('ghiChu').getValue(),
                    },
                    fnSuccess: function (data) {
                        MessageToast.show(data, { width: '25em', duration: 5000 });
                        root.bus.publish('SoftwareChannel', 'loadDevHistory');
                        root.bus.publish('SoftwareChannel', 'onCloseDevHistorySoftwareEdit');
                        root.clearForm();
                    }
                });
            }
        },
        onCancel: function () {
            this.clearForm();
            this.bus.publish('SoftwareChannel', 'onCloseDevHistorySoftwareEdit');
        },
        closeArea: function () {
            this.bus.publish('SoftwareChannel', 'onCloseDevHistorySoftwareEdit');
        },
    });
});