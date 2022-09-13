sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "app/globalformatter",
    "app/ext/Auth.Connector.Adal",
    "app/ext/CoreJsonModel",
    "sap/m/UploadCollectionParameter",
    'sap/ui/core/Fragment',

], function (Controller, Core, MessageBox, MessageToast, GlobalFormatter, Connector, CoreJsonModel, UploadCollectionParameter, Fragment) {
    "use strict";
    return Controller.extend("app.MonAn.VatDungDiKem.Detail", {
        mainModel: new CoreJsonModel(),
        fileModel: new CoreJsonModel(),
        mainId: null,
        idVatTu: null,
        globalFormatter: GlobalFormatter,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.bus.subscribe("MonAnChannel", "loadDetailVatDungPage", this.loadDetailPage, this);
            this.bus.subscribe('MonAnChannel', 'onCloseVatDungMonAnEdit', this.onCloseVatDungMonAnEdit, this);

        },
        onExit: function () {
            this.bus.unsubscribe("MonAnChannel", "loadDetailVatDungPage", this.loadDetailPage, this);
        },
        closeArea: function () {
            this.bus.publish("MonAnChannel", "onCloseVatDungDiKemMonAnDetail");
        },
        loadDetailPage: function (sChanel, sEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                this.mainId = oData.Id;
                this.idVatTu = oData.IdVatTu;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },

        onEditButtonPress: function () {
            if(this.mainId){
                const root = this;
                if (!this._VatDungEdit) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.MonAn.VatDungDiKem.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._VatDungEdit = frag;
                        root._VatDungEdit.open();
                        root.bus.publish('MonAnChannel', 'loadEditVatDungPage', { Id: root.mainId, IdVatTu: root.idVatTu });
                    });
                }
                else {
                    root._VatDungEdit.open();
                    this.bus.publish('MonAnChannel', 'loadEditVatDungPage', { Id: root.mainId, IdVatTu: root.idVatTu });
                }
            }
        },
        onCloseVatDungMonAnEdit: function () {
            if (this._VatDungEdit) {
                this._VatDungEdit.close();
            }
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/' + root.mainId, {
                                fnSuccess: function (data) {
                                    root.bus.publish("MonAnChannel", "onCloseVatDungDiKemMonAnDetail");
                                    root.bus.publish("MonAnChannel", "loadVatDungData");
                                    MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                                }
                            });
                        }
                    }
                });
            }
        },

       
    });
});