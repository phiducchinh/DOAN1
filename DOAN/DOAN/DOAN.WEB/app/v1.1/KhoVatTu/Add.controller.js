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
    return Controller.extend('app.VatTu.Add', {
        globalFormatter: GlobalFormatter,
        _oriModel: {
            maVatTu: '',
            tenVatTu: '',
            trangThai:null,
            soLuongTong: '',
            soLuongConLai: '',
            ghiChu: '',
        },
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        mainId: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.clearForm();
            //this.mainModel.setData(this._oriModel);
            //this.bus.subscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        },
        clearForm: function () {
            this.mainModel.setData({ ...this._oriModel });
        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('VatTuChannel', 'onCloseVatTuAdd');
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('tenVatTu');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('trangThai');
            if (!input.getSelectedKey()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('soLuongTong');
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
            input = this.getView().byId('soLuongConLai');
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
                paras.trangThai = Number(paras.trangThai);
                paras.soLuongTong = Number(paras.soLuongTong);
                paras.soLuongConLai = Number(paras.soLuongConLai);
                Connector.postToApi(sdConfig.adminApiEndpoint + 'VatTu', {
                    oParameters: paras,
                    fnSuccess: function () {
                        MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                        root.closeArea();
                        root.bus.publish('VatTuChannel', 'reLoadData');
                    }
                })
            }
        },
        
        
    });
});