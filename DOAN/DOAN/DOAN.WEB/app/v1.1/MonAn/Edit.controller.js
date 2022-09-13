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
    return Controller.extend('app.MonAn.Edit', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        _oriModel: {
            tenMonAn: '',
            loai: '',
            soDienThoai: '',
            giaTien: '',
            ghiChu: ''
        },
        mainModel: new CoreJsonModel(),
        titleModel: new CoreJsonModel,
        mainId: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.titleModel, 'titleModel');
            this.bus.subscribe('MonAnChannel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function (oC, oE, oD) {
            if (oD && oD.Id) {
                const root = this;
                root.mainId = oD.Id;
                root.titleModel.setData({ title: oD.title });
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'MonAn/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
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
            this.bus.publish('MonAnChannel', 'onCloseMonAnEdit');
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('tenMonAn');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('loai');
            if (!input.getSelectedKey()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('giaTien');
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
            //input = this.getView().byId('ghiChu');
            //if (!input.getValue()) {
            //    input.setValueState('Error');
            //    input.setValueStateText('Trường thông tin này bắt buộc!');
            //    isValid = false;
            //} else {
            //    input.setValueState('None');
            //}
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
                paras.loai = Number(paras.loai);
                paras.id = root.mainId;
                Connector.putToApi(sdConfig.adminApiEndpoint + 'MonAn/' + this.mainId, {
                    oParameters: paras,
                    fnSuccess: function () {
                        MessageToast.show("Sửa thành công", { width: '25em', duration: 5000 });
                        root.closeArea();
                        root.bus.publish('MonAnChannel', 'reLoadData');
                    }
                })
            }
        },
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});