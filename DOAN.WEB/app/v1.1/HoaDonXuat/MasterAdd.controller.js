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
    "sap/ui/core/Item",
    "sap/ui/core/mvc/XMLView",
    "sap/f/library",
], function (Controller, Core, MessageToast, MessageBox, Connector, CoreJsonModel, Fragment, GlobalFormatter, Filter, FilterOperator, Device, Row, Item, XMLView, fioriLibrary) {
    'use strict';
    var LayoutType = fioriLibrary.LayoutType;

    return Controller.extend('app.HoaDonXuat.MasterAdd', {
        globalFormatter: GlobalFormatter,
        isState: true,
        mainModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        chiTietTPModel: new CoreJsonModel(),
        thucDonModel: new CoreJsonModel(),
        mainId: null,
        arrCT: [],
        idThucPham: null,
        idHopDong: null,
        phieuXuat: [{ isEdit: true }],
        onInit: function () {
            //this.bus = Core.getEventBus();
            //this.mainLayout = this.byId('fcl');
            this.bus = this.getOwnerComponent().getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.getView().setModel(this.chiTietTPModel, "chiTietTPModel");
            this.getView().setModel(this.thucDonModel, "thucDonModel");
            this.phieuXuatModel.setData(this.phieuXuat);
            this.initialize();
            this.oFlexibleColumnLayout = this.byId("fcl");

            //console.log(123);
            //this.oRouter = this.getOwnerComponent().getRouter();
            //this.getView().setModel(this.bepTruongModel, "bepTruongModel");
            //this.clearForm();

            this.bus.subscribe('HoaDonXuatChannel', 'loadAddpage', this.loadAddpage, this);
            this.bus.subscribe('HoaDonXuatChannel', 'addThucPhamPM', this.addThucPhamPM, this);
            this.bus.subscribe('HoaDonXuatChannel', 'addChiTietThucPham', this.addChiTietThucPham, this);
            this.bus.subscribe('a', 'closeDetail', this.closeDetail, this);
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
                let { id, tenThucPham, soLuong } = object;
                let isCheck = this.phieuXuat.some(x => x.idThucPham == id);
                if (isCheck) {
                    MessageToast.show('Thực phẩm này đã được thêm vào!');
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
        loadAddpage: function (id) {
            const root = this;
            if (id) {
                this.idHopDong = id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuXuat/hopDong/' + id, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0)
                            root.formatDataThucPham(data);
                        else {
                            root.phieuXuatModel.setData([{ isEdit: true }]);
                        }
                        root.getView().byId('maPhieuXuat').setValue('PXTP' + id);

                    }
                })
            } else {
                this.idHopDong = null;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'hoadonxuat/getnewid', {
                    fnProcessData: function (data) {
                        
                        let ida = 0;
                        if (data) {
                            ida = Number(data.maHoaDon.replace('PXTPN', ''))+1;
                        }
                        root.getView().byId('maPhieuXuat').setValue('PXTPN' + ida);

                    }
                })
            }

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;
            this.getView().byId('ngayTao').setValue(moment().format('DD/MM/YYYY'));
        },
        reload: function () {
            const root = this;
            if (this.idHopDong) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuXuat/hopDong/' + this.idHopDong, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0)
                            root.formatDataThucPham(data);
                    }
                })
            }
            
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
                    cloneData[i].trangThai = 0;
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
            let selected = this.getView().getModel('phieuXuatModel').getProperty('', oEvent.getParameter('row').getBindingContext('phieuXuatModel'));

            this._loadView({
                id: "detailPage",
                viewName: "app.HoaDonXuat.Flex.Detail"
            }).then(function (detailView) {
                this.oFlexibleColumnLayout.addMidColumnPage(detailView);
                this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
            }.bind(this));

            this.getView().byId('fcl').setBusy(true);

            let data = this.phieuXuatModel.getData();
            for (let i = 0; i < data.length; i++) {
                if (data[i].trangThai == 2) {
                    data[i].trangThai = 0;
                }
            }
            
            selected.trangThai = 2;
            this.phieuXuatModel.refresh();


            let newData = this.arrCT.filter(item => {
                return item.idThucPham === selected.idThucPham;
            })

            setTimeout(() => {
                this.bus.publish("HoaDonXuatChannel", "loadChiTiet", { obj: selected, data: newData });
                this.getView().byId('fcl').setBusy(false);
            }, 300);

        },

        closeDetail: function () {
            this._loadView({
                id: "detailPage",
                viewName: "app.HoaDonXuat.Flex.Detail"
            }).then(function (detailView) {
                this.oFlexibleColumnLayout.backToTopBeginColumn(detailView);
                this.oFlexibleColumnLayout.setLayout(LayoutType.OneColumn);
            }.bind(this));
        },
        closeChiTietThucPham: function () {
            if (this._thucPhamEdit) {
                this._thucPhamEdit.close();
            }
        },
        loadChiTietThucPham(id) {
            if (id) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/check/' + id, {
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
            input = this.getView().byId('ngayTao');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('donCo');
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
                    ctrol.setValueStateText('Trường thông tin phải nhập số');
                    this.isValid = false;
                } else {
                    if (soLuongTon < slXuat) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng xuất phải nhỏ hơn hoặc bằng số lượng trong kho");
                        this.isState = false;
                    } else {
                        ctrol.setValueState("None");
                        this.isState = true;
                    }
                }
            }

        },
        loadDonCoFragment: function () {
            let root = this;
            let oView = this.getView();
            if (!this._vanChuyenFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HoaDonXuat.fragment.DonCo',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._vanChuyenFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.loadDonCo();
                    root._vanChuyenFrag.open();
                });
            } else {
                root._vanChuyenFrag.open();
                root.loadDonCo();
            }
        },
        closedonCoputDialog: function () {
            if (this.getView().byId('donCoList'))
                this.getView().byId('donCoList').removeSelections();
            this._vanChuyenFrag.close();
        },
        loadDonCo: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/checkPhieuXuat', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.donCoModel.setData(data);
                    }
                }
            });
        },
        ondonCoPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('donCoModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idDonCo = rowObject.id;
            this.getView().byId('donCo').setValue(rowObject.tenHopDong)
            this.loadAddpage(rowObject.id);
            //this.loadFraAdd(rowObject.id);
            this.closedonCoputDialog();
        },
        ondonCoCancelPress: function () {
            this.loadAddpage(null);
            this.getView().byId('donCo').setValue("Phiếu xuất ngoài");
            this.closedonCoputDialog();
        },
        onPressItems: function () {
            const indices = this.getView().byId('donCoList').getSelectedIndices();
            const dataTable = this.getView().byId('donCoList').getBinding('rows').getModel().getData();
            const listId = [];
            let oView = this.getView();
            const root = this;
            if (indices.length > 0) {
                for (let i = 0; i < indices.length; i++) {
                    listId.push(dataTable[indices[i]].id);
                }
            }

            if (listId.length > 0) {
                if (!this._HoaDonXuatAdd) {
                    Fragment.load({
                        id: oView.getId(),
                        name: 'app.HoaDonXuat.Add',
                        controller: this,
                        type: 'XML'
                    }).then(function (oDialog) {
                        root._HoaDonXuatAdd = oDialog;
                        //oView.addDependent(oDialog);
                        root._HoaDonXuatAdd.open();
                        root.bus.publish('HoaDonXuatChannel', 'loadAddpage', { ListId: listId });

                    });
                } else {
                    root.bus.publish('HoaDonXuatChannel', 'loadAddpage', { ListId: listId });
                    root._HoaDonXuatAdd.open();

                }
                //root.bus.publish('HoaDonXuatChannel', 'loadAddpage', { ListId: listId });
                //window.open(`${appConfig.chungThuSo.appEndpoint}software/${selected.ID}`, '_blank');
                //window.open(`${appConfig.chungThuSo.appEndpoint}software/${selected.ID}`, '_blank');
                this.closeDonCoputDialog();
            }
        },
        addChiTietThucPham: function (oChannel, oEvent, oData) {
            if (oData) {
                for (let j = this.arrCT.length-1 ; j >=0; j--) {
                    if (this.arrCT[j].idThucPham == oData.data[0].idThucPham) {
                        this.arrCT.splice(j, 1);
                    }
                }

                let data = this.phieuXuatModel.getData();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].idThucPham == oData.data[0].idThucPham) {
                        data[i].trangThai = 1;
                    }
                }
                this.phieuXuatModel.refresh();
                oData.data.forEach(item => {
                    this.arrCT.push(item);
                })
            }
        },

        save: function () {
            const root = this;
            if (this.validateForm()) {
                if (this.isState) {
                    //let paras = {};
                    let data = this.mainModel.getData();
                    
                    if (data.ngayTao == moment().format('DD/MM/YYYY'))
                        data.ngayTao = moment().format('YYYY-MM-DD');

                    if (this.idHopDong)
                    data.idHopDong = this.idHopDong;
                    data.maHoaDon = data.maphieuXuat;
                    let dataCT = this.phieuXuatModel.getData();

                    let newData = [...dataCT];
                    newData.pop();

                    if (newData && newData.length <= 0) {
                        MessageToast.show("Thêm ít nhất 1 thực phẩm!", { width: '25em', duration: 5000 ,at: "center center", });
                        return;
                    }
                    

                    let check = 1;
                    dataCT.forEach(item => {
                        if (item.trangThai == 0) {
                            item.checkStateTP = 'Error';
                            check = 0;
                        } else {
                            item.checkStateTP = 'None';
                        }
                    });
                    if (check == 0) {
                        MessageToast.show("Cần chọn chi tiết thực phẩm", { width: '25em', duration: 5000 });
                        this.phieuXuatModel.refresh();
                        return;
                    }

                    Connector.postToApi(sdConfig.adminApiEndpoint + 'HoaDonXuat', {
                        oParameters: data,
                        fnSuccess: function (data) {
                            let arr = [];
                            root.arrCT.forEach(item => {
                                arr.push({
                                    idHoaDon: data.id,
                                    idThucPham: item.idThucPham,
                                    soLuong: item.soLuong,
                                    idChiTietNhap: item.idChiTietNhap,
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