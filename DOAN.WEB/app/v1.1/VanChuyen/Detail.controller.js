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
    return Controller.extend('app.VanChuyen.Detail', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        vatDungModel: new CoreJsonModel(),
        vanChuyenModel: new CoreJsonModel(),
        phieuNhapModel: new CoreJsonModel(),
        phieuXuatModel: new CoreJsonModel(),
        mainId: null,
        mainTitle: null,
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.vatDungModel, "vatDungModel");
            this.getView().setModel(this.vanChuyenModel, "vanChuyenModel");
            this.getView().setModel(this.phieuNhapModel, "phieuNhapModel");
            this.getView().setModel(this.phieuXuatModel, "phieuXuatModel");
            //this.bus.subscribe('VanChuyenChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('VanChuyenChannel', 'loadDetailPage', this.loadDetailPage, this);
            //this.bus.subscribe('VanChuyenChannel', 'onCloseMonAnEdit', this.onCloseMonAnEdit, this);
        },
        onTabSelectionChange: function (oEvent) {
            const key = oEvent.getParameter('key');
            if (key === 'vanChuyenTab') this.loadDetailPage();
            if (key === 'phieuXuatTab') this.loadPhieuXuatData();
            if (key === 'phieuNhapTab') this.loadPhieuNhapData();
        },
        //#region main
        loadDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            //this.getView().byId('detailIconTabBar').setSelectedKey('monAnTab')
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'vanchuyen/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTietVanChuyen();
                        }
                    }
                });
            }
        },
        loadChiTietVanChuyen: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyen/hopDong/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.vanChuyenModel.setData(data);
                }
            });
        },
        onVanChuyenRefresh: function () {
            this.loadDetailPage();
            //this.removeSelectionsVatDung();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        },
        //reLoadData: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        Connector.getFromApi(sdConfig.adminApiEndpoint + 'MonAn/' + root.mainId, {
        //            fnProcessData: function (data) {
        //                if (data) {
        //                    root.mainModel.setData(data);
        //                }
        //            }
        //        });
        //    }
        //},
        //onDeleteButtonPress: function () {
        //    const root = this;
        //    MessageBox.show('Bạn chắc chắn muốn xóa ?', {
        //        icon: MessageBox.Icon.WARNING,
        //        title: 'Xác nhận',
        //        actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //        onClose: function (oAction) {
        //            if (oAction == MessageBox.Action.DELETE) {
        //                Connector.deleteToApi(sdConfig.adminApiEndpoint + 'MonAn/' + root.mainId, {
        //                    fnSuccess: function (data) {
        //                        root.bus.publish("VanChuyenChannel", "onCloseMonAnView");
        //                        root.bus.publish("VanChuyenChannel.Detail", "reLoadData");
        //                        MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
        //                    }
        //                });
        //            }
        //        }
        //    });
        //},
        //onEditButtonPress: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        if (!this._imgEdit) {
        //            Fragment.load({
        //                id: root.getView().getId(),
        //                name: "app.MonAn.Edit",
        //                type: "XML",
        //                controller: this
        //            }).then(function (frag) {
        //                root._imgEdit = frag;
        //                root._imgEdit.open();
        //                root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
        //            });
        //        }
        //        else {
        //            root._imgEdit.open();
        //            root.bus.publish('VanChuyenChannel', 'loadEditPage', { Id: root.mainId, title: root.title });
        //        }
        //    }
        //},
        //onCloseMonAnEdit: function () {
        //    this._imgEdit.close();
        //},

        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        },
        //#endregion
        loadDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            //this.getView().byId('detailIconTabBar').setSelectedKey('monAnTab')
            if (oData && oData.Id) {
                root.mainId = oData.Id;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'vanchuyen/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                            root.loadChiTietVanChuyen();
                        }
                    }
                });
            }
        },
        loadChiTietVanChuyen: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyen/hopDong/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.vanChuyenModel.setData(data);
                }
            });
        },
        onVanChuyenRefresh: function () {
            this.loadDetailPage();
            //this.removeSelectionsVatDung();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        },
        reLoadData: function () {
            if (this.mainId) {
                const root = this;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'Chitietvanchuyen/' + root.mainId, {
                    fnProcessData: function (data) {
                        if (data) {
                            root.mainModel.setData(data);
                        }
                    }
                });
            }
        },

        //#region Phiếu xuất

        loadPhieuXuatData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyenxuat/vanchuyen/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.phieuXuatModel.setData(data);
                }
            });
        },
        onPhieuXuatRefresh: function () {
            this.loadPhieuXuatData();
            //this.removeSelectionsVatDung();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        },
        //#endregion


        //#region Phiếu nhập

        loadPhieuNhapData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietvanchuyen/phieunhap/' + root.mainId, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.phieuNhapModel.setData(data);
                }
            });
        },
        onPhieuNhapRefresh: function () {
            this.loadPhieuNhapData();
            //this.removeSelectionsVatDung();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        },
        //#endregion

        ////#region Vật dụng
        //loadVatDungData: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        this.VatDungTable = this.getView().byId('VatDungTable');
        //        Connector.getFromApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn/MonAn/' + this.mainId, {
        //            fnProcessData: function (data) {
        //                if (data && data.length > 0) {
        //                    for (var i = 0; i < data.length; i++) {
        //                        data[i]['STT'] = i + 1;
        //                    }
        //                }
        //                root.vatDungModel.setData(data);
        //            }
        //        });
        //    }
        //},
        //reloadVatDung: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        this.VatDungTable = this.getView().byId('VatDungTable');
        //        Connector.getFromApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn/MonAn/' + this.mainId, {
        //            fnProcessData: function (data) {
        //                if (data && data.length > 0) {
        //                    for (var i = 0; i < data.length; i++) {
        //                        data[i]['STT'] = i + 1;
        //                    }
        //                    root.vatDungModel.setData(data);
        //                }
        //            }
        //        });
        //    }
        //},
        
        //addVatDung: function () {
        //    const root = this;
        //    if (!this._VatDungAdd) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.MonAn.VatDungDiKem.Add",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._VatDungAdd = frag;
        //            root._VatDungAdd.open();
        //            root.bus.publish('VanChuyenChannel', 'loadAddVatDungPage', { Id: root.mainId });
        //        });
        //    }
        //    else {
        //        root._VatDungAdd.open();
        //        this.bus.publish('VanChuyenChannel', 'loadAddVatDungPage', { Id: root.mainId });
        //    }
        //},
        //onCloseVatDungMonAnAdd: function () {
        //    this._VatDungAdd.close();
        //},
        //onRowViewVatDung: function (oEvent) {
        //    let selectedId = this.getView().getModel('vatDungModel').getProperty('id', oEvent.getParameter('row').getBindingContext('vatDungModel'));
        //    this.bus.publish('VanChuyenChannel', 'switchToVatDungViewPage', { Id: selectedId });
        //},
        //VatDungCellClick: function (oEvent) {
        //    const selectedId = this.getView().getModel('vatDungModel').getProperty('id', oEvent.getParameter('rowBindingContext'));
        //    if (selectedId) {
        //        this.bus.publish('VanChuyenChannel', 'switchToVatDungViewPage', { Id: selectedId });
        //    }
        //},
        //switchToVatDungViewPage: function (oChannel, oEvent, oData) {
        //    if (oData.Id) {
        //        const root = this;
        //        if (!this._VatDungView) {
        //            Fragment.load({
        //                id: root.getView().getId(),
        //                name: "app.MonAn.VatDungDiKem.Detail",
        //                type: "XML",
        //                controller: this
        //            }).then(function (frag) {
        //                root._VatDungView = frag;
        //                root._VatDungView.open();
        //                root.bus.publish('VanChuyenChannel', 'loadDetailVatDungPage', { Id: oData.Id, IdVatTu: root.mainId });
        //            });
        //        }
        //        else {
        //            root._VatDungView.open();
        //            this.bus.publish('VanChuyenChannel', 'loadDetailVatDungPage', { Id: oData.Id, IdVatTu: root.mainId });
        //        }
        //    }
        //},
        //onCloseVatDungDiKemMonAnDetail: function () {
        //    this._VatDungView.close();
        //},
        //onRowEditVatDung: function (oEvent) {
        //    let selectedId = this.getView().getModel('vatDungModel').getProperty('', oEvent.getParameter('row').getBindingContext('vatDungModel'));
        //    if (selectedId) {
        //        const root = this;
        //        if (!this._VatDungEdit) {
        //            Fragment.load({
        //                id: root.getView().getId(),
        //                name: "app.MonAn.VatDungDiKem.Edit",
        //                type: "XML",
        //                controller: this
        //            }).then(function (frag) {
        //                root._VatDungEdit = frag;
        //                root._VatDungEdit.open();
        //                root.bus.publish('VanChuyenChannel', 'loadEditVatDungPage', { Id: selectedId.id, IdVatTu: selectedId.idVatTu });
        //            });
        //        }
        //        else {
        //            root._VatDungEdit.open();
        //            this.bus.publish('VanChuyenChannel', 'loadEditVatDungPage', { Id: selectedId.id, IdVatTu: selectedId.idVatTu });
        //        }
        //    }
        //},
        //onCloseVatDungMonAnEdit: function () {
        //    if (this._VatDungEdit)
        //    this._VatDungEdit.close();
        //},
        //onRowDeleteVatDung: function (oEvent) {
        //    const root = this;
        //    let selectedId = this.getView().getModel('vatDungModel').getProperty('id', oEvent.getParameter('row').getBindingContext('vatDungModel'));
        //    MessageBox.show('Bạn có chắc chắn muốn xóa?', {
        //        icon: MessageBox.Icon.WARNING,
        //        title: 'Xác nhận',
        //        actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //        onClose: function (oAction) {
        //            if (oAction == MessageBox.Action.DELETE) {
        //                Connector.deleteToApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn/' + selectedId, {
        //                    fnSuccess: function (data) {
        //                        root.reloadVatDung();
        //                        MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
        //                    }
        //                });
        //            }
        //        }
        //    });
        //},
        //onVatDungRowSelectionChange: function () {
        //    const deleteButton = this.getView().byId('deleteVatDungButton');
        //    const selectedIndices = this.VatDungTable.getSelectedIndices();
        //    if (selectedIndices.length > 0) {
        //        deleteButton.setVisible(true);
        //    } else {
        //        deleteButton.setVisible(false);
        //    }
        //},
        //onDeleteVatDungButtonPress: function () {
        //    const root = this;
        //    const selectedIndices = this.VatDungTable.getSelectedIndices();
        //    const tableData = this.VatDungTable.getBinding('rows').getModel().getData();
        //    const selectedIds = selectedIndices.map(item => tableData[item].id);
        //    if (selectedIds.length > 0) {
        //        MessageBox.show('Xóa tất cả các mục được chọn?', {
        //            icon: MessageBox.Icon.WARNING,
        //            title: 'Xác nhận',
        //            actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //            onClose: function (oAction) {
        //                if (oAction == MessageBox.Action.DELETE) {
        //                    Connector.deleteToApi(sdConfig.adminApiEndpoint + 'DungCuKemMonAn/list', {
        //                        oParameters: selectedIds,
        //                        fnSuccess: function (data) {
        //                            MessageToast.show("Xóa thành công", { width: '25em', duration: 5000 });
        //                            root.reloadVatDung();
        //                            root.removeSelectionsVatDung();
        //                        }
        //                    });
        //                }
        //            }
        //        });
        //    }
        //},
        //removeSelectionsVatDung: function () {
        //    this.VatDungTable.clearSelection();
        //    this.getView().byId('deleteVatDungButton').setVisible(false);
        //},

        //onVatDungSearch: function (oEvent) {
        //    let root = this;
        //    let params = oEvent.getParameters();
        //    let key = params.query;
        //    let isReset = params.clearButtonPressed;
        //    if (key) {
        //        this.VatDungModel.postToSercureApi(sdConfig.adminApiEndpoint + 'DungCuDiKemMonAn', {
        //            oParameters: {
        //                Filters: [{
        //                    Name: 'PHANMEMID',
        //                    Value: root.mainId,
        //                    Type: DbType.Int,
        //                    ParameterName: 'PHANMEMID'
        //                }, {
        //                    InnerFilter: [{
        //                        Name: 'IP',
        //                        ParameterName: 'IP',
        //                        Value: key,
        //                        Type: DbType.String,
        //                        CompareOperator: 'Contains',
        //                        LogicalOperator: 'Or',
        //                    }],
        //                    LogicalOperator: 'And'
        //                }],
        //            },
        //            fnSuccess: function (data) {
        //                root.removeSelectionsVatDung();
        //            }
        //        });
        //    } else if (isReset) {
        //        root.reloadVatDung();
        //    }
        //},
        //onVatDungLiveChange: function (oEvent) {
        //    if (!oEvent.getParameter('newValue')) {
        //        this.reloadMaintenanceHistory();
        //    }
        //},
        ////#endregion

        ////#region Thực Phẩm
        //loadThucPhamData: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        this.ThucPhamTable = this.getView().byId('ThucPhamTable');
        //        Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPhamKemMonAn/MonAn/' + this.mainId, {
        //            fnProcessData: function (data) {
        //                if (data && data.length > 0) {
        //                    for (var i = 0; i < data.length; i++) {
        //                        data[i]['STT'] = i + 1;
        //                    }
        //                }
        //                root.thucPhamModel.setData(data);
        //            }
        //        });
        //    }
        //},
        //reloadThucPham: function () {
        //    if (this.mainId) {
        //        const root = this;
        //        this.ThucPhamTable = this.getView().byId('ThucPhamTable');
        //        Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucPhamKemMonAn/MonAn/' + this.mainId, {
        //            fnProcessData: function (data) {
        //                if (data && data.length > 0) {
        //                    for (var i = 0; i < data.length; i++) {
        //                        data[i]['STT'] = i + 1;
        //                    }
        //                }
        //                root.thucPhamModel.setData(data);
        //            }
        //        });
        //    }
        //},
        //onThucPhamRefresh: function () {
        //    this.reloadThucPham();
        //    this.removeSelectionsThucPham();
        //    MessageToast.show('Tải lại dữ liệu thành công!', { width: '25em', duration: 5000 });
        //},
        //addThucPham: function () {
        //    const root = this;
        //    if (!this._thucPhamAdd) {
        //        Fragment.load({
        //            id: root.getView().getId(),
        //            name: "app.MonAn.ThucPham.Add",
        //            type: "XML",
        //            controller: this
        //        }).then(function (frag) {
        //            root._thucPhamAdd = frag;
        //            root._thucPhamAdd.open();
        //            root.bus.publish('VanChuyenChannel', 'loadAddThucPhamPage', { Id: root.mainId });
        //        });
        //    }
        //    else {
        //        root._thucPhamAdd.open();
        //        this.bus.publish('VanChuyenChannel', 'loadAddThucPhamPage', { Id: root.mainId });
        //    }
        //},
        //onCloseThucPhamMonAnAdd: function () {
        //    if (this._thucPhamAdd)
        //        this._thucPhamAdd.close();
        //},
        //onRowViewThucPham: function (oEvent) {
        //    let selectedId = this.getView().getModel('thucPhamModel').getProperty('id', oEvent.getParameter('row').getBindingContext('thucPhamModel'));
        //    this.bus.publish('VanChuyenChannel', 'switchToThucPhamViewPage', { Id: selectedId });
        //},
        //thucPhamCellClick: function (oEvent) {
        //    const selectedId = this.getView().getModel('thucPhamModel').getProperty('id', oEvent.getParameter('rowBindingContext'));
        //    if (selectedId) {
        //        this.bus.publish('VanChuyenChannel', 'switchToThucPhamViewPage', { Id: selectedId });
        //    }
        //},
        //switchToThucPhamViewPage: function (oChannel, oEvent, oData) {
        //    if (oData.Id) {
        //        const root = this;
        //        if (!this._thucPhamView) {
        //            Fragment.load({
        //                id: root.getView().getId(),
        //                name: "app.MonAn.ThucPham.Detail",
        //                type: "XML",
        //                controller: this
        //            }).then(function (frag) {
        //                root._thucPhamView = frag;
        //                root._thucPhamView.open();
        //                root.bus.publish('VanChuyenChannel', 'loadDetailThucPhamPage', { Id: oData.Id, IdVatTu: root.mainId });
        //            });
        //        }
        //        else {
        //            root._thucPhamView.open();
        //            this.bus.publish('VanChuyenChannel', 'loadDetailThucPhamPage', { Id: oData.Id, IdVatTu: root.mainId });
        //        }
        //    }
        //},
        //onCloseThucPhamMonAnDetail: function () {
        //    if (this._thucPhamView)
        //        this._thucPhamView.close();
        //},
        //onRowEditThucPham: function (oEvent) {
        //    let selectedId = this.getView().getModel('thucPhamModel').getProperty('', oEvent.getParameter('row').getBindingContext('thucPhamModel'));
        //    if (selectedId) {
        //        const root = this;
        //        if (!this._thucPhamEdit) {
        //            Fragment.load({
        //                id: root.getView().getId(),
        //                name: "app.MonAn.ThucPham.Edit",
        //                type: "XML",
        //                controller: this
        //            }).then(function (frag) {
        //                root._thucPhamEdit = frag;
        //                root._thucPhamEdit.open();
        //                root.bus.publish('VanChuyenChannel', 'loadEditThucPhamPage', { Id: selectedId.id, IdThucPham: selectedId.idThucPham });
        //            });
        //        }
        //        else {
        //            root._thucPhamEdit.open();
        //            this.bus.publish('VanChuyenChannel', 'loadEditThucPhamPage', { Id: selectedId.id, IdThucPham: selectedId.idThucPham });
        //        }
        //    }
        //},
        //onCloseThucPhamMonAnEdit: function () {
        //    if (this._thucPhamEdit)
        //        this._thucPhamEdit.close();
        //},
        //onRowDeleteThucPham: function (oEvent) {
        //    const root = this;
        //    let selectedId = this.getView().getModel('thucPhamModel').getProperty('id', oEvent.getParameter('row').getBindingContext('thucPhamModel'));
        //    MessageBox.show('Bạn có chắc chắn muốn xóa?', {
        //        icon: MessageBox.Icon.WARNING,
        //        title: 'Xác nhận',
        //        actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //        onClose: function (oAction) {
        //            if (oAction == MessageBox.Action.DELETE) {
        //                Connector.deleteToApi(sdConfig.adminApiEndpoint + 'thucPhamKemMonAn/' + selectedId, {
        //                    fnSuccess: function (data) {
        //                        root.reloadThucPham();
        //                        MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
        //                    }
        //                });
        //            }
        //        }
        //    });
        //},
        //onThucPhamRowSelectionChange: function () {
        //    const deleteButton = this.getView().byId('deleteThucPhamButton');
        //    const selectedIndices = this.ThucPhamTable.getSelectedIndices();
        //    if (selectedIndices.length > 0) {
        //        deleteButton.setVisible(true);
        //    } else {
        //        deleteButton.setVisible(false);
        //    }
        //},
        //onDeleteThucPhamButtonPress: function () {
        //    const root = this;
        //    const selectedIndices = this.ThucPhamTable.getSelectedIndices();
        //    const tableData = this.ThucPhamTable.getBinding('rows').getModel().getData();
        //    const selectedIds = selectedIndices.map(item => tableData[item].id);
        //    if (selectedIds.length > 0) {
        //        MessageBox.show('Xóa tất cả các mục được chọn?', {
        //            icon: MessageBox.Icon.WARNING,
        //            title: 'Xác nhận',
        //            actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
        //            onClose: function (oAction) {
        //                if (oAction == MessageBox.Action.DELETE) {
        //                    Connector.deleteToApi(sdConfig.adminApiEndpoint + 'ThucPhamKemMonAn/list', {
        //                        oParameters: selectedIds,
        //                        fnSuccess: function (data) {
        //                            MessageToast.show("Xóa thành công", { width: '25em', duration: 5000 });
        //                            root.reloadThucPham();
        //                            root.removeSelectionsThucPham();
        //                        }
        //                    });
        //                }
        //            }
        //        });
        //    }
        //},
        //removeSelectionsThucPham: function () {
        //    this.ThucPhamTable.clearSelection();
        //    this.getView().byId('deleteThucPhamButton').setVisible(false);
        //},

        //onThucPhamSearch: function (oEvent) {
        //    let root = this;
        //    let params = oEvent.getParameters();
        //    let key = params.query;
        //    let isReset = params.clearButtonPressed;
        //    if (key) {
        //        this.thucPhamModel.postToSercureApi(sdConfig.adminApiEndpoint + 'DungCuDiKemMonAn', {
        //            oParameters: {
        //                Filters: [{
        //                    Name: 'PHANMEMID',
        //                    Value: root.mainId,
        //                    Type: DbType.Int,
        //                    ParameterName: 'PHANMEMID'
        //                }, {
        //                    InnerFilter: [{
        //                        Name: 'IP',
        //                        ParameterName: 'IP',
        //                        Value: key,
        //                        Type: DbType.String,
        //                        CompareOperator: 'Contains',
        //                        LogicalOperator: 'Or',
        //                    }],
        //                    LogicalOperator: 'And'
        //                }],
        //            },
        //            fnSuccess: function (data) {
        //                root.removeSelectionsThucPham();
        //            }
        //        });
        //    } else if (isReset) {
        //        root.reloadThucPham();
        //    }
        //},
        //onThucPhamLiveChange: function (oEvent) {
        //    if (!oEvent.getParameter('newValue')) {
        //        this.reloadMaintenanceHistory();
        //    }
        //},
        ////#endregion
    });
});