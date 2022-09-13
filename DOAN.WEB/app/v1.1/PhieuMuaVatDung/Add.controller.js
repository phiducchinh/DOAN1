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
    'sap/ui/model/FilterOperator',
    'sap/ui/Device',
    "sap/ui/table/Row",
    "sap/ui/core/Item"
], function (Controller, Core, MessageToast, MessageBox, Connector, CoreJsonModel, Fragment, GlobalFormatter, Filter, FilterOperator, Device,Row,Item) {
    'use strict';
    return Controller.extend('app.PhieuMuaVatDung.Add', {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        phieuMuaModel: new CoreJsonModel(),
        vatDungModel: new CoreJsonModel(),
        thucDonModel: new CoreJsonModel(),
        mainId: null,
        idHopDong: null,
        phieuMua: [],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuMuaModel, "phieuMuaModel");
            this.getView().setModel(this.vatDungModel, "vatDungModel");
            this.getView().setModel(this.thucDonModel, "thucDonModel");
            this.phieuMuaModel.setData();
            this.initialize();
            this.phieuMuaModel.setData([{ isEdit :true}])
            //this.getView().setModel(this.bepTruongModel, "bepTruongModel");
            //this.clearForm();
            
            this.bus.subscribe('PhieuMuaVatDungChannel', 'loadAddpage', this.loadAddpage, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'addvatDungPM', this.addvatDungPM, this);
            this.bus.subscribe('PhieuMuaVatDungChannel', 'onClosevatDungPhieuMuaVatDungAdd', this.onClosevatDungPhieuMuaVatDungAdd, this);
        },
        initialize: function () {
            this.loadDataHang();
            this.loadData();
            this.getView().byId('idhang').setFilterFunction(function (sTerm, oItem) {
                return oItem.getText().match(new RegExp(sTerm, "i"));
            });
            this.getView().byId('idhang').setSuggestionRowValidator(this.suggestionRowValidator);
        },
        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'phieumuavd/getnewid', {
                fnProcessData: function (data) {
                    let count = 0;
                    if (data) {
                        data = data.maPhieu.replace('PMVD', '');
                        count = Number(data) + 1;
                    }
                    let datax = {
                        maPhieuMua: 'PMVD' + count,
                        ngayTao: moment().format('DD/MM/YYYY')
                    };
                    root.mainModel.setData(datax);

                }
            });
        },
        suggestionRowValidator: function (oColumnListItem) {
            var aCells = oColumnListItem.getCells();
            return new Item({
                key: aCells[1].getText(),
                text: aCells[0].getText()
            });
        },
        loadDataHang: async function () {
            let root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'vatTu', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.vatDungModel.setData(data);
                }
            });
        },
        soLuongNhapChange: function (evt) {
            let ctrol = evt.getSource();
            let slVe = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext().getObject();
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
                    evt.getSource().setValueState("None");
                    this.isState = true;
                }

            }
        },
        onSelected: function (evt) {
            if (evt.getParameter("selectedRow")) {
                this.phieuMua = this.phieuMuaModel.getData();
                //console.log(this.phieuMua);
                let object = evt.getParameter("selectedRow").getBindingContext("vatDungModel").getObject();
                let { id, tenVatTu, soLuongConLai, maVatTu, soLuongChuaSD,trangThai} = object;
                let isCheck = this.phieuMua.some(x => x.idvatDung == id);
                if (isCheck) {
                    MessageToast.show('Đơn hàng này đã được thêm vào phiếu\n Vui lòng chọn đơn hàng khác.');
                    this.phieuMua[this.phieuMua.length - 1].tenvatDung = '';
                    this.phieuMuaModel.refresh();
                    return;
                }
                let dCount = this.phieuMua.length;
                //let obj = Object.assign({ index: dCount }, object)
                let obj = {
                    idvatDung: id,
                    soLuongConLai: soLuongConLai || 0,
                    soLuongMua:0,
                    maVatTu: maVatTu,
                    tenVatDung: tenVatTu,
                    soLuongChuaSD: soLuongChuaSD || 0,
                    trangThai: trangThai
                }
                this.phieuMua[dCount - 1] = Object.assign({ isEdit: false }, obj);
                this.phieuMua.push({ isEdit: true });
            }

        },
        DetailThucDon: function () {
            let root = this;
            let oView = this.getView();
            if (!this._thucDon) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HopDong.fragment.ThucDon',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._thucDon = oDialog;
                    oView.addDependent(oDialog);
                    root.loadThucdon();
                    root._thucDon.open();
                });
            } else {
                root._thucDon.open();
                root.loadThucdon();
            }
        },
        closeThucDonnputDialog: function () {
            this._thucDon.close();
        },
        loadThucdon: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucdon/HopDong/' + this.idHopDong, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.thucDonModel.setData(data)
                }
            });
        },
        loadAddpage: function (oC, oE, oData) {
            const root = this;
            if (oData.IdDonCo) {
                this.idHopDong = oData.IdDonCo;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuMua/hopDong/' + oData.IdDonCo, {
                    fnProcessData: function (data) {
                        console.log(data);
                        if (data && data.length > 0)
                            root.formatDatavatDung(data);
                    }
                });
                this.getView().byId('ngayTao').setValue(moment().format('DD/MM/YYYY'));
                this.getView().byId('maPhieuMua').setValue('PM' + oData.IdDonCo);
            } else {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'PhieuMuaVatDung/getnewid', {
                    fnProcessData: function (data) {
                        let count = 0;
                        if (data) {
                            data = data.maPhieu.replace('PMN', '');
                            count = Number(data) + 1;
                        }
                        let datax = {
                            maPhieuMua: 'PMN' + count,
                            ngayTao: moment().format('DD/MM/YYYY')
                        };
                        root.mainModel.setData(datax);
                    }
                });
                this.phieuMuaModel.setData([{ isEdit :true}])
            }

            //var today = new Date();
            //var dd = String(today.getDate()).padStart(2, '0');
            //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            //var yyyy = today.getFullYear();

            //today = dd + '/' + mm + '/' + yyyy;
            
        },
        reload: function () {
            const root = this;
            Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuMua/hopdong/' + root.idHopDong, {
                oParameters: root.listId,
                fnSuccess: function (data) {
                    if (data)
                        root.formatDatavatDung(data);
                }
            })
        },
        formatDatavatDung: function (data) {
            let cloneData = [];
            for (let i = 0; i < data.length; i++) {
                cloneData.push(data[i]);
            }
            let arrCheck = [];
            let resultData = [];

            for (let i = 0; i < cloneData.length; i++) {
                if (!arrCheck.includes(cloneData[i].idvatDung)) {
                    resultData.push(cloneData[i]);
                    let tong = 0;
                    for (let j = 0; j < cloneData.length; j++) {
                        if (cloneData[i].idvatDung == cloneData[j].idvatDung) {
                            tong += cloneData[j].soLuong;
                        }
                        cloneData[i].tong = tong;
                        
                    }
                    cloneData[i].soLuongTon = cloneData[i].vatDung.soLuong;
                    cloneData[i].tenvatDung = cloneData[i].vatDung.tenvatDung;
                    cloneData[i].isEdit = false;
                    
                    arrCheck.push(cloneData[i].idvatDung)
                }
            }
            resultData.push({ isEdit: true });
            this.phieuMuaModel.setData(resultData);
        },
        onRowDelete: function (oEvent) {
            let selected = this.getView().getModel('phieuMuaModel').getProperty('', oEvent.getParameter('row').getBindingContext('phieuMuaModel'));
            if (!selected.isEdit) {
                let data = this.phieuMuaModel.getData();
                data.forEach((item, index) => {
                    if (item.idvatDung == selected.idvatDung) {
                        data.splice(index, 1);
                    }
                })
                this.phieuMuaModel.refresh();
            }
            
        },
        addvatDung: function () {
            const root = this;
            let arrId = [];
            let data = this.phieuMuaModel.getData();
            data.forEach(item => {
                arrId.push(item.idvatDung);
            })
            if (!this._vatDungAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuMuaVatDung.vatDung.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._vatDungAdd = frag;
                    root._vatDungAdd.open();
                    root.bus.publish('PhieuMuaVatDungChannel', 'loadAddvatDungPage', { arrID: arrId });
                });
            }
            else {
                root._vatDungAdd.open();
                this.bus.publish('PhieuMuaVatDungChannel', 'loadAddvatDungPage', { arrID: arrId });
            }
        },
        onClosevatDungPhieuMuaVatDungAdd: function () {
            if (this._vatDungAdd) {
                this._vatDungAdd.close();
            }
        },
        addvatDungPM: function (oC, oE, oData) {
            if (oData.data) {
                let datatable = this.phieuMuaModel.getData();
                datatable.push(oData.data);
                this.phieuMuaModel.setData(datatable);
            }
        },
        clearForm: function () {
            this.phieuMuaModel.setData({});
            this.mainModel.setData({});
        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('PhieuMuaVatDungChannel', 'closePhieuMuaVatDungAdd');
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('maPhieuMua');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }

            return isValid;
        },
       
        save: function () {
            const root = this;
            if (this.validateForm()) {

                let pmData = this.phieuMuaModel.getData();
                if (pmData.length < 2) {
                    MessageToast.show("Cần thêm thực phẩm", { width: '25em', duration: 5000, at:'center center' });
                } else {

                    let datax = root.phieuMuaModel.getData();
                    let check = true;
                    datax.forEach(item => {
                        if (item.soLuongMua <= 0) {
                            item.state = 'Error';
                            check = false;
                        }
                    })
                    if (check == false) {
                        this.phieuMuaModel.refresh();
                    } else {
                        let data = this.mainModel.getData();
                        if (data.ngayTao == moment().format('DD/MM/YYYY'))
                            data.ngayTao = moment().format('YYYY-MM-DD');
                        let paras = {};
                        paras.maPhieu = data.maPhieuMua;
                        paras.ngayTao = data.ngayTao;
                        paras.ghiChu = data.ghiChu;

                        Connector.postToApi(sdConfig.adminApiEndpoint + 'PhieuMuaVD', {
                            oParameters: paras,
                            fnSuccess: function (data) {
                                datax.pop();
                                let arr = [];
                                datax.forEach(item => {
                                    arr.push({
                                        idPhieuMua: data.id,
                                        idVatTu: item.idvatDung,
                                        soLuong: Number(item.soLuongMua),
                                        nhaCungCap: item.nhaCungCap,
                                    });
                                });
                                Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuMuaVatDung', {
                                    oParameters: arr,
                                    fnSuccess: function (dataa) {
                                        MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                        root.closeArea();
                                        root.bus.publish('PhieuMuaVatDungChannel', 'reLoadData');
                                    }
                                });
                            }
                        });
                    }
                }

            }
        },
        
        
    });
});