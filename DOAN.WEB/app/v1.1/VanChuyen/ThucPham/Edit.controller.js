sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/Core',
    'sap/m/MessageToast',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'sap/ui/core/Fragment',
    'app/globalformatter',
    "sap/m/MessageBox",
], function (Controller, Core, MessageToast, Connector, CoreJsonModel, Fragment, GlobalFormatter, MessageBox) {
    'use strict';
        return Controller.extend('app.MonAn.VatDungDiKem.Edit', {
        mainModel: new CoreJsonModel(),
        globalFormatter: GlobalFormatter,
        vatDungModel: new CoreJsonModel(),
        mainId: null,
        idVatTu: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.vatDungModel, 'vatDungModel');
            this.bus.subscribe('MonAnChannel', 'loadEditVatDungPage', this.loadEditPage, this);
        },
        onExit: function () {
            this.bus.unsubscribe('MonAnChannel', 'loadEditVatDungPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                this.idVatTu = oData.IdVatTu;
                this.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                        }
                    },
                });
            }
        },
        closeArea: function () {
            this.bus.publish('MonAnChannel', 'onCloseVatDungDiKemMonAnEdit');
        },
        clearForm: function () {
            this.getView().byId("tenVatDung").setValue("");
            this.getView().byId("soLuong").setValue("");
            this.getView().byId("ghiChu").setValue("");
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('tenVatDung');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('soLuong');
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
                Connector.putToApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn', {
                    oParameters: {
                        id: this.mainId,
                        soLuong: Number(this.getView().byId('soLuong').getValue()),
                        ghiChu: this.getView().byId('ghiChu').getValue(),
                    },
                    fnSuccess: function (data) {
                        MessageToast.show(data, { width: '25em', duration: 5000 });
                        root.bus.publish('MonAnChannel', 'loadVatDungData');
                        root.bus.publish('MonAnChannel', 'onCloseVatDungMonAnEdit');
                        root.clearForm();
                    }
                });
            }
        },
        onCancel: function () {
            this.clearForm();
            this.bus.publish('MonAnChannel', 'onCloseVatDungMonAnEdit');
        },
        closeArea: function () {
            this.bus.publish('MonAnChannel', 'onCloseVatDungMonAnEdit');
            },
        //#region Vật dụng
            loadVatDungFragment: function () {
                const root = this;
                let oView = this.getView();
                this.filter = [];
                if (!this._vatDung) {
                    Fragment.load({
                        id: oView.getId(),
                        name: 'app.fragments.VatDung',
                        controller: this,
                        type: 'XML'
                    }).then(function (oDialog) {
                        root._vatDung = oDialog;
                        oView.addDependent(oDialog);
                        root._vatDung.open();
                        root.loadVatDung();
                    });
                } else {
                    this._vatDung.open();
                    root.loadVatDung();
                }
            },
            closeVatDungInputDialog: function () {
                this._vatDung.close();
            },
            loadVatDung: function () {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'VatTu', {
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
            onVatDungItemPress: function (oEvent) {
                const root = this;
                let oRowContext = oEvent.getParameters().listItem.getBindingContext('vatDungModel');
                let rowPath = oRowContext.getPath();
                let rowObject = oRowContext.getObject(rowPath);
                if (rowObject.id != root.idVatTu) {
                    Connector.getFromApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/check/' + rowObject.id + '/' + this.mainId, {
                        fnProcessData: function (data) {
                            if (data) {
                                MessageBox.warning("Đã tồn tại vật dụng này trong món ăn!", { width: "30em", duration: 5000 });
                            }
                            else {
                                this.idVatTu = rowObject.id;
                                root.byId('tenVatDung').setValue(rowObject.tenVatTu);
                                root._vatDung.close();
                            }
                        }
                    });
                } else {
                    this.idVatTu = rowObject.id;
                    root.byId('tenVatDung').setValue(rowObject.tenVatTu);
                    root._vatDung.close();
                }
            },
            onVatDungCancelPress: function () {
                this.idVatTu = null;
                this.byId('tenVatDung').setValue("");
                this._vatDung.close();
            },
            onSearchVatDung: function (oEvent) {
                const root = this;
                var parameters = oEvent.getParameters();
                var searchKey = parameters.query;
                var isClear = parameters.clearButtonPressed;
                if (searchKey) {
                    const root = this;
                    Connector.getFromApi(sdConfig.adminApiEndpoint + 'VatTu/searchName/' + searchKey, {
                        fnProcessData: function (data) {
                            if (data && data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    data[i]['STT'] = i + 1;
                                }
                            }
                            root.vatDungModel.setData(data);
                        }
                    });
                }
                else if (isClear) {
                    this.loadVatDung();
                }
            },
        //#endregion
    });
});