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
    return Controller.extend('app.VanChuyen.PhieuNhap.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        phieuNhapModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        vanChuyenModel: new CoreJsonModel(),
        vanchuyen: [],
        phieuXuatId:null,
        isState: true,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('vanChuyenTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuNhapModel, "phieuNhapModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");
           
        },
        closeArea: function () {
            this.mainModel.setData({});
            this.vanChuyenModel.setData({});
            if (this.getView().byId('phieuXuatList'))
                this.getView().byId('phieuXuatList').removeSelections();
            this.bus.publish('PhieuNhapVatDungChannel', 'onClosePhieuNhap');
        },
        reLoadData: function () {
            const root = this;
            this.mainId = oData.Id;
            this.loadInfoDonCo();
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/phieunhapadd/' + this.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                            data[i]['soLuongNhap'] = data[i]['soLuong'];
                        }
                        root.phieuNhapModel.setData(data);
                    }
                }
            });

        },

        PhieuNhapLoad: function (oC, oE, oData) {
            const root = this;
            if (oData.Id) {
                this.mainId = oData.Id;
                this.loadInfoDonCo();
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyen/phieunhapadd/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                                data[i]['soLuongNhap'] = data[i]['soLuong'];
                            }
                            root.phieuNhapModel.setData(data);
                        }
                    }
                });
            }
        },
        loadInfoDonCo: function () {
            const root = this;
            if (this.mainId) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'vanchuyen/' + this.mainId, {
                    fnSuccess: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },
        changeSL: function (evt) {
            let ctrol = evt.getSource();
            let slVe = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext("phieuNhapModel").getObject();
            let { soLuong } = object;

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
                    if (soLuong < Number(slVe)) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng hàng!");
                        this.isState = false;
                        return;
                    }
                    evt.getSource().setValueState("None");
                    this.isState = true;
                }

            }

        },
        saveF: function () {
            
            let input, isValid = true;
            input = this.getView().byId('phieuXuat');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('ngayTao');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            if (isValid) {
                if (this.isState) {
                    const root = this;
                    MessageBox.show('Bạn muốn hoàn thành đơn vận chuyển ? ', {
                        icon: MessageBox.Icon.WARNING,
                        title: 'Xác nhận',
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction == MessageBox.Action.YES) {
                                let dataVC = root.vanChuyenModel.getData();
                                let check = false;
                                for (var i = 0; i < dataVC.length; i++) {
                                    if (dataVC[i].isEdit == true && dataVC[i].soLuongNhap > 0) {
                                        check = true;
                                        break;
                                    }
                                }
                                if (check == false) {
                                    dataVC.forEach(item => {
                                        if (item.isEdit == true && item.soLuongNhap == 0) {
                                            item.state = 'Error';
                                        }
                                    });
                                    root.vanChuyenModel.refresh();
                                } else {
                                    let mainData = root.mainModel.getData();
                                    let phieuNhap = {
                                        maPhieu: mainData.maPhieu,
                                        idPhieuXuat: root.phieuXuatId,
                                        ghiChu: mainData.ghiChu,
                                        ngayTao: mainData.ngayTao
                                    }
                                    Connector.postToApi(sdConfig.adminApiEndpoint + 'phieunhapvd', {
                                        oParameters: phieuNhap,
                                        fnSuccess: function (data) {
                                            let datax = []
                                            dataVC.forEach(item => {
                                                if (item.soLuongNhap > 0) {
                                                    let obj = {
                                                        idPhieuNhap: data.id,
                                                        idVatTu: item.idVatTu,
                                                        soLuong: Number(item.soLuongNhap),
                                                    }
                                                    datax.push(obj);
                                                }
                                            });
                                            Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietvanchuyennhap/addlistHT', {
                                                oParameters: datax,
                                                fnSuccess: function () {
                                                    MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                                    root.closeArea();
                                                    root.bus.publish('PhieuNhapVatDungChannel', 'reLoadData');
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    });
                }
            }
        },
        save: function () {
            console.log('save');
            return;
            let input, isValid = true;
            input = this.getView().byId('phieuXuat');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('ngayTao');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            if (isValid) {
                if (this.isState) {
                    const root = this;
                    let dataVC = this.vanChuyenModel.getData();
                    let check = false;
                    for (var i = 0; i < dataVC.length; i++) {
                        if (dataVC[i].isEdit == true && dataVC[i].soLuongNhap > 0) {
                            check = true;
                            break;
                        }
                    }
                    if (check == false) {
                        dataVC.forEach(item => {
                            if (item.isEdit == true && item.soLuongNhap == 0) {
                                item.state = 'Error';
                            }
                        });
                        root.vanChuyenModel.refresh();
                    } else {
                        let mainData = root.mainModel.getData();
                        let phieuNhap = {
                            maPhieu: mainData.maPhieu,
                            idPhieuXuat: root.phieuXuatId,
                            ghiChu: mainData.ghiChu,
                            ngayTao: mainData.ngayTao
                        }

                        dataVC = dataVC.filter(item => {
                            return item.isEdit == true;
                        });
                        Connector.postToApi(sdConfig.adminApiEndpoint + 'phieunhapvd', {
                            oParameters: phieuNhap,
                            fnSuccess: function (data) {
                                let datax = []
                                dataVC.forEach(item => {
                                    if (item.soLuongNhap > 0) {
                                        let obj = {
                                            idPhieuNhap: data.id,
                                            idVatTu: item.idVatTu,
                                            soLuong: Number(item.soLuongNhap),
                                        }
                                        datax.push(obj);
                                    }
                                });
                                Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietvanchuyennhap/addlist', {
                                    oParameters: datax,
                                    fnSuccess: function () {
                                        MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                        root.closeArea();
                                        root.bus.publish('PhieuNhapVatDungChannel', 'reLoadData');
                                    }
                                })
                            }
                        })
                    }
                }
            }
        },
        //saveF: function () {
        //    let input, isValid = true;
        //    input = this.getView().byId('phieuXuat');
        //    if (!input.getValue()) {
        //        input.setValueState('Error');
        //        input.setValueStateText('Trường thông tin này bắt buộc!');
        //        isValid = false;
        //    } else {
        //        input.setValueState('None');
        //    }
        //    input = this.getView().byId('ngayTao');
        //    if (!input.getValue()) {
        //        input.setValueState('Error');
        //        input.setValueStateText('Trường thông tin này bắt buộc!');
        //        isValid = false;
        //    } else {
        //        input.setValueState('None');
        //    }

        //    if (isValid) {
        //        if (this.isState) {
        //            const root = this;
        //            let dataVC = this.vanChuyenModel.getData();
        //            let mainData = this.mainModel.getData();
        //            let phieuNhap = {
        //                maPhieu: mainData.maPhieu,
        //                idPhieuXuat: this.phieuXuatId,
        //                ghiChu: mainData.ghiChu,
        //                ngayTao: mainData.ngayTao
        //            }
                    
        //            dataVC = dataVC.filter(item => {
        //                return item.isEdit == true;
        //            });
        //            Connector.postToApi(sdConfig.adminApiEndpoint + 'phieunhapvd', {
        //                oParameters: phieuNhap,
        //                fnSuccess: function (data) {
        //                    dataVC = dataVC.map(item => {
        //                        return {
        //                            idPhieuNhap: data.id,
        //                            idVatTu: item.idVatTu,
        //                            soLuong: Number(item.soLuongNhap),
        //                            soLuongMat: item.biMat ? item.soLuong - item.soLuongDaLay - item.soLuongNhap : 0,
        //                        }
        //                    });
        //                    Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietvanchuyennhap/addlist', {
        //                        oParameters: dataVC,
        //                        fnSuccess: function () {
        //                            MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
        //                            root.closeArea();
        //                            root.bus.publish('PhieuNhapVatDungChannel', 'reLoadData');
        //                        }
        //                    })
        //                }
        //            })
        //            return;
                    
                    
        //        }
        //    }
            
        //},

        soLuongNhapChange: function (evt) {
            let ctrol = evt.getSource();
            let slVe = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext("vanChuyenModel").getObject();
            let { soLuong, soLuongDaLay } = object;

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
                    if (soLuong < Number(slVe) + soLuongDaLay) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng xuất!");
                        this.isState = false;
                        return;
                    }
                    evt.getSource().setValueState("None");
                    this.isState = true;
                }

            }
        },

        loadPhieuXuatFragment: function () {
            let root = this;
            let oView = this.getView();
            if (!this._vanChuyenFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.PhieuXuatVatDung.fragment.PhieuXuat',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._vanChuyenFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.getPhieuXuatData();
                    root._vanChuyenFrag.open();
                });
            } else {
                root._vanChuyenFrag.open();
                root.getPhieuXuatData();
            }
        },
        getPhieuXuatData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieuxuatvd/check', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.phieuXuatModel.setData(data);
                    }
                }
            });
        },
        onphieuXuatPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('phieuXuatModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.phieuXuatId = rowObject.id;
            this.getView().byId('phieuXuat').setValue(rowObject.maPhieu);
            this.getView().byId('maPhieuNhap').setValue('PN' + rowObject.id);

            this.loadPhieuNhapByPhieuXuat(rowObject.id);
            this._vanChuyenFrag.close();
            this.getView().byId('phieuXuatList').removeSelections(true);
        },
        closephieuXuatputDialog: function () {
            this._vanChuyenFrag.close();
            this.phieuXuatId = null;
        },
        loadPhieuNhapByPhieuXuat: function (id) {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyenXuat/phieuxuat/'+id, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.formatData(data,id);
                    }
                }
            });
        },
        formatData: function (listPX, idPhieuXuat) {
            let newArr = [];
            listPX.forEach(item => {
                newArr.push(item);
            });
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyenNhap/phieuXuat/' + idPhieuXuat, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        let arrCheck = [];
                        let dataResult = [];
                        for (var i = 0; i < data.length; i++) {
                            if (!arrCheck.includes(data[i].idVatTu)) {
                                arrCheck.push(data[i].idVatTu);
                                dataResult.push(data[i]);
                            }
                            let soLuong = 0;
                            for (var j = 0; j < data.length; j++) {
                                if (data[i].idVatTu == data[j].idVatTu) {
                                    soLuong += data[j].soLuong;
                                }
                                data[i].soLuongDaLay = soLuong;
                            }
                        }
                        for (var i = 0; i < dataResult.length; i++) {
                            for (var j = 0; j < newArr.length; j++) {
                                if (dataResult[i]['idVatTu'] == newArr[j]['idVatTu']) {
                                    newArr[j].soLuongDaLay = dataResult[i].soLuongDaLay;
                                    newArr[j].soLuongNhap = 0;
                                    if (dataResult[i].soLuongDaLay == newArr[j].soLuong) {
                                        newArr[j].isEdit = false;
                                    } else {
                                        newArr[j].isEdit = true;
                                    }
                                }
                            }
                        }

                    }
                    else {
                        newArr.forEach(item => {
                            item.soLuongDaLay = 0;
                            item.soLuongNhap = 0;
                            //item.biMat = false;
                            item.isEdit = true;
                        });
                    }
                    root.vanChuyenModel.setData(newArr);
                }
            });
        },

    });
});