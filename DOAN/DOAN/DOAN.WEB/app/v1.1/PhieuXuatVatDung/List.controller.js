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
    return Controller.extend('app.PhieuXuatVatDung.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        vanChuyenModel: new CoreJsonModel(),
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
            this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");
            this.loadData()
            this.bus.subscribe('PhieuXuatVatDungChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'onClosePhieuXuatVatDungView', this.onClosePhieuXuatVatDungView, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'onClosePhieuXuatVatDungAdd', this.onClosePhieuXuatVatDungAdd, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'onClosePhieuXuatVatDungEdit', this.onClosePhieuXuatVatDungEdit, this);
            this.bus.subscribe('VanChuyenChannel', 'closeVanChuyenDi', this.onClosePhieuXuat, this);
            this.bus.subscribe('PhieuXuatVatDungChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('PhieuXuatVatDungChannel.Detail', 'reLoadData', this.reLoadData, this);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieuxuatvd', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        //for (var i = 0; i < data.length; i++) {
                        //    data[i]['STT'] = i + 1;
                        //}
                        root.formatdata(data);
                    }
                    //root.mainModel.setData(data);
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
                    trangThai: item.isCheck,
                    diaChi: item.vanChuyen.diaChi,
                    soDienThoai: item.vanChuyen.soDienThoai,
                    items: [],
                }
                datas.push(h);

                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyenxuat/phieuxuat/' + item.id, {
                    fnProcessData: function (datax) {
                        if (datax && datax.length > 0) {
                            let x = root.groupBy(datax, 'lan');
                            for (let value in x) {
                                let a = {
                                    maPhieu: 'Lần ' + value,
                                    ngayTao: x[value][0].ngayTao,
                                    items: []
                                };
                                x[value].forEach(value => {
                                    let b = {
                                        tenVatDung: value.vatTu.tenVatTu,
                                        maVatTu: value.vatTu.maVatTu,
                                        soLuong: value.soLuong,
                                    }
                                    a.items.push(b);
                                });
                                h.items.push(a);
                            }
                        }
                    }
                });
                setTimeout(() => {
                    root.mainModel.setData(datas);

                }, 300)
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
            this.removeSelections();
            this.mainTable.clear
            this.getView().byId('searchField').setValue('');
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
                    name: "app.PhieuXuatVatDung.fragment.UpdateStatus",
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
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'PhieuXuatVatDung/updateStatus', {
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
            if (selected)
                this.bus.publish('PhieuXuatVatDungChannel', 'switchToDetailPage', { Id: selected.id });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('PhieuXuatVatDungChannel', 'switchToDetailPage', { Id: selected.id });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._PhieuXuatVatDungDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuXuatVatDung.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuXuatVatDungDetail = frag;
                    root._PhieuXuatVatDungDetail.open();
                    root.bus.publish('PhieuXuatVatDungChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._PhieuXuatVatDungDetail.open();
                root.bus.publish('PhieuXuatVatDungChannel', 'loadDetailPage', { Id: oData.Id });
            }
        },
        onClosePhieuXuatVatDungView: function () {
            this._PhieuXuatVatDungDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            let root = this;
            let oView = this.getView();
            if (!this._vamnChuyenFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.PhieuXuatVatDung.fragment.VanChuyen',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._vamnChuyenFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.getVanChuyenData();
                    root._vamnChuyenFrag.open();
                });
            } else {
                root._vamnChuyenFrag.open();
                root.getVanChuyenData();
            }
        },
        closevanChuyenputDialog: function () {
            if (this._vamnChuyenFrag) {
                this.byId('vanChuyenList').removeSelections(true);
                this.idVanChuyen = null;
                this._vamnChuyenFrag.close();
            }
                
        },
        getVanChuyenData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'VanChuyen/Checkxuat', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.vanChuyenModel.setData(data);
                    }
                }
            });
        },
        onVanChuyenPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('vanChuyenModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idVanChuyen = rowObject.id;
            this.onRowEditVanChuyen(rowObject.id);
            this.closevanChuyenputDialog();
        },
        //onvanChuyenCancelPress: function () {

        //},
        onRowEditVanChuyen: function (id) {
            const root = this;
            if (!this._phieuXuatAddd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuXuatVatDung.fragment.VanChuyenDi",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._phieuXuatAddd = frag;
                    root._phieuXuatAddd.open();
                    root.bus.publish('VanChuyenChannel', 'PhieuXuatLoad', { Id: id });
                });
            }
            else {
                root.bus.publish('VanChuyenChannel', 'PhieuXuatLoad', { Id: id });
                root._phieuXuatAddd.open();
            }
        },
        onClosePhieuXuat: function () {
            if (this._phieuXuatAddd)
                this._phieuXuatAddd.close();
        },
        //onAddButtonPress: function () {
        //    const root = this;
        //    if (!this._PhieuXuatVatDungAdd) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.PhieuXuatVatDung.VanChuyen",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._PhieuXuatVatDungAdd = frag;
        //            root._PhieuXuatVatDungAdd.open();
        //            //root.bus.publish('PhieuXuatVatDungChannel', 'loadDetailPage', { Id: oData.Id });
        //        });
        //    }
        //    else {
        //        root._PhieuXuatVatDungAdd.open();
        //        //root.bus.publish('PhieuXuatVatDungChannel', 'loadDetailPage', { Id: oData.Id });
        //    }
        //},
        onClosePhieuXuatVatDungAdd: function () {
            this._PhieuXuatVatDungAdd.close();
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenPhieuXuatVatDung, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuXuatVatDung/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuXuatVatDung/list', {
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
            if (!this._PhieuXuatVatDungEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuXuatVatDung.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuXuatVatDungEdit = frag;
                    root._PhieuXuatVatDungEdit.open();
                    root.bus.publish('PhieuXuatVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuXuatVatDung });
                });
            }
            else {
                root._PhieuXuatVatDungEdit.open();
                root.bus.publish('PhieuXuatVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuXuatVatDung });
            }
        },
        onClosePhieuXuatVatDungEdit: function () {
            if (this._PhieuXuatVatDungEdit)
                this._PhieuXuatVatDungEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});