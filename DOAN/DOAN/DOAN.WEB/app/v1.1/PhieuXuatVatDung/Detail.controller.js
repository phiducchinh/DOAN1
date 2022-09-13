sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/Core',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'sap/ui/core/Fragment',
    'app/globalformatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Controller, Core, MessageToast, MessageBox, Connector, CoreJsonModel, Fragment, GlobalFormatter, Filter, FilterOperator) {
    'use strict';
    return Controller.extend('app.PhieuXuatVatDung.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        mainTitle: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            this.bus.subscribe('PhieuXuatVatDungChannel', 'loadDetailPage', this.loadEditPage, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'onClosePhieuXuatVatDungEdit', this.onClosePhieuXuatVatDungEdit, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'reLoadData', this.reLoadData, this);

        },
        loadEditPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'PhieuXuatVD/' + root.mainId, {
                    fnProcessData: function (data) {
                        console.log(data);
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTiet(data.id);
                        }
                    }
                });
            }
        },
        loadChiTiet: function (id) {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyenxuat/phieuxuat/' + id, {
                fnProcessData: function (data) {
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                        root.phieuXuatModel.setData(data);
                    }
                }
            });
        },
        reLoadData: function () {
            if (this.mainId) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'PhieuXuatVD/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTiet(data.id);
                            MessageToast.show("Tải lại thành công", { width: '25em', duration: 5000 });

                        }
                    }
                });
            }
        },



        onDeleteButtonPress: function () {
            const root = this;
            MessageBox.show('Bạn chắc chắn muốn xóa ?', {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuXuatVatDung/' + root.mainId, {
                            fnSuccess: function (data) {
                                root.bus.publish("PhieuXuatVatDungChannel", "onClosePhieuXuatVatDungView");
                                root.bus.publish("PhieuXuatVatDungChannel.Detail", "reLoadData");
                                MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                            }
                        });
                    }
                }
            });
        },
        onEditButtonPress: function () {
            if (this.mainId) {
                const root = this;
                if (!this._imgEdit) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuXuatVatDung.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._imgEdit = frag;
                        root._imgEdit.open();
                        root.bus.publish('PhieuXuatVatDungChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                    });
                }
                else {
                    root._imgEdit.open();
                    root.bus.publish('PhieuXuatVatDungChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                }
            }
        },
        onClosePhieuXuatVatDungEdit: function () {
            this._imgEdit.close();
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});