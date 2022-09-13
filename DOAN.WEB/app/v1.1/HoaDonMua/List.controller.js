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
    return Controller.extend('app.HoaDonMua.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        mainId: null,
        hoaDonModel: new CoreJsonModel(),
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.vanChuyenModel, "hoaDonModel");
            this.loadData()
            this.bus.subscribe('HoaDonMuaChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseHoaDonMuaView', this.onCloseHoaDonMuaView, this);
            this.bus.subscribe('HoaDonMuaChannel', 'closeHoaDonMuaAdd', this.closeHoaDonMuaAdd, this);
            //this.bus.subscribe('HoaDonMuaChannel', 'onCloseHoaDonMuaEdit', this.onCloseHoaDonMuaEdit, this);
            //this.bus.subscribe('HoaDonMuaChannel', 'onCloseVanChuyenAdd', this.onCloseVanChuyenAdd, this);
            this.bus.subscribe('HoaDonMuaChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('HoaDonMuaChannel.Detail', 'reLoadData', this.reLoadData, this);
        },

        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonMua', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                        root.mainModel.setData(data);
                    }
                }
            });
        },
        onRefresh: function () {
            this.reLoadData();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '30em', duration: 5000 });
        },
        reLoadData: function () {
            this.loadData();
            this.getView().byId('searchField').setValue('');
        },
        
        searchFilter: function () {
            const root = this;
            let title = this.getView().byId("searchField").getValue();
            let status = this.getView().byId('statusFilter').getSelectedKey();
            this.filter.title = title;
            this.filter.status = status;
            Connector.postToApi(sdConfig.adminApiEndpoint + 'HoaDonMua/filter', {
                oParameters: root.filter,
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.mainModel.setData(data);
                }
            });
        },
        onLiveChange: function () {
            let title = this.getView().byId("searchField").getValue();
            this.filter.title = title;
            if (title != null || title != '') {
                this.searchFilter();
            }
        },
        onSearch: function (oEvent) {
            const params = oEvent.getParameters();
            const isReset = params.clearButtonPressed;
            if (isReset) {
                this.filter.title = "";
                this.searchFilter();
            }
            else
                this.searchFilter();
        },
        onStatusFilterChange: function () {
            this.searchFilter();
        },

        //#region Detail
        onCellClick: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected)
                this.bus.publish('HoaDonMuaChannel', 'switchToDetailPage', { Id: selected.id });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('HoaDonMuaChannel', 'switchToDetailPage', { Id: selected.id });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._HoaDonMuaDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonMua.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HoaDonMuaDetail = frag;
                    root._HoaDonMuaDetail.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._HoaDonMuaDetail.open();
                root.bus.publish('HoaDonMuaChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onCloseHoaDonMuaView: function () {
            this._HoaDonMuaDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: async function () {
            let root = this;
            let oView = this.getView();
            if (!this._HopDongAdd) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HoaDonMua.fragment.DonCo',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._HopDongAdd = oDialog;
                    oView.addDependent(oDialog);
                    root.loadDonCo();
                    root._HopDongAdd.open();
                });
            } else {
                root._HopDongAdd.open();
                root.loadDonCo();
            }
        },
        ondonCoCancelPress: function () {
            this.loadFraAdd(null);
        },
        closedonCoputDialog: function () {
            this.getView().byId('donCoList').removeSelections();
            this._HopDongAdd.close();
        },
        ondonCoPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('donCoModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idDonCo = rowObject.id;
            this.loadFraAdd(rowObject.id);
            this.closedonCoputDialog();
        },
        loadFraAdd: function (id) {
            let oView = this.getView();
            const root = this;
            if (!this._hoaDonMuaAdd) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HoaDonMua.Add',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._hoaDonMuaAdd = oDialog;
                    //oView.addDependent(oDialog);
                    root._hoaDonMuaAdd.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadAddpage', { IdDonCo: id });

                });
            } else {
                root.bus.publish('HoaDonMuaChannel', 'loadAddpage', { IdDonCo: id });
                root._hoaDonMuaAdd.open();

            }
            this.closedonCoputDialog();
        },

        onPressItems: function () {
            const indices = this.getView().byId('donCoList').getSelectedIndices();
            const dataTable = this.getView().byId('donCoList').getBinding('rows').getModel().getData();
            const listId = [];
            let oView = this.getView();
            const root = this;  
            if (indices.length > 0) {
                for (let i = 0; i < indices.length; i++) {
                    listId.push(dataTable[indices[i]].id);
                }
            }

            if (listId.length > 0) {
                if (!this._hoaDonMuaAdd) {
                    Fragment.load({
                        id: oView.getId(),
                        name: 'app.HoaDonMua.Add',
                        controller: this,
                        type: 'XML'
                    }).then(function (oDialog) {
                        root._hoaDonMuaAdd = oDialog;
                        //oView.addDependent(oDialog);
                        root._hoaDonMuaAdd.open();
                        root.bus.publish('HoaDonMuaChannel', 'loadAddpage', { ListId: listId });

                    });
                } else {
                    root.bus.publish('HoaDonMuaChannel', 'loadAddpage', { ListId: listId });
                    root._hoaDonMuaAdd.open();
                    
                }
                this.closeDonCoputDialog();
            }
        },
        closeHoaDonMuaAdd() {
            if (this._hoaDonMuaAdd)
                this._hoaDonMuaAdd.close();
        },
        loadDonCo: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/checkTD', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.donCoModel.setData(data);
                    }
                }
            });
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenHoaDonMua, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HoaDonMua/' + selected.id, {
                            fnSuccess: function (data) {
                                root.reLoadData();
                                MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                            }
                        });
                    }
                }
            });

        },
        deleteItems: function (oEvent) {
            const root = this;
            const indices = this.mainTable.getSelectedIndices();
            const dataTable = this.mainTable.getBinding('rows').getModel().getData();
            const listId = [];
            if (indices.length > 0) {
                for (let i = 0; i < indices.length; i++) {
                    listId.push(dataTable[indices[i]].id);
                }
                MessageBox.show('Xóa tất cả các mục được chọn?', {
                    icon: MessageBox.Icon.WARNING,
                    title: 'Xác nhận',
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction == MessageBox.Action.DELETE) {
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HoaDonMua/list', {
                                oParameters: listId,
                                fnSuccess: function (data) {
                                    root.reLoadData();
                                    MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                                }
                            });
                        }
                    }
                });
            }
            else {
                MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
            }
        },
        //#endregion

        //#region Edit
        onRowEdit: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            const root = this;
            if (!this._HoaDonMuaEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonMua.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HoaDonMuaEdit = frag;
                    root._HoaDonMuaEdit.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHoaDonMua });
                });
            }
            else {
                root._HoaDonMuaEdit.open();
                root.bus.publish('HoaDonMuaChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHoaDonMua });
            }
        },
        onCloseHoaDonMuaEdit: function () {
            if (this._HoaDonMuaEdit)
                this._HoaDonMuaEdit.close();
        },
        //#endregion

        onAddVanChuyen: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));

            if (!this._vanChuyenAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonMua.fragment.VanChuyen",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._vanChuyenAdd = frag;
                    root._vanChuyenAdd.open();
                    root.bus.publish('HoaDonMuaChannel', 'VanChuyenLoad', { Id: selected.id,});
                });
            }
            else {
                root.bus.publish('HoaDonMuaChannel', 'VanChuyenLoad', { Id: selected.id,});
                root._vanChuyenAdd.open();
            }

           
        },
        onCloseVanChuyenAdd: function () {
            if (this._vanChuyenAdd)
                this._vanChuyenAdd.close();
        },
        
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});