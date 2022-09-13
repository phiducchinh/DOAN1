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
    "sap/ui/core/Item"
], function (Controller, Core, MessageToast, MessageBox, Connector, CoreJsonModel, Fragment, GlobalFormatter, Filter, FilterOperator, Device, Row, Item) {
    "use strict";

    return Controller.extend("app.HoaDonXuat.Flex.Detail", {
        mainModel: new CoreJsonModel(),
        chiTietTPModel: new CoreJsonModel(),
        globalFormatter: GlobalFormatter,
        tongSL: 0,
        onInit: function () {
            this.bus = this.getOwnerComponent().getEventBus();
            this.getView().setModel(this.mainModel);
            this.getView().setModel(this.chiTietTPModel, 'chiTietTPModel');
            var oExitButton = this.getView().byId("exitFullScreenBtn"),
                oEnterButton = this.getView().byId("enterFullScreenBtn");
            this.bus.subscribe("HoaDonXuatChannel", "loadChiTiet", this.loadAddpage, this);

            //this.oRouter = this.getOwnerComponent().getRouter();
            //this.oModel = this.getOwnerComponent().getModel();

            //this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            //this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);

            //[oExitButton, oEnterButton].forEach(function (oButton) {
            //	oButton.addEventDelegate({
            //		onAfterRendering: function () {
            //			if (this.bFocusFullScreenButton) {
            //				this.bFocusFullScreenButton = false;
            //				oButton.focus();
            //			}
            //		}.bind(this)
            //	});
            //}, this);
        },
        loadAddpage: function (a, b, oData) {
            if (oData) {
                this.tongSL = oData.obj.tong;
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/check/' + oData.obj.idThucPham, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            if (oData.data && oData.data.length > 0) {
                                for (var i = 0; i < oData.data.length; i++) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (oData.data[i].idChiTietNhap == data[j].id) {
                                            data[i]['soLuongXuat'] = oData.data[i].soLuong;
                                        }
                                        data[j]['STT'] = j + 1;
                                        data[j]['checkState'] = 'None';
                                    }
                                }
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    data[i]['STT'] = i + 1;
                                    data[i]['soLuongXuat'] = 0;
                                    data[i]['checkState'] = 'None';
                                }
                            }
                        }
                        root.chiTietTPModel.setData(data);
                    }
                });
            }

        },
        slXuatChange: function (evt) {
            const root = this;
            let ctrol = evt.getSource();
            let slXuat = ctrol.getValue();
            let object = ctrol.oParent.getRowBindingContext("chiTietTPModel").getObject();
            let { soLuongXuat, soLuongConLai } = object;
            if (!slXuat.length) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường nhập bắt buộc!');
                this.isValid = false;
                return;
            }
            if (isNaN(slXuat)) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường thông tin phải nhập số');
                this.isValid = false;
                return;
            }
            if (slXuat > soLuongConLai) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Số lượng xuất cần nhỏ hơn số lượng còn lại');
                this.isValid = false;
                return;
            }

            let data = this.chiTietTPModel.getData();
            
            data = data.filter(el => el.STT !== object['STT']);

            //let tong = 0;
            slXuat = Number(slXuat);
            data.forEach(item => {
                slXuat += Number(item.soLuongXuat);
            });
            if (slXuat > this.tongSL) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Tổng số lượng xuất vượt quá giới hạn.');
                this.isValid = false;
                return;
            }

            ctrol.setValueState('None');
            ctrol.setValueStateText('');
        },
        closeDetail: function () {
            this.bus.publish('a', 'closeDetail');
        },

        save: function () {
            let data = this.chiTietTPModel.getData();
            let tong = 0;
            data.forEach(item => {
                item.checkState = 'None';
                tong += Number(item.soLuongXuat);
            })

            if (tong == 0) {
                data.forEach(item => {
                    item.checkState = 'Error';
                    item.checkText = 'Cần nhập thông tin';
                });
            }

            if (tong < this.tongSL) {
                data.forEach(item => {
                    if (item.soLuongXuat > 0) {
                        item.checkState = 'Error';
                        item.checkText = 'Tổng số lượng xuất cần bằng ' + this.tongSL;
                    }
                });
            } else {
                data = data.filter(item => {
                    return Number(item.soLuongXuat) > 0;
                });

                let obj = data.map(item => {
                    return {
                        idChiTietNhap: item.id,
                        idThucPham: item.idThucPham,
                        soLuong: Number(item.soLuongXuat)
                    }
                });
                this.closeDetail();
                this.bus.publish("HoaDonXuatChannel", "addChiTietThucPham", { data: obj });

            }
            this.chiTietTPModel.refresh();
        },


        //handleItemPress: function (oEvent) {
        //	var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
        //		supplierPath = oEvent.getSource().getSelectedItem().getBindingContext("products").getPath(),
        //		supplier = supplierPath.split("/").slice(-1).pop();

        //	this.oRouter.navTo("detailDetail", {layout: oNextUIState.layout,
        //		product: this._product, supplier: supplier});
        //},
        //handleFullScreen: function () {
        //	this.bFocusFullScreenButton = true;
        //	var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
        //	this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
        //},
        //handleExitFullScreen: function () {
        //	this.bFocusFullScreenButton = true;
        //	var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
        //	this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
        //},
        //handleClose: function () {
        //	var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
        //	this.oRouter.navTo("master", {layout: sNextLayout});
        //},
        //_onProductMatched: function (oEvent) {
        //	this._product = oEvent.getParameter("arguments").product || this._product || "0";
        //	this.getView().bindElement({
        //		path: "/ProductCollection/" + this._product,
        //		model: "products"
        //	});
        //}
    });
});
