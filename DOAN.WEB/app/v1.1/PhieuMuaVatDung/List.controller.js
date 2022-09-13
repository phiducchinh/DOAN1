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
    return Controller.extend('app.PhieuMuaVatDung.List', {
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
            this.bus.subscribe('PhieuMuaVatDungChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'onClosePhieuMuaVatDungView', this.onClosePhieuMuaVatDungView, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'closePhieuMuaVatDungAdd', this.closePhieuMuaVatDungAdd, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'onClosePhieuMuaVatDungEdit', this.onClosePhieuMuaVatDungEdit, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'reLoadData', this.reLoadData, this);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieuMuaVD', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.formatdata(data);
                        //root.mainModel.setData(data);
                    }
                }
            });
        },
        formatdata: function (data) {
            let datas = [];
            const root = this;
            data.forEach(item => {
                let h = {
                    maPhieu: item.maPhieu,
                    ngayTao: item.ngayTao,
                    ghiChu: item.ghiChu,
                    isCheck: item.isCheck,
                    items: [],
                }
                datas.push(h);

                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chiTietPhieuMuaVatDung/PhieuMua/' + item.id, {
                    fnProcessData: function (datax) {
                        if (datax && datax.length > 0) {
                            datax.forEach(value => {
                                let b = {
                                    tenVatDung: value.vatTu.tenVatTu,
                                    maVatTu: value.vatTu.maVatTu,
                                    soLuong: value.soLuong,
                                    isCheck: value.isCheck,
                                }
                                h.items.push(b);
                            });
                        }
                    }
                });
                setTimeout(() => {
                    root.mainModel.setData(datas);
                }, 400)
            });
        },
        groupBy: function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        },
        onRefresh: function () {
            this.reLoadData();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '30em', duration: 5000 });
        },
        reLoadData: function () {
            this.loadData();
            //this.removeSelections();
            //this.mainTable.clear
            //this.getView().byId('searchField').setValue('');
            //this.getView().byId('statusFilter').setSelectedKey('All')
        },
        removeSelections: function () {
            this.mainTable.clearSelection();
        //    this.getView().byId('btnUpdateStatus').setVisible(false);
        //    this.getView().byId('btnDelete').setVisible(false);
        },
        onRowSelectionChange: function (oEvent) {
            //const selectedIndices = this.mainTable.getSelectedIndices();
            //if (selectedIndices.length > 0) {
            //    this.getView().byId('btnUpdateStatus').setVisible(true);
            //    this.getView().byId('btnDelete').setVisible(true);
            //} else {
            //    this.getView().byId('btnUpdateStatus').setVisible(false);
            //    this.getView().byId('btnDelete').setVisible(false);
            //}
        },
        updateStatusItems: function (oEvent) {
            const root = this;
            const button = oEvent.getSource();
            if (!root.fragUpdateStatus) {
                Fragment.load({
                    name: "app.PhieuMuaVatDung.fragment.UpdateStatus",
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
            let sts = selectedItem.data('Status') == '0' ? 0 : 1;
            if (selectedItem) {
                const indices = this.mainTable.getSelectedIndices();
                const dataTable = this.mainTable.getBinding('rows').getModel().getData();
                const listId = [];
                if (indices.length > 0) {
                    for (let i = 0; i < indices.length; i++) {
                        listId.push(dataTable[indices[i]].itemId);
                    }
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'PhieuMuaVatDung/updateStatus', {
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
            //console.log(selected);
            if (selected)
                this.bus.publish('PhieuMuaVatDungChannel', 'switchToDetailPage', { Id: selected.id, title: selected.maPhieu });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('PhieuMuaVatDungChannel', 'switchToDetailPage', { Id: selected.id, title: selected.maPhieu });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._PhieuMuaVatDungDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuMuaVatDung.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuMuaVatDungDetail = frag;
                    root._PhieuMuaVatDungDetail.open();
                    root.bus.publish('PhieuMuaVatDungChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
                });
            }
            else {
                root._PhieuMuaVatDungDetail.open();
                root.bus.publish('PhieuMuaVatDungChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onClosePhieuMuaVatDungView: function () {
            this._PhieuMuaVatDungDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            const root = this;
            if (!this._PhieuMuaVatDungAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuMuaVatDung.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuMuaVatDungAdd = frag;
                    root._PhieuMuaVatDungAdd.open();
                    //root.bus.publish('PhieuMuaVatDungChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._PhieuMuaVatDungAdd.open();
                //root.bus.publish('PhieuMuaVatDungChannel', 'loadDetailPage', { Id: oData.Id });
            }
        },
        closePhieuMuaVatDungAdd: function () {
            this._PhieuMuaVatDungAdd.close();
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenPhieuMuaVatDung, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuMuaVatDung/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuMuaVatDung/list', {
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
            if (!this._PhieuMuaVatDungEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuMuaVatDung.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuMuaVatDungEdit = frag;
                    root._PhieuMuaVatDungEdit.open();
                    root.bus.publish('PhieuMuaVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuMuaVatDung });
                });
            }
            else {
                root._PhieuMuaVatDungEdit.open();
                root.bus.publish('PhieuMuaVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuMuaVatDung });
            }
        },
        onClosePhieuMuaVatDungEdit: function () {
            if (this._PhieuMuaVatDungEdit)
                this._PhieuMuaVatDungEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});