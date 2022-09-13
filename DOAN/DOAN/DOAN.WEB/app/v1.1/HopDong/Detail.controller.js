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
    return Controller.extend('app.HopDong.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        thucDonModel: new CoreJsonModel(),
        mainId: null,
        mainTitle: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.thucDonModel, "thucDonModel");
            this.bus.subscribe('HopDongChannel', 'loadDetailPage', this.loadDetailPage, this);
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongEdit', this.onCloseHopDongEdit, this);
            this.bus.subscribe('HopDongChannel', 'loadThucDonData', this.loadThucDonData, this);
            this.bus.subscribe('HopDongChannel', 'onCloseThucDonhopDongAdd', this.onCloseThucDonhopDongAdd, this);
            this.bus.subscribe('HopDongChannel', 'onCloseThucDonHopDongEdit', this.onCloseThucDonHopDongEdit, this);
            this.bus.subscribe('HopDongChannel', 'onCloseThucDonHopDongDetail', this.onCloseThucDonHopDongDetail, this);
            this.bus.subscribe('HopDongChannel', 'switchToThucDonViewPage', this.switchToThucDonViewPage, this);
            this.bus.subscribe('HopDongChannel', 'reLoadData', this.reLoadData, this);

        },
        loadDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                root.mainTitle = oData.title;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + root.mainId, {
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
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + root.mainId, {
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
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HopDong/' + root.mainId, {
                            fnSuccess: function (data) {
                                root.bus.publish("HopDongChannel", "onCloseHopDongView");
                                root.bus.publish("HopDongChannel.Detail", "reLoadData");
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
                        name: "app.HopDong.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._imgEdit = frag;
                        root._imgEdit.open();
                        root.bus.publish('HopDongChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                    });
                }
                else {
                    root._imgEdit.open();
                    root.bus.publish('HopDongChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
                }
            }
        },
        onCloseHopDongEdit: function () {
            if (this._imgEdit)
            this._imgEdit.close();
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        },
        onTabSelectionChange: function (oEvent) {
            const key = oEvent.getParameter('key');
            if (key === 'hopDongTab') this.loadDetailPage();
            if (key === 'thucDonTab') this.loadThucDonData();
            //if (key === 'doChuanBiTab') this.loadDoChuanBiData();
        },
        //#region ThucDon
        loadThucDonData: function () {
            if (this.mainId) {
                const root = this;
                this.ThucDonTable = this.getView().byId('thucDonTable');
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HopDong/' + this.mainId, {
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
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HopDong/' + this.mainId, {
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
                    name: "app.HopDong.ThucDon.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThucDonThucDonAdd = frag;
                    root._ThucDonThucDonAdd.open();
                    root.bus.publish('HopDongChannel', 'loadAddThucDonPage', { Id: root.mainId });
                });
            }
            else {
                root._ThucDonThucDonAdd.open();
                this.bus.publish('HopDongChannel', 'loadAddThucDonPage', { Id: root.mainId });
            }
        },
        onCloseThucDonhopDongAdd: function () {
            if (this._ThucDonThucDonAdd)
                this._ThucDonThucDonAdd.close();
        },
        onRowViewThucDon: function (oEvent) {
            let selectedId = this.getView().getModel('thucDonModel').getProperty('', oEvent.getParameter('row').getBindingContext('thucDonModel'));
            this.bus.publish('HopDongChannel', 'switchToThucDonViewPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
        },
        thucDonCellClick: function (oEvent) {
            const selectedId = this.getView().getModel('thucDonModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selectedId) {
                this.bus.publish('HopDongChannel', 'switchToThucDonViewPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
            }
        },
        switchToThucDonViewPage: function (oChannel, oEvent, oData) {
            if (oData.Id) {
                const root = this;
                if (!this._ThucDonThucDonView) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.HopDong.ThucDon.Detail",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._ThucDonThucDonView = frag;
                        root._ThucDonThucDonView.open();
                        root.bus.publish('HopDongChannel', 'loadDetailThucDonPage', { Id: oData.Id, IdMonAn: oData.IdMonAn });
                    });
                }
                else {
                    root._ThucDonThucDonView.open();
                    this.bus.publish('HopDongChannel', 'loadDetailThucDonPage', { Id: oData.Id, IdMonAn: oData.IdMonAn });
                }
            }
        },
        onCloseThucDonHopDongDetail: function () {
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
                        name: "app.HopDong.ThucDon.Edit",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._ThucDonThucDonEdit = frag;
                        root._ThucDonThucDonEdit.open();
                        root.bus.publish('HopDongChannel', 'loadEditThucDonPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
                    });
                }
                else {
                    root._ThucDonThucDonEdit.open();
                    this.bus.publish('HopDongChannel', 'loadEditThucDonPage', { Id: selectedId.id, IdMonAn: selectedId.idMonAn });
                }
            }
        },
        onCloseThucDonHopDongEdit: function () {
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