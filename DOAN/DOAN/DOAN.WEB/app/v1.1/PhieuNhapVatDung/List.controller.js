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
    return Controller.extend('app.PhieuNhapVatDung.List', {
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
            this.bus.subscribe('PhieuNhapVatDungChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('PhieuNhapVatDungChannel', 'onClosePhieuNhapVatDungView', this.onClosePhieuNhapVatDungView, this);
            this.bus.subscribe('PhieuNhapVatDungChannel', 'onClosePhieuNhap', this.onClosePhieuNhap, this);
            this.bus.subscribe('PhieuNhapVatDungChannel', 'onClosePhieuNhapVatDungEdit', this.onClosePhieuNhapVatDungEdit, this);
            this.bus.subscribe('PhieuNhapVatDungChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('PhieuNhapVatDungChannel.Detail', 'reLoadData', this.reLoadData, this);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieunhapvd', {
                fnProcessData: function (data) {
                    if (data) {
                        root.formatdata(data.phieuNhapVD, data.pnVatDung);
                    }
                }
            });
        },
        formatdata: function (dataPhieuNhap,dataPN) {
            const root = this;
            let datas = [];
            if (dataPhieuNhap.length > 0) {
                dataPhieuNhap.forEach(item => {
                    let h = {
                        maPhieu: item.maPhieu,
                        ngayNhap: item.ngayTao,
                        maPhieuXuat: item.phieuXuat.maPhieu,
                        ghiChu: item.ghiChu,
                        trangThai: item.phieuXuat.vanChuyen.trangThai,
                        diaChi: item.phieuXuat.vanChuyen.diaChi,
                        soDienThoai: item.phieuXuat.vanChuyen.soDienThoai,
                        nguonGoc: item.nguonGoc,
                        items: [],
                    }
                    datas.push(h);
                    Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyennhap/phieunhap/' + item.id, {
                        fnProcessData: function (datax) {
                            if (datax && datax.length > 0) {
                                let x = root.groupBy(datax, 'lan');
                                for (let value in x) {
                                    let a = {
                                        maPhieu: 'Lần ' + value,
                                        ngayNhap: x[value][0].ngayNhap,
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

                });
            }
            
            let list2 = []
            if (dataPN.length > 0) {
                dataPN.forEach(item => {
                    let h = {
                        maPhieu: item.maPhieu,
                        ngayNhap: item.ngayTao,
                        //maPhieuXuat: item.phieuXuat.maPhieu,
                        ghiChu: item.ghiChu,
                        trangThai: item.pmVatDung.isCheck,
                        nguonGoc: item.nguonGoc,
                        items: [],
                    }
                    list2.push(h);
                    Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietPhieuNhapVatDung/phieunhap/' + item.id, {
                        fnProcessData: function (datax) {
                            if (datax && datax.length > 0) {
                                let x = root.groupBy(datax, 'lan');
                                for (let value in x) {
                                    let a = {
                                        maPhieu: 'Lần ' + value,
                                        ngayNhap: x[value][0].ngayNhap,
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

                });
            }
            
            console.log(list2);
            setTimeout(() => {
                root.mainModel.setData([...datas, ...list2]);
            }, 500)
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
                    name: "app.PhieuNhapVatDung.fragment.UpdateStatus",
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
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'PhieuNhapVatDung/updateStatus', {
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
                this.bus.publish('PhieuNhapVatDungChannel', 'switchToDetailPage', { Id: selected.id, title: selected.maPhieu });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('PhieuNhapVatDungChannel', 'switchToDetailPage', { Id: selected.id, title: selected.maPhieu });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._PhieuNhapVatDungDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuNhapVatDung.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuNhapVatDungDetail = frag;
                    root._PhieuNhapVatDungDetail.open();
                    root.bus.publish('PhieuNhapVatDungChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
                });
            }
            else {
                root._PhieuNhapVatDungDetail.open();
                root.bus.publish('PhieuNhapVatDungChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onClosePhieuNhapVatDungView: function () {
            this._PhieuNhapVatDungDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            const root = this;
            if (!this._PhieuNhapVatDungAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuNhapVatDung.PhieuNhap.VanChuyenVe",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuNhapVatDungAdd = frag;
                    root._PhieuNhapVatDungAdd.open();
                    //root.bus.publish('PhieuNhapVatDungChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._PhieuNhapVatDungAdd.open();
                //root.bus.publish('PhieuNhapVatDungChannel', 'loadDetailPage', { Id: oData.Id });
            }
        },
        onClosePhieuNhap: function () {
            this._PhieuNhapVatDungAdd.close();
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenPhieuNhapVatDung, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuNhapVatDung/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'PhieuNhapVatDung/list', {
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
            if (!this._PhieuNhapVatDungEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuNhapVatDung.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._PhieuNhapVatDungEdit = frag;
                    root._PhieuNhapVatDungEdit.open();
                    root.bus.publish('PhieuNhapVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuNhapVatDung });
                });
            }
            else {
                root._PhieuNhapVatDungEdit.open();
                root.bus.publish('PhieuNhapVatDungChannel', 'loadEditPage', { Id: selected.id, title: selected.tenPhieuNhapVatDung });
            }
        },
        onClosePhieuNhapVatDungEdit: function () {
            if (this._PhieuNhapVatDungEdit)
                this._PhieuNhapVatDungEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});