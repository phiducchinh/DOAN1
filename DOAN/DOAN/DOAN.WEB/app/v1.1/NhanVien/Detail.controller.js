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
    return Controller.extend('app.NhanVien.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        mainModel: new CoreJsonModel(),
        mainId: null,
        mainTitle: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.bus.subscribe('NhanVienChannel', 'loadDetailPage', this.loadEditPage, this);
            this.bus.subscribe('NhanVienChannel', 'onCloseNhanVienEdit', this.onCloseNhanVienEdit, this);
            this.bus.subscribe('NhanVienChannel', 'reLoadData', this.reLoadData, this);

        },
        loadEditPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                root.mainTitle = oData.title;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'NhanVien/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },
        reLoadData: function () {
            if (this.mainId) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'NhanVien/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
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
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'NhanVien/' + root.mainId, {
                            fnSuccess: function (data) {
                                root.bus.publish("NhanVienChannel", "onCloseNhanVienView");
                                root.bus.publish("NhanVienChannel.Detail", "reLoadData");
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
                        name: "app.NhanVien.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._imgEdit = frag;
                        root._imgEdit.open();
                        root.bus.publish('NhanVienChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                    });
                }
                else {
                    root._imgEdit.open();
                    root.bus.publish('NhanVienChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                }
            }
        },
        onCloseNhanVienEdit: function () {
            this._imgEdit.close();
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});