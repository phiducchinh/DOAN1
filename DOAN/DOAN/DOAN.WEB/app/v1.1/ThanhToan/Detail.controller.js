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
    return Controller.extend('app.ThanhToan.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        thanhToanModel: new CoreJsonModel(),
        mainId: null,
        idHopDong: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.thanhToanModel, "thanhToanModel");
            this.bus.subscribe('ThanhToanChannel', 'loadDetailPage', this.loadDetailPage, this);
            this.bus.subscribe('ThanhToanChannel', 'onCloseThanhToanEdit', this.onCloseThanhToanEdit, this);
            this.bus.subscribe('ThanhToanChannel', 'reLoadData', this.reLoadData, this);
        },
        loadDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                root.idHopDong = oData.IdHopDong;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThanhToan/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTiet();
                        }
                    }
                });
            }
            console.log(this.idHopDong);
        },
        loadChiTiet: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + this.idHopDong, {
                fnProcessData: function (dataa) {
                    if (dataa) {
                        let soLuong = dataa.soMam + dataa.soMamPhatSinh;
                        Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HopDong/' + root.idHopDong, {
                            fnProcessData: function (data) {
                                if (data && data.length > 0) {
                                    root.dataThanhToan = data;
                                    root.formatDataHD(data, soLuong);
                                }
                            }
                        });
                    }
                }
            });
        },
        formatDataHD: function (data, soLuong) {
            const root = this;
            for (let i = 0; i < data.length; i++) {
                data[i]['STT'] = i + 1;
                data[i]['soLuong'] = soLuong;
                data[i]['thanhTien'] = data[i]['soLuong'] * data[i]['giaTien'];
            }
            root.thanhToanModel.setData(data);
        },
        reLoadData: function () {
            if (this.mainId) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThanhToan/' + root.mainId, {
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
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThanhToan/' + root.mainId, {
                            fnSuccess: function (data) {
                                root.bus.publish("ThanhToanChannel", "onCloseThanhToanView");
                                root.bus.publish("ThanhToanChannel.Detail", "reLoadData");
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
                        name: "app.ThanhToan.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._imgEdit = frag;
                        root._imgEdit.open();
                        root.bus.publish('ThanhToanChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                    });
                }
                else {
                    root._imgEdit.open();
                    root.bus.publish('ThanhToanChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                }
            }
        },
        onCloseThanhToanEdit: function () {
            if (this._imgEdit)
                this._imgEdit.close();
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});