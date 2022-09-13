
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'app/ext/CoreJsonModel',
], function (Controller, CoreJsonModel) {
    "use strict";
    const controller = {
        componentTypeReportModel: new CoreJsonModel(),
        componentModel: new CoreJsonModel(),
        dataModel: new CoreJsonModel(),
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
            //this.bus = Core.getEventBus();
            this.getView().setModel(this.dataModel, "dataModel");
            this.initial();
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