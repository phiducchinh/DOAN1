sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "app/ext/Auth.Connector.Adal",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/model/json/JSONModel",
    "app/ext/CoreJsonModel",
    'sap/ui/core/Fragment',
    'app/globalformatter',
], function (Controller, Core, Connector, MessageBox,MessageToast, UploadCollectionParameter, JSONModel, CoreJsonModel, Fragment, GlobalFormatter) {
    "use strict";
    const oController = {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainId: null,
        mainModel: new CoreJsonModel(),
        vatDungModel: new CoreJsonModel(),
        idVatTu: null,
        _data: {
            tenVatDung: '',
            soLuong:''
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.vatDungModel, "vatDungModel");
            this.bus.subscribe("HopDongChannel", "loadAddVatDungPage", this.loadAddVatDungPage, this);
        },
        onAfterRendering: function () {
        },
        loadAddVatDungPage: function (sChanel, sEvent, oData) {
            this.mainId = oData.arrID;
        },
        closeArea: function () {
            this.bus.publish("HopDongChannel", "onCloseVatDungVanChuyenAdd");
            this.clearForm();
        },
        clearForm: function () {
            this.mainModel.setData({ ...this._data });
        },
        validateForm: function () {
            let input, isValid = true;
            
            input = this.getView().byId("tenVatDung");
            if (!input.getValue()) {
                input.setValueState("Error");
                input.setValueStateText("Trường thông tin này bắt buộc!");
                isValid = false;
            } else {
                input.setValueState("None");
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
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'VatTu/' + this.idVatTu, {
                    fnProcessData: function (data) {
                        if (data) {
                            let obj = {
                                idVatDung: root.idVatTu,
                                tong: Number(root.getView().byId('soLuong').getValue()),
                                vatTu: data
                            }
                            root.bus.publish("HopDongChannel", "addVatTuVC", { data: obj });
                            MessageToast.show("Thêm thành công!", { width: "30em", duration: 5000 });
                            root.closeArea();

                        }
                    }
                });
                //let paras = {};
                //let data = this.mainModel.getData();
                //Object.keys(this._data).forEach(i => {
                //    paras[i] = data[i]||'';
                //});
                //paras.idMonAn = this.mainId;
                //paras.idVatTu = this.idVatTu;
                //paras.soLuong = Number(paras.soLuong);
                //Connector.postToApi(sdConfig.adminApiEndpoint + "dungcukemmonan", {
                //    oParameters: paras,
                //    fnSuccess: function (data) {
                //        MessageToast.show("Thêm thành công!", { width: "30em", duration: 5000 });
                //        root.bus.publish("MonAnChannel", "loadVatDungData");
                //        root.closeArea();
                //    },
                //});
            }
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
            if (this.mainId) {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'VatTu/notInArr', {
                    oParameters: root.mainId,
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
            
        },
        onVatDungItemPress: function (oEvent) {
            const root = this;
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('vatDungModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idVatTu = rowObject.id;
            root.byId('tenVatDung').setValue(rowObject.tenVatTu);
            root._vatDung.close();
            //if (rowObject.id) {
            //    Connector.getFromApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/check/' + rowObject.id + '/' + this.mainId, {
            //        fnProcessData: function (data) {
            //            if (data) {
            //                MessageBox.warning("Đã tồn tại vật dụng này trong món ăn!", { width: "30em", duration: 5000 });
            //            }
            //            else {
            //                root.byId('tenVatDung').setValue(rowObject.tenVatTu);
            //                root._vatDung.close();
            //            }
            //        }
            //    });
            //}
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

        
    };
        return Controller.extend("app.MonAn.DevHistory.Add", oController);
});