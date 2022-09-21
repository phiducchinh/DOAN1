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
    return Controller.extend('app.HoaDonNhap.List', {
        globalFormatter: GlobalFormatter,
        saveObject: {},
        mainModel: new CoreJsonModel(),
        countModel: new CoreJsonModel(),
        donCoModel: new CoreJsonModel(),
        mainId: null,
        hoaDonModel: new CoreJsonModel(),
        data: [
            {
                name: 'Pn1',
                ngayNhap: '22/12/2021',
                Pn1: [
                    {
                        name: 'Lần 1',
                        ngayNhap: '22/12/2021',
                        1: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                            {
                                ttp: 'Bò',
                                soLuong: 9,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            }
                        ],
                        2: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                        ]
                    },
                    {
                        name: 'Lần 2',
                        ngayTao: '24/12/2021',
                        2: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                        ]
                    }
                ]
            },
            {
                name: 'Pn2',
                ngayNhap: '27/12/2021',
                data: [
                    {
                        ngayNhap: '27/12/2021',
                        name: 'Lần 1',
                        ngayTao: '22/12/2021',
                        data: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                ngayNhap: '27/12/2021',
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                            {
                                ngayNhap: '27/12/2021',
                                ttp: 'Bò',
                                soLuong: 9,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            }
                        ]
                    },
                    {
                        name: 'Lần 2',
                        ngayTao: '24/12/2021',
                        data: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                        ]
                    },
                    {
                        name: 'Lần 3',
                        ngayTao: '22/12/2021',
                        data: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            },
                            {
                                ttp: 'Bò',
                                soLuong: 9,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Pn3',
                ngayNhap: '27/12/2021',
                data: [
                    {
                        name: 'Lần 1',
                        ngayNhap: '27/12/2021',
                        ngayTao: '22/12/2021',
                        data: [
                            {
                                ttp: 'Cá',
                                soLuong: 10,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                nhaCungCap: 'a',
                                ngayNhap: '27/12/2021',
                            },
                            {
                                ttp: 'Bò',
                                soLuong: 9,
                                donVi: 'Kg',
                                hanSuDung: '30/12/2021',
                                ngayNhap: '27/12/2021',
                                nhaCungCap: 'a',
                            }
                        ]
                    },
                ]
            },
        ],
        x: [
            {
                "maPhieu": "PNTP9",
                "ngayNhap": "2022-08-19T01:49:54.7817926",
                "ghiChu": null,
                "data": [
                    {
                        "maPhieu": "Lần1",
                        "ngayNhap": "2022-08-19T01:49:54.7817926",
                        "data": [
                            {
                                "thucPham": "Gạo",
                                "maThucPham": "tp03",
                                "soLuong": 6.6,
                                "nhaCungCap": "b",
                                "donvi": "kg",
                                "hanSuDung": "2022-10-18T00:00:00"
                            },
                            {
                                "thucPham": "Thịt gà",
                                "maThucPham": "tp01",
                                "soLuong": 6,
                                "nhaCungCap": "c",
                                "donvi": "con",
                                "hanSuDung": "2022-08-21T00:00:00"
                            },
                            {
                                "thucPham": "Bột mì",
                                "maThucPham": "tp231",
                                "soLuong": 4.2,
                                "nhaCungCap": "d",
                                "donvi": "kg",
                                "hanSuDung": "2022-08-22T00:00:00"
                            }
                        ]
                    },
                    {
                        "maPhieu": "Lần2",
                        "ngayNhap": "2022-08-19T01:49:54.7817926",
                        "data": [
                            {
                                "thucPham": "Gạo",
                                "maThucPham": "tp03",
                                "soLuong": 2,
                                "nhaCungCap": "d",
                                "donvi": "kg",
                                "hanSuDung": "2022-08-22T00:00:00"
                            }
                        ]
                    },
                    {
                        "maPhieu": "Lần3",
                        "ngayNhap": "2022-08-19T01:49:54.7817926",
                        "data": [
                            {
                                "thucPham": "Gạo",
                                "maThucPham": "tp03",
                                "soLuong": 1.9,
                                "nhaCungCap": "e",
                                "donvi": "kg",
                                "hanSuDung": "2022-08-23T00:00:00"
                            },
                            {
                                "thucPham": "Thịt gà",
                                "maThucPham": "tp01",
                                "soLuong": 4.5,
                                "nhaCungCap": "f",
                                "donvi": "con",
                                "hanSuDung": "2022-08-24T00:00:00"
                            }
                        ]
                    }
                ]
            }
        ],
        onInit: function () {
            this.bus = Core.getEventBus();
            this.mainTable = this.getView().byId('mainTable');
            this.getView().setModel(this.mainModel, "mainModel");
            this.getView().setModel(this.donCoModel, "donCoModel");
            this.getView().setModel(this.vanChuyenModel, "hoaDonModel");
            this.loadData()
            this.bus.subscribe('HoaDonNhapChannel', 'switchToDetailPage', this.switchToDetailPage, this);
            this.bus.subscribe('HoaDonNhapChannel', 'onCloseHoaDonNhapView', this.onCloseHoaDonNhapView, this);
            this.bus.subscribe('HoaDonNhapChannel', 'closeHoaDonNhapAdd', this.closephieuNhapDialog, this);
            //this.bus.subscribe('HoaDonNhapChannel', 'onCloseHoaDonNhapEdit', this.onCloseHoaDonNhapEdit, this);
            //this.bus.subscribe('HoaDonNhapChannel', 'onCloseVanChuyenAdd', this.onCloseVanChuyenAdd, this);
            this.bus.subscribe('HoaDonNhapChannel', 'reLoadData', this.reLoadData, this);
            this.bus.subscribe('HoaDonNhapChannel.Detail', 'reLoadData', this.reLoadData, this);
            //this.mainModel.setData(this.x);
        },

        loadData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonNhap', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        //console.log(dataResult);
                        let dataResult = root.formatDataPN(data);
                        setTimeout(() => {
                            root.mainModel.setData(dataResult);

                        }, 500)
                    }
                }
            });
        },
        flatToHierarchy: function (data, idKey, parentKey, childrenKey, extProperties) {
            const tree = [];
            const childrenOf = {};
            data.forEach((item) => {
                const { [idKey]: id, [parentKey]: parentId = 0 } = item;
                childrenOf[id] = childrenOf[id] || [];
                item[childrenKey] = childrenOf[id];
                (parentId && parentId != 0) ? (childrenOf[parentId] = childrenOf[parentId] || []).push(item) : tree.push(item);
            });
            return tree;
        },
        groupBy : function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        },

        formatDataPN: function (PN) {
            const root = this;
           
            let datas = [];
            PN.forEach(item => {
                let giaTienTong = 0;
                let h = {
                    maPhieu: item.maHoaDon,
                    ngayNhap: item.ngayTao,
                    ghiChu: item.ghiChu,
                    giaTien: giaTienTong,
                    nguonGoc: item.nguonGoc,
                    items: [],
                }
                datas.push(h);

                Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/phieunhap/' + item.id, {
                    fnProcessData: function (datax) {
                        if (datax && datax.length > 0) {
                            let x = root.groupBy(datax, 'lan');
                            for (let value in x) {
                                let giaTienLan = 0;
                                let a = {
                                    maPhieu: 'Lần ' + value,
                                    ngayNhap: x[value][0].hoaDonhNhap.ngayTao,
                                    items: []
                                };
                                x[value].forEach(value => {
                                    giaTienLan += value.giaTien;
                                    let b = {
                                        thucPham: value.thucPham.tenThucPham,
                                        maThucPham: value.thucPham.maThucPham,
                                        soLuong: value.soLuong,
                                        nhaCungCap: value.ncc,
                                        donVi: value.thucPham.donVi,
                                        giaTien: value.giaTien,
                                        hanSuDung: value.hanSuDung
                                    }
                                    a.items.push(b);
                                });
                                a.giaTien = giaTienLan;
                                giaTienTong += giaTienLan;
                                h.items.push(a);
                            }
                            h.giaTien = giaTienTong;

                        }
                    }
                });

            });
            return datas;
            
        },

        onRefresh: function () {
            this.reLoadData();
            MessageToast.show('Tải lại dữ liệu thành công!', { width: '30em', duration: 5000 });
        },
        reLoadData: function () {
            this.loadData();
            this.getView().byId('searchField').setValue('');
        },
        
        searchFilter: function () {
            const root = this;
            let title = this.getView().byId("searchField").getValue();

            if (title) {
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'HoaDonNhap/filter/' + title, {
                    fnProcessData: function (data) {
                        let dataResult;
                        if (data && data.length > 0) {
                            //for (var i = 0; i < data.length; i++) {
                            //    data[i]['STT'] = i + 1;
                            //}
                            dataResult = root.formatDataPN(data);
                            setTimeout(() => {
                                root.mainModel.setData(dataResult);

                            }, 500)
                        }
                        root.mainModel.setData(dataResult);
                    }
                });
            }
            
        },
        onLiveChange: function () {
            let title = this.getView().byId("searchField").getValue();
            //  this.filter.title = title;
            if (title != null || title != '') {
                this.searchFilter();
            }
            if (title == '') {
                this.loadData();
            }
        },
        onSearch: function (oEvent) {
            const params = oEvent.getParameters();
            const isReset = params.clearButtonPressed;
            if (isReset) {
                //this.filter.title = "";
                this.searchFilter();
            }
            else
                this.searchFilter();
        },
        onStatusFilterChange: function () {
            this.searchFilter();
        },

        //#region Detail
        onCellClick: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected)
                this.bus.publish('HoaDonNhapChannel', 'switchToDetailPage', { Id: selected.id });
        },
        onRowView: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.bus.publish('HoaDonNhapChannel', 'switchToDetailPage', { Id: selected.id });
        },
        switchToDetailPage: function (oChannel, oEvent, oData) {
            const root = this;
            if (!this._HoaDonNhapDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonNhap.Detail",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HoaDonNhapDetail = frag;
                    root._HoaDonNhapDetail.open();
                    root.bus.publish('HoaDonNhapChannel', 'loadDetailPage', { Id: oData.Id });
                });
            }
            else {
                root._HoaDonNhapDetail.open();
                root.bus.publish('HoaDonNhapChannel', 'loadDetailPage', { Id: oData.Id, title: oData.title });
            }
        },
        onCloseHoaDonNhapView: function () {
            this._HoaDonNhapDetail.close();
        },

        //#endregion

        //#region Add
        onAddButtonPress: async function () {
            let root = this;
            let oView = this.getView();
            if (!this._HopDongAdd) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HoaDonNhap.Add',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._HopDongAdd = oDialog;
                    //oView.addDependent(oDialog);
                    root._HopDongAdd.open();
                });
            } else {
                root._HopDongAdd.open();
                //root.loadDonCo();
            }

        },
        closephieuNhapDialog: function () {
            this._HopDongAdd.close();
        },
        onPressItems: function () {
            const indices = this.getView().byId('donCoList').getSelectedIndices();
            const dataTable = this.getView().byId('donCoList').getBinding('rows').getModel().getData();
            const listId = [];
            let oView = this.getView();
            const root = this;  
            if (indices.length > 0) {
                for (let i = 0; i < indices.length; i++) {
                    listId.push(dataTable[indices[i]].id);
                }
            }

            if (listId.length > 0) {
                if (!this._HoaDonNhapAdd) {
                    Fragment.load({
                        id: oView.getId(),
                        name: 'app.HoaDonNhap.Add',
                        controller: this,
                        type: 'XML'
                    }).then(function (oDialog) {
                        root._HoaDonNhapAdd = oDialog;
                        //oView.addDependent(oDialog);
                        root._HoaDonNhapAdd.open();
                        root.bus.publish('HoaDonNhapChannel', 'loadAddpage', { ListId: listId });

                    });
                } else {
                    root.bus.publish('HoaDonNhapChannel', 'loadAddpage', { ListId: listId });
                    root._HoaDonNhapAdd.open();
                    
                }
                this.closeDonCoputDialog();
            }
        },
        closeHoaDonNhapAdd() {
            console.log(    32);
            if (this._HoaDonNhapAdd)
                this._HoaDonNhapAdd.close();
        },
        loadDonCo: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'HopDong/checkTD', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        root.donCoModel.setData(data);
                    }
                }
            });
        },

        //#endregion

        //#region Delete
        onRowDelete: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            MessageBox.show('Bạn muốn xóa ' + selected.tenHoaDonNhap, {
                icon: MessageBox.Icon.WARNING,
                title: 'Xác nhận',
                actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == MessageBox.Action.DELETE) {
                        Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HoaDonNhap/' + selected.id, {
                            fnSuccess: function (data) {
                                root.reLoadData();
                                MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                            }
                        });
                    }
                }
            });

        },
        deleteItems: function (oEvent) {
            const root = this;
            const indices = this.mainTable.getSelectedIndices();
            const dataTable = this.mainTable.getBinding('rows').getModel().getData();
            const listId = [];
            if (indices.length > 0) {
                for (let i = 0; i < indices.length; i++) {
                    listId.push(dataTable[indices[i]].id);
                }
                MessageBox.show('Xóa tất cả các mục được chọn?', {
                    icon: MessageBox.Icon.WARNING,
                    title: 'Xác nhận',
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction == MessageBox.Action.DELETE) {
                            Connector.deleteToApi(sdConfig.adminApiEndpoint + 'HoaDonNhap/list', {
                                oParameters: listId,
                                fnSuccess: function (data) {
                                    root.reLoadData();
                                    MessageToast.show("Xóa thành công!", { width: '25em', duration: 5000 });
                                }
                            });
                        }
                    }
                });
            }
            else {
                MessageToast.show('Phải chọn ít nhất một mục!', { width: '30em', duration: 5000 });
            }
        },
        //#endregion

        //#region Edit
        onRowEdit: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));
            const root = this;
            if (!this._HoaDonNhapEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonNhap.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._HoaDonNhapEdit = frag;
                    root._HoaDonNhapEdit.open();
                    root.bus.publish('HoaDonNhapChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHoaDonNhap });
                });
            }
            else {
                root._HoaDonNhapEdit.open();
                root.bus.publish('HoaDonNhapChannel', 'loadEditPage', { Id: selected.id, title: selected.tenHoaDonNhap });
            }
        },
        onCloseHoaDonNhapEdit: function () {
            if (this._HoaDonNhapEdit)
                this._HoaDonNhapEdit.close();
        },
        //#endregion

        onAddVanChuyen: function (oEvent) {
            const root = this;
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('row').getBindingContext('mainModel'));

            if (!this._vanChuyenAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.HoaDonNhap.fragment.VanChuyen",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._vanChuyenAdd = frag;
                    root._vanChuyenAdd.open();
                    root.bus.publish('HoaDonNhapChannel', 'VanChuyenLoad', { Id: selected.id,});
                });
            }
            else {
                root.bus.publish('HoaDonNhapChannel', 'VanChuyenLoad', { Id: selected.id,});
                root._vanChuyenAdd.open();
            }

           
        },
        onCloseVanChuyenAdd: function () {
            if (this._vanChuyenAdd)
                this._vanChuyenAdd.close();
        },
        
        onExit: function () {
            //this.bus.unsubscribe('DeviceChannel', 'loadEditPage', this.loadEditPage, this);
        }
    });
});