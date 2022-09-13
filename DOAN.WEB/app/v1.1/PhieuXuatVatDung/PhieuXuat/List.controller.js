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
    return Controller.extend('app.VanChuyen.PhieuXuat.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        vanChuyenModel: new CoreJsonModel(),
        vanchuyen:[],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('vanChuyenTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");
            //this.bus.subscribe('VanChuyenChannel.Detail', 'reLoadData', this.reLoadData, this);
            //this.bus.subscribe('VanChuyenChannel', 'VanChuyenLoad', this.loadData, this);
            this.bus.subscribe('VanChuyenChannel', 'PhieuXuatLoad', this.PhieuXuatLoad, this);
            this.bus.subscribe('VanChuyenChannel', 'onCloseVatDungVanChuyenAdd', this.onCloseVatDungVanChuyenAdd, this);
            //this.loadVatDung();
        },
        closeArea: function () {
            this.mainModel.setData({});
            this.vanChuyenModel.setData({});
            this.bus.publish('VanChuyenChannel', 'closeVanChuyenDi');
        },
        reLoadData: function () {
            const root = this;
            this.mainId = oData.Id;
            this.loadInfoDonCo();
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/phieuxuatadd/' + this.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                        root.phieuXuatModel.setData(data);
                    }
                }
            });
            
        },

        PhieuXuatLoad: function (oC, oE, oData) {
            const root = this;
            if (oData.Id) {
                this.mainId = oData.Id;
                this.loadInfoDonCo(oData.Id);
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/phieuxuatadd/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            root.formatData(data);
                        }
                    }
                });
            }
        },
        onRowDelete: function (oEvent) {
            let selected = this.getView().getModel('phieuXuatModel').getProperty('', oEvent.getParameter('row').getBindingContext('phieuXuatModel'));
            if (selected.isEdit) {
                let data = this.phieuXuatModel.getData();
                data = data.filter(item => {
                    return item.vatTu.id !== selected.vatTu.id;
                })
                this.phieuXuatModel.setData(data);
            }

        },
        formatData: function (data) {
            const root = this;
            let newArr = [];
            data.forEach(item => {
                newArr.push(item);
            });
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieuXuatVD/vanChuyen/' + this.mainId, {
                fnProcessData: function (datax) {
                    if (datax) {
                        Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyenxuat/phieuxuat/' + datax.id, {
                            fnProcessData: function (dataCT) {
                                if (dataCT && dataCT.length > 0) {
                                    let arrCheck = [];
                                    let dataResult = [];
                                    for (var i = 0; i < dataCT.length; i++) {
                                        if (!arrCheck.includes(dataCT[i].idVatTu)) {
                                            arrCheck.push(dataCT[i].idVatTu);
                                            dataResult.push(dataCT[i]);
                                        }
                                        let soLuong = 0;
                                        for (var j = 0; j < dataCT.length; j++) {
                                            if (dataCT[i].idVatTu == dataCT[j].idVatTu) {
                                                soLuong += dataCT[j].soLuong;
                                            }
                                            dataCT[i].soLuongDaXuat = soLuong;
                                        }
                                    }
                                    for (var i = 0; i < newArr.length; i++) {
                                        newArr[i].soLuongXuat = 0;
                                        newArr[i].STT = i + 1;
                                        newArr[i].isEdit = true;
                                        for (var j = 0; j < dataResult.length; j++) {
                                            if (dataResult[j]['idVatTu'] == newArr[i]['idVatTu']) {
                                                newArr[i].soLuongDaXuat = dataResult[j].soLuongDaXuat;
                                                if (newArr[i].soLuongDaXuat == newArr[i].soLuong) {
                                                    newArr[i].isEdit = false;
                                                }
                                            }
                                        }
                                    }
                                    root.phieuXuatModel.setData(newArr);

                                }
                            }
                        });
                    } else {
                        data=data.map((item,index) => {
                            return {
                                STT: index+1,
                                vatTu: item.vatTu,
                                soLuong: item.soLuong,
                                soLuongDaXuat: 0,
                                soLuongXuat: 0,
                                isEdit:true
                            }
                        });
                        root.phieuXuatModel.setData(data);
                    }

                }
            });
        },
        loadInfoDonCo: function () {
            const root = this;
            if (this.mainId) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'vanchuyen/' + this.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            data.maPhieuXuat = 'PX' + root.mainId;
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },
        soLuongNhapChange: function (evt) {
            let ctrol = evt.getSource();
            let slVe = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext("phieuXuatModel").getObject();
            let { soLuong, soLuongDaXuat, vatTu } = object;
            if (!slVe) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường thông tin này bắt buộc!');
                this.isValid = false;
            } else {
                let gr = Number.isInteger(Number(slVe));
                if (!gr) {
                    ctrol.setValueState('Error');
                    ctrol.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isValid = false;
                } else {
                    if (soLuong < Number(slVe) + soLuongDaXuat ) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng trong đơn vận chuyển!");
                        this.isState = false;
                        return;
                    } else if (Number(slVe) > vatTu.soLuongConLai){
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng trong kho!");
                        this.isState = false;
                        return;
                    }
                    evt.getSource().setValueState("None");
                    this.isState = true;
                }

            }
        },
        save: function () {
            
            const root = this;
            let phieuXuat = this.phieuXuatModel.getData();
            
            phieuXuat = phieuXuat.filter(item => {
                return item.isEdit == true;
            });
            if (phieuXuat.length == 0) {
                MessageToast.show("Cần ít nhất nhập 1 vật tư", { width: '25em', duration: 5000 });
            } else {
                let check = true;
                phieuXuat.forEach(item => {
                    if (item.soLuongXuat <= 0 && item.isEdit == true) {
                        item.state = 'Error';
                        check = false;
                    }
                })
                this.phieuXuatModel.refresh();
                
                if (check == true) {
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'phieuxuatVD', {
                        oParameters: {
                            maPhieu: 'PX' + root.mainId,
                            idVanChuyen: root.mainId
                        },
                        fnSuccess: function (data) {
                            let dataChiTiet = phieuXuat.map(item => {
                                return {
                                    idPhieuXuat: data.id,
                                    idVatTu: item.vatTu.id,
                                    soLuong: Number(item.soLuongXuat)
                                }
                            });
                            Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietvanchuyenXuat/addlist', {
                                oParameters: dataChiTiet,
                                fnSuccess: function () {
                                    MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                    root.closeArea();
                                    root.bus.publish('PhieuXuatVatDungChannel', 'reLoadData');
                                }
                            })
                        }
                    })

                }
            }
            
        },


        //loadVatDung: function () {
        //    const root = this;
        //    Connector.getFromApi(sdConfig.adminApiEndpoint + 'VatTu', {
        //        fnProcessData: function (data) {
        //            if (data && data.length > 0) {
        //                root.vatDungModel.setData(data);
        //            }
        //        }
        //    });
        //},
        loadData: function (oC, oE, oData) {
            const root = this;
            if (oData.Id) {
                this.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            root.formatDataVanChuyen(data);
                        }
                    }
                });
                this.loadInfoDonCo();
            }
        },
        
        formatDataVanChuyen: function (data) {
            let cloneData = [];
            for (let i = 0; i < data.length; i++) {
                cloneData.push(data[i]);
            }
            let arrCheck = [-1];
            let resultData = [];
            for (let i = 0; i < cloneData.length; i++) {
                if (!arrCheck.includes(cloneData[i].idVatDung)) {
                    resultData.push(cloneData[i]);
                    let tong = 0;
                    for (let j = 0; j < cloneData.length; j++) {
                        if (cloneData[i].idVatDung == cloneData[j].idVatDung) {
                            tong += cloneData[j].soLuong;
                        }
                        cloneData[i].tong = tong;
                        cloneData[i].isEdit = false;
                    }
                    arrCheck.push(cloneData[i].idVatDung)
                }
            }
            resultData.push({ isEdit :true})
            this.vanChuyenModel.setData({ data: resultData });
        },
        onSelected: function (evt) {
            if (evt.getParameter("selectedRow")) {
                this.vanchuyen = this.vanChuyenModel.getData().data;
                let object = evt.getParameter("selectedRow").getBindingContext("vatDungModel").getObject();
                let { id, tenVatTu, maVatTu } = object;
                let isCheck = this.vanchuyen.some(x => x.idVatDung == id);
                if (isCheck) {
                    MessageToast.show('Đơn hàng này đã được thêm vào phiếu\n Vui lòng chọn đơn hàng khác.');
                    return;
                }
                let dCount = this.vanchuyen.length;
                //let obj = Object.assign({ index: dCount }, object)
                let obj = {
                    idVatDung: id,
                    soLuong: 0,
                    vatTu: object,
                    tong: 0,
                }
                this.vanchuyen[dCount - 1] = Object.assign({ isEdit: false }, obj);
                this.vanchuyen.push({ isEdit: true });
               
            }
        },

        addVatDung: function () {
            const root = this;
            let arrId = [];
            let data = this.vanChuyenModel.getData();
            data.data.forEach(item => {
                arrId.push(item.idVatDung);
            });
            if (!this._VatDungAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.VanChuyen.VatDung.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._VatDungAdd = frag;
                    root._VatDungAdd.open();
                    root.bus.publish('VanChuyenChannel', 'loadAddVatDungPage', { arrID: arrId });
                });
            }
            else {
                root._VatDungAdd.open();
                this.bus.publish('VanChuyenChannel', 'loadAddVatDungPage', { arrID: arrId });
            }
        },
        onCloseVatDungVanChuyenAdd: function () {
            if (this._VatDungAdd) {
                this._VatDungAdd.close();
            }
        },
        addVatTuVC: function (oC, oE, oData) {
            if (oData.data) {
                let datatable = this.vanChuyenModel.getData();
                datatable.data.push(oData.data);
                this.vanChuyenModel.setData(datatable);
            }
        },
        onAddButtonPress: function () {
            const root = this;
            let obj = {
                idHopDong: this.mainId,
                trangThai: 1,
            }
            Connector.postToApi(sdConfig.adminApiEndpoint + "vanchuyen", {
                oParameters: obj,
                    fnSuccess: function (data) {
                        if (data) {
                            let addArr = [];
                            let info = root.vanChuyenModel.getData();
                            info.data.forEach(item => {
                                addArr.push({
                                    idVanChuyen: data.id,
                                    idVatTu: item.idVatDung,
                                    soLuong: item.tong
                                })
                            })
                            addArr.pop();
                            Connector.postToApi(sdConfig.adminApiEndpoint + "chitietvanchuyen", {
                                oParameters: addArr,
                                fnSuccess: function (data) {
                                    MessageToast.show("Thêm thành công!", { width: "30em", duration: 5000 });
                                    root.reLoadData();
                                    root.bus.publish('VanChuyenChannel', 'onCloseVanChuyenAdd');

                                },
                            });
                        }
                    },
                });
                    
        },


        onRefresh: function () {
            this.reLoadData();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '30em', duration: 5000 });
        },
        //reLoadData: function () {
        //    this.loadData();
        //    this.removeSelections();
        //    this.mainTable.clear
        //    this.getView().byId('searchField').setValue('');
        //    this.getView().byId('statusFilter').setSelectedKey('-1')
        //    this.getView().byId('statusThanhToanFilter').setSelectedKey('-1')
        //},
        //removeSelections: function () {
        //    this.mainTable.clearSelection();
        //    this.getView().byId('btnUpdateStatus').setVisible(false);
        //    this.getView().byId('btnUpdateThanhToanStatus').setVisible(false);
        //    this.getView().byId('btnDelete').setVisible(false);
        //},
        //onRowSelectionChange: function (oEvent) {
        //    const selectedIndices = this.mainTable.getSelectedIndices();
        //    if (selectedIndices.length > 0) {
        //        this.getView().byId('btnUpdateStatus').setVisible(true);
        //        this.getView().byId('btnUpdateThanhToanStatus').setVisible(true);
        //        this.getView().byId('btnDelete').setVisible(true);
        //    } else {
        //        this.getView().byId('btnUpdateStatus').setVisible(false);
        //        this.getView().byId('btnUpdateThanhToanStatus').setVisible(false);
        //        this.getView().byId('btnDelete').setVisible(false);
        //    }
        //},
        //onRowDelete: function (oEvent) {
        //    let selected = this.getView().getModel('vanChuyenModel').getProperty('', oEvent.getParameter('row').getBindingContext('vanChuyenModel'));
        //    let data = this.vanChuyenModel.getData();
        //    data.data.forEach((item,index) => {
        //        if (item.idVatDung == selected.idVatDung) {
        //            data.data.splice(index, 1);
        //        }
        //    })
        //    this.vanChuyenModel.setData(data)
        //}
        //updateStatusItems: function (oEvent) {
        //    const root = this;
        //    const button = oEvent.getSource();
        //    if (!root.fragUpdateStatus) {
        //        Fragment.load({
        //            name: "app.HopDong.fragment.UpdateStatus",
        //            type: "XML",
        //            controller: root
        //        }).then(function (frag) {
        //            root.fragUpdateStatus = frag;
        //            root.getView().addDependent(frag);
        //            root.fragUpdateStatus.openBy(button);
        //        });
        //    }
        //    else {
        //        this.fragUpdateStatus.openBy(button);
        //    }
        //},
        //updateThanhToanStatusItems: function (oEvent) {
        //    const root = this;
        //    const button = oEvent.getSource();
        //    if (!root.fragUpdateTTStatus) {
        //        Fragment.load({
        //            name: "app.HopDong.fragment.UpdateStatusThanhToan",
        //            type: "XML",
        //            controller: root
        //        }).then(function (frag) {
        //            root.fragUpdateTTStatus = frag;
        //            root.getView().addDependent(frag);
        //            root.fragUpdateTTStatus.openBy(button);
        //        });
        //    }
        //    else {
        //        this.fragUpdateTTStatus.openBy(button);
        //    }
        //},
        //btnUpdateStatus: function (oEvent) {
        //    const root = this;
        //    let selectedItem = sap.ui.getCore().byId('idListUpdateStatus').getSelectedItem();
        //    let sts = Number(selectedItem.data('Status'));
        //    if (selectedItem) {
        //        const indices = this.mainTable.getSelectedIndices();
        //        const dataTable = this.mainTable.getBinding('rows').getModel().getData();
        //        const listId = [];
        //        if (indices.length > 0) {
        //            for (let i = 0; i < indices.length; i++) {
        //                listId.push(dataTable[indices[i]].itemId);
        //            }
        //            Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/updateStatus', {
        //                oParameters: {
        //                    ids: listId,
        //                    status: sts,
        //                },
        //                fnSuccess: function (data) {
        //                    MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
        //                    root.fragUpdateStatus.close();
        //                    root.reLoadData();
        //                }
        //            });
        //        }
        //        else {
        //            MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
        //        }
        //        this.fragUpdateStatus.close();
        //    } else {
        //        MessageToast.show('Hãy chọn một trạng thái!', { width: '30em', duration: 5000 });
        //    }
        //},
        //btnUpdateStatusThanhToans: function (oEvent) {
        //    const root = this;
        //    let selectedItem = sap.ui.getCore().byId('idListUpdateStatusThanhToan').getSelectedItem();
        //    let sts = Number(selectedItem.data('Status'));
        //    if (selectedItem) {
        //        const indices = this.mainTable.getSelectedIndices();
        //        const dataTable = this.mainTable.getBinding('rows').getModel().getData();
        //        const listId = [];
        //        if (indices.length > 0) {
        //            for (let i = 0; i < indices.length; i++) {
        //                listId.push(dataTable[indices[i]].itemId);
        //            }
        //            Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/updateStatusThanhToan', {
        //                oParameters: {
        //                    ids: listId,
        //                    status: sts,
        //                },
        //                fnSuccess: function (data) {
        //                    MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
        //                    root.fragUpdateTTStatus.close();
        //                    root.reLoadData();
        //                }
        //            });
        //        }
        //        else {
        //            MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
        //        }
        //        this.fragUpdateStatus.close();
        //    } else {
        //        MessageToast.show('Hãy chọn một trạng thái!', { width: '30em', duration: 5000 });
        //    }
        //},
        //searchFilter: function () {
        //    const root = this;
        //    let title = this.getView().byId("searchField").getValue();
        //    let status = this.getView().byId('statusFilter').getSelectedKey();
        //    this.filter.title = title;
        //    this.filter.status = status;
        //    Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong/filter', {
        //        oParameters: root.filter,
        //        fnProcessData: function (data) {
        //            if (data && data.length > 0) {
        //                for (var i = 0; i < data.length; i++) {
        //                    data[i]['STT'] = i + 1;
        //                }
        //            }
        //            root.mainModel.setData(data);
        //        }
        //    });
        //},
        //onLiveChange: function () {
        //    let title = this.getView().byId("searchField").getValue();
        //    this.filter.title = title;
        //    if (title != null || title != '') {
        //        this.searchFilter();
        //    }
        //},
        //onSearch: function (oEvent) {
        //    const params = oEvent.getParameters();
        //    const isReset = params.clearButtonPressed;
        //    if (isReset) {
        //        this.filter.title = "";
        //        this.searchFilter();
        //    }
        //    else
        //        this.searchFilter();
        //},
        //onStatusFilterChange: function () {
        //    this.searchFilter();
        //},

        ////#region Detail
        //onCellClick: function (oEvent) {
        //    let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
        //    if (selected)
        //        this.bus.publish('VanChuyenChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenHopDong });
        //},
        //onRowView: function (oEvent) {
        //    let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
        //    this.bus.publish('VanChuyenChannel', 'switchToDetailPage', { Id: selected.id, title: selected.tenHopDong });
        //},
        //switchToDetailPage: function (oChannel, oEvent, oData) {
        //    const root = this;
        //    if (!this._HopDongDetail) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.HopDong.Detail",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._HopDongDetail = frag;
        //            root._HopDongDetail.open();
        //            root.bus.publish('VanChuyenChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
        //        });
        //    }
        //    else {
        //        root._HopDongDetail.open();
        //        root.bus.publish('VanChuyenChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
        //    }
        //},
        //onCloseHopDongView: function () {
        //    this._HopDongDetail.close();
        //},

        ////#endregion

        ////#region Add
        //onAddButtonPress: function () {
        //    const root = this;
        //    if (!this._HopDongAdd) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.HopDong.Add",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._HopDongAdd = frag;
        //            root._HopDongAdd.open();
        //        });
        //    }
        //    else {
        //        root._HopDongAdd.open();
        //    }
        //},
        //onCloseHopDongAdd: function () {
        //    this._HopDongAdd.close();
        //},

        ////#endregion

        ////#region Delete
        //onRowDelete: function (oEvent) {
        //    const root = this;
        //    let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
        //    MessageBox.show('Bạn muốn xóa ' + selected.tenHopDong, {
        //        icon: MessageBox.Icon.WARNING,
        //        title: 'Xác nhận',
        //        actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //        onClose: function (oAction) {
        //            if (oAction == MessageBox.Action.DELETE) {
        //                Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HopDong/' + selected.id, {
        //                    fnSuccess: function (data) {
        //                        root.reLoadData();
        //                        MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
        //                    }
        //                });
        //            }
        //        }
        //    });

        //},
        //deleteItems: function (oEvent) {
        //    const root = this;
        //    const indices = this.mainTable.getSelectedIndices();
        //    const dataTable = this.mainTable.getBinding('rows').getModel().getData();
        //    const listId = [];
        //    if (indices.length > 0) {
        //        for (let i = 0; i < indices.length; i++) {
        //            listId.push(dataTable[indices[i]].id);
        //        }
        //        MessageBox.show('Xóa tất cả các mục được chọn?', {
        //            icon: MessageBox.Icon.WARNING,
        //            title: 'Xác nhận',
        //            actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //            onClose: function (oAction) {
        //                if (oAction == MessageBox.Action.DELETE) {
        //                    Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HopDong/list', {
        //                        oParameters: listId,
        //                        fnSuccess: function (data) {
        //                            root.reLoadData();
        //                            MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
        //                        }
        //                    });
        //                }
        //            }
        //        });
        //    }
        //    else {
        //        MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
        //    }
        //},
        ////#endregion

        ////#region Edit
        //onRowEdit: function (oEvent) {
        //    let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
        //    const root = this;
        //    if (!this._HopDongEdit) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.HopDong.Edit",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._HopDongEdit = frag;
        //            root._HopDongEdit.open();
        //            root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHopDong });
        //        });
        //    }
        //    else {
        //        root._HopDongEdit.open();
        //        root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHopDong });
        //    }
        //},
        //onCloseHopDongEdit: function () {
        //    if (this._HopDongEdit)
        //        this._HopDongEdit.close();
        //},
        ////#endregion

        //onAddVanChuyen: function (oEvent) {
        //    const root = this;
        //    this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");

        //    if (!this._vanChuyenAdd) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.HopDong.fragment.VanChuyen",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._vanChuyenAdd = frag;
        //            root._vanChuyenAdd.open();
        //        });
        //    }
        //    else {
        //        root._vanChuyenAdd.open();
        //    }

        //    let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
        //    Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/' + selected.id, {
        //        fnProcessData: function (data) {
        //            if (data && data.length > 0) {
        //                root.formatDataVanChuyen(data);
        //            }
        //        }
        //    });
        //},
        //onCloseVanChuyenAdd: function () {
        //    if (this._vanChuyenAdd)
        //        this._vanChuyenAdd.close();
        //},
        //formatDataVanChuyen: function (data) {
        //    let cloneData = [];
        //    for (let i = 0; i < data.length; i++) {
        //        cloneData.push(data[i]);
        //    }
        //    let arrCheck = [-1];
        //    let resultData = [];
        //    for (let i = 0; i < cloneData.length; i++) {
        //        if (!arrCheck.includes(cloneData[i].idVatDung)) {
        //            resultData.push(cloneData[i]);
        //            let tong = 0;
        //            for (let j = 0; j < cloneData.length; j++) {
        //                if (cloneData[i].idVatDung == cloneData[j].idVatDung) {
        //                    tong += cloneData[j].soLuong;
        //                }
        //                cloneData[i].tong = tong;
        //            }
        //            arrCheck.push(cloneData[i].idVatDung)
        //        }
        //    }
        //    console.log(resultData);
        //    this.vanChuyenModel.setData({ data: resultData });
        //    console.log(this.vanChuyenModel.getData());
        //},
        //onExit: function () {
        //    //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        //}
    });
});