// Mock data for NetSpace Assets Management System

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  group: string;
  manufacturer: string;
  user: string;
  department: string;
  position: string;
  status: "active" | "unused" | "maintenance" | "liquidated";
  price: number;
  purchaseDate: string;
  vendor: string;
  warrantyEnd: string;
  depreciationYears: number;
  depreciationRate: number;
  notes: string;
  icon: string;
  iconColor: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: "create" | "edit" | "export" | "delete";
  assetName: string;
  assetCode: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  user: string;
  description: string;
}

export interface Department {
  name: string;
  code: string;
  assetCount: number;
  totalValue: number;
  percentage: number;
}

export const departments: Department[] = [
  { name: "Phòng Công nghệ", code: "IT", assetCount: 342, totalValue: 15200000000, percentage: 85 },
  { name: "Phòng Hành chính", code: "HC", assetCount: 198, totalValue: 6800000000, percentage: 45 },
  { name: "Phòng Marketing", code: "MKT", assetCount: 156, totalValue: 8900000000, percentage: 65 },
  { name: "Phòng R&D", code: "RD", assetCount: 287, totalValue: 12400000000, percentage: 95 },
  { name: "Phòng Nhân sự", code: "HR", assetCount: 89, totalValue: 2100000000, percentage: 25 },
  { name: "Phòng Tài chính", code: "TC", assetCount: 76, totalValue: 1800000000, percentage: 20 },
  { name: "Phòng Thiết kế", code: "TK", assetCount: 134, totalValue: 5600000000, percentage: 40 },
];

