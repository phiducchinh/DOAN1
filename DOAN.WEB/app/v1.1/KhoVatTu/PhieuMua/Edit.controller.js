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
    return Controller.extend('app.HopDong.Edit', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        _oriModel: {
            maHopDong: '',
            tenHopDong: '',
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
            tenbepTruong: '',
            ghiChu: ''
        },
        mainModel: new CoreJsonModel(),
        bepTruongModel: new CoreJsonModel(),
        titleModel: new CoreJsonModel,
        mainId: null,
        idBepTruong: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.titleModel, 'titleModel');
            this.getView().setModel(this.bepTruongModel, 'bepTruongModel');
            this.bus.subscribe('HopDongChannel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function (oC, oE, oD) {
            const root = this;
            if (oD && oD.Id) {
                const root = this;
                root.mainId = oD.Id;
                root.titleModel.setData({ title: oD.title });
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            data.tenbepTruong = data.bepTruong.tenNhanVien;
                            root.idBepTruong = data.bepTruong.id;
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },
        clearForm: function () {
            this.mainModel.setData({ ...this._oriModel });
        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('HopDongChannel', 'onCloseHopDongEdit');
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('tenHopDong');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('tenKhachHang');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('diaChi');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('soDienThoai');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('ngayBatDau');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('ngayKetThuc');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('soDienThoai');
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
            input = this.getView().byId('soMam');
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

            return isValid;
        },
        save: function () {
            const root = this;
            if (this.validateForm()) {
                let paras = {};
                let data = this.mainModel.getData();
                Object.keys(this._oriModel).forEach(i => {
                    paras[i] = data[i];
                });
                paras.idBepTruong = this.idBepTruong;
                paras.soMam = Number(paras.soMam);
                paras.soMamPhatSinh = Number(paras.soMamPhatSinh);
                paras.suDungBanGhe = Number(paras.suDungBanGhe);
                paras.soMamPhatSinh = Number(paras.soMamPhatSinh);
                paras.tienCoc = Number(paras.tienCoc);
                paras.trangThai = Number(paras.trangThai);
                paras.trangThaiThanhToan = Number(paras.trangThaiThanhToan);
                paras.bepTruong = null;
                paras.id = this.mainId;
                Connector.putToApi(sdConfig.adminApiEndpoint + 'HopDong/' + this.mainId, {
                    oParameters: paras,
                    fnSuccess: function () {
                        MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
                        root.closeArea();
                        root.bus.publish('HopDongChannel', 'reLoadData');
                    }
                })
            }
            
        },
        loadBepTruogFragment: function () {
            let root = this;
            let oView = this.getView();
            if (!this._bepTruongFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HopDong.fragment.BepTruong',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._bepTruongFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.getBepTruongData();
                    root._bepTruongFrag.open();
                });
            } else {
                root._bepTruongFrag.open();
                root.getBepTruongData();
            }
        },
        onBTPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('bepTruongModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idBepTruong = rowObject.id;
            this.getView().byId('bepTruong').setValue(rowObject.tenNhanVien);
            this._bepTruongFrag.close();
            this.byId('bepTruongList').removeSelections(true);
        },
        onBepTruongCancelPress: function () {
            this._bepTruongFrag.close();
            this.byId('bepTruongList').removeSelections(true);
            this._oriModel.idBepTruong = null;
            this.getView().byId('bepTruong').setValue('');
        },
        closeBepTruongputDialog: function () {
            this._bepTruongFrag.close();
        },
        onSearchBepTruongLive: function (oEvent) {
            if (!oEvent.getParameter('newValue'))
                this.getBepTruongData();
            let value = oEvent.getParameter('newValue');
            this.searchBepTruong(value);
        },
        searchBepTruong: function (value) {
            const root = this;
            Connector.postToApi(sdConfig.adminApiEndpoint + 'NhanVien/SearchByNameBepTruong', {
                oParameters: value,
                fnSuccess: function (data) {
                    root.bepTruongModel.setData(data);
                    root.getView().byId('bepTruongList').removeSelections(true);
                }
            })
        },
        onSearchBepTruong: function (oEvent) {
            const root = this;
            var parameters = oEvent.getParameters();
            var searchKey = parameters.query;
            var isClear = parameters.clearButtonPressed;
            if (searchKey) {
                root.searchBepTruong(searchKey);
            }
            if (isClear) {
                this.getBepTruongData();
            }
        },
        getBepTruongData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'NhanVien/beptruong', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.bepTruongModel.setData(data);
                    }
                }
            });
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});