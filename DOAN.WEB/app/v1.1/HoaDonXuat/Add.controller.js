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
    return Controller.extend('app.HoaDonXuat.Add', {
        globalFormatter: GlobalFormatter,
        isState: true,
        mainModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        chiTietTPModel: new CoreJsonModel(),
        thucDonModel: new CoreJsonModel(),
        mainId: null,
        idHopDong: null,
        phieuXuat: [],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.getView().setModel(this.chiTietTPModel, "chiTietTPModel");
            this.getView().setModel(this.thucDonModel, "thucDonModel");
            this.phieuXuatModel.setData(this.phieuXuat);
            //this.initialize();
            this.oFlexibleColumnLayout = this.byId("fcl");

            //this.oRouter = this.getOwnerComponent().getRouter();
            //this.getView().setModel(this.bepTruongModel, "bepTruongModel");
            //this.clearForm();
            
            this.bus.subscribe('HoaDonXuatChannel', 'loadAddpage', this.loadAddpage, this);
            this.bus.subscribe('HoaDonXuatChannel', 'addThucPhamPM', this.addThucPhamPM, this);
            this.bus.subscribe('HoaDonXuatChannel', 'onCloseThucPhamHoaDonXuatAdd', this.onCloseThucPhamHoaDonXuatAdd, this);
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
                this.phieuXuat = this.phieuXuatModel.getData();
                let object = evt.getParameter("selectedRow").getBindingContext("thucPhamModel").getObject();
                console.log(object);
                let { id, tenThucPham, soLuong } = object;
                let isCheck = this.phieuXuat.some(x => x.idThucPham == id);
                if (isCheck) {
                    MessageToast.show('Đơn hàng này đã được thêm vào phiếu\n Vui lòng chọn đơn hàng khác.');
                    this.phieuXuat[this.phieuXuat.length - 1].tenThucPham = '';
                    this.phieuXuatModel.refresh();
                    return;
                }
                let dCount = this.phieuXuat.length;
                //let obj = Object.assign({ index: dCount }, object)
                let obj = {
                    idThucPham: id,
                    soLuong: 0,
                    thucPham: object,
                    tong: 0,
                    tenThucPham: tenThucPham,
                    soLuongTon: soLuong
                }
                console.log(obj);
                this.phieuXuat[dCount - 1] = Object.assign({ isEdit: false }, obj);
                this.phieuXuat.push({ isEdit: true });

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
            if (oData) {
                this.idHopDong = oData.IdDonCo;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuXuat/hopDong/' + oData.IdDonCo, {
                    fnProcessData: function (data) {
                        if (data && data.length>0)
                        root.formatDataThucPham(data);
                    }
                })
            }

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;
            this.getView().byId('maPhieuXuat').setValue('PX'+oData.IdDonCo);
            this.getView().byId('ngayTao').setValue(today);
        },
        reload: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuXuat/hopDong/' + this.idHopDong, {
                fnProcessData: function (data) {
                    if (data && data.length > 0)
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
                        cloneData[i].soLuongTon = cloneData[i].thucPham.soLuong;
                        
                    }
                    cloneData[i].tenThucPham = cloneData[i].thucPham.tenThucPham;
                    cloneData[i].isEdit = false;
                    
                    arrCheck.push(cloneData[i].idThucPham)
                }
            }
            resultData.push({ isEdit: true });
            this.phieuXuatModel.setData(resultData);
        },
        onRowDelete: function (oEvent) {
            let selected = this.getView().getModel('phieuXuatModel').getProperty('', oEvent.getParameter('row').getBindingContext('phieuXuatModel'));
            if (!selected.isEdit) {
                let data = this.phieuXuatModel.getData();
                data.forEach((item, index) => {
                    if (item.idThucPham == selected.idThucPham) {
                        data.splice(index, 1);
                    }
                })
                this.phieuXuatModel.refresh();
            }
            
        },
        _loadView: function (options) {
            var mViews = this._mViews = this._mViews || Object.create(null);
            if (!mViews[options.id]) {
                mViews[options.id] = this.getOwnerComponent().runAsOwner(function () {
                    return XMLView.create(options);
                });
            }
            return mViews[options.id];
        },
        onRowEdit: function (oEvent) {
            this._loadView({
                id: "midView",
                viewName: "app.HoaDonXuat.Flex.Detail"
            }).then(function (detailView) {
                console.log(detailView);
                this.oFlexibleColumnLayout.addMidColumnPage(detailView);
                this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
            }.bind(this));

            //const root = this;
            //let oView = this.getView();
            //let selected = this.getView().getModel('phieuXuatModel').getProperty('', oEvent.getParameter('row').getBindingContext('phieuXuatModel'));
            //if (selected) {
            //    if (!this._thucPhamEdit) {
            //        Fragment.load({
            //            id: oView.getId(),
            //            name: 'app.HoaDonXuat.fragment.EditChiTiet',
            //            controller: this,
            //            type: 'XML'
            //        }).then(function (oDialog) {
            //            root._thucPhamEdit = oDialog;
            //            oView.addDependent(oDialog);
            //            root.loadChiTietThucPham(selected.idThucPham);
            //            root._thucPhamEdit.open();
            //        });
            //    } else {
            //        root._thucPhamEdit.open();
            //        root.loadChiTietThucPham(selected.idThucPham);
            //    }
            //}
        },
        closeChiTietThucPham: function () {
            if (this._thucPhamEdit) {
                this._thucPhamEdit.close();
            }
        },
        loadChiTietThucPham(id) {
            if (id) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/check/'+id, {
                    fnProcessData: function (data) {
                        console.log(data);
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                        root.chiTietTPModel.setData(data);
                    }
                });
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
                    name: "app.HoaDonXuat.ThucPham.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._thucPhamAdd = frag;
                    root._thucPhamAdd.open();
                    root.bus.publish('HoaDonXuatChannel', 'loadAddThucPhamPage', { arrID: arrId });
                });
            }
            else {
                root._thucPhamAdd.open();
                this.bus.publish('HoaDonXuatChannel', 'loadAddThucPhamPage', { arrID: arrId });
            }
        },
        onCloseThucPhamHoaDonXuatAdd: function () {
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
            this.getView().byId('ngayTao').setValue('');
            this.getView().byId('maPhieuXuat').setValue('');
            this.getView().byId('ghiChu').setValue('');
            this.reload();
        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('HoaDonXuatChannel', 'closeHoaDonXuatAdd');
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('maPhieuXuat');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            return isValid;
        },
        slXuatChange: function (evt) {
            let ctrol = evt.getSource();
            let slXuat = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext("phieuXuatModel").getObject();
            let { soLuongTon } = object;
            if (!slXuat) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường thông tin này bắt buộc!');
                this.isValid = false;
            } else {
                if (typeof slXuat !== 'number' && isNaN(slXuat)) {
                    ctrol.setValueState('Error');
                    ctrol.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isValid = false;
                } else {
                    if (soLuongTon < slXuat) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng tồn!");
                        this.isState = false;
                    } else {
                        ctrol.setValueState("None");
                        this.isState = true;
                    }
                }
            }

        },
        save: function () {
            const root = this;
            if (this.validateForm()) {
                if (this.isState) {
                    let paras = {};
                    paras.maHoaDon = this.getView().byId('maPhieuXuat').getValue();
                    paras.ngayTao = '2022-08-06';
                    paras.ghiChu = this.getView().byId('ghiChu').getValue();
                    paras.idHopDong = this.idHopDong;
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'HoaDonXuat', {
                        oParameters: paras,
                        fnSuccess: function (data) {
                            let datax = root.phieuXuatModel.getData();
                            datax.pop();
                            let arr = [];
                            datax.forEach(item => {
                                arr.push({
                                    idHoaDon: data.id,
                                    idThucPham: item.idThucPham,
                                    soLuong: Number(item.tong),
                                });
                            });
                            Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuXuat', {
                                oParameters: arr,
                                fnSuccess: function (dataa) {
                                    MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                    root.closeArea();
                                    root.bus.publish('HoaDonXuatChannel', 'reLoadData');
                                }
                            });
                        }
                    });
                }
            }
        },
        
        
    });
});