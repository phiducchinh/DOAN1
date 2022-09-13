//const { data } = required("jquery");

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
    return Controller.extend('app.HopDong.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        phatSinhModel: new CoreJsonModel(),
        thanhToanModel: new CoreJsonModel(),
        mainId: null,
        dataThanhToan:[],
        vanChuyenModel: new CoreJsonModel(),
        filter: {
            title: '',
            status: 'All'
        },
        isValid : true,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");
            this.getView().setModel(this.phatSinhModel, "phatSinhModel");
            this.getView().setModel(this.thanhToanModel, "thanhToanModel");
            this.loadData()
            this.bus.subscribe('HopDongChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongView', this.onCloseHopDongView, this);
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongAdd', this.onCloseHopDongAdd, this);
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongEdit', this.onCloseHopDongEdit, this);
            this.bus.subscribe('HopDongChannel', 'onCloseVanChuyenAdd', this.onCloseVanChuyenAdd, this);
            this.bus.subscribe('HopDongChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('HopDongChannel.Detail', 'reLoadData', this.reLoadData, this);
        },

        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong', {
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
            this.removeSelections();
            this.mainTable.clear
            this.getView().byId('searchField').setValue('');
            this.getView().byId('statusFilter').setSelectedKey('-1')
            this.getView().byId('statusThanhToanFilter').setSelectedKey('-1')
        },
        removeSelections: function () {
            this.mainTable.clearSelection();
            this.getView().byId('btnUpdateStatus').setVisible(false);
            this.getView().byId('btnUpdateThanhToanStatus').setVisible(false);
            this.getView().byId('btnDelete').setVisible(false);
        },
        onRowSelectionChange: function (oEvent) {
            const selectedIndices = this.mainTable.getSelectedIndices();
            if (selectedIndices.length > 0) {
                this.getView().byId('btnUpdateStatus').setVisible(true);
                this.getView().byId('btnUpdateThanhToanStatus').setVisible(true);
                this.getView().byId('btnDelete').setVisible(true);
            } else {
                this.getView().byId('btnUpdateStatus').setVisible(false);
                this.getView().byId('btnUpdateThanhToanStatus').setVisible(false);
                this.getView().byId('btnDelete').setVisible(false);
            }
        },
        updateStatusItems: function (oEvent) {
            const root = this;
            const button = oEvent.getSource();
            if (!root.fragUpdateStatus) {
                Fragment.load({
                    name: "app.HopDong.fragment.UpdateStatus",
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
                    name: "app.HopDong.fragment.UpdateStatusThanhToan",
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
                        listId.push(dataTable[indices[i]].itemId);
                    }
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/updateStatus', {
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
        btnUpdateStatusThanhToans: function (oEvent) {
            const root = this;
            let selectedItem = sap.ui.getCore().byId('idListUpdateStatusThanhToan').getSelectedItem();
            let sts = Number(selectedItem.data('Status'));
            if (selectedItem) {
                const indices = this.mainTable.getSelectedIndices();
                const dataTable = this.mainTable.getBinding('rows').getModel().getData();
                const listId = [];
                if (indices.length > 0) {
                    for (let i = 0; i < indices.length; i++) {
                        listId.push(dataTable[indices[i]].id);
                    }
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/updateStatusThanhToan', {
                        oParameters: {
                            ids: listId,
                            status: sts,
                        },
                        fnSuccess: function (data) {
                            MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
                            if (root.fragUpdateTTStatus)
                                root.fragUpdateTTStatus.close();
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
            let status = this.getView().byId('statusFilter').getSelectedKey() ||-1;
            let statusTT = this.getView().byId('statusThanhToanFilter').getSelectedKey()|| -1;
            let filter = {
                title: title,
                status: status,
                statusTT: statusTT
            }
            Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/searchFilter', {
                oParameters: filter,
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
        onStatusThanhToanFilterChange: function () {
            this.searchFilter();

        },

        //#region Detail
        onCellClick: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected)
                this.bus.publish('HopDongChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenHopDong });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('HopDongChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenHopDong });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._HopDongDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HopDongDetail = frag;
                    root._HopDongDetail.open();
                    root.bus.publish('HopDongChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
                });
            }
            else {
                root._HopDongDetail.open();
                root.bus.publish('HopDongChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onCloseHopDongView: function () {
            this._HopDongDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            const root = this;
            if (!this._HopDongAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HopDongAdd = frag;
                    root.bus.publish('HopDongChannel', 'loadAddPage');
                    root._HopDongAdd.open();
                });
            }
            else {
                root.bus.publish('HopDongChannel', 'loadAddPage');
                root._HopDongAdd.open();
            }
        },
        onCloseHopDongAdd: function () {
            if (this._HopDongAdd)
            this._HopDongAdd.close();
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenHopDong, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HopDong/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HopDong/list', {
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
            if (!this._HopDongEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HopDongEdit = frag;
                    root._HopDongEdit.open();
                    root.bus.publish('HopDongChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHopDong });
                });
            }
            else {
                root._HopDongEdit.open();
                root.bus.publish('HopDongChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHopDong });
            }
        },
        onCloseHopDongEdit: function () {
            if (this._HopDongEdit)
                this._HopDongEdit.close();
        },
        //#endregion

        //#region Phát sinh
        onRowPhatSinh: function (oEvent) {
            let oView = this.getView();
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            let obj = {
                title: selected.tenHopDong,
                tenKhachHang: selected.tenKhachHang,
                soMamPhatSinh: selected.soMamPhatSinh,
                idHopDong: selected.id
            }
            this.phatSinhModel.setData(obj);
            if (!this._phatSinh) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.fragment.PhatSinh",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._phatSinh = frag;
                    oView.addDependent(frag);
                    root._phatSinh.open();
                    
                });
            }
            else {
                root._phatSinh.open();
            }
        },
        closePhatSinh: function () {
            if (this._phatSinh)
                this._phatSinh.close();
        },

        onPhatSinhSave: function () {
            const root = this;
            let data = this.phatSinhModel.getData();
            let input = this.getView().byId('phatSinh'),
                isValid = true;
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                let gr = Number.isInteger(Number(input.getValue()));
                if (!gr) {
                    input.setValueState('Error');
                    input.setValueStateText('Trường thông tin này phải nhập số!');
                    isValid = false;
                } else {
                    input.setValueState('None');
                }
            }
            if (isValid) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + data.idHopDong + '/phatSinh/' + Number(data.soMamPhatSinh), {
                    fnProcessData: function (data) {
                        if (data) {
                            MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                            root.closePhatSinh();
                            root.reLoadData();
                        }
                    }
                });
            
            }
        },
        //#endregion

        //#region Thanh toan
        onRowThanhToan: function (oEvent) {
            let oView = this.getView();
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            if (!this._thanhToan) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.fragment.ThanhToan",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._thanhToan = frag;
                    oView.addDependent(frag);
                    root.loadThanhToan(selected.id)
                    root._thanhToan.open();

                });
            }
            else {
                root.loadThanhToan(selected.id)
                root._thanhToan.open();
            }
        },

        closeThanhToanDialog: function () {
            if (this._thanhToan)
                this._thanhToan.close();
        },
        loadThanhToan: function (idHopDong) {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + idHopDong, {
                fnProcessData: function (dataa) {
                    if (dataa) {
                        let soLuong = dataa.soMam + dataa.soMamPhatSinh;
                        dataa.maHoaDon = 'HD' + dataa.id;
                        //dataa.ngayTao = moment().format('MM/DD/YYYY');
                        root.thanhToanModel.setProperty('/info', dataa);
                        Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HopDong/' + idHopDong, {
                            fnProcessData: function (data) {
                                if (data && data.length > 0) {
                                    root.dataThanhToan = data;
                                    root.formatDataHD(data,soLuong,0);
                                }
                            }
                        });
                    }
                }
            });
            
        },
        formatDataHD: function (data, soLuong,phatSinh) {
            const root = this;
            let tongTien = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['STT'] = i + 1;
                data[i]['soLuong'] = soLuong;
                data[i]['thanhTien'] = data[i]['soLuong'] * data[i]['giaTien'];
                tongTien += data[i].thanhTien;
            }
            tongTien += phatSinh;
            root.thanhToanModel.setProperty('/data', data);
            root.thanhToanModel.setProperty('/tongTien', tongTien);
        },
        tienPhatSinhChange: function (oEvent) {
            const root = this;
            let el = oEvent.getSource();
            this.isValid = true;
            //let soLuong = Number(root.getVew().byId('soMamx').getValue()) + Number(root.getVew().byId('soMamPhatSinhx').getValue());
            let mainData = root.thanhToanModel.getData();
            let soLuong = Number(mainData.info.soMam) + Number(mainData.info.soMamPhatSinh);
            let value = oEvent.getParameter('newValue');
            if (value) {
                let gr = Number.isInteger(Number(value));
                if (!gr) {
                    el.setValueState('Error');
                    el.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isValid = false;
                } else {
                    this.isValid = true;
                    el.setValueState('None');
                    this.formatDataHD(this.dataThanhToan, soLuong, Number(value));
                }

            }
        },
        onSaveThanhToanPress: function () {
            const root = this;
            let input;
            input = this.getView().byId('maHoaDon');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                this.isValid = false;
            } else {
                input.setValueState('None');
                this.isValid = true;

            }
            input = this.getView().byId('ngayBatDau');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                this.isValid = false;
            } else {
                this.isValid = true;
                input.setValueState('None');
            }

            if (this.isValid) {
                let data = this.thanhToanModel.getData();
                let paras = {
                    maHoaDon: data.info.maHoaDon,
                    ngayTao: data.info.ngayTao,
                    idHopDong: data.info.id,
                    tienPhatSinh: data.info.tienPhatSinh,
                    tongTien: data.tongTien,
                    ghiChu: data.info.ghiChuu
                }
                Connector.postToApi(sdConfig.adminApiEndpoint + 'ThanhToan', {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        root.closeThanhToanDialog();
                        root.reLoadData();
                    }
                })
            }
        },
        //#endregion

        onAddVanChuyen: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));

            if (!this._vanChuyenAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.fragment.VanChuyen",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._vanChuyenAdd = frag;
                    root._vanChuyenAdd.open();
                    root.bus.publish('HopDongChannel', 'VanChuyenLoad', { Id: selected.id,});
                });
            }
            else {
                root.bus.publish('HopDongChannel', 'VanChuyenLoad', { Id: selected.id,});
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