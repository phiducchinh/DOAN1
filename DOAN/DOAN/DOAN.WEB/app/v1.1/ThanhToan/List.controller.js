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
    return Controller.extend('app.ThanhToan.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        thanhToanModel: new CoreJsonModel(),
        mainId: null,
        filter: {
            title:'',
            status:'All'
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.thanhToanModel, "thanhToanModel");
            this.loadData()
            this.bus.subscribe('ThanhToanChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('ThanhToanChannel', 'onCloseThanhToanView', this.onCloseThanhToanView, this);
            //this.bus.subscribe('ThanhToanChannel', 'onCloseThanhToanAdd', this.onCloseThanhToanAdd, this);
            this.bus.subscribe('ThanhToanChannel', 'onCloseThanhToanEdit', this.onCloseThanhToanEdit, this);
            this.bus.subscribe('ThanhToanChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('ThanhToanChannel.Detail', 'reLoadData', this.reLoadData, this);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThanhToan', {
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
                    name: "app.ThanhToan.fragment.UpdateStatus",
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
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'ThanhToan/updateStatus', {
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
            Connector.postToApi(sdConfig.adminApiEndpoint + 'ThanhToan/filter', {
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
                this.bus.publish('ThanhToanChannel', 'switchToDetailPage', { Id: selected.id, IdHopDong: selected.idHopDong });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('ThanhToanChannel', 'switchToDetailPage', { Id: selected.id, IdHopDong: selected.idHopDong });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._ThanhToanDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.ThanhToan.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThanhToanDetail = frag;
                    root._ThanhToanDetail.open();
                    root.bus.publish('ThanhToanChannel', 'loadDetailPage', { Id: oData.Id, IdHopDong: oData.IdHopDong });
                });
            }
            else {
                root._ThanhToanDetail.open();
                root.bus.publish('ThanhToanChannel', 'loadDetailPage', { Id: oData.Id, IdHopDong: oData.IdHopDong });
            }
        },
        onCloseThanhToanView: function () {
            this._ThanhToanDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: function () {
            let root = this;
            let oView = this.getView();
            if (!this.donCoFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.ThanhToan.fragment.DonCo',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root.donCoFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.getDonCoData();
                    root.donCoFrag.open();
                });
            } else {
                root.donCoFrag.open();
                root.getDonCoData();
            }
        },
        closedonCoputDialog: function () {
            if (this.donCoFrag) {
                this.byId('donCoList').removeSelections(true);
                this.idDonCo = null;
                this.donCoFrag.close();
            }

        },
        getDonCoData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'hopDong/trangthaithanhtoan/'+0, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.donCoModel.setData(data);
                    }
                }
            });
        },
        onDonCoPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('donCoModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idDonCo = rowObject.id;
            this.onRowEditDonCo(rowObject.id);
            this.closedonCoputDialog();
        },
        onRowEditDonCo: function (id) {
            let oView = this.getView();
            const root = this;
            
            if (!this._thanhToant) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.fragment.ThanhToan",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._thanhToant = frag;
                    oView.addDependent(frag);
                    root.loadThanhToan(id)
                    root._thanhToant.open();

                });
            }
            else {
                root.loadThanhToan(id)
                root._thanhToant.open();
            }
        },
        closeThanhToanDialog: function () {
            if (this._thanhToant)
                this._thanhToant.close();
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
                                    root.formatDataHD(data, soLuong, 0);
                                }
                            }
                        });
                    }
                }
            });

        },
        formatDataHD: function (data, soLuong, phatSinh) {
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

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenThanhToan, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThanhToan/' + selected.id, {
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
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThanhToan/list', {
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
            if (!this._ThanhToanEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.ThanhToan.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._ThanhToanEdit = frag;
                    root._ThanhToanEdit.open();
                    root.bus.publish('ThanhToanChannel', 'loadEditPage', { Id: selected.id, title: selected.tenThanhToan });
                });
            }
            else {
                root._ThanhToanEdit.open();
                root.bus.publish('ThanhToanChannel', 'loadEditPage', { Id: selected.id, title: selected.tenThanhToan });
            }
        },
        onCloseThanhToanEdit: function () {
            if (this._ThanhToanEdit)
                this._ThanhToanEdit.close();
        },
        //#endregion


        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});