sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'app/globalformatter',
    'sap/ui/core/Fragment',
    'sap/ui/export/Spreadsheet',
    'sap/ui/Device',

    "sap/ui/table/Row",
    "sap/ui/core/Item"
], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, TableRow, Item) {
    'use strict';
    const GROUP_NAME = "addGroup";
    const GROUP_NAME_STEP_ONE = "addGroupStepOne";
    const oController = {
        //globalFormatter: GlobalFormatter,
        globalFormatter: GlobalFormatter,
        //orgHang: {
        //    idhang: null,
        //    tenhang: '',
        //    mota: '',
        //    donvi: '',
        //    soluong: 0,
        //},
        //tableModel: new CoreJsonModel([{ soluong: 0 }]),
        tableModel: new CoreJsonModel(),
        hangModel: new CoreJsonModel(),
        mainModel: new CoreJsonModel(),
        phieuMuaModel: new CoreJsonModel(),
        thucPhamModel: new CoreJsonModel(),
        nccModel: new CoreJsonModel(),
        selectedId: {},
        tableData: [],
        //phieuNhap: [{isEdit:true}],
        phieuNhap: [{ isEdit: true }],
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            //sap.ui.core.UIComponent.getRouterFor(this).getRoute("dongmua-add").attachMatched(this._onObjectMatched, this);   
            this.getView().setModel(this.tableModel, 'tableModel');
            this.getView().setModel(this.hangModel, 'hangModel');
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.thucPhamModel, 'thucPhamModel');
            this.getView().setModel(this.phieuMuaModel, 'phieuMuaModel');
            //this.getView().setModel(this.nccModel);
            //this.tableModel.setData(this.phieuNhap);
            //this.initialize();
        },
        initialize: function () {
            this.loadDataHang();
            //this.loadDataNCC();
            //this.getView().byId('maPhieu').setValue(this.Base.randID());
            this.getView().byId('ngayNhap').setValue(moment().format('DD/MM/YYYY'));
            this.getView().byId('idhang').setFilterFunction(function (sTerm, oItem) {
                return oItem.getText().match(new RegExp(sTerm, "i"));
            });
            this.getView().byId('idhang').setSuggestionRowValidator(this.suggestionRowValidator);
        },

        loadPhieuMuaFragment: function () {
            let root = this;
            let oView = this.getView();
            if (!this._vanChuyenFrag) {
                Fragment.load({
                    id: oView.getId(),
                    name: 'app.HoaDonNhap.fragment.PhieuMua',
                    controller: this,
                    type: 'XML'
                }).then(function (oDialog) {
                    root._vanChuyenFrag = oDialog;
                    oView.addDependent(oDialog);
                    root.getPhieumuaData();
                    root._vanChuyenFrag.open();
                });
            } else {
                root._vanChuyenFrag.open();
                root.getPhieumuaData();
            }
        },

        getPhieumuaData: function () {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'hoadonmua/check', {
                fnProcessData: function (data) {
                    root.phieuMuaModel.setData(data);
                }
            });
        },
        onphieuMuaPress: function (oEvent) {
            let oRowContext = oEvent.getParameters().listItem.getBindingContext('phieuMuaModel');
            let rowPath = oRowContext.getPath();
            let rowObject = oRowContext.getObject(rowPath);
            this.idPhieuMua = rowObject.id;
            this.getView().byId('maPhieuMua').setValue(rowObject.maHoaDon);
            this.getView().byId('idPN').setValue('PNTP' + rowObject.id);
            this.loadChitietPhieuNhap(rowObject.id);
            this.getView().byId('ngayNhap').setValue(moment().format('DD/MM/YYYY'));
            this.closephieumuaDialog();
        },

        loadChitietPhieuNhap: function (id) {
            const root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieumua/phieuMua/' + id, {
                fnProcessData: function (dataPM) {
                    if (dataPM && dataPM.length>0) {
                        Connector.getFromApi(sdConfig.adminApiEndpoint + 'chitietphieunhap/phieuMua/' + id, {
                            fnProcessData: function (dataPN) {
                                if (dataPN && dataPN.length>0) {
                                    root.formatTwoData(dataPM, dataPN);
                                } else {
                                    root.formatTwoData(dataPM, null);
                                }
                            }
                        });
                    }
                }
            });
        },
        slNhapChange: function (evt) {
            let ctrol = evt.getSource();
            let slNhap = evt.getParameter('newValue');
            let object = evt.getSource().oParent.getRowBindingContext("tableModel").getObject();
            let { soLuongPM, soLuongDaNhap } = object;
            if (!slNhap) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường thông tin này bắt buộc!');
                this.isState = false;
            } else {
                if (typeof slNhap !== 'number' && isNaN(slNhap)) {
                    ctrol.setValueState('Error');
                    ctrol.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isState = false;
                } else {
                    if (soLuongDaNhap + Number(slNhap) > soLuongPM) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhiều hơn số lượng mua!");
                        this.isState = false;
                    } else if (soLuongDaNhap + slNhap < 0 || slNhap < 0) {
                        ctrol.setValueState("Error");
                        ctrol.setValueStateText("Số lượng nhập không được nhỏ hơn 0!");
                        this.isState = false;
                    }
                    else {
                        ctrol.setValueState("None");
                        this.isState = true;
                    }
                }
            }
        },
        giaTienChange: function (evt) {
            let ctrol = evt.getSource();
            let slNhap = evt.getParameter('newValue');
            
            if (!slNhap) {
                ctrol.setValueState('Error');
                ctrol.setValueStateText('Trường thông tin này bắt buộc!');
                this.isState = false;
            } else {
                if (typeof slNhap !== 'number' && isNaN(slNhap)) {
                    ctrol.setValueState('Error');
                    ctrol.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isState = false;
                } else {
                    ctrol.setValueState("None");
                    this.isState = true;
                }
            }
        },
        HSDChange: function (evt) {
            let ctrol = evt.getSource();
            let slNhap = evt.getParameter('newValue');
            if (!slNhap) {
            } else {
                if (typeof slNhap !== 'number' && isNaN(slNhap)) {
                    ctrol.setValueState('Error');
                    ctrol.setValueStateText('Trường thông tin này phải nhập số!');
                    this.isState = false;
                } else {
                    ctrol.setValueState("None");
                    this.isState = true;
                }
            }
        },
        formatTwoData: function (PM, PN) {
            if (PN == null) {
                PM.forEach(item => {
                    item.soLuongPM = item.soLuong;
                    item.soLuongDaNhap = 0;
                    item.soLuongNhap = 0;
                    item.giaTien = 0;
                });
                this.tableModel.setData(PM);
            } else {
                let newArr = [];
                let arrCheck = [];
                PM.forEach(item => {
                    if (!arrCheck.includes(item.idThucPham)) {
                        newArr.push(item);
                        let tong = 0;
                        for (var i = 0; i < PN.length; i++) {
                            if (item.idThucPham == PN[i].idThucPham) {
                                tong += PN[i].soLuong;
                            }
                            item.soLuongDaNhap = tong;
                        }
                        arrCheck.push(item.idThucPham);
                    }
                });
                
                let arrHT = [];
                let arrCHT = [];
                newArr.forEach((x,index) => {
                    PM.forEach(y => {
                        if (x.idThucPham == y.idThucPham) {
                            x.soLuongPM = y.soLuong;
                            x.hanSuDung = null;
                            x.isEdit = true;
                            if (x.soLuongDaNhap == x.soLuongPM) {
                                x.isEdit = false;
                                arrHT.push(x);
                            }
                            else {
                                arrCHT.push(x);
                                x.giaTien = 0;
                                x.soLuongNhap=0
                            }
                        }
                    });
                });
                let lastArr = [...arrHT, ...arrCHT]
                this.tableModel.setData(lastArr);
            }
        },
        closephieumuaDialog: function () {
            if (this.getView().byId('phieuMuaList'))
                this.getView().byId('phieuMuaList').removeSelections();
            this._vanChuyenFrag.close();
        },

        _onObjectMatched: function (e, f) {
            this.clearForm();
        },
        suggestionRowValidator: function (oColumnListItem) {
            var aCells = oColumnListItem.getCells();
            return new Item({
                key: aCells[1].getText(),
                text: aCells[0].getText()
            });
        },
        clearForm: function () {
            //this.Base.resetDataFromGroup(GROUP_NAME);
            //this.Base.resetDataFromGroup(GROUP_NAME_STEP_ONE);
            //this.getView().byId('maPhieu').setValue(this.Base.randID());
            this.tableData = [];
            this.tableModel.setData({});
            this.mainModel.setData({});
        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('HoaDonNhapChannel', "closeHoaDonNhapAdd")
        },
        save: function () {
            const root = this;
            let input, isValidd = true;
            input = this.getView().byId('ngayNhap');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValidd = false;
            } else {
                input.setValueState('None');
            }
            input = this.getView().byId('maPhieuMua');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isValidd = false;
            } else {
                input.setValueState('None');
            }

            let datax = root.tableModel.getData();
            let isCheck = true;
            datax.forEach(item => {
                if (item.soLuongNhap == 0 || !item.soLuongNhap && item.isEdit == true) {
                    item.cSoLuong = 'Error';
                    isCheck = false;
                }
                if (item.giaTien == 0 || !item.giaTien && item.isEdit == true) {
                    item.cGiaTien = 'Error';
                    isCheck = false;
                }

                if (item.hanSuDung == 0 || !item.hanSuDung && item.isEdit==true) {
                    item.cHanSuDung = 'Error';
                    isCheck = false;
                }
            })


            this.tableModel.refresh();
            if (isCheck) {
                if (isValidd) {
                    if (this.isState) {
                        let mainData = this.mainModel.getData();
                        mainData.ngayTao = mainData.ngayTao == moment().format('DD/MM/YYYY') ? moment().format('YYYY-MM-DD') : mainData.ngayTao;
                        Connector.postToApi(sdConfig.adminApiEndpoint + 'HoaDonNhap', {
                            oParameters: {
                                maHoaDon: mainData.maHoaDon,
                                idPhieuMua: root.idPhieuMua,
                                ghiChu: mainData.ghiChu,
                                ngayTao: mainData.ngayTao,
                            },
                            fnSuccess: function (data) {
                                console.log(data);
                                let arr = [];
                                datax.forEach(item => {
                                    if (item.soLuongDaNhap != item.soLuongPM && item.soLuongNhap != 0 && item.soLuongNhap != '0') {
                                        arr.push({
                                            idHoaDon: data.id,
                                            idThucPham: item.idThucPham,
                                            soLuong: Number(item.soLuongNhap),
                                            hanSuDung: item.hanSuDung ? moment(mainData.ngayTao, "YYYY-MM-DD").add(Number(item.hanSuDung) || 3, "d").format("YYYY-MM-DD") : null,
                                            giaTien: Number(item.giaTien),
                                            lan: item.lan || 0,
                                            NCC: item.nhaCungCap
                                        });
                                    }
                                });
                                Connector.postToApi(sdConfig.adminApiEndpoint + 'ChiTietPhieuNhap', {
                                    oParameters: arr,
                                    fnSuccess: function (dataa) {
                                        MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                                        root.closeArea();
                                        root.bus.publish('HoaDonNhapChannel', 'reLoadData');
                                    }
                                });
                            }
                        });
                    }
                }
            }
            
        },
        loadDataHang: async function () {
            let root = this;
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
        loadDataNCC: async function () {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    root.nccModel.setData({
                        NhaCungCap: {
                            ...dt.data
                        }
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        handleValueHelpNCC: function () {
            var oView = this.getView();
            if (!this._pValueHelpDialogDonDat) {
                this._pValueHelpDialogDonDat = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.NhaCungCap",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialogDonDat.then(function (oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        handleValueHelpHang: function (oEvent) {
            var oView = this.getView();
            if (!this._pValueHelpDialogHang) {
                this._pValueHelpDialogHang = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.Hang",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialogHang.then(function (oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        handleSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter('id', FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        showSelectDonMua: function (oEvent) {
            var oView = this.getView();
            if (!this._pValueHelpDialogDonMua) {
                this._pValueHelpDialogDonMua = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.DonMua",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
                this._pValueHelpDialogDonMua.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            } else {
                this._pValueHelpDialogDonMua.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            }
        },
        handleClose: function (oEvent) {
            let root = this;
            let idElement = (oEvent.getSource().sId).split('-').pop();;
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                let itemSelected = aContexts.map(function (oContext) {
                    return oContext.getObject()
                });
                switch (idElement) {
                    case "dialogNCC":
                        this.byId('idncc').setValue(itemSelected[0].tenncc);
                        this.selectedId.idncc = itemSelected[0].id;
                        break;
                    case "hangDialog":
                        root.getView().byId('tenhang').setValue(itemSelected[0].tenhang);
                        this.selectedId.idhang = itemSelected[0].id;
                        break;
                    case "khoDialog":
                        root.getView().byId('maKho').setValue(itemSelected[0].tenkho);
                        this.selectedId.idkho = itemSelected[0].id;
                        break;
                    case "donMuaDialog":
                        root.getView().byId('maDonMua').setValue(itemSelected[0].id);
                        this.selectedId.iddonmua = itemSelected[0].id;

                        break;
                    default:
                        break;
                }
            }
        },
        //! END-LOAD INITTIAL DATA
        onSelected: function (evt) {
            if (evt.getParameter("selectedRow")) {
                let object = evt.getParameter("selectedRow").getBindingContext("thucPhamModel").getObject();
                //object.soluong = 0; 
                let { id, tenThucPham, maThucPham } = object;
                let isCheck = this.phieuNhap.some(x => x.id == id);
                if (isCheck) {
                    MessageToast.show('Đơn hàng này đã được thêm vào phiếu\n Vui lòng chọn đơn hàng khác.');
                    return;
                }
                //let index = evt.getSource().data('inputIndex');

                let dCount = this.phieuNhap.length;
                let obj = Object.assign({ index: dCount }, object)
                this.phieuNhap[dCount - 1] = Object.assign({ isEdit: false }, obj);
                this.phieuNhap.push({ isEdit: true });

                setTimeout(() => {
                    let domEl = document.querySelector(`[data-inputindex='i']`);
                    console.log(domEl);
                    domEl.firstChild.firstChild.focus();
                }, 0);
                //let domEl = document.querySelector(`[data-inputindex='i${dCount + 1}']`);

                //setTimeout(() => {
                //    let domEl = document.querySelector(`[data-inputindex='i${dCount+1}']`);
                //    domEl.firstChild.firstChild.focus();

                //}, 200);

                //setTimeout(() => {
                //    let domEl = document.querySelector(`[data-inputindex='i${dCount}']`);
                //    domEl.firstChild.firstChild.focus();
                //}, 0);
            }

        },
        soLuongChange: function (evt) {
            let object = evt.getSource().oParent.getRowBindingContext("hangModel").getObject();
            let { soluong, soluongnhap } = object;
            if (Number(soluong) > Number(soluongnhap) || Number(soluong) < 0) {
                MessageBox.error('Số lượng nhập không hợp lệ')
            }
        },
        onAfterRendering: function () {
            this.addEventForInputSoLuong();
            this.addEventForInputHanSuDung();
        },
        addEventForInputSoLuong: function () {
            let dCount = this.tableData.length;
            //dCount += dCount;

            let giahapEl = document.querySelectorAll('.gianhap');
            giahapEl.forEach(el => {
                el.addEventListener('keypress', evt => {
                    if (evt.keyCode === 13) {
                        setTimeout(() => {
                            let domEl = document.querySelectorAll('.hansudung');
                            console.log(domEl);
                            //domEl[dCount - 1].firstChild.focus();
                        }, 300);

                        //let parentEl = evt.target.parentElement.parentElement.offsetParent.offsetParent;
                        //let nextEl = parentEl.nextSibling;
                        //let inputEl = nextEl.getElementsByTagName('input');
                        //console.log(inputEl);
                        //inputEl[inputEl.length - 1].focus();
                    }
                })
            });



        },
        addEventForInputHanSuDung: function () {
            let dCount = this.tableData.length;
            dCount += dCount;
            let hanSuDungEl = document.querySelectorAll('.hansudung');
            hanSuDungEl.forEach(el => {
                el.addEventListener('keypress', evt => {
                    if (evt.keyCode === 13) {

                        setTimeout(() => {
                            let domEl = document.querySelector(`[data-inputindex='i${dCount}']`);
                            domEl.firstChild.firstChild.focus();
                        }, 0);

                    }
                })
            })
        },
        onRowDelete: function (oEvt) {
            //console.log(oEvt.getSource());
            let selected = oEvt.getSource().getBindingContext("tableModel").getObject();
            let PN = this.tableModel.getData();
            if (PN) {
                PN = PN.filter(el => el.id !== selected.id);
                this.tableModel.setData([...PN]);
            }
            

            if (this.phieuNhap.length === 0) {
                this.tableModel.setData([{}]);
            }
        }
    };
    return Controller.extend('app.HoaDonNhap.Add1', oController);
});