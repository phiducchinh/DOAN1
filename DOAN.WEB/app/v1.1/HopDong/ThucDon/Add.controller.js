sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "app/ext/Auth.Connector.Adal",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/model/json/JSONModel",
    "app/ext/CoreJsonModel",
    'sap/ui/core/Fragment',
    'app/globalformatter',
], function (Controller, Core, Connector, MessageToast, UploadCollectionParameter, JSONModel, CoreJsonModel, Fragment, GlobalFormatter) {
    "use strict";
    const oController = {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainId: null,
        mainModel: new CoreJsonModel(),
        operatingSystemModel: new CoreJsonModel(),
        idHeDieuHanh: null,
        _data: {
            Ip: '',
            tenHeDieuHanh:'',
            LoaiMayChu: '',
            CongNghe: '',
            GhiChu:''
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.operatingSystemModel, "operatingSystemModel");
            this.bus.subscribe("SoftwareChannel", "loadAddServerPage", this.loadAddServerPage, this);
        },
        onAfterRendering: function () {
        },
        loadAddServerPage: function (sChanel, sEvent, oData) {
            this.mainId = oData.Id;
        },
        closeArea: function () {
            this.bus.publish("SoftwareChannel", "onCloseServerSoftwareAdd");
            this.clearForm();
        },
        clearForm: function () {
            this.mainModel.setData({ ...this._data });
        },
        validateForm: function () {
            let input, isValid = true;
            input = this.getView().byId('IP');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValid = false;
            } else {
                let arr = input.getValue().split('.');
                if (arr.length === 4) {
                    if ((arr[0].length > 3 || arr[0].length < 1) ||
                        (arr[1].length > 3 || arr[1].length < 1) ||
                        (arr[2].length > 3 || arr[2].length < 1) ||
                        (arr[3].length > 3 || arr[3].length < 1)) {
                        input.setValueState('Error');
                        input.setValueStateText('Bạn nhập không đúng định dạng IP!');
                        isValid = false;
                    }
                    else
                        input.setValueState('None');
                }
                else {
                    input.setValueState('Error');
                    input.setValueStateText('Bạn nhập không đúng định dạng IP!');
                    isValid = false;
                }
            }
            input = this.getView().byId("heDieuHanh");
            if (!input.getValue()) {
                input.setValueState("Error");
                input.setValueStateText("Trường thông tin này bắt buộc!");
                isValid = false;
            } else {
                input.setValueState("None");
            }
            input = this.getView().byId("loaiMayChu");
            if (!input.getSelectedKey()) {
                input.setValueState("Error");
                input.setValueStateText("Trường thông tin này bắt buộc!");
                isValid = false;
            } else {
                input.setValueState("None");
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
                paras.HeDieuHanh = this.idHeDieuHanh;
                paras.PhanMemId = this.mainId;
                paras.LoaiMayChu = Number(paras.LoaiMayChu);
                Connector.postToSercureApi(sdConfig.adminApiEndpoint + "server/add", {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        MessageToast.show("Thêm máy chủ thành công!", { width: "30em", duration: 5000 });
                        root.bus.publish("SoftwareChannel", "loadServerData");
                        root.closeArea();
                    },
                });
            }
        },
        //#region peratingSystem
        openOperatingSystemFragment: function () {
            const root = this;
            let oView = this.getView();
            this.filter = [];
            if (!this._OperatingSystem) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.fragments.OperatingSystem',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._OperatingSystem = oDialog;
                    oView.addDependent(oDialog);
                    root._OperatingSystem.open();
                    root.loadOperatingSystemData();
                });
            } else {
                this._OperatingSystem.open();
                root.loadOperatingSystemData();

            }
        },
        closeOperatingSystemInputDialog: function () {
            this._OperatingSystem.close();
        },
        loadOperatingSystemData: function () {
            const root = this;
            this.operatingSystemModel.postToSercureApi(sdConfig.adminApiEndpoint + 'category/list', {
                oParameters: {
                    Filters: [{
                        Name: 'LOAI',
                        ParameterName: 'PARAM',
                        Value: CategoryType.HeDieuHanh,
                        Type: 0,
                        CompareOperator: 'Equal'
                    }],
                },
                fnSuccess: function (data) {
                    root.byId('operatingSystemTable').removeSelections(true);
                },
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        return data;
                    }
                    return [];
                }
            });
        },
        onSearchOperatingSystem: function (oEvent) {
            const root = this;
            var parameters = oEvent.getParameters();
            var searchKey = parameters.query;
            var isClear = parameters.clearButtonPressed;
            if (searchKey) {
                this.operatingSystemModel.postToSercureApi(sdConfig.adminApiEndpoint + 'category/list', {
                    oParameters: {
                        Filters: [{
                            Name: 'LOAI',
                            ParameterName: 'PARAM',
                            Value: CategoryType.HeDieuHanh,
                            Type: 1,
                            CompareOperator: 'Equal'
                        }, {
                            Name: 'TENDANHMUC',
                            ParameterName: 'TENDANHMUC',
                            Value: searchKey,
                            Type: 0,
                            CompareOperator: 'Contains'
                        }]
                    },
                    fnSuccess: function (data) {
                        root.byId('operatingSystemTable').removeSelections(true);
                    }
                });
            }
            else if (isClear) {
                this.loadOperatingSystemData();
            }
        },
        onOperatingSystemItemPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('operatingSystemModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idHeDieuHanh = rowObject.ID;
            //this.saveObject.HEDIEUHANH = rowObject.ID;
            this.byId('heDieuHanh').setValue(rowObject.TENDANHMUC);
            this._OperatingSystem.close();
        },
        onOperatingSystemCancelPress: function () {
            //this.saveObject.HEDIEUHANH = null;
            this.idHeDieuHanh = null;
            this.byId('heDieuHanh').setValue("");
            this._OperatingSystem.close();
        },
        //#endregion
    };
        return Controller.extend("app.Software.DevHistory.Add", oController);
});