
sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'app/ext/CoreJsonModel',
    'app/ext/Auth.Connector.Adal',
    'sap/m/MessageBox',
    'app/globalformatter',

], function (Core, Fragment, Controller, CoreJsonModel, Connector, MessageBox, GlobalFormatter      ) {
    "use strict";
    const controller = {
        globalFormatter: GlobalFormatter,
        componentTypeReportModel: new CoreJsonModel(),
        componentModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        dataModel: new CoreJsonModel(),
        planningModel: new CoreJsonModel(),
        doanhThuModel: new CoreJsonModel(),
        chiTieuModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
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
        fakeModel: [
            {
                VATDUNGID: 1,
                TENVATDUNG: "Bát",
                CL: 300,
                MUON: 100
            },
            {
                VATDUNGID: 2,
                TENVATDUNG: "Bàn",
                CL: 485,
                MUON: 235
            },
            {
                VATDUNGID: 3,
                TENVATDUNG: "Ghế",
                CL: 1500,
                MUON: 450
            },
            {
                VATDUNGID: 4,
                TENVATDUNG: "BÁT",
                CL: 545,
                MUON: 265
            },
            {
                VATDUNGID: 5,
                TENVATDUNG: "Đĩa tròn",
                CL: 440,
                MUON: 180
            },
            {
                VATDUNGID: 6,
                TENVATDUNG: "Đĩa vuông",
                CL: 570,
                MUON: 320
            },
            {
                VATDUNGID: 7,
                TENVATDUNG: "bát chấm",
                CL: 640,
                MUON: 250
            },
            {
                VATDUNGID: 8,
                TENVATDUNG: "Đĩa kê",
                CL: 850,
                MUON: 300
            },
            {
                VATDUNGID: 9,
                TENVATDUNG: "Bếp cồn",
                CL: 180,
                MUON: 30
            },
            {
                VATDUNGID: 10,
                TENVATDUNG: "Xoong",
                CL: 100,
                MUON: 25
            },
        ],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.dataModel, "dataModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.planningModel, "planningModel");
            this.getView().setModel(this.chiTieuModel, "chiTieuModel");
            this.getView().setModel(this.doanhThuModel, "doanhThuModel");
            this.getView().setModel(this.thucPhamModel, "thucPhamModel");
            this.initial();
            this.loadDataDonco();
            this.loadDataDoanhThu();
            this.loadDataChiTieu();
            this.loadThucPham();
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongView', this.onCloseHopDongView, this);

            this.bus.subscribe('HopDongChannel', 'onCloseHopDongView', this.onCloseHopDongView, this);
            this.initialPlan();
        },
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
                        console.log(data);
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
                endDate: date.getFullYear() + '-' + month +'-'+ lastDay.getDate()
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
                        obj.doanhThu =tong;
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
        chiTieuChange: function () {
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
        dateChange: function () {
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
        doanhThuChange: function () {
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
            let root = this;
            //root.getView().byId('pgBlockContainer').setBusy(true);
            var oVizFrame = this.getView().byId("iVizFrame");
            oVizFrame.setUiConfig({
                "applicationSet": "fiori"
            });
            oVizFrame.setVizProperties(this._chartPro);

            
            root.loadVatDungChart();
            //root.addSetting();
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
        //onAfterRendering: function () {
        //    const data = this.getView().data('blockData');
        //    if (data.Configs.title)
        //        this.getView().byId('blockTitle').setText(data.Configs.title);
        //    else { this.getView().byId('blockTitle').setText(data.Title); }
        //},
        //mapData: function (data) {
        //    for (var i = 0; i < data.length; i++) {
        //        switch (data[i].TRANGTHAI) {
        //            case 0:
        //                data[i].Title = "Đang hoạt động";
        //                break;
        //            case 1:
        //                data[i].Title = "Đang bảo trì";
        //                break;
        //            case 2:
        //                data[i].Title = "Đã vô hiệu";
        //                break;
        //            default:
        //        }
        //    }
        //    return data;
        //},
        //stateText: function (sts) {
        //    switch (sts) {
        //        case 0:
        //            return "Success";
        //        case 1:
        //            return "Warning";
        //        case 2:
        //            return "Error";
        //        default:
        //    }
        //},
        //initial: function () {
        //    let root = this;
        //    root.getView().byId('pgBlockContainer').setBusy(true);
        //    //Connector.getFromSercureApi({
        //    //    url: appConfig.chungThuSo.apiEndpoint + "v1.0/software/groupbysoftwaretype",
        //    //    oParameters: this._config,
        //    //    fnSuccess: function (data) {
        //    //        root.formatReportData(data.Data);
        //    //    },
        //    //    fnCompleted: function () {
        //    //        root.getView().byId('pgBlockContainer').setBusy(false);
        //    //    }
        //    //});
        //    this.dataModel.setData({
        //        "Data": this.fakeModel
        //    })
        //    //root.addSetting();
        //},
        //addSetting: function () {
        //    let root = this;
        //    const oPopOver = new vizPopover({
        //        actionItems: [{
        //            type: 'action',
        //            text: 'Xem chi tiết theo biểu đồ',
        //            press: function () {
        //                root.navToReportPageFromChart('summary');
        //            }
        //        },
        //        {
        //            type: 'action',
        //            text: 'Xem chi tiết theo danh sách',
        //            press: function () {
        //                root.navToReportPageFromChart('list');
        //            }
        //        }],
        //        customDataControl: function (item) {
        //            if (!item.data.val) return;
        //            const rowIndex = item.data.val.find(i => i.id === "_context_row_number");
        //            const selectedMeasure = item.data.val.filter(i => i.type === "Measure");
        //            if (rowIndex && selectedMeasure) {
        //                const data = root.dataModel.getData();
        //                const dataContext = data.Data[rowIndex.value];
        //                const total = dataContext.TOTAL;
        //                let percen = total == 0 ? 0 : selectedMeasure[0].value / total;
        //                root._selectedObj = { loaiPhanMem: dataContext.LOAIPHANMEMID, trangThaiPM: selectedMeasure[0].id };
        //                return new VBox({
        //                    items: [
        //                        new Label({
        //                            text: dataContext.TENDANHMUC,
        //                            design: 'Bold',
        //                            textAlign: 'Center',
        //                            wrapping: true
        //                        }).addStyleClass('sapUiTinyMarginBottom'),
        //                        new RadialMicroChart({
        //                            alignContent: 'Center',
        //                            size: 'L',
        //                            percentage: percen * 100,
        //                            valueColor: item.data.color
        //                        }).addStyleClass('sapUiSmallMargin'),
        //                        new ObjectStatus({
        //                            title: 'Tổng số',
        //                            text: total + ' phần mềm'
        //                        }).addStyleClass('sapUiTinyMarginBottom'),
        //                        new ObjectStatus({
        //                            title: dataContext.TENDANHMUC,
        //                            text: selectedMeasure[0].value + ' phần mềm ',
        //                            state: "Success"
        //                        }).addStyleClass('sapUiTinyMarginBottom ' + item.data.color.replace("#", "color-"))]
        //                }).addStyleClass('sapUiSmallMargin');
        //            }
        //        }
        //    });
        //    var oVizFrame = this.getView().byId("iVizFrame");
        //    oVizFrame.setUiConfig({
        //        "applicationSet": "fiori"
        //    });
        //    oVizFrame.setVizProperties(this._chartPro);
        //    oPopOver.connect(oVizFrame.getVizUid());
        //},
        //formatReportData: function (data) {
        //    const root = this;
        //    let dt = [...data];
        //    let dataFormat = [
        //        {
        //            Status: 0,
        //            LOAIPHANMEMID: loaiPM.PMThuongMai,
        //            TENDANHMUC: "Phần mềm thương mại",
        //            DHD: 0,
        //            DBT: 0,
        //            DVH: 0,
        //            TOTAL: 0
        //        },
        //        {
        //            Status: 1,
        //            LOAIPHANMEMID: loaiPM.PMNoiBo,
        //            TENDANHMUC: "Phần mềm nội bộ",
        //            DHD: 0,
        //            DBT: 0,
        //            DVH: 0,
        //            TOTAL: 0
        //        },
        //        {
        //            Status: 2,
        //            LOAIPHANMEMID: loaiPM.PMKemThietBi,
        //            TENDANHMUC: "Phần mềm kèm thiết bị",
        //            DHD: 0,
        //            DBT: 0,
        //            DVH: 0,
        //            TOTAL: 0
        //        }
        //    ];
        //    for (let i = 0; i < dataFormat.length; i++) {
        //        for (let j = 0; j < dt.length; j++) {
        //            if (dataFormat[i].LOAIPHANMEMID == dt[j].LOAIPHANMEMID) {
        //                dataFormat[i][root.getSoftwareType(dt[j].TRANGTHAI)] = dt[j].COUNT;
        //            }
        //        }
        //        dataFormat[i].TOTAL = dataFormat[i].DHD + dataFormat[i].DBT + dataFormat[i].DVH
        //    }
        //    this.dataModel.setData({
        //        "Data": dataFormat
        //    })
        //},
        //getSoftwareType: function (type) {
        //    switch (type) {
        //        case 0: return "DHD";
        //        case 1: return "DBT";
        //        case 2: return "DVH";
        //        default: return "";
        //    }
        //},
        //navToReportPageFromChart: function (type) {
        //    if (!savRuntime.reportConfigs["rpc_softwarereport"]) {
        //        savRuntime.reportConfigs["rpc_softwarereport"] = {};
        //    }
        //    const { loaiPhanMem, trangThaiPM } = this._selectedObj;

        //    savRuntime.reportConfigs["rpc_softwarereport"].IdLoaiPM = loaiPhanMem;
        //    savRuntime.reportConfigs["rpc_softwarereport"].trangThaiPM = trangThaiPM;

        //    sap.ui.core.routing.Router.getRouter("globalRouter").navTo('softwarereport', { groupBy: 'TRANGTHAI', viewType: type });
        //},
        //formatTrangThaiPhanMem: function (oVal) {
        //    switch (oVal) {
        //        case 0:
        //            return "Đang hoạt động";
        //        case 1:
        //            return "Đang bảo trì";
        //        case 2:
        //            return "Đã vô hiệu";
        //        default:
        //    }
        //},
        ////formatLoaiPhanMem: function (val) {
        ////    switch (val) {
        ////        case 26:
        ////            return "PM thương mại";
        ////        case 27:
        ////            return "PM nội bộ";
        ////        case 33:
        ////            return "PM kèm thiết bịi";
        ////        default:
        ////    }
        ////},
        onViewChange: function () {
            let vizF = this.getView().byId('iVizFrame');
            let sts = this.getView().byId('segBtn').getSelectedKey();
            if (sts == "stacked")
                vizF.setVizType("stacked_column");
            else
                vizF.setVizType("column");

        }

    };
    return Controller.extend("app.Dashboard.QuickStatisStics", controller);
});