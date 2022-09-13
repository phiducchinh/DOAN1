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
        thucPhamModel: new CoreJsonModel(),
        idThucPham: null,
        _data: {
            tenThucPham: '',
            soLuong:''
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.bus.subscribe("HoaDonMuaChannel", "loadAddThucPhamPage", this.loadAddThucPhamPage, this);
        },
        onAfterRendering: function () {
        },
        loadAddThucPhamPage: function (sChanel, sEvent, oData) {
            this.mainId = oData.arrID;
        },
        closeArea: function () {
            this.bus.publish("HoaDonMuaChannel", "onCloseThucPhamHoaDonMuaAdd");
            this.clearForm();
        },
        clearForm: function () {
            this.mainModel.setData({ ...this._data });
        },
        validateForm: function () {
            let input, isValid = true;
            
            input = this.getView().byId("tenThucPham");
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
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPham/' + this.idThucPham, {
                    fnProcessData: function (data) {
                        if (data) {
                            let obj = {
                                idThucPham: root.idThucPham,
                                tong: Number(root.getView().byId('soLuong').getValue()),
                                thucPham: data
                            }
                            root.bus.publish("HoaDonMuaChannel", "addThucPhamPM", { data: obj });
                            MessageToast.show("Thêm thành công!", { width: "30em", duration: 5000 });
                            root.closeArea();

                        }
                    }
                });
            }
        },
        //#region Vật dụng
        loadThucPhamFragment: function () {
            const root = this;
            let oView = this.getView();
            this.filter = [];
            if (!this._ThucPham) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.fragments.ThucPham',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._ThucPham = oDialog;
                    oView.addDependent(oDialog);
                    root._ThucPham.open();
                    root.loadThucPham();
                });
            } else {
                this._ThucPham.open();
                root.loadThucPham();
            }
        },
        closeThucPhamInputDialog: function () {
            this._ThucPham.close();
        },
        loadThucPham: function () {
            const root = this;
            if (this.mainId) {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'ThucPham/notInArr', {
                    oParameters: root.mainId,
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                        root.thucPhamModel.setData(data);
                    }
                });
            }
            
        },
        onThucPhamItemPress: function (oEvent) {
            const root = this;
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('thucPhamModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idThucPham = rowObject.id;
            root.byId('tenThucPham').setValue(rowObject.tenThucPham);
            root._ThucPham.close();
            //if (rowObject.id) {
            //    Connector.getFromApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/check/' + rowObject.id + '/' + this.mainId, {
            //        fnProcessData: function (data) {
            //            if (data) {
            //                MessageBox.warning("Đã tồn tại vật dụng này trong món ăn!", { width: "30em", duration: 5000 });
            //            }
            //            else {
            //                root.byId('tenThucPham').setValue(rowObject.tenVatTu);
            //                root._ThucPham.close();
            //            }
            //        }
            //    });
            //}
        },
        onThucPhamCancelPress: function () {
            this.idThucPham = null;
            this.byId('tenThucPham').setValue("");
            this._ThucPham.close();
        },
        onSearchThucPham: function (oEvent) {
            const root = this;
            var parameters = oEvent.getParameters();
            var searchKey = parameters.query;
            var isClear = parameters.clearButtonPressed;
            if (searchKey) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPham/searchName/' + searchKey, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                        root.thucPhamModel.setData(data);
                    }
                });
            }
            else if (isClear) {
                this.loadThucPham();
            }
        },
        //#endregion

        
    };
        return Controller.extend("app.HoaDonMua.ThucPham.Add", oController);
});