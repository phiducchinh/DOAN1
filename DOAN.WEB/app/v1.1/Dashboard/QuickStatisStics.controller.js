
sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'app/ext/CoreJsonModel',
    'app/ext/Auth.Connector.Adal',
    'sap/m/MessageBox',

], function (Core,Fragment,Controller, CoreJsonModel, Connector, MessageBox) {
    "use strict";
    const controller = {
        componentTypeReportModel: new CoreJsonModel(),
        componentModel: new CoreJsonModel(),
		dataModel: new CoreJsonModel(),
		planningModel: new CoreJsonModel(),
        _chartPro: {
            title: {
                visible: false
            },
            valueAxisScale: "AutoScale",
            plotArea: {
                colorPalette: ['#80b918', '#ffca3a'],
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
			this.getView().setModel(this.planningModel,"planningModel");
            this.initial();
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongView', this.onCloseHopDongView, this);

    //        console.log({
				//startDate: new Date("2017", "0", "15", "8", "0"),
				//people: [{
				//	pic: "test-resources/sap/ui/documentation/sdk/images/John_Miller.png",
				//	name: "John Miller",
				//	role: "team member",
				//	appointments: [
				//		{
				//			start: new Date("2017", "0", "8", "08", "30"),
				//			end: new Date("2017", "0", "8", "09", "30"),
				//			title: "Meet Max Mustermann",
				//			type: "Type02",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "11", "10", "0"),
				//			end: new Date("2017", "0", "11", "12", "0"),
				//			title: "Team meeting",
				//			info: "room 1",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "12", "11", "30"),
				//			end: new Date("2017", "0", "12", "13", "30"),
				//			title: "Lunch",
				//			info: "canteen",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "15", "08", "30"),
				//			end: new Date("2017", "0", "15", "09", "30"),
				//			title: "Meet Max Mustermann",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "15", "10", "0"),
				//			end: new Date("2017", "0", "15", "12", "0"),
				//			title: "Team meeting",
				//			info: "room 1",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "15", "11", "30"),
				//			end: new Date("2017", "0", "15", "13", "30"),
				//			title: "Lunch",
				//			info: "canteen",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "15", "13", "30"),
				//			end: new Date("2017", "0", "15", "17", "30"),
				//			title: "Discussion with clients",
				//			info: "online meeting",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "16", "04", "00"),
				//			end: new Date("2017", "0", "16", "22", "30"),
				//			title: "Discussion of the plan",
				//			info: "Online meeting",
				//			type: "Type04",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "18", "08", "30"),
				//			end: new Date("2017", "0", "18", "09", "30"),
				//			title: "Meeting with the manager",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "18", "11", "30"),
				//			end: new Date("2017", "0", "18", "13", "30"),
				//			title: "Lunch",
				//			info: "canteen",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "18", "1", "0"),
				//			end: new Date("2017", "0", "18", "22", "0"),
				//			title: "Team meeting",
				//			info: "regular",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "21", "00", "30"),
				//			end: new Date("2017", "0", "21", "23", "30"),
				//			title: "New Product",
				//			info: "room 105",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "25", "11", "30"),
				//			end: new Date("2017", "0", "25", "13", "30"),
				//			title: "Lunch",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "29", "10", "0"),
				//			end: new Date("2017", "0", "29", "12", "0"),
				//			title: "Team meeting",
				//			info: "room 1",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "30", "08", "30"),
				//			end: new Date("2017", "0", "30", "09", "30"),
				//			title: "Meet Max Mustermann",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "30", "10", "0"),
				//			end: new Date("2017", "0", "30", "12", "0"),
				//			title: "Team meeting",
				//			info: "room 1",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "30", "11", "30"),
				//			end: new Date("2017", "0", "30", "13", "30"),
				//			title: "Lunch",
				//			type: "Type03",
				//			tentative: true
				//		},
				//		{
				//			start: new Date("2017", "0", "30", "13", "30"),
				//			end: new Date("2017", "0", "30", "17", "30"),
				//			title: "Discussion with clients",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "0", "31", "10", "00"),
				//			end: new Date("2017", "0", "31", "11", "30"),
				//			title: "Discussion of the plan",
				//			info: "Online meeting",
				//			type: "Type04",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "1", "3", "08", "30"),
				//			end: new Date("2017", "1", "13", "09", "30"),
				//			title: "Meeting with the manager",
				//			type: "Type02",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "1", "4", "10", "0"),
				//			end: new Date("2017", "1", "4", "12", "0"),
				//			title: "Team meeting",
				//			info: "room 1",
				//			type: "Type01",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: false
				//		},
				//		{
				//			start: new Date("2017", "2", "30", "10", "0"),
				//			end: new Date("2017", "4", "33", "12", "0"),
				//			title: "Working out of the building",
				//			type: "Type07",
				//			pic: "sap-icon://sap-ui5",
				//			tentative: true
				//		}
				//	],
				//}]
            this.bus.subscribe('HopDongChannel', 'onCloseHopDongView', this.onCloseHopDongView, this);
    //        });
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
            let obj= {
                name: "Đơn cỗ",
                appointments: [
                    //{
                    //    start: new Date("2022", "8", "20", "10", "30"),
                    //    end: new Date("2022", "8", "20", "17", "30"),
                    //    title: "Đơn cỗ A",
                    //    info: "Anh Bình",
                    //    type: "Type02",
                    //    tentative: true
                    //},
                    //{
                    //    start: new Date("2022", "8", "21", "8", "0"),
                    //    end: new Date("2022", "8", "21", "19", "0"),
                    //    title: "Đơn cỗ 4",
                    //    info: "Bác Lan",
                    //    type: "Type01",
                    //    tentative: false
                    //},
                    //{
                    //    start: new Date("2022", "8", "21", "10", "0"),
                    //    end: new Date("2022", "8", "22", "10", "0"),
                    //    title: "Đơn cỗ 4",
                    //    info: "Bác Lan",
                    //    type: "Type04",
                    //    tentative: false
                    //}
                    
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
                                start: new Date(moment(item.ngayBatDau).format('yyyy'), moment(item.ngayBatDau).format('MM')-1, moment(item.ngayBatDau).format('DD'), moment(item.ngayBatDau).format('HH'), moment(item.ngayBatDau).format('mm')),
                                end: new Date(moment(item.ngayKetThuc).format('yyyy'), moment(item.ngayKetThuc).format('MM')-1, moment(item.ngayKetThuc).format('DD'), moment(item.ngayKetThuc).format('HH'), moment(item.ngayKetThuc).format('mm')),
                                title: item.tenHopDong,
                                info: item.tenKhachHang,
                                type: "Type01",
                                tentative: false
                            })
                        })
                    }
                    setTimeout(function () {
                        root.planningModel.setData(dataPlan)
                    },200)
                }
            });
        },
        initial: function () {
            let root = this;
            //root.getView().byId('pgBlockContainer').setBusy(true);
            var oVizFrame = this.getView().byId("iVizFrame");
            oVizFrame.setUiConfig({
                "applicationSet": "fiori"
            });
            oVizFrame.setVizProperties(this._chartPro);

            this.dataModel.setData({
                "Data": this.fakeModel
            })
            //root.addSetting();
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
                                type: "Type01",
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