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
    return Controller.extend('app.VanChuyen.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        filter: {
            title: '',
            status: 'All'
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.loadData()
            this.bus.subscribe('VanChuyenChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('VanChuyenChannel', 'onCloseVanChuyenView', this.onCloseVanChuyenView, this);
            this.bus.subscribe('HopDongChannel', 'onCloseVanChuyenAdd', this.onCloseVanChuyenAdd, this);
            this.bus.subscribe('VanChuyenChannel', 'onCloseVanChuyenEdit', this.onCloseVanChuyenEdit, this);
            this.bus.subscribe('VanChuyenChannel', 'closeVanChuyenDi', this.onClosePhieuXuat, this);
            this.bus.subscribe('VanChuyenChannel', 'closeVanChuyenVe', this.onClosePhieuNhap, this);
            this.bus.subscribe('VanChuyenChannel', 'reLoadData', this.loadData, this);

        },

        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'VanChuyen', {
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
        onRefresh: function () {
            this.reLoadData();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '30em', duration: 5000 });
        },
        reLoadData: function () {
            this.loadData();
            this.removeSelections();
            this.mainTable.clear
            this.getView().byId('searchField').setValue('');
            this.getView().byId('statusFilter').setSelectedKey('-1')
        },
        removeSelections: function () {
            this.mainTable.clearSelection();
        },
        onRowSelectionChange: function (oEvent) {
            const selectedIndices = this.mainTable.getSelectedIndices();
            if (selectedIndices.length > 0) {
            } else {
                this.getView().byId('btnUpdateStatus').setVisible(false);
            }
        },

        onRowEditVanChuyen: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            if (!this._phieuXuatAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.VanChuyen.fragment.VanChuyenDi",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._phieuXuatAdd = frag;
                    root._phieuXuatAdd.open();
                    root.bus.publish('VanChuyenChannel', 'PhieuXuatLoad', { Id: selected.id, });
                });
            }
            else {
                root.bus.publish('VanChuyenChannel', 'PhieuXuatLoad', { Id: selected.id, });
                root._phieuXuatAdd.open();
            }
            //Connector.getFromApi(sdConfig.adminApiEndpoint + 'VanChuyen/updateStatus/' + selected.id + '/' + 2, {
            //    fnSuccess: function (data) {
            //        MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
            //        root.reLoadData();
            //    }
            //});

        },
        onClosePhieuXuat: function () {
            if (this._phieuXuatAdd)
                this._phieuXuatAdd.close();
            //if (this._phieuNhapAdd)
            //    this._phieuNhapAdd.close();
        },

        onRowEditHoanThanh: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            if (!this._phieuNhapAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.VanChuyen.fragment.VanChuyenVe",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._phieuNhapAdd = frag;
                    root._phieuNhapAdd.open();
                    root.bus.publish('VanChuyenChannel', 'PhieuNhapLoad', { Id: selected.id, });
                });
            }
            else {
                root.bus.publish('VanChuyenChannel', 'PhieuNhapLoad', { Id: selected.id, });
                root._phieuNhapAdd.open();
            }
            //Connector.getFromApi(sdConfig.adminApiEndpoint + 'VanChuyen/updateStatus/' + selected.id + '/' + 4, {
            //    fnSuccess: function (data) {
            //        MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
            //        root.reLoadData();
            //    }
            //});
        },
        onClosePhieuNhap: function () {
            if (this._phieuNhapAdd)
                this._phieuNhapAdd.close();
        },

        updateStatusItems: function (oEvent) {
            const root = this;
            const button = oEvent.getSource();
            if (!root.fragUpdateStatus) {
                Fragment.load({
                    name: "app.VanChuyen.fragment.UpdateStatus",
                    type: "XML",
                    controller: root
                }).then(function (frag) {
                    root.fragUpdateStatus = frag;
                    root.getView().addDependent(frag);
                    root.fragUpdateStatus.openBy(button);
                });
            }
            else {
                this.fragUpdateStatus.openBy(button);
            }
        },
        updateThanhToanStatusItems: function (oEvent) {
            const root = this;
            const button = oEvent.getSource();
            if (!root.fragUpdateTTStatus) {
                Fragment.load({
                    name: "app.VanChuyen.fragment.UpdateStatusThanhToan",
                    type: "XML",
                    controller: root
                }).then(function (frag) {
                    root.fragUpdateTTStatus = frag;
                    root.getView().addDependent(frag);
                    root.fragUpdateTTStatus.openBy(button);
                });
            }
            else {
                this.fragUpdateTTStatus.openBy(button);
            }
        },
        btnUpdateStatus: function (oEvent) {
            const root = this;
            let selectedItem = sap.ui.getCore().byId('idListUpdateStatus').getSelectedItem();
            let sts = Number(selectedItem.data('Status'));
            if (selectedItem) {
                const indices = this.mainTable.getSelectedIndices();
                const dataTable = this.mainTable.getBinding('rows').getModel().getData();
                const listId = [];
                if (indices.length > 0) {
                    for (let i = 0; i < indices.length; i++) {
                        listId.push(dataTable[indices[i]].id);
                    }
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'VanChuyen/updateStatus', {
                        oParameters: {
                            ids: listId,
                            status: sts,
                        },
                        fnSuccess: function (data) {
                            MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
                            root.fragUpdateStatus.close();
                            root.reLoadData();
                        }
                    });
                }
                else {
                    MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
                }
                this.fragUpdateStatus.close();
            } else {
                MessageToast.show('Hãy chọn một trạng thái!', { width: '30em', duration: 5000 });
            }
        },

        searchFilter: function () {
            const root = this;
            let title = this.getView().byId("searchField").getValue();
            let status = this.getView().byId('statusFilter').getSelectedKey();
            this.filter.title = title;
            this.filter.status = status;
            Connector.postToApi(sdConfig.adminApiEndpoint + 'VanChuyen/filter', {
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
                this.bus.publish('VanChuyenChannel', 'switchToDetailPage', { Id: selected.id });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            
            this.bus.publish('VanChuyenChannel', 'switchToDetailPage', { Id: selected.id });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._VanChuyenDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.VanChuyen.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._VanChuyenDetail = frag;
                    root._VanChuyenDetail.open();
                    root.bus.publish('VanChuyenChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._VanChuyenDetail.open();
                root.bus.publish('VanChuyenChannel', 'loadDetailPage', { Id: oData.Id });
            }
        },
        onCloseVanChuyenView: function () {
            if (this._VanChuyenDetail)
                this._VanChuyenDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            let root = this;
            let oView = this.getView();
            if (!this._HopDongAdd) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.VanChuyen.fragment.DonCo',
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
        onCloseVanChuyenAdd: function () {
            if (this._hoaDonMuaAdd)
                this._hoaDonMuaAdd.close();
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
                    name: 'app.HopDong.VanChuyen.VanChuyen',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._hoaDonMuaAdd = oDialog;
                    //oView.addDependent(oDialog);
                    root._hoaDonMuaAdd.open();
                    root.bus.publish('HopDongChannel', 'VanChuyenLoad', { Id: id });

                });
            } else {
                root.bus.publish('HopDongChannel', 'VanChuyenLoad', { Id: id });
                root._hoaDonMuaAdd.open();

            }
            this.closedonCoputDialog();
        },
        closeHoaDonMuaAdd() {
            if (this._hoaDonMuaAdd)
                this._hoaDonMuaAdd.close();
        },
        
        
        loadDonCo: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/checkVC', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        console.log(data);
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
            MessageBox.show('Bạn muốn xóa ' + selected.tenVanChuyen, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'VanChuyen/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'VanChuyen/list', {
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
            if (!this._VanChuyenEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.VanChuyen.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._VanChuyenEdit = frag;
                    root._VanChuyenEdit.open();
                    root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: selected.id, title: selected.hopDong.tenHopDong });
                });
            }
            else {
                root._VanChuyenEdit.open();
                root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: selected.id, title: selected.hopDong.tenHopDong });
            }
        },
        onCloseVanChuyenEdit: function () {
            if (this._VanChuyenEdit)
                this._VanChuyenEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});