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
    const oController = {
        globalFormatter: GlobalFormatter,
        thucDonModel: new CoreJsonModel([{ soluong: 0 }]),
        hangModel: new CoreJsonModel(),
        mainModel: new CoreJsonModel(),
        monAnModel: new CoreJsonModel(),
        nccModel: new CoreJsonModel(),
        selectedId: {},
        //tableData: [],
        phieuNhap: [{ isEdit: true }],
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            //sap.ui.core.UIComponent.getRouterFor(this).getRoute("dongmua-add").attachMatched(this._onObjectMatched, this);   
            this.getView().setModel(this.thucDonModel, 'thucDonModel');
            this.getView().setModel(this.mainModel, 'mainModel');
            //this.getView().setModel(this.hangModel, 'hangModel');
            this.getView().setModel(this.monAnModel, 'monAnModel');
            //this.getView().setModel(this.nccModel);
            this.thucDonModel.setData(this.phieuNhap);
            this.bus.subscribe('HopDongChannel', 'editThucDon', this.editThucDon, this);

            this.initialize();
        },
        initialize: function () {
            this.loadDataHang();
            //this.loadDataNCC();
            //this.getView().byId('maPhieu').setValue(this.Base.randID());
            //this.getView().byId('ngayNhap').setValue(moment().format('MM/DD/YYYY'));
            this.getView().byId('idhang').setFilterFunction(function (sTerm, oItem) {
                return oItem.getText().match(new RegExp(sTerm, "i"));
            });
            this.getView().byId('idhang').setSuggestionRowValidator(this.suggestionRowValidator);
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
            this.phieuNhap = [{ isEdit: true }];
            this.thucDonModel.setData(this.phieuNhap);
        },
        addHopdong: function (oc, oE, oData) {
            if (oData) {
                this.paras = oData.paras;
            }
        },

        editThucDon: function (oC, oE, oData) {
            const root = this;
            if (oData) {
                this.idHopDong = oData.idHopDong;
                Connector.getFromApi(sdConfig.adminApiEndpoint + 'ThucDon/HopDong/' + this.idHopDong, {
                    fnProcessData: function (data) {
                        if (data && data.length > 0) {
                            console.log(data);
                            root.phieuNhap = [];
                            data.forEach(item => {
                                root.phieuNhap.push({
                                    tenMonAn: item.monAn.tenMonAn,
                                    idMonAn: item.idMonAn,
                                    id: item.idMonAn,
                                    giaTien: item.giaTien,
                                    loai: item.monAn.loai,
                                    isEdit: false
                                });
                            });
                            root.phieuNhap.push({ isEdit: true });
                            root.thucDonModel.setData(root.phieuNhap);
                        }
                    }
                });
            }
        },
        pass: function () {
            const root = this;
            this.paras.isThucDon = 0;
            Connector.postToApi(sdConfig.adminApiEndpoint + 'HopDong', {
                oParameters: this.paras,
                fnSuccess: function (data) {
                    MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                    root.bus.publish('HopDongChannel', 'onCloseHopDongAdd');
                    root.bus.publish('HopDongChannel', 'reLoadData');
                    root.closeAreaTD();
                }
            });
        },
        validate: function () {
            let isCheck = true;
            let input = this.getView().byId('tentd');
            if (!input.getValue()) {
                input.setValueState('Error');
                input.setValueStateText('Trường thông tin này bắt buộc!');
                isCheck = false;
            } else {
                input.setValueState('None');
            }
            return isCheck
        },
        closeAreaTD: function () {
            this.clearForm();
            this.bus.publish('ThucDonChannel', "onCloseThucDonAdd");
        },
        save: async function () {

            if (this.validate()) {
                const root = this;
                let listThucDon = root.thucDonModel.getData();
                let tt = root.mainModel.getData();
                if (listThucDon && listThucDon.length <= 1) {
                    MessageToast.show("Cần thêm ít nhất 1 món ăn", { width: '25em', duration: 5000 });

                } else {
                    listThucDon.pop();
                    let newlistThucDon = listThucDon.map((item) => {
                        return {
                            idHopDong: 2,
                            idMonAn: item.idMonAn,
                            giaTien: Number(item.giaTien),
                            tenThucDon: tt.tenThucDon,
                            ghiChu: tt.ghiChu,
                        }
                    });
                    
                    Connector.postToApi(sdConfig.adminApiEndpoint + 'thucdon/addTDMau', {
                        oParameters: newlistThucDon,
                        fnSuccess: function (data) {
                            root.closeAreaTD();
                            root.bus.publish('ThucDonChannel', 'reLoadData');
                            MessageToast.show("Thêm thành công", { width: '25em', duration: 5000 });
                        }
                    })
                }
            }

            


        },
        loadDataHang: async function () {
            let root = this;
            Connector.getFromApi(sdConfig.adminApiEndpoint + 'MonAn', {
                fnProcessData: function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i]['STT'] = i + 1;
                        }
                    }
                    root.monAnModel.setData(data);
                }
            });
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
                let object = evt.getParameter("selectedRow").getBindingContext("monAnModel").getObject();
                let { id } = object;
                let isCheck = this.phieuNhap.some(x => x.id == id);
                if (isCheck) {
                    MessageToast.show('Món ăn này đã được thêm vào thực đơn\n Vui lòng chọn món ăn khác.');
                } else {
                    let dCount = this.phieuNhap.length;
                    let obj = Object.assign({ index: dCount, idMonAn: id }, object)
                    this.phieuNhap[dCount - 1] = Object.assign({ isEdit: false }, obj);
                    this.phieuNhap.push({ isEdit: true, index: dCount + 1 });
                    this.thucDonModel.setData(this.phieuNhap);

                    setTimeout(() => {
                        let domEl = document.querySelector(`[data-inputindex='i${dCount + 1}']`);
                        if (domEl)
                            domEl.firstChild.firstChild.focus();
                    }, 100);
                }
                ////let index = evt.getSource().data('inputIndex');


                ////let domEl = document.querySelector(`[data-inputindex='i${dCount + 1}']`);

                ////setTimeout(() => {
                ////    let domEl = document.querySelector(`[data-inputindex='i${dCount+1}']`);
                ////    domEl.firstChild.firstChild.focus();

                ////}, 200);

                ////setTimeout(() => {
                ////    let domEl = document.querySelector(`[data-inputindex='i${dCount}']`);
                ////    domEl.firstChild.firstChild.focus();
                ////}, 0);
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
            //this.addEventForInputSoLuong();
            //this.addEventForInputHanSuDung();
        },
        addEventForInputSoLuong: function () {
            //let dCount = this.tableData.length;
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
            //let dCount = this.tableData.length;
            //dCount += dCount;
            //let hanSuDungEl = document.querySelectorAll('.hansudung');
            //hanSuDungEl.forEach(el => {
            //    el.addEventListener('keypress', evt => {
            //        if (evt.keyCode === 13) {

            //            setTimeout(() => {
            //                let domEl = document.querySelector(`[data-inputindex='i${dCount}']`);
            //                domEl.firstChild.firstChild.focus();
            //            }, 0);

            //        }
            //    })
            //})
        },
        onRowDelete: function (oEvt) {
            let selected = oEvt.getSource().getBindingContext("thucDonModel").getObject();
            this.phieuNhap = this.phieuNhap.filter(el => el.id !== selected.id);
            this.phieuNhap.forEach((el, idex) => {
                el.index = idex + 1;
            })
            this.phieuNhap[this.phieuNhap.length - 1] = {
                isEdit: true, index: this.phieuNhap.length, tenThucPham: ''
            }
            this.thucDonModel.setData([...this.phieuNhap]);

            if (this.phieuNhap.length === 0) {
                this.thucDonModel.setData([{}]);
            }
            console.log(this.phieuNhap);
        }
    };
    return Controller.extend('app.ThucDon.Add', oController);
});