export const assets: Asset[] = [
  {
    id: "1", code: "NS-LP-2024-001", name: "MacBook Pro M3 Max", category: "Máy tính", group: "Thiết bị IT",
    manufacturer: "Apple Inc.", user: "Nguyễn Văn An", department: "Phòng Công nghệ", position: "Senior Developer",
    status: "active", price: 82500000, purchaseDate: "2024-01-12", vendor: "FPT Shop", warrantyEnd: "2026-01-12",
    depreciationYears: 3, depreciationRate: 33.3, notes: "Cấu hình M3 Max, 36GB RAM, 1TB SSD",
    icon: "laptop_mac", iconColor: "indigo"
  },
  {
    id: "2", code: "NS-PR-2023-042", name: "Máy In Công Nghiệp Ricoh", category: "Máy in", group: "Thiết bị văn phòng",
    manufacturer: "RICOH Asia", user: "Trần Thị Bình", department: "Phòng Hành chính", position: "Admin Manager",
    status: "maintenance", price: 145000000, purchaseDate: "2023-08-15", vendor: "RICOH Vietnam", warrantyEnd: "2025-08-15",
    depreciationYears: 5, depreciationRate: 20, notes: "Đang bảo trì định kỳ quý 2/2026",
    icon: "print", iconColor: "purple"
  },
  {
    id: "3", code: "NS-FUR-2023-112", name: "Ghế Công Thái Học Herman Miller", category: "Nội thất", group: "Thiết bị văn phòng",
    manufacturer: "Herman Miller Inc.", user: "Lê Minh Châu", department: "Phòng Thiết kế", position: "UI/UX Designer",
    status: "active", price: 32400000, purchaseDate: "2023-11-02", vendor: "Herman Miller VN", warrantyEnd: "2035-11-02",
    depreciationYears: 10, depreciationRate: 10, notes: "Aeron Size B, Full option",
    icon: "chair", iconColor: "blue"
  },
  {
    id: "4", code: "NS-MON-2024-015", name: "Màn Hình Dell U3423WE", category: "Màn hình", group: "Thiết bị IT",
    manufacturer: "Dell Technologies", user: "Phạm Đức Dũng", department: "Phòng R&D", position: "Tech Lead",
    status: "active", price: 18900000, purchaseDate: "2024-03-20", vendor: "Dell Vietnam", warrantyEnd: "2027-03-20",
    depreciationYears: 5, depreciationRate: 20, notes: "34 inch Ultrawide, USB-C Hub",
    icon: "monitor", iconColor: "sky"
  },
  {
    id: "5", code: "NS-SRV-2023-003", name: "Server Dell PowerEdge R750", category: "Server", group: "Hạ tầng",
    manufacturer: "Dell Technologies", user: "Nguyễn Hoàng Em", department: "Phòng Công nghệ", position: "System Admin",
    status: "active", price: 289000000, purchaseDate: "2023-06-10", vendor: "Dell Vietnam", warrantyEnd: "2028-06-10",
    depreciationYears: 5, depreciationRate: 20, notes: "2x Xeon Gold 6348, 256GB RAM, RAID 10",
    icon: "dns", iconColor: "violet"
  },
  {
    id: "6", code: "NS-IOT-2024-078", name: "Camera Giám Sát Hikvision", category: "IoT", group: "Thiết bị an ninh",
    manufacturer: "Hikvision", user: "Trần Văn Phát", department: "Phòng Hành chính", position: "Security Officer",
    status: "active", price: 8500000, purchaseDate: "2024-02-28", vendor: "TechOne VN", warrantyEnd: "2026-02-28",
    depreciationYears: 3, depreciationRate: 33.3, notes: "DS-2CD2347G2-LU, 4MP ColorVu",
    icon: "videocam", iconColor: "emerald"
  },
  {
    id: "7", code: "NS-LP-2022-088", name: "ThinkPad X1 Carbon Gen 10", category: "Máy tính", group: "Thiết bị IT",
    manufacturer: "Lenovo", user: "Hoàng Thị Giang", department: "Phòng Marketing", position: "Marketing Manager",
    status: "liquidated", price: 42000000, purchaseDate: "2022-04-15", vendor: "Lenovo VN", warrantyEnd: "2025-04-15",
    depreciationYears: 3, depreciationRate: 33.3, notes: "Đã thanh lý Q1/2026, giá trị còn lại: 0đ",
    icon: "laptop_mac", iconColor: "slate"
  },
  {
    id: "8", code: "NS-NET-2024-005", name: "Switch Cisco Catalyst 9200", category: "Mạng", group: "Hạ tầng",
    manufacturer: "Cisco Systems", user: "Nguyễn Hoàng Em", department: "Phòng Công nghệ", position: "System Admin",
    status: "active", price: 67800000, purchaseDate: "2024-01-05", vendor: "Cisco VN", warrantyEnd: "2029-01-05",
    depreciationYears: 5, depreciationRate: 20, notes: "48-Port PoE+, Stackable",
    icon: "router", iconColor: "cyan"
  },
  {
    id: "9", code: "NS-AC-2023-021", name: "Điều hòa Daikin Inverter", category: "Điều hòa", group: "Thiết bị văn phòng",
    manufacturer: "Daikin", user: "", department: "Phòng Hành chính", position: "",
    status: "unused", price: 25600000, purchaseDate: "2023-09-18", vendor: "Daikin VN", warrantyEnd: "2025-09-18",
    depreciationYears: 8, depreciationRate: 12.5, notes: "2HP, chưa lắp đặt tầng 5",
    icon: "ac_unit", iconColor: "teal"
  },
  {
    id: "10", code: "NS-PRJ-2024-002", name: "Máy Chiếu Epson EB-L260F", category: "Máy chiếu", group: "Thiết bị trình bày",
    manufacturer: "Epson", user: "Phạm Thị Hương", department: "Phòng Marketing", position: "Event Coordinator",
    status: "active", price: 38500000, purchaseDate: "2024-05-10", vendor: "Epson VN", warrantyEnd: "2027-05-10",
    depreciationYears: 5, depreciationRate: 20, notes: "4600 lumen, Full HD Laser",
    icon: "videocam", iconColor: "amber"
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: "1", timestamp: "2026-04-09T10:30:00", action: "edit", assetName: "MacBook Pro M3 Max",
    assetCode: "NS-LP-2024-001", field: "Người sử dụng", oldValue: "Nguyễn Văn An", newValue: "Trần Văn Bình",
    user: "Admin", description: "Chuyển đổi người sử dụng tài sản"
  },
  {
    id: "2", timestamp: "2026-04-09T09:15:00", action: "create", assetName: "Máy Chiếu Epson EB-L260F",
    assetCode: "NS-PRJ-2024-002", user: "Admin", description: "Tạo tài sản mới trong hệ thống"
  },
  {
    id: "3", timestamp: "2026-04-08T16:45:00", action: "edit", assetName: "Máy In Công Nghiệp Ricoh",
    assetCode: "NS-PR-2023-042", field: "Trạng thái", oldValue: "Đang sử dụng", newValue: "Bảo trì",
    user: "Admin", description: "Cập nhật trạng thái bảo trì định kỳ"
  },
  {
    id: "4", timestamp: "2026-04-08T14:20:00", action: "export", assetName: "Toàn bộ tài sản",
    assetCode: "ALL", user: "Kế toán Nguyễn", description: "Xuất báo cáo Excel toàn bộ tài sản Q1/2026"
  },
  {
    id: "5", timestamp: "2026-04-08T11:00:00", action: "edit", assetName: "ThinkPad X1 Carbon Gen 10",
    assetCode: "NS-LP-2022-088", field: "Trạng thái", oldValue: "Đang sử dụng", newValue: "Thanh lý",
    user: "Admin", description: "Thanh lý tài sản hết khấu hao"
  },
  {
    id: "6", timestamp: "2026-04-07T15:30:00", action: "edit", assetName: "Ghế Công Thái Học Herman Miller",
    assetCode: "NS-FUR-2023-112", field: "Phòng ban", oldValue: "Phòng Công nghệ", newValue: "Phòng Thiết kế",
    user: "Admin", description: "Điều chuyển tài sản giữa các phòng ban"
  },
  {
    id: "7", timestamp: "2026-04-07T10:00:00", action: "create", assetName: "Camera Giám Sát Hikvision",
    assetCode: "NS-IOT-2024-078", user: "Admin", description: "Thêm camera an ninh tầng 3"
  },
  {
    id: "8", timestamp: "2026-04-06T09:30:00", action: "export", assetName: "Phòng Công nghệ",
    assetCode: "DEPT-IT", user: "Kế toán Nguyễn", description: "Xuất báo cáo tài sản phòng IT"
  },
];

export const statusLabels: Record<Asset["status"], string> = {
  active: "Đang sử dụng",
  unused: "Chưa sử dụng",
  maintenance: "Đang bảo trì",
  liquidated: "Đã thanh lý",
};

export const statusColors: Record<Asset["status"], { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-700" },
  unused: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-700" },
  maintenance: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-700" },
  liquidated: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-700" },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export const summaryStats = {
  totalAssets: 1284,
  totalValue: 42500000000,
  activeUsers: 856,
  departments: 12,
  inUse: 978,
  unused: 124,
  maintenance: 89,
  liquidated: 93,
  unassigned: 45,
  missingInfo: 12,
};
