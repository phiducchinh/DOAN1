sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'app/ext/Auth.Connector.Adal',
    'app/globalformatter',
    'app/ext/CoreJsonModel',

], function (Core, Controller, JSONModel, Filter, FilterOperator, Connector, GlobalFormatter, CoreJsonModel) {
    'use strict';
    return Controller.extend('app.Root', {
        globalFormatter: GlobalFormatter,
        sideBarModel: new JSONModel(),
        parentModel: new JSONModel(),
        thucPhamModel: new CoreJsonModel(),
        dataModel: new CoreJsonModel(),
        planningModel: new CoreJsonModel(),
        doanhThuModel: new CoreJsonModel(),
        chiTieuModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        hideModel: new CoreJsonModel(),
        hide: {
            donCo: false,
            doanhThu: false,
            chiTieu: false,
        },
        _chartPro: {
            title: {
                visible: false
            },
            valueAxisScale: "AutoScale",
            plotArea: {
                colorPalette: ['#80b918', '#ffca3a'],
                //colorPalette: ['#007f5f', '#D4D700', "#55A630","#FFFF3F"],
                dataLabel: {
                    visible: true,
                    showTotal: true,
                },
                gap: {
                    barSpacing: 0.5
                },
                gridline: {
                    type: 'dash'
                },
                isFixedDataPointSize: true,
                drawingEffect: 'normal'
                //drawingEffect: 'glossy'
            },
            legendGroup: {
                layout: {
                    position: "top"
                }
            },
            valueAxis: {
                applyAxislineColor: true,
                title: {
                    text: "Số lượng"
                },
            },
            categoryAxis: {
                title: {
                    text: "Thống kê các loại phần mềm"
                },
                applyAxislineColor: true,
                label: {
                    angle: 60,
                    linesOfWrap: 2,
                }
            },
            tooltip: {
                visible: true
            },
            interaction: {
                selectability: {
                    mode: 'single'
                }
            },
            legend: {
                label: {
                    style: {
                        color: "#333"
                    }
                }
            }
        },
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.dataModel, "dataModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.planningModel, "planningModel");
            this.getView().setModel(this.chiTieuModel, "chiTieuModel");
            this.getView().setModel(this.doanhThuModel, "doanhThuModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.getView().setModel(this.sideBarModel, 'sideBarModel');
            this.getView().setModel(this.hideModel, 'hideModel');
            this.bus.subscribe('rootBus', 'renderSidebar', this.renderSidebar, this);
            this.renderSidebar();
            this.loadData()
            this.hideModel.setData(this.hide);
        },
        loadData: function () {
            //this.initial();
            this.loadDataDonco();
            this.loadDataDoanhThu();
            this.loadDataChiTieu();
            //this.loadThucPham();
            //this.initialPlan();
        },
        renderSidebar: function () {
            this.buildHierarchySideBarItems(appRuntime.Features, 'main');
        },
        buildHierarchySideBarItems: function (flat, position) {
            const root = this;
            root.sideBarModel.setData({
                main: flat,
                //fixed: root.buildFlatSideBarItems(appRuntime.Menus, 'fixed')
            });
        },
        onItemSelect: function (oControlEvent) {
            var oItem = oControlEvent.getParameters().listItem;
            var oContext = oItem.getBindingContext('sideBarModel');
            appRuntime.selectedFeature = oContext.getObject();
            //console.log(this);
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //console.log(oContext.getObject());
            this.changeChart(appRuntime.selectedFeature.Key);
            if (appRuntime.selectedFeature.Endpoint) {
                if (appRuntime.selectedFeature.Endpoint.includes('ManageDevice_GroupType')) {
                    oRouter.navTo(appRuntime.selectedFeature.Parent, { grouptype: appRuntime.selectedFeature.Key});
                }
                else
                    oRouter.navTo(appRuntime.selectedFeature.Endpoint);
                
            }
            if (appRuntime.selectedFeature.Parent === '' && appRuntime.selectedFeature.Level == 1 || appRuntime.selectedFeature.Endpoint == 'ManageDevice' || appRuntime.selectedFeature.Endpoint == 'ManageDigitalSignature') {
                const id = oControlEvent.getParameter('listItem').sId;
                const index = id.lastIndexOf('-');
                const indexItem = parseInt(id.slice(index + 1, id.length));
                this.getView().byId('sidebarItem').expand(indexItem);
            }
            this.bus.publish('appRoot', 'toggleMasterMenu');
        },
        onSearchTyping: function (oEvent) {
            let aFilter = [];
            let sQuery = oEvent.getParameters().newValue;

            if (sQuery && sQuery.length > 0) {
                aFilter.push(new Filter('Value', FilterOperator.Contains, sQuery));
                this.getView().byId('sidebarItem').expandToLevel(3);
            }
            let oList = this.byId('sidebarItem');
            let oBinding = oList.getBinding('items');
            oBinding.filter(aFilter);
        },
        onFixedButtonPress: function (oEvent) {
            appRuntime.selectedFeature = oEvent.getSource().getBindingContext('sideBarModel').getObject();
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (appRuntime.selectedFeature.Endpoint) {
                oRouter.navTo(appRuntime.selectedFeature.Endpoint);
            }
        },
        onTogglePinMenu: function (oControlEvent) {
            var pressed = oControlEvent.getParameter('pressed');
            this.bus.publish('appRoot', 'togglePinMasterMenu', { pined: pressed });
        },
        changeChart: function (key) {
            if (key == 'HopDong') {
                this.hide.donCo = true;
                this.hide.doanhThu = false;
                this.hide.chiTieu = false;
            }
            else if (key == 'ThanhToan') {
                this.hide.donCo = false;
                this.hide.doanhThu = true;
                this.hide.chiTieu = true;
            }
            else if (key == 'PhieuMua' || key == 'Mua') {
                this.hide.donCo = false;
                this.hide.doanhThu = false;
                this.hide.chiTieu = true;
            }
            else {
                this.hide.donCo = false;
                this.hide.doanhThu = false;
                this.hide.chiTieu = false;
            }
            this.hideModel.refresh();
        },
        //
        initialPlan: function () {
            const root = this;
            var date = new Date();
            let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), "0", "0");

            let dataPlan = {
                startDate: startDate,
                people: []
            }
            let obj = {
                name: "Đơn cỗ",
                appointments: [
                ]
            }
            dataPlan.people.push(obj);
            root.planningModel.setData(dataPlan)

            let start = moment().format('yyyy-MM-DDTHH:mm:ss.SSS');
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'hopdong/getByStartDate/' + start, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        data.forEach(item => {
                            obj.appointments.push({
                                id: item.id,
                                start: new Date(moment(item.ngayBatDau).format('yyyy'), moment(item.ngayBatDau).format('MM') - 1, moment(item.ngayBatDau).format('DD'), moment(item.ngayBatDau).format('HH'), moment(item.ngayBatDau).format('mm')),
                                end: new Date(moment(item.ngayKetThuc).format('yyyy'), moment(item.ngayKetThuc).format('MM') - 1, moment(item.ngayKetThuc).format('DD'), moment(item.ngayKetThuc).format('HH'), moment(item.ngayKetThuc).format('mm')),
                                title: item.tenHopDong,
                                info: item.tenKhachHang,
                                type: "Type0" + Math.floor(Math.random() * 10),
                                tentative: false
                            })
                        })
                    }
                    setTimeout(function () {
                        root.planningModel.setData(dataPlan)
                    }, 200)
                }
            });
        },
        loadThucPham: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/chart/', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                        root.thucPhamModel.setData(data);
                    }
                }
            });
        },
        loadDataDonco: function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();

            let paras = {
                startDate: date.getFullYear() + '-' + month + '-01',
                endDate: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            Connector.postToApi(sdConfig.adminApiEndpoint + 'hopdong/bydate', {
                oParameters: paras,
                fnSuccess: function (data) {
                    var obj = {
                        ngayBD: firstDay,
                        ngayKT: endDay,
                        soDonCo: 0,
                    }
                    if (data && data.length > 0) {
                        obj.soDonCo = data.length;
                    }
                    root.donCoModel.setData(obj)
                }
            })
        },
        loadDataDoanhThu: function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();

            let paras = {
                s: date.getFullYear() + '-' + month + '-01',
                e: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            Connector.postToApi(sdConfig.adminApiEndpoint + 'thanhtoan/chart', {
                oParameters: paras,
                fnSuccess: function (data) {
                    var obj = {
                        ngayBD: firstDay,
                        ngayKT: endDay,
                        doanhThu: 0,
                    }
                    if (data && data.length > 0) {
                        let tong = 0;
                        data.forEach(item => {
                            tong += item.tongTien;
                        })
                        obj.doanhThu = tong;
                    }
                    root.doanhThuModel.setData(obj)
                }
            })
        },
        loadDataChiTieu: function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();

            let paras = {
                s: date.getFullYear() + '-' + month + '-01',
                e: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            let tp = new Promise(resolve => {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/chart', {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        resolve(data);
                    }
                })
            });

            let vd = new Promise(resolve => {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuNhapVatDung/chart', {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        resolve(data);
                    }
                })
            })

            Promise.all([tp, vd])
                .then(([dataTp, dataVd]) => {
                    let tong = 0;
                    if (dataTp && dataTp.length > 0) {
                        dataTp.forEach(item => {
                            tong += item.giaTien;
                        })
                    }
                    if (dataVd && dataVd.length > 0) {
                        dataVd.forEach(item => {
                            tong += item.giaNhap;
                        })
                    }
                    var obj = {
                        ngayBD: firstDay,
                        ngayKT: endDay,
                        chiTieu: tong,
                    }
                    root.chiTieuModel.setData(obj);
                })
                .catch(err => {
                    console.log(err);
                })


        },
        chiTieuChanger  : function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();
            let paras = {
                s: date.getFullYear() + '-' + month + '-01',
                e: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            let data = this.chiTieuModel.getData();
            if (data.ngayBD != firstDay) {
                paras.s = data.ngayBD;
            }
            if (data.ngayKT != endDay) {
                paras.e = data.ngayKT;
            }
            let tp = new Promise(resolve => {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/chart', {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        resolve(data);
                    }
                })
            });

            let vd = new Promise(resolve => {
                Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuNhapVatDung/chart', {
                    oParameters: paras,
                    fnSuccess: function (data) {
                        resolve(data);
                    }
                })
            })

            Promise.all([tp, vd])
                .then(([dataTp, dataVd]) => {
                    let tong = 0;
                    if (dataTp && dataTp.length > 0) {
                        dataTp.forEach(item => {
                            tong += item.giaTien;
                        })
                    }
                    if (dataVd && dataVd.length > 0) {
                        dataVd.forEach(item => {
                            tong += item.giaNhap;
                        })
                    }
                    root.chiTieuModel.setProperty('/chiTieu', tong);
                    root.chiTieuModel.refresh();
                })
                .catch(err => {
                    console.log(err);
                })

        },
        dateChanger: function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();
            let paras = {
                startDate: date.getFullYear() + '-' + month + '-01',
                endDate: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            let data = this.donCoModel.getData();
            if (data.ngayBD != firstDay) {
                paras.startDate = data.ngayBD;
            }
            if (data.ngayKT != endDay) {
                paras.endDate = data.ngayKT;
            }
            Connector.postToApi(sdConfig.adminApiEndpoint + 'hopdong/bydate', {
                oParameters: paras,
                fnSuccess: function (data) {
                    if (data && data.length > 0) {
                        root.donCoModel.setProperty('/soDonCo', data.length);
                        root.donCoModel.refresh();
                    }
                }
            })
        },
        doanhThuChanger: function () {
            const root = this;
            var date = new Date();
            var month = date.getMonth() + 1;
            var firstDay = '1/' + month + '/' + date.getFullYear();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var endDay = lastDay.getDate() + '/' + month + '/' + date.getFullYear();
            let paras = {
                s: date.getFullYear() + '-' + month + '-01',
                e: date.getFullYear() + '-' + month + '-' + lastDay.getDate()
            }

            let data = this.doanhThuModel.getData();
            if (data.ngayBD != firstDay) {
                paras.s = data.ngayBD;
            }
            if (data.ngayKT != endDay) {
                paras.e = data.ngayKT;
            }

            Connector.postToApi(sdConfig.adminApiEndpoint + 'thanhtoan/chart', {
                oParameters: paras,
                fnSuccess: function (data) {
                    if (data && data.length > 0) {
                        let tong = 0;
                        data.forEach(item => {
                            tong += item.tongTien;
                        })
                        root.doanhThuModel.setProperty('/doanhThu', tong);
                        root.doanhThuModel.refresh();
                    }
                }
            })
        },
        initial: function () {
            //let root = this;
            //var oVizFrame = this.getView().byId("iVizFrame");
            //oVizFrame.setUiConfig({
            //    "applicationSet": "fiori"
            //});
            //oVizFrame.setVizProperties(this._chartPro);


            //root.loadVatDungChart();
        },
        loadVatDungChart: function () {
            const root = this;
            let slMuon = new Promise(resolve => {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ChiTietVanChuyenNhap/chart', {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            //data = data.map(item => {
                            //    return {
                            //        VATDUNGID: item.id,
                            //        TENVATDUNG: item.tenVatTu,
                            //        CL: item.soLuongConLai,
                            //        MUON: 100
                            //    }
                            //});
                            resolve(data);
                        }

                    }
                });
            });

            let slConLai = new Promise(resolve => {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'vattu', {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            resolve(data)
                        }

                    }
                });
            });
            let arr = [];
            Promise.all([slMuon, slConLai])
                .then(([dataMuon, dataConlai]) => {
                    dataConlai.forEach(cl => {
                        var check = true;
                        dataMuon.forEach(muon => {
                            if (muon.idVatTu == cl.id) {
                                check = false;
                                var obj = {
                                    VATDUNGID: cl.id,
                                    TENVATDUNG: cl.tenVatTu,
                                    MAVATTU: cl.maVatTu,
                                    CL: cl.soLuongConLai,
                                    MUON: muon.sl || 0
                                }
                                arr.push(obj);
                            }
                        })
                        if (check == true) {
                            var obj = {
                                VATDUNGID: cl.id,
                                TENVATDUNG: cl.tenVatTu,
                                MAVATTU: cl.maVatTu,
                                CL: cl.soLuongConLai,
                                MUON: 0
                            }
                            arr.push(obj);
                        }
                    });
                    return arr;
                })
                .then(data => {
                    root.dataModel.setData({
                        "Data": data
                    });
                })
                .catch(err => {
                    cconsole.log(err)
                })



        },
        changePlan: function () {
            const root = this;
            let planData = this.planningModel.getData();
            let month = Number(planData.startDate.getMonth() + 1);
            month = month >= 10 ? month : "0" + month;
            let date = planData.startDate.getDate();
            date = date >= 10 ? date : "0" + date;

            let day = planData.startDate.getFullYear() + "-" + month + "-" + date + "T00:00:00.000";

            Connector.getFromApi(sdConfig.adminApiEndpoint + 'hopdong/getByStartDate/' + day, {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        let arr = [];
                        data.forEach(item => {
                            arr.push({
                                id: item.id,
                                start: new Date(moment(item.ngayBatDau).format('yyyy'), moment(item.ngayBatDau).format('MM') - 1, moment(item.ngayBatDau).format('DD'), moment(item.ngayBatDau).format('HH'), moment(item.ngayBatDau).format('mm')),
                                end: new Date(moment(item.ngayKetThuc).format('yyyy'), moment(item.ngayKetThuc).format('MM') - 1, moment(item.ngayKetThuc).format('DD'), moment(item.ngayKetThuc).format('HH'), moment(item.ngayKetThuc).format('mm')),
                                title: item.tenHopDong,
                                info: item.tenKhachHang,
                                type: "Type0" + Math.floor(Math.random() * 10),
                                tentative: false
                            })
                        })
                        planData.people[0].appointments = arr;
                        root.planningModel.refresh();
                    }

                }
            });

        },
        viewChange: function (e) {
            var ctrl = e.getSource().getViewKey();
            if (ctrl == "Day") {
                this.initialPlan();
            }
        },
        handleAppointmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameters('appointment').appointment.getBindingContext('planningModel').getObject();
            const root = this;
            if (!this._HopDongDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HopDong.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HopDongDetail = frag;
                    root._HopDongDetail.open();
                    root.bus.publish('HopDongChannel', 'loadDetailPage', { Id: oAppointment.id, title: oAppointment.title });
                });
            }
            else {
                root._HopDongDetail.open();
                root.bus.publish('HopDongChannel', 'loadDetailPage', { Id: oAppointment.id, title: oAppointment.title });
            }
        },
        onCloseHopDongView: function () {
            if (this._HopDongDetail)
                this._HopDongDetail.close();
        },

    });
}
);