﻿sap.ui.define([
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
    return Controller.extend('app.HoaDonMua.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        mainId: null,
        mainTitle: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.bus.subscribe('HoaDonMuaChannel', 'loadDetailPage', this.loadDetailPage, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseHoaDonMuaEdit', this.onCloseHoaDonMuaEdit, this);
            this.bus.subscribe('HoaDonMuaChannel', 'loadThucDonData', this.loadThucDonData, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseThucDonHoaDonMuaAdd', this.onCloseThucDonHoaDonMuaAdd, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseThucDonHoaDonMuaEdit', this.onCloseThucDonHoaDonMuaEdit, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseThucDonHoaDonMuaDetail', this.onCloseThucDonHoaDonMuaDetail, this);
            this.bus.subscribe('HoaDonMuaChannel', 'switchToThucDonViewPage', this.switchToThucDonViewPage, this);
            this.bus.subscribe('HoaDonMuaChannel', 'reLoadData', this.reLoadData, this);

        },
        loadDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonMua/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTiet();
                        }
                    }
                });
            }
        },
        loadChiTiet: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChitietPhieuMua/phieuMua/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.thucPhamModel.setData(data);
                }
            });
        },
        onHoaDonRefresh: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonMua/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data) {
                        root.mainModel.setData(data);
                        root.loadChiTiet();
                    }
                }
            });
        },
        reLoadData: function () {
            if (this.mainId) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonMua/' + root.mainId, {
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
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HoaDonMua/' + root.mainId, {
                            fnSuccess: function (data) {
                                root.bus.publish("HoaDonMuaChannel", "onCloseHoaDonMuaView");
                                root.bus.publish("HoaDonMuaChannel.Detail", "reLoadData");
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
                        name: "app.HoaDonMua.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._imgEdit = frag;
                        root._imgEdit.open();
                        root.bus.publish('HoaDonMuaChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                    });
                }
                else {
                    root._imgEdit.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                }
            }
        },
        onCloseHoaDonMuaEdit: function () {
            if (this._imgEdit)
            this._imgEdit.close();
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        },
        onTabSelectionChange: function (oEvent) {
            const key = oEvent.getParameter('key');
            if (key === 'HoaDonMuaTab') this.loadDetailPage();
            if (key === 'thucDonTab') this.loadThucDonData();
            //if (key === 'doChuanBiTab') this.loadDoChuanBiData();
        },
        //#region ThucDon
        loadThucDonData: function () {
            if (this.mainId) {
                const root = this;
                this.ThucDonTable = this.getView().byId('thucDonTable');
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HoaDonMua/' + this.mainId, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                        root.thucDonModel.setData(data);
                    }
                });
            }
        },
        reloadThucDon: function () {
            if (this.mainId) {
                const root = this;
                this.ThucDonTable = this.getView().byId('thucDonTable');
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HoaDonMua/' + this.mainId, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                            root.thucDonModel.setData(data);
                    }
                });
            }
        },
        onThucDonRefresh: function () {
            this.reloadThucDon();
            this.removeSelectionsThucDon();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        },
        addThucDon: function () {
            const root = this;
            if (!this._ThucDonThucDonAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonMua.ThucDon.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThucDonThucDonAdd = frag;
                    root._ThucDonThucDonAdd.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadAddThucDonPage', { Id: root.mainId });
                });
            }
            else {
                root._ThucDonThucDonAdd.open();
                this.bus.publish('HoaDonMuaChannel', 'loadAddThucDonPage', { Id: root.mainId });
            }
        },
        onCloseThucDonHoaDonMuaAdd: function () {
            if (this._ThucDonThucDonAdd)
                this._ThucDonThucDonAdd.close();
        },
        onRowViewThucDon: function (oEvent) {
            let selectedId = this.getView().getModel('thucDonModel').getProperty('', oEvent.getParameter('row').getBindingContext('thucDonModel'));
            this.bus.publish('HoaDonMuaChannel', 'switchToThucDonViewPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
        },
        thucDonCellClick: function (oEvent) {
            const selectedId = this.getView().getModel('thucDonModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selectedId) {
                this.bus.publish('HoaDonMuaChannel', 'switchToThucDonViewPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
            }
        },
        switchToThucDonViewPage: function (oChannel, oEvent, oData) {
            if (oData.Id) {
                const root = this;
                if (!this._ThucDonThucDonView) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.HoaDonMua.ThucDon.Detail",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._ThucDonThucDonView = frag;
                        root._ThucDonThucDonView.open();
                        root.bus.publish('HoaDonMuaChannel', 'loadDetailThucDonPage', { Id: oData.Id, IdMonAn: oData.IdMonAn });
                    });
                }
                else {
                    root._ThucDonThucDonView.open();
                    this.bus.publish('HoaDonMuaChannel', 'loadDetailThucDonPage', { Id: oData.Id, IdMonAn: oData.IdMonAn });
                }
            }
        },
        onCloseThucDonHoaDonMuaDetail: function () {
            if (this._ThucDonThucDonView)
            this._ThucDonThucDonView.close();
        },
        onRowEditThucDon: function (oEvent) {
            let selectedId = this.getView().getModel('thucDonModel').getProperty('', oEvent.getParameter('row').getBindingContext('thucDonModel'));
            console.log(selectedId); 
            if (selectedId) {
                const root = this;
                if (!this._ThucDonThucDonEdit) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.HoaDonMua.ThucDon.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._ThucDonThucDonEdit = frag;
                        root._ThucDonThucDonEdit.open();
                        root.bus.publish('HoaDonMuaChannel', 'loadEditThucDonPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
                    });
                }
                else {
                    root._ThucDonThucDonEdit.open();
                    this.bus.publish('HoaDonMuaChannel', 'loadEditThucDonPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
                }
            }
        },
        onCloseThucDonHoaDonMuaEdit: function () {
            if (this._ThucDonThucDonEdit)
                this._ThucDonThucDonEdit.close();
        },
        onRowDeleteThucDon: function (oEvent) {
            const root = this;
            let selectedId = this.getView().getModel('thucDonModel').getProperty('id', oEvent.getParameter('row').getBindingContext('thucDonModel'));
            MessageBox.show('Bạn có chắc chắn muốn xóa?', {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'thucdon/' + selectedId, {
                            fnSuccess: function (data) {
                                root.reloadThucDon();
                                MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                            }
                        });
                    }
                }
            });
        },
        onThucDonRowSelectionChange: function () {
            const deleteButton = this.getView().byId('deleteThucDonButton');
            const selectedIndices = this.ThucDonTable.getSelectedIndices();
            if (selectedIndices.length > 0) {
                    deleteButton.setVisible(true);
            } else {
                deleteButton.setVisible(false);
            }
        },
        onDeleteThucDonButtonPress: function () {
            const root = this;
            const selectedIndices = this.ThucDonTable.getSelectedIndices();
            const tableData = this.ThucDonTable.getBinding('rows').getModel().getData();
            const selectedIds = selectedIndices.map(item => tableData[item].id);
            if (selectedIds.length > 0) {
                MessageBox.show('Xóa tất cả các mục được chọn?', {
                    icon: MessageBox.Icon.WARNING,
                    title: 'Xác nhận',
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction == MessageBox.Action.DELETE) {
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThucDon/list', {
                                oParameters: selectedIds,
                                fnSuccess: function (data) {
                                    MessageToast.show("Xóa thành công", { width: '25em', duration: 5000 });
                                    root.reloadThucDon();
                                    root.removeSelectionsThucDon();
                                }
                            });
                        }
                    }
                });
            }
        },
        removeSelectionsThucDon: function () {
            this.ThucDonTable.clearSelection();
            this.getView().byId('deleteThucDonButton').setVisible(false);
        },

        onThucDonSearch: function (oEvent) {
            let root = this;
            let params = oEvent.getParameters();
            let key = params.query;
            let isReset = params.clearButtonPressed;
            if (key) {
                this.ThucDonModel.postToSercureApi(sdConfig.adminApiEndpoint + 'ThucDon/list', {
                    oParameters: {
                        Filters: [{
                            Name: 'PHANMEMID',
                            Value: root.mainId,
                            Type: DbType.Int,
                            ParameterName: 'PHANMEMID'
                        }, {
                            InnerFilter: [{
                                Name: 'IP',
                                ParameterName: 'IP',
                                Value: key,
                                Type: DbType.String,
                                CompareOperator: 'Contains',
                                LogicalOperator: 'Or',
                            }],
                            LogicalOperator: 'And'
                        }],
                    },
                    fnSuccess: function (data) {
                        root.removeSelectionsThucDon();
                    }
                });
            } else if (isReset) {
                root.reloadThucDon();
            }
        },
        onThucDonLiveChange: function (oEvent) {
            if (!oEvent.getParameter('newValue')) {
                this.reloadMaintenanceHistory();
            }
        },
        //#endregion


        
    });
});