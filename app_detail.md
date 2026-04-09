NetSpace Assets Management System
🎯 Mục tiêu hệ thống

Hệ thống quản lý tài sản nội bộ dành cho doanh nghiệp, giúp:

Chuẩn hóa dữ liệu tài sản (Single Source of Truth)
Ngăn chặn chỉnh sửa không kiểm soát (Audit-proof)
Tra cứu nhanh chóng và chính xác
Theo dõi lịch sử thay đổi đầy đủ
Hỗ trợ xuất báo cáo phục vụ kế toán
🧠 Nguyên tắc cốt lõi
Không overwrite dữ liệu
Mọi thay đổi đều có log
Dữ liệu là immutable (chỉ append)
Tra cứu là trung tâm trải nghiệm
🧩 CẤU TRÚC HỆ THỐNG
1. Dashboard (Tổng quan)
Mục đích

Hiển thị nhanh tình trạng tài sản toàn công ty

Thành phần
Tổng số tài sản
Tổng giá trị tài sản
Tài sản theo trạng thái:
Đang sử dụng
Chưa sử dụng
Bảo trì
Thanh lý
Cảnh báo
Tài sản chưa gán người
Tài sản thiếu thông tin
2. Asset Master (Quản lý tài sản)
Mục đích

Nguồn dữ liệu gốc duy nhất của hệ thống

🧾 Cấu trúc dữ liệu
A. Thông tin định danh (KHÔNG sửa trực tiếp)
Mã tài sản (auto generate)
Tên tài sản
Nhóm tài sản
Loại tài sản
B. Thông tin sử dụng
Người sử dụng
Phòng ban
Chức danh
Trạng thái
C. Thông tin tài chính
Đơn giá
Ngày mua
Đơn vị bán
Hạn bảo hành
Thời gian khấu hao
Mức khấu hao
D. Metadata
Ảnh tài sản
Ghi chú
⚠️ Quy tắc
Không cho edit trực tiếp trong table
Mọi chỉnh sửa phải qua modal
Mọi thay đổi đều được ghi log
3. Tra cứu (Search Center) 🔍
Mục đích

Trung tâm chính để kiểm tra và truy vấn tài sản

UI/UX
Thanh tìm kiếm chính

Placeholder:

“Tìm theo tên tài sản, mã, người sử dụng…”

Bộ lọc
Loại tài sản
Nhóm tài sản
Phòng ban
Người sử dụng
Trạng thái
Kết quả hiển thị
A. Summary
Tổng số tài sản
Tổng giá trị
Số người đang sử dụng
B. Table dữ liệu
Tên	Mã	Loại	Người dùng	Phòng	Giá trị	Trạng thái
C. Insight panel (bên phải)
Phân bổ theo phòng ban
Danh sách người đang giữ tài sản
Top tài sản theo giá trị
4. Chỉnh sửa có kiểm soát (Edit Control)
Nguyên tắc
Không sửa trực tiếp
Không overwrite
Flow chỉnh sửa
Click “Edit”
Mở modal
UI Modal
Hiển thị:
Giá trị cũ
Giá trị mới (input)
Khi lưu

Hệ thống tạo log:

Field: Người sử dụng
From: Nguyễn Văn A
To: Trần Văn B
By: Admin
Time: 2026-04-09 10:30
5. Audit Log (Lịch sử thay đổi) 🚨
Mục đích

Theo dõi toàn bộ thay đổi trong hệ thống

Ghi nhận
Tạo tài sản
Chỉnh sửa tài sản
Export dữ liệu
UI hiển thị
Timeline
[10:30] Admin sửa tài sản Laptop ASUS
→ Người dùng: A → B
[09:00] Admin tạo tài sản mới
Quy tắc
Không được xóa log
Không được chỉnh sửa log
6. Export Excel 📤
Chức năng
Xuất toàn bộ dữ liệu
Xuất theo filter
Format
Chuẩn kế toán
Đầy đủ cột:
Mã
Tên
Giá trị
Người sử dụng
Ngày mua
7. Phân quyền (Roles)
Admin
Toàn quyền
Tạo / sửa tài sản
Xem log
Kế toán
Xem dữ liệu
Xuất Excel
Không được sửa
Nhân viên
Chỉ xem tài sản của mình
🧭 CẤU TRÚC GIAO DIỆN (UI)
Sidebar
Dashboard
Assets
🔍 Tra cứu
Audit Log
Settings
Trang chính (Recommended)

👉 Tra cứu (Search Center)

Lý do:

Phù hợp use case “kiểm tài sản”
Nhanh hơn dashboard
⚡ UX QUAN TRỌNG
Table:
Sticky header
Hover highlight
Form:
Validate
Disable button khi chưa đủ
Modal:
Có loading
Có success state
Search:
Debounce (300ms)
Realtime result
🔐 BẢO MẬT & TOÀN VẸN DỮ LIỆU
Audit log immutable
Không cho delete thật (soft delete)
Mọi thay đổi đều trace được
Role-based access control
🚀 KẾT LUẬN

Đây là hệ thống:

Asset Control System (mini ERP)
không phải CRUD app đơn giản