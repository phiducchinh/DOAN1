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
    return Controller.extend('app.ThucPham.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        filter: {
            title:'',
            status:'All'
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.loadData()
            this.bus.subscribe('ThucPhamChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('ThucPhamChannel', 'onCloseThucPhamView', this.onCloseThucPhamView, this);
            this.bus.subscribe('ThucPhamChannel', 'onCloseThucPhamAdd', this.onCloseThucPhamAdd, this);
            this.bus.subscribe('ThucPhamChannel', 'onCloseThucPhamEdit', this.onCloseThucPhamEdit, this);
            this.bus.subscribe('ThucPhamChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('ThucPhamChannel.Detail', 'reLoadData', this.reLoadData, this);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPham/getall', {
                fnProcessData: function (data) {
                    console.log(data);
                    if (data && data.length > 0) {
                        data.forEach(item => {
                            if (item.phieuNhap && item.phieuNhap.length > 0) {
                                item.phieuNhap.forEach(i => {
                                    i.donVi = item.donVi;
                                    i.loai = item.loai;
                                    i.soLuong = i.soLuongConLai;
                                    i.thucPham = null;
                                })
                            }
                        })
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
            //this.getView().byId('statusFilter').setSelectedKey('-1')
        },
        removeSelections: function () {
            this.mainTable.clearSelection();
            //this.getView().byId('btnUpdateStatus').setVisible(false);
            this.getView().byId('btnDelete').setVisible(false);
        },
        onRowSelectionChange: function (oEvent) {
            const selectedIndices = this.mainTable.getSelectedIndices();
            if (selectedIndices.length > 0) {
                //this.getView().byId('btnUpdateStatus').setVisible(true);
                this.getView().byId('btnDelete').setVisible(true);
            } else {
                //this.getView().byId('btnUpdateStatus').setVisible(false);
                this.getView().byId('btnDelete').setVisible(false);
            }
        },
        updateStatusItems: function (oEvent) {
            const root = this;
            const button = oEvent.getSource();
            if (!root.fragUpdateStatus) {
                Fragment.load({
                    name: "app.ThucPham.fragment.UpdateStatus",
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
        btnUpdateStatus: function (oEvent) {
            const root = this;
            let selectedItem = sap.ui.getCore().byId('idListUpdateStatus').getSelectedItem();
            let sts = selectedItem.data('Status') == "0" ? 0 : 1;
            if (selectedItem) {
                const indices = this.mainTable.getSelectedIndices();
                const dataTable = this.mainTable.getBinding('rows').getModel().getData();
                const listId = [];
                if (indices.length > 0) {
                    for (let i = 0; i < indices.length; i++) {
                        listId.push(dataTable[indices[i]].itemId);
                    }
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'ThucPham/updateStatus', {
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
            Connector.postToApi(sdConfig.adminApiEndpoint + 'ThucPham/filter', {
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
                this.bus.publish('ThucPhamChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenThucPham });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('ThucPhamChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenThucPham });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._ThucPhamDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.ThucPham.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThucPhamDetail = frag;
                    root._ThucPhamDetail.open();
                    root.bus.publish('ThucPhamChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
                });
            }
            else {
                root._ThucPhamDetail.open();
                root.bus.publish('ThucPhamChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onCloseThucPhamView: function () {
            this._ThucPhamDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            const root = this;
            if (!this._ThucPhamAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.ThucPham.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThucPhamAdd = frag;
                    root._ThucPhamAdd.open();
                });
            }
            else {
                root._ThucPhamAdd.open();
            }
        },
        onCloseThucPhamAdd: function () {
            this._ThucPhamAdd.close();
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenThucPham, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThucPham/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThucPham/list', {
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
            if (!this._ThucPhamEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.ThucPham.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThucPhamEdit = frag;
                    root._ThucPhamEdit.open();
                    root.bus.publish('ThucPhamChannel', 'loadEditPage', { Id: selected.id, title: selected.tenThucPham });
                });
            }
            else {
                root._ThucPhamEdit.open();
                root.bus.publish('ThucPhamChannel', 'loadEditPage', { Id: selected.id, title: selected.tenThucPham });
            }
        },
        onCloseThucPhamEdit: function () {
            if (this._ThucPhamEdit)
                this._ThucPhamEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});