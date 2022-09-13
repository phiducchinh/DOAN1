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
        return Controller.extend('app.MonAn.ThucPham.Edit', {
        mainModel: new CoreJsonModel(),
        globalFormatter: GlobalFormatter,
        thucPhamModel: new CoreJsonModel(),
        mainId: null,
        idThucPham: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.thucPhamModel, 'thucPhamModel');
            this.bus.subscribe('MonAnChannel', 'loadEditThucPhamPage', this.loadEditPage, this);
        },
        onExit: function () {
            this.bus.unsubscribe('MonAnChannel', 'loadEditThucPhamPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            const root = this;
            if (oData && oData.Id) {
                //console.log(oData);
                this.idThucPham = oData.IdThucPham;
                this.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPhamKemMonAn/' + oData.Id, {
                    fnProcessData: function (data) {
                        if (data) {
                            console.log(data);
                            root.mainModel.setData(data);
                        }
                    },
                });
            }
        },
        closeArea: function () {
            this.bus.publish('MonAnChannel', 'onCloseThucPhamMonAnEdit');
        },
        clearForm: function () {
            this.getView().byId("tenThucPham").setValue("");
            this.getView().byId("soLuong").setValue("");
            this.getView().byId("ghiChu").setValue("");
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
                Connector.putToApi(sdConfig.adminApiEndpoint + 'ThucPhamKemMonAn/' + this.mainId, {
                    oParameters: {
                        id: this.mainId,
                        soLuong: Number(this.getView().byId('soLuong').getValue()),
                        ghiChu: this.getView().byId('ghiChu').getValue(),
                        idThucPham: root.idThucPham,
                    },
                    fnSuccess: function (data) {
                        MessageToast.show(data, { width: '25em', duration: 5000 });
                        root.bus.publish('MonAnChannel', 'loadThucPhamData');
                        root.bus.publish('MonAnChannel', 'onCloseThucPhamMonAnEdit');
                        root.clearForm();
                    }
                });
            }
        },
        onCancel: function () {
            this.clearForm();
            this.bus.publish('MonAnChannel', 'onCloseThucPhamMonAnEdit');
        },
        closeArea: function () {
            this.bus.publish('MonAnChannel', 'onCloseThucPhamMonAnEdit');
            },
        //#region Thực phẩm
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
                let oRowContext = oEvent.getParameters().listItem.getBindingContext('ThucPhamModel');
                let rowPath = oRowContext.getPath();
                let rowObject = oRowContext.getObject(rowPath);
                if (rowObject.id != root.idThucPham) {
                    Connector.getFromApi(sdConfig.adminApiEndpoint + 'dungcukemmonan/check/' + rowObject.id + '/' + this.mainId, {
                        fnProcessData: function (data) {
                            if (data) {
                                MessageBox.warning("Đã tồn tại thực phẩm này trong món ăn!", { width: "30em", duration: 5000 });
                            }
                            else {
                                this.idThucPham = rowObject.id;
                                root.byId('tenThucPham').setValue(rowObject.tenThucPam);
                                root._ThucPham.close();
                            }
                        }
                    });
                } else {
                    this.idThucPham = rowObject.id;
                    root.byId('tenThucPham').setValue(rowObject.tenThucPham);
                    root._ThucPham.close();
                }
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
    });
});