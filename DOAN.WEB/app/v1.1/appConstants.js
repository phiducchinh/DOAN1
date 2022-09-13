const DefaultPageSize = 30;
const DbType = {
    String: 0,
    Int: 1,
    Boolean: 2,
    Date: 3,
    DateTime: 4,
    Time: 5,
    Float: 6,
    Decimal: 7,
    Int16: 8,
    Byte: 9
};
const IntergrationType = {
    Add: 0,
    Edit: 1,
    Del: 2,
};
const IntergrationStatus = {
    ChuaCapNhap: 0,
    DaCapNhap: 1,
};
const OrderType = {
    Ascending: "Ascending",
    Descending: "Descending"
};
const LogicalOperator = {
    And: 'And',
    Or: 'Or'
};
const CompareOperator = {
    Contains: "Contains",
    Equal: "Equal",
    NotEqual: "NotEqual",
    GreaterThan: "GreaterThan",
    GreaterOrEqual: "GreaterOrEqual",
    LessThan: "LessThan",
    LessOrEqual: "LessOrEqual",
    IsNull: "IsNull",
    NotNull: "NotNull",
};
const TableType = {
    Device: 0,
    DigitalSignature: 1,
    Software: 2,
    Component: 3
};
const AlertType = {
    BaoHanh: 0,
    BaoTri: 1,
    HetHan: 2,
};
const DeviceStatus = {
    ChuaSuDung: 0,
    DangHoatDong: 1,
    DangBaoTri: 2,
    DangBaoHanh: 3,
    DangSuaChua: 4,
    DaHong: 5,
};
const MaintenanceStatus = {
    ConBaoHanh: 0,
    ChoLapKeHoach: 1,
    DaLapKeHoach: 2,
};
const ComponentStatus = {
    ChuaSuDung: 0,
    DangHoatDong: 1,
    DangBaoHanh: 2,
    DangBaoTri: 3,
    DangSuaChua: 4,
    DaHong: 5,
};
const SupplierType = {
    ThietBi: 'TB',
    LinhKien: 'LK',
    PhanMem: 'PM',
    ChuKySo: 'CKS',
    BanQuyen: 'BQ',
    BaoTri: 'BT'
};
const CategoryType = {
    ThietBi: 0,
    LinhKien: 1,
    PhanMem: 2,
    BaoTri: 3,
    HeDieuHanh: 4,
    LyDoPhatSinh: 5,
    DoiTacHoTro: 6,
    CachThucQLLicense: 7,
    DichVu: 8,
    NhomThietBi: 9,
};
const DigitalSignatureRequestType = {
    CapMoi: 0,
    CapNhap: 1,
    ThuHoi: 2,
};
const CommonStatus = {
    Active: 0,
    Deactive: 1,
    Deleted: 2
};
const DataType = {
    Common: 0,
    Exchange: 1
};
const DigitalSignatureRequestStatus = {
    ChoPheDuyet: 0,
    DaPheDuyet: 1,
    DaTuChoi: 2,
    ChoCap: 3,
    DaCap: 4,
    TuChoiCap: 5
};
const DigitalSignatureNewRequestStatus = {
    CapMoi: 0,
};
const DigitalSignatureUpdateRequestStatus = {
    ChuaCapNhat: 0,
    DaCapNhat: 1,
};
const DigitalSignatureRetrieveRequestStatus = {
    DaThuHoi: 0,
};
const DigitalSignature4GStatus = {
    DaCap: 0,
    ChoCap: 1,
    DaHuy: 2
};
const DigitalSignatureType = {
    Usb: 0,
    SimPKI: 1,
    All: 2
};
const DigitalSignatureStatus = {
    DaKichHoat: 0,
    DaBanGiao: 1,
    KhongHoatDong: 2,
};
const DigitalCertificateStatus = {
    DaKichHoat: 0,
    DaBanGiao: 1,
    KhongHoatDong: 2
};
const DigitalCertificateType = {
    CaNhan: 0,
    ToChuc: 1,
};
const LicenseStatus = {
    ChuaSuDung: 0,
    DangSuDung: 1,
    DaHetHan: 2
};
const SoftwareStatus = {
    DangSuDung: 0,
    DangBaoTri: 1,
    DaVoHieu: 2
};
const ActivityHistoryType = {
    ThietBi: 0,
    PhanMem: 1,
    ThietBiKySo: 2,
    Component: 3,
    ChungThuSo: 4
};
const ActivityType = {
    Nhap: 0,
    Xuat: 1
};
const MaintenanceHistoryType = {
    ThietBi: 0,
    PhanMem: 1,
};
const DeviceLicenseUpdateType = {
    Device: 0,
    License: 1
};
const DeviceSoftwareUpdateType = {
    Device: 0,
    Software: 1
};
const SupplierDTType = {
    NhaCungCap: 0,
    ChuDauTu: 1,
};
const VirtualMachineSts = {
    DangHoatDong: 0,
    DaVOHieu: 1,
};
const MappingSoftwareVirtualMachine = {
    Software: 0,
    VirtualMachine: 1,
};
const TableSchema = {
    Component: [{
        name: "Tên linh kiện",
        dbName: "TENLINHKIEN",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã linh kiện",
        dbName: "MALINHKIEN",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã thiết bị",
        dbName: "MATHIETBI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Hãng sản xuất",
        dbName: "HANGSANXUAT",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã hợp đồng",
        dbName: "MAHOPDONGMUABAN",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Chủng loại",
        dbName: "CHUNGLOAI",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày mua",
        dbName: "NGAYMUA",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày hết bảo hành",
        dbName: "NGAYHETBAOHANH",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày bàn giao",
        dbName: "NGAYBANGIAO",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày bắt đầu sử dụng",
        dbName: "NGAYBATDAUSUDUNG",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    }, {
        name: "Sở hữu",
        dbName: "SOHUU",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    },],
    Device: [{
        name: "Tên thiết bị",
        dbName: "TENTHIETBI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã thiết bị",
        dbName: "MATHIETBI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Hãng sản xuất",
        dbName: "HANGSANXUAT",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Nhà thầu",
        dbName: "NHATHAUID",
        isShow: false,
        isAllowFilter: true,
        dbType: 1
    }, {
        name: "Hãng cung cấp",
        dbName: "HANGCUNGCAPID",
        isShow: false,
        isAllowFilter: true,
        dbType: 1
    }, {
        name: "Dự án",
        dbName: "DUANID",
        isShow: false,
        isAllowFilter: true,
        dbType: 1
    }, {
        name: "Loại thiết bị",
        dbName: "LOAITHIETBIID",
        isShow: false,
        isAllowFilter: false,
        dbType: 1
    },
    {
        name: "Nhóm thiết bị",
        dbName: "NHOMID",
        isShow: false,
        isAllowFilter: false,
        dbType: 1
    },
    {
        name: "Chủng loại",
        dbName: "CHUNGLOAI",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Người sử dụng",
        dbName: "NGUOISUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Người quản lý",
        dbName: "NGUOIQUANLY",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Địa điểm đặt thiết bị",
        dbName: "DIADIEM",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Đơn vị sử dụng",
        dbName: "DONVISUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Đơn vị quản lý",
        dbName: "DONVIQUANLY",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã hợp đồng",
        dbName: "MAHOPDONGMUABAN",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày bắt đầu thời hạn hợp đồng",
        dbName: "NGAYBATDAU",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày kết thúc thời hạn hợp đồng",
        dbName: "NGAYKETTHUC",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày bảo hành đến",
        dbName: "NGAYHETBAOHANH",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày bàn giao",
        dbName: "NGAYBANGIAO",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    },
    {
        name: "Ngày bắt đầu sử dụng",
        dbName: "NGAYBATDAUSUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    },
    {
        name: "Ngày bắt đầu bảo hành",
        dbName: "NGAYBATDAUBAOHANH",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Xuất xứ",
        dbName: "XUATXU",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Năm sản xuất",
        dbName: "NAMSANXUAT",
        isShow: false,
        isAllowFilter: true,
        dbType: 1
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    }, {
        name: "Trạng thái bảo trì",
        dbName: "BAOTRI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    }, {
        name: "Sở hữu",
        dbName: "SOHUU",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    },],
    DigitalSignature: [{
        name: "STT",
        dbName: "STT",
        isShow: true,
        dbType: 0
    }, {
        name: "Số mã vạch",
        dbName: "MATHIETBIKYSO",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "ICCID",
        dbName: "ICCID",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại chữ ký số",
        dbName: "LOAICHUKYSO",
        isShow: true,
        isAllowFilter: false,
        dbType: 9
    }, {
        name: "Họ và tên",
        dbName: "TENDOITUONGSUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại đối tượng sử dụng",
        dbName: "LOAIDOITUONGSUDUNG",
        isShow: false,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Tên đơn vị",
        dbName: "TENDONVI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Chức vụ",
        dbName: "CHUCVU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày cấp",
        dbName: "NGAYCAP",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày hết hạn",
        dbName: "NGAYHETHAN",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày bàn giao",
        dbName: "NGAYBANGIAO",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Người bàn giao",
        dbName: "NGUOIBANGIAO",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 9
    }, {
        name: "Trạng thái 4G",
        dbName: "TRANGTHAI4G",
        isShow: true,
        isAllowFilter: false,
        dbType: 9
    }, {
        name: "Mật khẩu(Token)",
        dbName: "MATKHAU",
        isShow: false,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Mật khẩu(Sim)",
        dbName: "MATKHAUSIM",
        isShow: false,
        isAllowFilter: false,
        dbType: 0
    },],
    Intergration: [{
        name: "STT",
        dbName: "STT",
        isShow: true,
        dbType: 0
    }, {
        name: "Số mã vạch",
        dbName: "MATHIETBIKYSO",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "ICCID",
        dbName: "ICCID",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Họ và tên",
        dbName: "TENDOITUONGSUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Chức vụ",
        dbName: "CHUCVU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    },
    {
        name: "Chức vụ cũ",
        dbName: "CHUCVUCU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    },
    {
        name: "Đơn vị",
        dbName: "DONVI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    },
    {
        name: "Đơn vị cũ",
        dbName: "DONVICU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 9
    }, {
        name: "Loại",
        dbName: "LOAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 9
    },],
    DigitalCertificate: [{
        name: "Số chứng thư số",
        dbName: "SOCHUNGTHUSO",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Đối tượng sử dụng",
        dbName: "DOITUONGSUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại tượng sử dụng",
        dbName: "LOAIDOITUONGSUDUNG",
        isShow: false,
        isAllowFilter: true,
        dbType: 9
    }, {
        name: "Số hiệu thiết bị lưu khóa bí mật",
        dbName: "SOHIEUTHIETBILUUKHOABIMAT",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Email",
        dbName: "EMAIL",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày cấp",
        dbName: "NGAYCAP",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày hết hạn",
        dbName: "NGAYHETHAN",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Loại tượng sử dụng",
        dbName: "LOAIDOITUONGSUDUNG",
        isShow: true,
        isAllowFilter: true,
        dbType: 9
    }, {
        name: "Ghi chú",
        dbName: "GHICHU",
        isShow: true,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: true,
        dbType: 1
    },],
    DigitalSignatureRequest: [{
        name: "STT",
        dbName: "STT",
        isShow: true,
        dbType: 0
    }, {
        name: "Đối tượng được cấp",
        dbName: "DOITUONGDUOCCAP",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Cơ quan tổ chức công tác",
        dbName: "COQUANTOCHUCCONGTAC",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Tỉnh",
        dbName: "TINH",
        isShow: true,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Chức vụ cũ ",
        dbName: "CHUCVUCU",
        isShow: true,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Đơn vị cũ",
        dbName: "DONVICU",
        isShow: true,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Địa chỉ thư điện tử",
        dbName: "DIACHITHUDIENTUCONGVU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại yêu cầu",
        dbName: "LOAI",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    },],
    License: [{
        name: "Tên giấy phép",
        dbName: "TENGIAYPHEP",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã giấy phép",
        dbName: "MAGIAYPHEP",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại giấy phép",
        dbName: "LOAIGIAYPHEP",
        isShow: true,
        isAllowFilter: false,
        dbType: 0
    }, {
        name: "Phần mềm",
        dbName: "TENPHANMEM",
        isShow: true,
        isAllowFilter: false,
        dbType: DbType.String
    }, {
        name: "Mã hợp đồng",
        dbName: "MAHOPDONGMUABAN",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày kích hoạt",
        dbName: "NGAYKICHHOAT",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày hết hạn",
        dbName: "NGAYHETHAN",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    }],
    Software: [{
        name: "Tên phần mềm",
        dbName: "TENPHANMEM",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Mã phần mềm",
        dbName: "MAPHANMEM",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Đường dẫn",
        dbName: "LINK",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Loại phần mềm",
        dbName: "LOAIPHANMEMID",
        isShow: false,
        isAllowFilter: false,
        dbType: 1
    }, {
        name: "Hãng cung cấp",
        dbName: "NHACUNGCAPID",
        isShow: false,
        isAllowFilter: false,
        dbType: 1
    }, {
        name: "Mã hợp đồng",
        dbName: "MAHOPDONGMUABAN",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày bắt đầu hoạt động",
        dbName: "NGAYBATDAUHOATDONG",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày hết bảo hành",
        dbName: "NGAYHETBAOHANH",
        isShow: true,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: false,
        dbType: 1
    },],
    VirtualMachine: [
        {
            name: "Tên máy ảo",
            dbName: "TENMAY",
            isShow: true,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Mô tả",
            dbName: "MOTA",
            isShow: true,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Địa chỉ IP",
            dbName: "IP",
            isShow: true,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Hệ điều hành",
            dbName: "HEDIEUHANH",
            isShow: false,
            isAllowFilter: true,
            dbType: 1
        }, {
            name: "Bộ nhớ sử dụng",
            dbName: "STORAGE",
            isShow: true,
            isAllowFilter: true,
            dbType: 1
        }, {
            name: "Ram sử dụng",
            dbName: "RAM",
            isShow: true,
            isAllowFilter: true,
            dbType: 1
        }, {
            name: "Số nhân CPU",
            dbName: "CPUCORE",
            isShow: true,
            isAllowFilter: true,
            dbType: 1
        }, {
            name: "Số luồng CPU",
            dbName: "CPUTHREAD",
            isShow: false,
            isAllowFilter: true,
            dbType: 1
        }, {
            name: "Máy chủ",
            dbName: "MATHIETBI",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Tài khoản máy ảo",
            dbName: "TAIKHOANADMIN",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Mô tả",
            dbName: "MOTA",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Ghi chú",
            dbName: "GHICHU",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        },
        {
            name: "VLAN",
            dbName: "VLAN",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        },
        {
            name: "Ngày tạo",
            dbName: "CREATED",
            isShow: false,
            isAllowFilter: true,
            dbType: 3
        }, {
            name: "Tạo bởi",
            dbName: "CREATEDBY",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Sửa lần cuối",
            dbName: "MODIFIED",
            isShow: false,
            isAllowFilter: true,
            dbType: 3
        }, {
            name: "Sửa bởi",
            dbName: "MODIFIEDBY",
            isShow: false,
            isAllowFilter: true,
            dbType: 0
        }, {
            name: "Trạng thái",
            dbName: "TRANGTHAI",
            isShow: true,
            isAllowFilter: false,
            dbType: 1
        },
    ],
    Domain: [{
        name: "STT",
        dbName: "STT",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Tên domain",
        dbName: "TEN",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ứng dụng triển khai",
        dbName: "PHANMEM",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ip Public",
        dbName: "IPPUBLIC",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ip Local",
        dbName: "IPLOCAL",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Port",
        dbName: "PORT",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Trạng thái",
        dbName: "TRANGTHAI",
        isShow: true,
        isAllowFilter: true,
        dbType: 9
    }, {
        name: "Thuộc tính",
        dbName: "THUOCTINH",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ghi chú",
        dbName: "GHICHU",
        isShow: true,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Ngày tạo",
        dbName: "CREATED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Tạo bởi",
        dbName: "CREATEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    }, {
        name: "Sửa lần cuối",
        dbName: "MODIFIED",
        isShow: false,
        isAllowFilter: true,
        dbType: 3
    }, {
        name: "Sửa bởi",
        dbName: "MODIFIEDBY",
        isShow: false,
        isAllowFilter: true,
        dbType: 0
    },]
};
const FilterConfig = [
    {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "Contains", text: "chứa" },
            { key: "StartWith", text: "bắt đầu với" },
            { key: "EndWith", text: "kết thúc với" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "stringInput"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "numberInput"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "boolSelect"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "datePicker"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "dateTimePicker"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "timePicker"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "numberInput"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "numberInput"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "numberInput"
    }, {
        CompareOperator: [
            { key: "Equal", text: "bằng" },
            { key: "NotEqual", text: "khác" },
            { key: "GreaterThan", text: "lớn hơn" },
            { key: "GreaterOrEqual", text: "lớn hơn hoặc bằng" },
            { key: "LessThan", text: "nhỏ hơn" },
            { key: "LessOrEqual", text: "nhỏ hơn hoặc bằng" },
            { key: "IsNull", text: "rỗng" },
            { key: "NotNull", text: "không rỗng" },
        ],
        Input: "numberInput"
    },
];
const Utility = {
    addDays: (date, day) => {
        let thisDate = new Date(date);
        let d = thisDate.getDate();
        thisDate.setDate(thisDate.getDate() + +day);
        if (thisDate.getDate() != d) {
            thisDate.setDate(0);
        }
        return thisDate;
    },
    addMonths: (date, months) => {
        let thisDate = new Date(date);
        let d = thisDate.getDate();
        thisDate.setMonth(thisDate.getMonth() + +months);
        if (thisDate.getDate() != d) {
            thisDate.setDate(0);
        }
        return thisDate;
    },
    addYears: (date, years) => {
        let thisDate = new Date(date);
        let d = thisDate.getDate();
        thisDate.setFullYear(thisDate.getFullYear() + +years);
        if (thisDate.getDate() != d) {
            thisDate.setDate(0);
        }
        return thisDate;
    },
    getDifferentMonth: (d1, d2) => {
        let months;
        let date1 = new Date(d1);
        let date2 = new Date(d2);
        months = (date2.getFullYear() - date1.getFullYear()) * 12;
        months -= date1.getMonth();
        months += date2.getMonth();
        return months <= 0 ? 0 : months;
    },
    getDateFromtring: str => {
        let arr = str.split("/");
        if (arr.length < 3)
            arr = str.split("-");
        arr.reverse();
        return new Date(arr[0], arr[1] - 1, arr[2]);
    },
    getDepreciationValue: (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (now < end) {
            const totalTime = Math.abs(end - start);
            const remainTime = Math.abs(end - now);
            let value = Math.round(remainTime * 1000 / totalTime) / 10;
            return value > 100 ? 100 : value;
        } else {
            return 0;
        }
    },
    getOrderText: order => {
        if (order === OrderType.Ascending)
            return " (A-Z)";
        return " (Z-A)";
    },
    formatFieldName: function (fieldName, fieldData) {
        let val = fieldName;
        if (fieldData && fieldData.length > 0) {
            fieldData.forEach(item => {
                if (fieldName == item.dbName) {
                    val = item.name;
                }
            });
        }
        return val;
    },
    formatCompareOperator: function (co) {
        switch (co) {
            case "Equal":
            default:
                return "bằng";
            case "NotEqual":
                return "khác";
            case "GreaterThan":
                return "lớn hơn";
            case "GreaterOrEqual":
                return "lớn hơn hoặc bằng";
            case "LessThan":
                return "nhỏ hơn";
            case "LessOrEqual":
                return "nhỏ hơn hoặc bằng";
            case "Contains":
                return "chứa";
            case "StartWith":
                return "bắt đầu với";
            case "EndWith":
                return "kết thúc với";
            case "IsNull":
                return "rỗng";
            case "NotNull":
                return "không rỗng";
        }
    },
    formatAccountDisplay: function (s) {
        if (!s) return "";
        else if (s === "#sys#") return "Hệ thống";
        else return s.split(";#")[1];
    },
};
const ActivityHistory = {
    TrangThai: {
        TieuDe: "Cập nhật trạng thái",
        NoiDung: "Thay đổi trạng thái trường thông tin thành: "
    }
};
const FileManager = {
    Device: 1,
    Software: 2,
    DeviceActivity: 3,
    SoftwareActivity: 4,
    Component: 5,
    DigitalCertificateForm: 6,
    Domain: 7,
};
const DomainStatus = {
    ChuaSuDung: 0,
    DangHoatDong: 1,
    DangBaoHanh: 2,
    DangBaoTri: 3,
    DangSuaChua: 4,
    DaHetHan: 5,
};