﻿// <auto-generated />
using System;
using DOAN.API.ViewModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DOAN.API.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20220829071612_up23")]
    partial class up23
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.17")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuMua", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idHoaDon")
                        .HasColumnType("int");

                    b.Property<int>("idThucPham")
                        .HasColumnType("int");

                    b.Property<double>("soLuong")
                        .HasColumnType("float");

                    b.HasKey("id");

                    b.HasIndex("idHoaDon");

                    b.HasIndex("idThucPham");

                    b.ToTable("ChiTietPhieuMua");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuMuaVatDung", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idPhieuMua")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int?>("isCheck")
                        .HasColumnType("int");

                    b.Property<string>("nhaCungCap")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idPhieuMua");

                    b.HasIndex("idVatTu");

                    b.ToTable("ChiTietPhieuMuaVatDung");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuNhap", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("NCC")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("hanSuDung")
                        .HasColumnType("datetime2");

                    b.Property<int>("idHoaDon")
                        .HasColumnType("int");

                    b.Property<int>("idThucPham")
                        .HasColumnType("int");

                    b.Property<int?>("lan")
                        .HasColumnType("int");

                    b.Property<double>("soLuong")
                        .HasColumnType("float");

                    b.HasKey("id");

                    b.HasIndex("idHoaDon");

                    b.HasIndex("idThucPham");

                    b.ToTable("ChiTietPhieuNhap");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuNhapVatDung", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("giaNhap")
                        .HasColumnType("int");

                    b.Property<int>("idPhieuNhap")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int>("lan")
                        .HasColumnType("int");

                    b.Property<string>("nhaCungCap")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idPhieuNhap");

                    b.HasIndex("idVatTu");

                    b.ToTable("ChiTietPhieuNhapVatDung");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuXuat", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idHoaDon")
                        .HasColumnType("int");

                    b.Property<int>("idThucPham")
                        .HasColumnType("int");

                    b.Property<double>("soLuong")
                        .HasColumnType("float");

                    b.HasKey("id");

                    b.HasIndex("idHoaDon");

                    b.HasIndex("idThucPham");

                    b.ToTable("ChiTietPhieuXuat");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyen", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idVanChuyen")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int?>("lan")
                        .HasColumnType("int");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idVanChuyen");

                    b.HasIndex("idVatTu");

                    b.ToTable("ChiTietVanChuyen");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyenNhap", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idPhieuNhap")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int?>("lan")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ngayNhap")
                        .HasColumnType("datetime2");

                    b.Property<int?>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idPhieuNhap");

                    b.HasIndex("idVatTu");

                    b.ToTable("ChiTietVanChuyenNhap");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyenXuat", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idPhieuXuat")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idPhieuXuat");

                    b.HasIndex("idVatTu");

                    b.ToTable("ChiTietVanChuyenXuat");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.DungCuKemMonAn", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idMonAn")
                        .HasColumnType("int");

                    b.Property<int>("idVatTu")
                        .HasColumnType("int");

                    b.Property<int>("soLuong")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idMonAn");

                    b.HasIndex("idVatTu");

                    b.ToTable("DungCuKemMonAn");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonMua", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("idHopDong")
                        .HasColumnType("int");

                    b.Property<int?>("isCheck")
                        .HasColumnType("int");

                    b.Property<string>("maHoaDon")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.HasKey("id");

                    b.HasIndex("idHopDong");

                    b.ToTable("HoaDonMua");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonNhap", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("giaTien")
                        .HasColumnType("int");

                    b.Property<int>("idPhieuMua")
                        .HasColumnType("int");

                    b.Property<string>("maHoaDon")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.HasKey("id");

                    b.HasIndex("idPhieuMua");

                    b.ToTable("HoaDonNhap");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonXuat", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("idHopDong")
                        .HasColumnType("int");

                    b.Property<string>("maHoaDon")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.HasKey("id");

                    b.HasIndex("idHopDong");

                    b.ToTable("HoaDonXuat");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HopDong", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("diaChi")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idBeptruong")
                        .HasColumnType("int");

                    b.Property<int?>("isHoaDon")
                        .HasColumnType("int");

                    b.Property<int?>("isPhieuMua")
                        .HasColumnType("int");

                    b.Property<int?>("isPhieuXuat")
                        .HasColumnType("int");

                    b.Property<int?>("isThucDon")
                        .HasColumnType("int");

                    b.Property<int?>("isVanChuyen")
                        .HasColumnType("int");

                    b.Property<string>("maHopDong")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ngayBatDau")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ngayKetThuc")
                        .HasColumnType("datetime2");

                    b.Property<string>("soDienThoai")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("soMam")
                        .HasColumnType("int");

                    b.Property<int?>("soMamPhatSinh")
                        .HasColumnType("int");

                    b.Property<int>("suDungBanGhe")
                        .HasColumnType("int");

                    b.Property<string>("tenHopDong")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("tenKhachHang")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("tienCoc")
                        .HasColumnType("int");

                    b.Property<int>("trangThai")
                        .HasColumnType("int");

                    b.Property<int?>("trangThaiThanhToan")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idBeptruong");

                    b.ToTable("HopDong");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.MonAn", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("giaTien")
                        .HasColumnType("int");

                    b.Property<int>("loai")
                        .HasColumnType("int");

                    b.Property<string>("tenMonAn")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("MonAn");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.NhanVien", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("chucVu")
                        .HasColumnType("int");

                    b.Property<int?>("luongCB")
                        .HasColumnType("int");

                    b.Property<string>("queQuan")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("soDienThoai")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("tenNhanVien")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("trangThai")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.ToTable("NhanVien");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PMVatDung", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("NgayTao")
                        .HasColumnType("datetime2");

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("isCheck")
                        .HasColumnType("int");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("PMVatDung");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PNVatDung", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("NgayTao")
                        .HasColumnType("datetime2");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("maPhieuMua")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("maPhieuMua");

                    b.ToTable("PNVatDung");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PhieuNhapVD", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idPhieuXuat")
                        .HasColumnType("int");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.Property<int?>("nguoiGoc")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idPhieuXuat");

                    b.ToTable("PhieuNhapVD");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PhieuXuatVD", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("idVanChuyen")
                        .HasColumnType("int");

                    b.Property<int?>("isCheck")
                        .HasColumnType("int");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.HasKey("id");

                    b.HasIndex("idVanChuyen");

                    b.ToTable("PhieuXuatVD");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThanhToan", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idHopDong")
                        .HasColumnType("int");

                    b.Property<string>("maHoaDon")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.Property<int>("tienPhatSinh")
                        .HasColumnType("int");

                    b.Property<int>("tongTien")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idHopDong");

                    b.ToTable("ThanhToan");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThucDon", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("giaTien")
                        .HasColumnType("int");

                    b.Property<int>("idHopDong")
                        .HasColumnType("int");

                    b.Property<int>("idMonAn")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idHopDong");

                    b.HasIndex("idMonAn");

                    b.ToTable("ThucDon");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThucPham", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("donVi")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("loai")
                        .HasColumnType("int");

                    b.Property<string>("maThucPham")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("soLuong")
                        .HasColumnType("float");

                    b.Property<string>("tenThucPham")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("ThucPham");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThucPhamKemMonAn", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idMonAn")
                        .HasColumnType("int");

                    b.Property<int>("idThucPham")
                        .HasColumnType("int");

                    b.Property<double>("soLuong")
                        .HasColumnType("float");

                    b.HasKey("id");

                    b.HasIndex("idMonAn");

                    b.HasIndex("idThucPham");

                    b.ToTable("ThucPhamKemMonAn");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.VanChuyen", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("diaChi")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("idHopDong")
                        .HasColumnType("int");

                    b.Property<string>("maPhieu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ngayDi")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ngayDon")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ngayTao")
                        .HasColumnType("datetime2");

                    b.Property<string>("soDienThoai")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("trangThai")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("idHopDong");

                    b.ToTable("VanChuyen");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.VatTu", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ghiChu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("maVatTu")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("soLuongChuaSD")
                        .HasColumnType("int");

                    b.Property<int>("soLuongConLai")
                        .HasColumnType("int");

                    b.Property<int?>("soLuongTong")
                        .HasColumnType("int");

                    b.Property<string>("tenVatTu")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("trangThai")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.ToTable("VatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuMua", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HoaDonMua", "hoaDonMua")
                        .WithMany()
                        .HasForeignKey("idHoaDon")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.ThucPham", "thucPham")
                        .WithMany()
                        .HasForeignKey("idThucPham")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hoaDonMua");

                    b.Navigation("thucPham");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuMuaVatDung", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PMVatDung", "pmVatDung")
                        .WithMany()
                        .HasForeignKey("idPhieuMua")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("pmVatDung");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuNhap", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HoaDonNhap", "hoaDonhNhap")
                        .WithMany()
                        .HasForeignKey("idHoaDon")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.ThucPham", "thucPham")
                        .WithMany()
                        .HasForeignKey("idThucPham")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hoaDonhNhap");

                    b.Navigation("thucPham");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuNhapVatDung", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PNVatDung", "pnVatDung")
                        .WithMany()
                        .HasForeignKey("idPhieuNhap")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("pnVatDung");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietPhieuXuat", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HoaDonXuat", "hoaDonXuat")
                        .WithMany()
                        .HasForeignKey("idHoaDon")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.ThucPham", "thucPham")
                        .WithMany()
                        .HasForeignKey("idThucPham")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hoaDonXuat");

                    b.Navigation("thucPham");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyen", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.VanChuyen", "vanChuyen")
                        .WithMany()
                        .HasForeignKey("idVanChuyen")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("vanChuyen");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyenNhap", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PhieuNhapVD", "phieuNhapVD")
                        .WithMany()
                        .HasForeignKey("idPhieuNhap")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("phieuNhapVD");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ChiTietVanChuyenXuat", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PhieuXuatVD", "PhieuXuatVD")
                        .WithMany()
                        .HasForeignKey("idPhieuXuat")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PhieuXuatVD");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.DungCuKemMonAn", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.MonAn", "monAn")
                        .WithMany()
                        .HasForeignKey("idMonAn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.VatTu", "vatTu")
                        .WithMany()
                        .HasForeignKey("idVatTu")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("monAn");

                    b.Navigation("vatTu");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonMua", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HopDong", "hopDong")
                        .WithMany()
                        .HasForeignKey("idHopDong");

                    b.Navigation("hopDong");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonNhap", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HoaDonMua", "hoaDonMua")
                        .WithMany()
                        .HasForeignKey("idPhieuMua")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hoaDonMua");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HoaDonXuat", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HopDong", "hopDong")
                        .WithMany()
                        .HasForeignKey("idHopDong");

                    b.Navigation("hopDong");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.HopDong", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.NhanVien", "bepTruong")
                        .WithMany()
                        .HasForeignKey("idBeptruong")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("bepTruong");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PNVatDung", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PMVatDung", "pmVatDung")
                        .WithMany()
                        .HasForeignKey("maPhieuMua")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("pmVatDung");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PhieuNhapVD", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.PhieuXuatVD", "phieuXuat")
                        .WithMany()
                        .HasForeignKey("idPhieuXuat")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("phieuXuat");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.PhieuXuatVD", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.VanChuyen", "vanChuyen")
                        .WithMany()
                        .HasForeignKey("idVanChuyen")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("vanChuyen");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThanhToan", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HopDong", "hopDong")
                        .WithMany()
                        .HasForeignKey("idHopDong")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hopDong");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThucDon", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HopDong", "hopDong")
                        .WithMany()
                        .HasForeignKey("idHopDong")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.MonAn", "monAn")
                        .WithMany()
                        .HasForeignKey("idMonAn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hopDong");

                    b.Navigation("monAn");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.ThucPhamKemMonAn", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.MonAn", "monAn")
                        .WithMany()
                        .HasForeignKey("idMonAn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DOAN.API.ViewModel.ThucPham", "thucPham")
                        .WithMany()
                        .HasForeignKey("idThucPham")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("monAn");

                    b.Navigation("thucPham");
                });

            modelBuilder.Entity("DOAN.API.ViewModel.VanChuyen", b =>
                {
                    b.HasOne("DOAN.API.ViewModel.HopDong", "hopDong")
                        .WithMany()
                        .HasForeignKey("idHopDong");

                    b.Navigation("hopDong");
                });
#pragma warning restore 612, 618
        }
    }
}
