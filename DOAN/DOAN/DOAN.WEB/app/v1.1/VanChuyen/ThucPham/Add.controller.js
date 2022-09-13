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
        idVatTu: null,
        _data: {
            tenThucPham: '',
            soLuong:'',
            ghiChu:''
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.bus.subscribe("MonAnChannel", "loadAddThucPhamPage", this.loadAddThucPhamPage, this);
        },
        onAfterRendering: function () {
        },
        loadAddThucPhamPage: function (sChanel, sEvent, oData) {
            this.mainId = oData.Id;
        },
        closeArea: function () {
            this.bus.publish("MonAnChannel", "onCloseThucPhamMonAnAdd");
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
                //let gr = Number.(Number(input.getValue()));
                //if (!gr) {
                //    input.setValueState('Error');
                //    input.setValueStateText('Trường thông tin này phải nhập số!');
                //    isValid = false;
                //} else {
                    input.setValueState('None');
                //}
            }
            
            return isValid;
        },
        save: function () {
            const root = this;
            if (this.validateForm()) {
                let paras = {};
                let data = this.mainModel.getData();
                Object.keys(this._data).forEach(i => {
                    paras[i] = data[i]||'';
                });
                paras.idMonAn = this.mainId;
                paras.idThucPham = this.idThucPham;
                paras.soLuong = Number(paras.soLuong);
                Connector.postToApi(sdConfig.adminApiEndpoint + "thucphamkemmonan", {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        MessageToast.show("Thêm thành công!", { width: "30em", duration: 5000 });
                        root.bus.publish("MonAnChannel", "loadThucPhamData");
                        root.closeArea();
                    },
                });
            }
        },
        //#region thực phẩm
        loadThucPhamFragment: function () {
            const root = this;
            let oView = this.getView();
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
            this.getView().byId('thucPhamTable').removeSelections(true);
            this._ThucPham.close();
        },
        loadThucPham: function () {
            const root = this;
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
        onThucPhamItemPress: function (oEvent) {
            const root = this;
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('thucPhamModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idThucPham = rowObject.id;
            if (rowObject.id) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'thucphamkemmonan/check/' + rowObject.id + '/' + this.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            MessageBox.warning("Đã tồn tại thực phẩm này trong món ăn!", { width: "30em", duration: 5000 });
                        }
                        else {
                            root.byId('tenThucPham').setValue(rowObject.tenThucPham);
                            root.closeThucPhamInputDialog();
                        }
                    }
                });
            }
        },
        onThucPhamCancelPress: function () {
            this.idThucPham = null;
            this.byId('tenThucPham').setValue("");
            this.closeThucPhamInputDialog();
        },
        onSearchThucPham: function (oEvent) {
            const root = this;
            var parameters = oEvent.getParameters();
            var searchKey = parameters.query;
            var isClear = parameters.clearButtonPressed;
            if (searchKey) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPham/search/' + searchKey, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i]['STT'] = i + 1;
                            }
                        }
                        root.ThucPhamModel.setData(data);
                    }
                });
            }
            else if (isClear) {
                this.loadThucPham();
            }
        },
        //#endregion

        
    };
        return Controller.extend("app.MonAn.DevHistory.Add", oController);
});