sap.ui.define([], function () {
    "use strict";
    return {
        requestStatusState: function (iStatus) {
            switch (iStatus) {
                case 0:
                case 3:
                    return "Warning";
                case 1:
                    return "Info";
                case 2:
                    return "Error";
                case 4:
                    return "Success";
                default:
                    return "None";
            }
        },
        requestStatusText: function (iStatus) {
            var resourceBundle = this.getOwnerComponen
                .getModel("i18n")
                .getResourceBundle();
            switch (iStatus) {
                case 0:
                    return resourceBundle.getText("Subbmited");
                case 1:
                    return resourceBundle.getText("Approved");
                case 2:
                    return resourceBundle.getText("Rejected");
                case 3:
                    return resourceBundle.getText("Resubmited");
                case 4:
                    return resourceBundle.getText("Completed");
                default:
                    return resourceBundle.getText("Undefined");
            }
        },
        logType: function (type) {
            switch (type) {
                case 0:
                    return "Thêm mới";
                case 1:
                    return "Cập nhật";
                case 2:
                    return "Xem";
                case 3:
                    return "Xóa";
                case 4:
                    return "Hệ thống";
                case 5:
                    return "Import";
                case 6:
                    return "Đồng bộ";
                default:
                    return "Khác";
            }
        },
        formatChucVuText: function (val) {
            switch (val) {
                case 0:
                    return "Quản lý";
                case 1:
                    return "Thu ngân";
                case 2:
                    return "Tạp vụ";
                case 3:
                    return "Vận chuyển";
                case 4:
                    return "Bếp trưởng";
                case 5:
                    return "Bếp phó";
                case 6:
                    return "Đầu bếp";
                default:
                    return "";
            }
        },
        formatTrangThaiText: function (val) {
            switch (val) {
                case 0:
                    return "Nghỉ việc";
                case 1:
                    return "Đang làm";
                default:
                    return "Lỗi";
            }
        },
        formatTrangThaiColor: function (val) {
            switch (val) {
                case 0:
                    return "Warning";
                case 1:
                    return "Success";
                default:
                    return "Error";
            }
        },
        formatSuDungBanGheText: function (val) {
            switch (val) {
                case 0:
                    return "Không sử dụng";
                case 1:
                    return "Có sử dụng";
                default:
                    return "";
            }
        },
        formatSuDungBanGheColor: function (val) {
            switch (val) {
                case 0:
                    return "Warning";
                case 1:
                    return "Success";
                default:
                    return "Error";
            }
        },
        formatTrangThaiHDText: function (val) {
            switch (val) {
                case 0:
                    return "Hủy bỏ";
                case 1:
                    return "Hoãn";
                case 2:
                    return "Lên hợp đồng";
                case 3:
                    return "Chuẩn bị";
                case 4:
                    return "Đang thực hiện";
                case 5:
                    return "Hoàn thành";
                default:
                    return "Lỗi";
            }
        },
        formatTrangThaiHDColor: function (val) {
            switch (val) {
                case 0:
                    return "Error";
                case 1:
                    return "Warning";
                case 2:
                    return "None";
                case 3:
                    return "Information";
                case 4:
                    return "Success";
                case 5:
                    return "Success";
                default:
                    return "Error";
            }
        },
        formatTrangThaiTTText: function (val) {
            switch (val) {
                case 0:
                    return "Chưa thanh toán";
                case 1:
                    return "Đã thanh toán";
                case 2:
                    return "Đang nợ";
                default:
                    return "";
            }
        },
        formatTrangThaiTTColor: function (val) {
            switch (val) {
                case 0:
                    return "Error";
                case 1:
                    return "Success";
                case 2:
                    return "Warning";
                default:
                    return "Error";
            }
        },
        formatTien: function (str) {
            if (str != null) {
                str = str.toString();
                return str.split('').reverse().reduce((prev, next, index) => {
                    return ((index % 3) ? next : (next + '.')) + prev
                })
            }
            return 0;
        },
        formatTienn: function (str) {
            if (str != null) {
                str = str.toString();
                return str.split('').reverse().reduce((prev, next, index) => {
                    return ((index % 3) ? next : (next + '.')) + prev
                })
            }
            return '';
        },
        formatLoaiTPText: function (val) {
            switch (val) {
                case 0:
                    return "Thực phẩm tươi sống";
                case 1:
                    return "Thực phẩm khô";
                default:
                    return "";
            }
        },
        formatLoaiTPState: function (val) {
            switch (val) {
                case 0:
                    return "Warning";
                case 1:
                    return "Information";
                default:
                    return "None";
            }
        },
        trangThaiVatTuText: function (val) {
            switch (val) {
                case 0:
                    return "Không sử dụng";
                case 1:
                    return "Đang sử dụng";
                default:
                    return "";
            }
        },
        trangThaiVatTuColor: function (val) {
            switch (val) {
                case 0:
                    return "Warning";
                case 1:
                    return "Success";
                default:
                    return "None";
            }
        },
        formatTTVanChuyenText: function (val) {
            switch (val) {
                case 1:
                    return "Chưa vận chuyển";
                case 2:
                    return "Đã vận chuyển";
                case 3:
                    return "Chưa dọn hết";
                case 4:
                    return "Hoàn thành";
                default:
                    return "";
            }
        },
        formatTTVanChuyenColor: function (val) {
            switch (val) {
                case 1:
                    return "Error";
                case 2:
                    return "Information";
                case 3:
                    return "Warning";
                case 4:
                    return "Success";
                default:
                    return "None";
            }
        },
        formatTTText: function (val) {
            switch (val) {
                case 0:
                    return "Chưa có";
                case 1:
                    return "Đã có";
                default:
                    return "";
            }
        },
        formatTTColor: function (val) {
            switch (val) {
                case 0:
                    return "Success";
                case 1:
                    return "Warning";
                default:
                    return "None";
            }
        },
        trangThaiTTVC: function (val) {
            switch (val) {
                case false:
                    return "Hoàn thành";
                case true:
                    return "Chưa hoàn thành";
                default:
                    return "Chưa hoàn thành";
            }
        },
        trangThaiTTVCColor: function (val) {
            switch (val) {
                case false:
                    return "Success";
                case true:
                    return "Warning";
                default:
                    return "None";
            }
        },
        isCkeckColor: function (val) {
            switch (val) {
                case 1:
                    return "Success";
                case 0:
                    return "Warning";
                default:
                    return "None";
            }
        },
        isCkeckText: function (val) {
            switch (val) {
                case 1:
                    return "Hoàn thành";
                case 0:
                    return "Chưa hoàn thành";
                default:
                    return "";
            }
        },
        formatNguonGoc: function (val) {
            switch (val) {
                case 1:
                    return "Phiếu xuất";
                case 2:
                    return "Phiếu mua";
                default:
                    return "";
            }
        },
        formatTrangThaiPXText: function (val) {
            switch (val) {
                case 1:
                    return "Hoàn thành";
                case 2:
                    return "Đang chọn";
                case 0:
                    return "Chưa chọn";
                default:
                    return "";
            }
        },
        formatTrangThaiPXColor: function (val) {
            switch (val) {
                case 1:
                    return "Success";
                case 2:
                    return "Information";
                case 0:
                    return "Warning";
                default:
                    return "Warning";
            }
        }
    };
});
