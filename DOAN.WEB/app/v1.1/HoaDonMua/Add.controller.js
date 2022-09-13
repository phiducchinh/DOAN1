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
    return Controller.extend('app.HoaDonMua.Add', {
        globalFormatter: GlobalFormatter,
        _oriModel: {
            maHoaDonMua: '',
            tenHoaDonMua: '',
            tenKhachHang: '',
            diaChi: '',
            soDienThoai: '',
            soMam: '',
            suDungBanGhe: 1,
            trangThai: 2,
            trangThaiThanhToan: 0,
            ngayBatDau: '',
            ngayKetThuc: '',
            soMamPhatSinh: 0,
            tienCoc: 0,
            tienPhatSinh: 0,
            tongTien: 0,
            bepTruong: '',
            ghiChu:''
        },
        mainModel: new CoreJsonModel(),
        phieuMuaModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        thucDonModel: new CoreJsonModel(),
        mainId: null,
        idHopDong: null,
        phieuMua: [],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuMuaModel, "phieuMuaModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.getView().setModel(this.thucDonModel, "thucDonModel");
            this.phieuMuaModel.setData();
            this.initialize();

            //this.getView().setModel(this.bepTruongModel, "bepTruongModel");
            //this.clearForm();
            
            this.bus.subscribe('HoaDonMuaChannel', 'loadAddpage', this.loadAddpage, this);
            this.bus.subscribe('HoaDonMuaChannel', 'addThucPhamPM', this.addThucPhamPM, this);
            this.bus.subscribe('HoaDonMuaChannel', 'onCloseThucPhamHoaDonMuaAdd', this.onCloseThucPhamHoaDonMuaAdd, this);
        },
        initialize: function () {
            this.loadDataHang();
            //this.loadDataNCC();
            //this.getView().byId('maPhieu').setValue(this.Base.randID());
            //this.getView().byId('ngayNhap').setValue(moment().format('MM/DD/YYYY'));
            this.getView().byId('idhang').setFilterFunction(function (sTerm, oItem) {
                return oItem.getText().match(new RegExp(sTerm, "i"));
            });
            this.getView().byId('idhang').setSuggestionRowValidator(this.suggestionRowValidator);
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
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPham', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.thucPhamModel.setData(data);
                }
            });
        },
        onSelected: function (evt) {
            if (evt.getParameter("selectedRow")) {
                this.phieuMua = this.phieuMuaModel.getData();
                //console.log(this.phieuMua);
                let object = evt.getParameter("selectedRow").getBindingContext("thucPhamModel").getObject();
                
                let { id, tenThucPham ,soLuong} = object;
                let isCheck = this.phieuMua.some(x => x.idThucPham == id);
                if (isCheck) {
                    MessageToast.show('Đơn hàng này đã được thêm vào phiếu\n Vui lòng chọn đơn hàng khác.');
                    this.phieuMua[this.phieuMua.length - 1].tenThucPham = '';
                    this.phieuMuaModel.refresh();
                    return;
                }
                let dCount = this.phieuMua.length;
                //let obj = Object.assign({ index: dCount }, object)
                let obj = {
                    idThucPham: id,
                    soLuong: 0,
                    thucPham: object,
                    tong: 0,
                    tenThucPham: tenThucPham,
                    soLuongTon: soLuong
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
                            root.formatDataThucPham(data);
                    }
                });
                this.getView().byId('ngayTao').setValue(moment().format('DD/MM/YYYY'));
                this.getView().byId('maPhieuMua').setValue('PM' + oData.IdDonCo);
            } else {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'hoadonmua/getnewid', {
                    fnProcessData: function (data) {
                        let count = 0;
                        if (data) {
                            console.log(data);
                            data = data.maHoaDon.replace('PMN', '');
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
                        root.formatDataThucPham(data);
                }
            })
        },
        formatDataThucPham: function (data) {
            let cloneData = [];
            for (let i = 0; i < data.length; i++) {
                cloneData.push(data[i]);
            }
            let arrCheck = [];
            let resultData = [];

            for (let i = 0; i < cloneData.length; i++) {
                if (!arrCheck.includes(cloneData[i].idThucPham)) {
                    resultData.push(cloneData[i]);
                    let tong = 0;
                    for (let j = 0; j < cloneData.length; j++) {
                        if (cloneData[i].idThucPham == cloneData[j].idThucPham) {
                            tong += cloneData[j].soLuong;
                        }
                        cloneData[i].tong = tong;
                        
                    }
                    cloneData[i].soLuongTon = cloneData[i].thucPham.soLuong;
                    cloneData[i].tenThucPham = cloneData[i].thucPham.tenThucPham;
                    cloneData[i].isEdit = false;
                    
                    arrCheck.push(cloneData[i].idThucPham)
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
                    if (item.idThucPham == selected.idThucPham) {
                        data.splice(index, 1);
                    }
                })
                this.phieuMuaModel.refresh();
            }
            
        },
        addThucPham: function () {
            const root = this;
            let arrId = [];
            let data = this.phieuMuaModel.getData();
            data.forEach(item => {
                arrId.push(item.idThucPham);
            })
            if (!this._thucPhamAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonMua.ThucPham.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._thucPhamAdd = frag;
                    root._thucPhamAdd.open();
                    root.bus.publish('HoaDonMuaChannel', 'loadAddThucPhamPage', { arrID: arrId });
                });
            }
            else {
                root._thucPhamAdd.open();
                this.bus.publish('HoaDonMuaChannel', 'loadAddThucPhamPage', { arrID: arrId });
            }
        },
        onCloseThucPhamHoaDonMuaAdd: function () {
            if (this._thucPhamAdd) {
                this._thucPhamAdd.close();
            }
        },
        addThucPhamPM: function (oC, oE, oData) {
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
            this.bus.publish('HoaDonMuaChannel', 'closeHoaDonMuaAdd');
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
                    let data = this.mainModel.getData();
                    if (data.ngayTao == moment().format('DD/MM/YYYY'))
                        data.ngayTao = moment().format('YYYY-MM-DD');
                    let paras = {};
                    paras.maHoaDon = data.maPhieuMua;
                    paras.ngayTao = data.ngayTao;
                    paras.ghiChu = data.ghiChu;
                    paras.idHopDong = root.idHopDong||null;
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'PhieuMua', {
                        oParameters: paras,
                        fnSuccess: function (data) {
                            let datax = root.phieuMuaModel.getData();
                            datax.pop();
                            let arr = [];
                            datax.forEach(item => {
                                arr.push({
                                    idHoaDon: data.id,
                                    idThucPham: item.idThucPham,
                                    soLuong: item.tong,
                                });
                            });
                            Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuMua', {
                                oParameters: arr,
                                fnSuccess: function (dataa) {
                                    MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                    root.closeArea();
                                    root.bus.publish('HoaDonMuaChannel', 'reLoadData');
                                }
                            });
                        }
                    });
                }

            }
        },
        
        
    });
});