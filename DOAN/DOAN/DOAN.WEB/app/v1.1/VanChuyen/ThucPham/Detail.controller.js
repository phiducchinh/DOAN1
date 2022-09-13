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
    return Controller.extend("app.MonAn.ThucPham.Detail", {
        mainModel: new CoreJsonModel(),
        fileModel: new CoreJsonModel(),
        mainId: null,
        idThucPham: null,
        globalFormatter: GlobalFormatter,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.bus.subscribe("MonAnChannel", "loadDetailThucPhamPage", this.loadDetailPage, this);
            this.bus.subscribe('MonAnChannel', 'onCloseThucPhamMonAnEdit', this.onCloseThucPhamMonAnEdit, this);

        },
        onExit: function () {
            this.bus.unsubscribe("MonAnChannel", "loadDetailThucPhamPage", this.loadDetailPage, this);
        },
        closeArea: function () {
            this.bus.publish("MonAnChannel", "onCloseThucPhamDiKemMonAnDetail");
        },
        loadDetailPage: function (sChanel, sEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                this.mainId = oData.Id;
                this.idThucPham = oData.IdThucPham;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucphamkemmonan/' + root.mainId, {
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
                if (!this._ThucPhamEdit) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.MonAn.ThucPham.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._ThucPhamEdit = frag;
                        root._ThucPhamEdit.open();
                        root.bus.publish('MonAnChannel', 'loadEditThucPhamPage', { Id: root.mainId, IdThucPham: root.idThucPham });
                    });
                }
                else {
                    root._ThucPhamEdit.open();
                    this.bus.publish('MonAnChannel', 'loadEditThucPhamPage', { Id: root.mainId, IdThucPham: root.idThucPham });
                }
            }
        },
        onCloseThucPhamMonAnEdit: function () {
            if (this._ThucPhamEdit) {
                this._ThucPhamEdit.close();
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'thucphamkemmonan/' + root.mainId, {
                                fnSuccess: function (data) {
                                    root.bus.publish("MonAnChannel", "onCloseThucPhamMonAnDetail");
                                    root.bus.publish("MonAnChannel", "loadThucPhamData");
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