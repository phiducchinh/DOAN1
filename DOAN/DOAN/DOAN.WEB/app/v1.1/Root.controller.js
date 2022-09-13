sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox',
    'app/globalformatter',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'sap/ui/core/Fragment'
], function (Core, Controller, MessageBox, GlobalFormatter, Connector, CoreJsonModel, Fragment) {
    'use strict';
    return Controller.extend('app.Root', {
        userModel: new CoreJsonModel(),
        notificationModel: new CoreJsonModel(),
        md_countNotif: new CoreJsonModel(0),
        globalFormatter: GlobalFormatter,
        resourceModel: {},
        onInit: function () {
            const root = this;
            this.bus = Core.getEventBus();
            this.bus.subscribe('appRoot', 'toggleMasterMenu', this.toggleMasterMenu, this);
            this.bus.subscribe('appRoot', 'togglePinMasterMenu', this.togglePinMasterMenu, this);
            this.loadAvailableFeatures();
            //this.resourceModel = this.getView().getModel('i18n').getResourceBundle();
            this.userModel.setData(currentUser);
            this.getView().setModel(this.md_countNotif, 'md_countNotif');
            this.getView().setModel(this.userModel, 'userModel');

        },
        loadAvailableFeatures: function () {
            const root = this;
            //Connector.getFromSercureApi(sdConfig.adminApiEndpoint + 'user/features', {
            //    fnSuccess: function (data) {
            //        if (data.Features.length === 0) {
            //            sap.ui.core.UIComponent.getRouterFor(root).getTargets().display('NotAuthorizationApp');
            //        } else {
            //            appRuntime.Features = data.Features;
            //            appRuntime.Menus = data.Menus;
            //            root.bus.publish('rootBus', 'renderSidebar');
            //        }
            //    },
            //    bMerge: true
            //});
            let data = [
                {
                    "Icon": "sap-icon://business-objects-experience",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "Dashboard",
                    "Expanded": true,
                    "Index": 1,
                    "Parent": "",
                    "Level": 1,
                    "Key": "Dashboard",
                    "Value": "Thống kê",
                    "items": []
                },
                
                {
                    "Icon": "sap-icon://decision",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "HopDong",
                    "Expanded": true,
                    "Index": 3,
                    "Parent": "",
                    "Level": 1,
                    "Key": "HopDong",
                    "Value": "Đơn cỗ",
                    "items": []
                },
                {
                    "Icon": "sap-icon://activity-individual",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "KhoThucPham",
                    "Expanded": true,
                    "Index": 2,
                    "Parent": "",
                    "Level": 1,
                    "Key": "KhoThucPham",
                    "Value": " Kho thực phẩm",
                    "items": [
                        {
                            "Icon": "sap-icon://cart",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "Mua",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "KhoThucPham",
                            "Level": 2,
                            "Key": "Mua",
                            "Value": "Phiếu mua",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://cart-3",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "Nhap",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "KhoThucPham",
                            "Level": 2,
                            "Key": "Nhap",
                            "Value": "Phiếu nhập",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://cart-2",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "Xuat",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "KhoThucPham",
                            "Level": 2,
                            "Key": "Xuat",
                            "Value": "Phiếu xuất",
                            "items": []
                        }
                    ]
                },
                {
                    "Icon": "sap-icon://activity-items",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "KhoVatTu",
                    "Expanded": true,
                    "Index": 2,
                    "Parent": "",
                    "Level": 1,
                    "Key": "KhoVatTu",
                    "Value": " Kho vật dụng",
                    "items": [
                        {
                            "Icon": "sap-icon://cart-4",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "PhieuMua",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "",
                            "Level": 1,
                            "Key": "PhieuMua",
                            "Value": "Phiếu Mua",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://outbox",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "PhieuXuat",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "",
                            "Level": 1,
                            "Key": "PhieuXuat",
                            "Value": "Phiếu xuất",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://inbox",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "PhieuNhap",
                            "Expanded": true,
                            "Index": 2,
                            "Parent": "",
                            "Level": 1,
                            "Key": "PhieuNhap",
                            "Value": "Phiếu nhập",
                            "items": []
                        }
                    ]
                },
                {
                    "Icon": "sap-icon://shipping-status",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "VanChuyen",
                    "Expanded": true,
                    "Index": 4,
                    "Parent": "",
                    "Level": 1,
                    "Key": "VanChuyen",
                    "Value": "Đơn vận chuyển",
                    "items": []
                },
                {
                    "Icon": "sap-icon://collaborate",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "NhanVien",
                    "Expanded": true,
                    "Index": 5,
                    "Parent": "",
                    "Level": 1,
                    "Key": "NhanVien",
                    "Value": "Nhân viên",
                    "items": []
                },
                {
                    "Icon": "sap-icon://sap-box",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "Manage",
                    "Expanded": true,
                    "Index": 6,
                    "Parent": "",
                    "Level": 1,
                    "Key": "Manage",
                    "Value": "Quản lý danh mục",
                    "items": [
                        {
                            "Icon": "sap-icon://meal",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "MonAn",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "Manage",
                            "Level": 2,
                            "Key": "MonAn",
                            "Value": "Món ăn",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://product",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "ThucPham",
                            "Expanded": true,
                            "Index": 1,
                            "Parent": "Manage",
                            "Level": 2,
                            "Key": "ThucPham",
                            "Value": "Thực phẩm",
                            "items": []
                        },
                        {
                            "Icon": "sap-icon://activity-items",
                            "Position": "main",
                            "RequirePermission": true,
                            "Endpoint": "VatTu",
                            "Expanded": true,
                            "Index": 2,
                            "Parent": "",
                            "Level": 1,
                            "Key": "VatTu",
                            "Value": "Vật dụng",
                            "items": []
                        },
                    ]
                },
                {
                    "Icon": "sap-icon://payment-approval",
                    "Position": "main",
                    "RequirePermission": true,
                    "Endpoint": "ThanhToan",
                    "Expanded": true,
                    "Index": 5,
                    "Parent": "",
                    "Level": 1,
                    "Key": "ThanhToan",
                    "Value": "Thanh toán",
                    "items": []
                },
                
                
            ];

            appRuntime.Features = data;
            root.bus.publish('rootBus', 'renderSidebar');

        },
        //#region new notìication
        loadCountNotifData: function () {
            this.md_countNotif.getFromSercureApi(sdConfig.adminApiEndpoint + 'notification/unreads/count', {
                fnProcessData: function (count) {
                    return { count: count.toString() };
                },
                fnError: function (err) { }
            });
        },

        onOpenNotitfication: function (oEvent) {
            const root = this;
            let button = oEvent.getSource();
            Connector.postToSercureApi(sdConfig.adminApiEndpoint + 'alertsetting/listtonoti', {
                fnSuccess: function (data) {
                    if (data && data.length) {
                        let baoHanhData = [];
                        let baoTriData = [];
                        let hetHanData = [];
                        data.forEach(item => {
                            let obj = item;
                            if (item.TABLETYPE == TableType.Device) {
                                let ngayhethan = moment(item.NGAYHETBAOHANHTHIETBI).format('DD/MM/YYYY');
                                let ngayhethanformat = moment(ngayhethan, "DD/MM/YYYY").format("YYYY-MM-DD");
                                if (item.ALERTTYPE == AlertType.BaoHanh) {
                                    if (item.NGAYHETBAOHANHTHIETBI != null) {
                                        if (new Date(ngayhethanformat) < new Date())
                                            obj.CONTENT = `Thiết bị ${item.TENTHIETBI} đã hết hạn bảo hành, ngày hết hạn ${ngayhethan}`;
                                        else
                                            obj.CONTENT = `Thiết bị ${item.TENTHIETBI} sắp hết hạn bảo hành, ngày hết hạn ${ngayhethan}`;
                                        baoHanhData.push(obj);
                                    }
                                }
                                if (item.ALERTTYPE == AlertType.BaoTri) {
                                    if (item.NGAYHETBAOHANHTHIETBI != null) {
                                        obj.CONTENT = `Thiết bị ${item.TENTHIETBI} cần bảo trì, ngày hết hạn ${ngayhethan}`;
                                        baoTriData.push(obj);
                                    }
                                }
                            }
                            if (item.TABLETYPE == TableType.Software) {
                                let ngayhethan = moment(item.NGAYHETBAOHANHPHANMEM).format('DD/MM/YYYY');
                                let ngayhethanformat = moment(ngayhethan, "DD/MM/YYYY").format("YYYY-MM-DD");
                                if (item.ALERTTYPE == AlertType.BaoHanh) {
                                    if (item.NGAYHETBAOHANHPHANMEM != null) {
                                        if (new Date(ngayhethanformat) < new Date())
                                            obj.CONTENT = `Phần mềm ${item.TENTHIETBI} đã hết hạn bảo hành , ngày hết hạn ${ngayhethan}`;
                                        else
                                            obj.CONTENT = `Phần mềm ${item.TENPHANMEM} sắp hết hạn bảo hành , ngày hết hạn ${ngayhethan}`;
                                        baoHanhData.push(obj);
                                    }
                                }
                                if (item.ALERTTYPE == AlertType.BaoTri) {
                                    if (item.NGAYHETBAOHANHPHANMEM != null) {
                                        obj.CONTENT = `Phần mềm ${item.TENPHANMEM} cần bảo trì , ngày hết hạn ${ngayhethan}`;
                                        baoTriData.push(obj);
                                    }
                                }
                            }
                            if (item.TABLETYPE == TableType.Component) {
                                let ngayhethan = moment(item.NGAYHETBAOHANHLINHKIEN).format('DD/MM/YYYY');
                                let ngayhethanformat = moment(ngayhethan, "DD/MM/YYYY").format("YYYY-MM-DD");
                                if (item.ALERTTYPE == AlertType.BaoHanh) {
                                    if (item.NGAYHETBAOHANHLINHKIEN != null) {
                                        if (new Date(ngayhethanformat) < new Date())
                                            obj.CONTENT = `Linh kiện ${item.TENLINHKIEN} đã hết hạn bảo hành, ngày hết hạn ${ngayhethan}`;
                                        else
                                            obj.CONTENT = `Linh kiện ${item.TENLINHKIEN} sắp hết hạn bảo hành, ngày hết hạn ${ngayhethan}`;
                                        baoHanhData.push(obj);
                                    }
                                }
                                if (item.ALERTTYPE == AlertType.BaoTri) {
                                    if (item.NGAYHETBAOHANHLINHKIEN != null) {
                                        obj.CONTENT = `Linh kiện ${item.TENLINHKIEN} cần bảo trì, ngày hết hạn ${ngayhethan}`;
                                        baoTriData.push(obj);
                                    }
                                }
                            }
                            if (item.TABLETYPE == TableType.DigitalSignature) {
                                let ngayhethan = moment(item.NGAYHETHANCHUKYSO).format('DD/MM/YYYY');
                                let ngayhethanformat = moment(ngayhethan, "DD/MM/YYYY").format("YYYY-MM-DD");
                                if (item.NGAYHETHANCHUKYSO != null) {
                                    if (new Date(ngayhethanformat) < new Date())
                                        obj.CONTENT = `Chứng thư số của ${item.HOTEN} đã hết hạn, ngày hết hạn ${ngayhethan}`;
                                    else
                                        obj.CONTENT = `Chứng thư số của ${item.HOTEN} sắp hết hạn, ngày hết hạn ${ngayhethan}`;
                                    hetHanData.push(obj);
                                }
                            }
                        });
                        root.notificationModel.setProperty('/baohanh', baoHanhData);
                        root.notificationModel.setProperty('/baohanhcount', baoHanhData.length);
                        root.notificationModel.setProperty('/baotri', baoTriData);
                        root.notificationModel.setProperty('/baotricount', baoTriData.length);
                        root.notificationModel.setProperty('/hethan', hetHanData);
                        root.notificationModel.setProperty('/hethancount', hetHanData.length);
                    }
                    else {
                        root.notificationModel.setProperty('/baohanh', []);
                        root.notificationModel.setProperty('/baohanhcount', 0);
                        root.notificationModel.setProperty('/baotri', []);
                        root.notificationModel.setProperty('/baotricount', 0);
                        root.notificationModel.setProperty('/hethan', []);
                        root.notificationModel.setProperty('/hethancount', 0);
                    }
                },

                fnCompleted: function () {
                    if (!root.notificationPopover) {
                        Fragment.load({
                            name: "app.fragments.NewNotificationPopover",
                            type: "XML",
                            controller: root
                        }).then(function (frag) {
                            root.notificationPopover = frag;
                            root.notificationPopover.setModel(root.notificationModel, 'notificationModel');
                            root.notificationPopover.openBy(button);
                        });
                    }
                    else {
                        root.notificationPopover.openBy(button);
                    }
                }
            });
        },
        onViewAllNotifPress: function () {
            this.notificationPopover.close();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo('SystemNotification');
        },
        onCloseNotificationPopover: function (oEvent) {
            this.notificationPopover.close();
        },
        onItemSelect: function (oEvent) {
            var item = oEvent.getParameter('item');
            var routeKey = item.getKey();
            if (routeKey && routeKey !== '') {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(item.getKey());
            }
        },
        //#endregion
        onSignoutClick: function () {
            var bCompact = !!this.getView().$().closest('.sapUiSizeCompact').length;
            MessageBox.confirm(this.resourceModel.getText('LogoutConfirm'), {
                styleClass: bCompact ? 'sapUiSizeCompact' : '',
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        authContext.logOut();
                    }
                }
            }
            );
        },
        toggleMasterMenu: function () {
            var splitApp = this.getView().byId('appRoot');
            if (splitApp.isMasterShown())
                splitApp.hideMaster();
            else
                splitApp.showMaster();
        },
        togglePinMasterMenu: function (sChanel, sEvent, oData) {
            var splitApp = this.getView().byId('appRoot');
            if (oData.pined)
                splitApp.setMode('ShowHideMode');
            else
                splitApp.setMode('HideMode');
        },
        onAccountClick: function (oEvent) {
            if (!this.accPopover) {
                this.accPopover = sap.ui.xmlfragment('app.fragments.AccountPopover', this);
                this.getView().addDependent(this.accPopover);
            }
            this.accPopover.openBy(oEvent.getSource());
        }
    });
});