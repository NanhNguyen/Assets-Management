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
  { name: "Công nghệ", code: "IT", assetCount: 45, totalValue: 1250000000, percentage: 85 },
  { name: "Kinh doanh", code: "KD", assetCount: 38, totalValue: 850000000, percentage: 75 },
  { name: "Media", code: "MD", assetCount: 42, totalValue: 1850000000, percentage: 90 },
  { name: "Truyền thông số", code: "DIG", assetCount: 25, totalValue: 560000000, percentage: 65 },
  { name: "Marketing", code: "MKT", assetCount: 31, totalValue: 480000000, percentage: 70 },
  { name: "SEO", code: "SEO", assetCount: 15, totalValue: 220000000, percentage: 40 },
  { name: "MCN", code: "MCN", assetCount: 20, totalValue: 450000000, percentage: 55 },
];

export const assets: Asset[] = [
  {
    id: "1", code: "12.03.01", name: "Laptop ASUS vivobook S14 S3407VA", category: "Laptop", group: "Thiết bị IT",
    manufacturer: "ASUS", user: "Ngô Thanh Huyền", department: "Truyền thông số", position: "TP truyền thông",
    status: "active", price: 18150000, purchaseDate: "2025-09-29", vendor: "Công ty CP Phát triển Công nghệ Gia Linh", warrantyEnd: "2027-09-29",
    depreciationYears: 2, depreciationRate: 50, notes: "Core i7 - 13620H / RAM 16GB / SSD 512GB",
    icon: "laptop_mac", iconColor: "indigo"
  },
  {
    id: "2", code: "12.17.01", name: "Sạc Pin Laptop ASUS vivobook", category: "Linh kiện", group: "Thiết bị IT",
    manufacturer: "ASUS", user: "Ngô Thanh Huyền", department: "Truyền thông số", position: "TP truyền thông",
    status: "active", price: 500000, purchaseDate: "2025-09-29", vendor: "Công ty CP Phát triển Công nghệ Gia Linh", warrantyEnd: "2026-09-29",
    depreciationYears: 1, depreciationRate: 100, notes: "Sạc kèm theo Laptop 12.03.01",
    icon: "battery_charging_full", iconColor: "amber"
  },
  {
    id: "3", code: "12.03.02", name: "Laptop ASUS vivobook S14 S3407VA", category: "Laptop", group: "Thiết bị IT",
    manufacturer: "ASUS", user: "Nguyễn Thị Tuyết Nhung", department: "Kinh doanh", position: "TP Kinh doanh và quan hệ đối tác",
    status: "active", price: 18150000, purchaseDate: "2025-09-29", vendor: "Công ty CP Phát triển Công nghệ Gia Linh", warrantyEnd: "2027-09-29",
    depreciationYears: 2, depreciationRate: 50, notes: "Core i7 - 13620H / RAM 16GB / SSD 512GB",
    icon: "laptop_mac", iconColor: "indigo"
  },
  {
    id: "4", code: "12.03.03", name: "MacBook Pro M3 Max", category: "Laptop", group: "Thiết bị IT",
    manufacturer: "Apple", user: "Nguyễn Hoàng Nam", department: "Công nghệ", position: "CTO",
    status: "active", price: 82500000, purchaseDate: "2024-01-12", vendor: "FPT Shop", warrantyEnd: "2026-01-12",
    depreciationYears: 3, depreciationRate: 33.3, notes: "36GB RAM, 1TB SSD",
    icon: "laptop_mac", iconColor: "indigo"
  },
  {
    id: "5", code: "11.01.001", name: "Máy In Canon LBP2900", category: "Máy in", group: "Thiết bị văn phòng",
    manufacturer: "Canon", user: "Trần Minh Tâm", department: "MCN", position: "Admin",
    status: "active", price: 4500000, purchaseDate: "2025-05-15", vendor: "Nguyễn Kim", warrantyEnd: "2026-05-15",
    depreciationYears: 3, depreciationRate: 33.3, notes: "Máy in đen trắng văn phòng",
    icon: "print", iconColor: "purple"
  },
  {
    id: "6", code: "12.04.15", name: "Màn hình Dell UltraSharp U2723QE", category: "Màn hình", group: "Thiết bị IT",
    manufacturer: "Dell", user: "Lê Quốc Anh", department: "Media", position: "Video Editor",
    status: "active", price: 15500000, purchaseDate: "2025-02-10", vendor: "Hanoi Computer", warrantyEnd: "2028-02-10",
    depreciationYears: 3, depreciationRate: 33.3, notes: "4K IPS Black, USB-C Hub",
    icon: "monitor", iconColor: "sky"
  },
  {
    id: "7", code: "12.20.01", name: "Máy ảnh Sony Alpha A7 IV", category: "Thiết bị ghi hình", group: "Thiết bị Media",
    manufacturer: "Sony", user: "Đặng Thu Thảo", department: "Media", position: "Photographer",
    status: "active", price: 58000000, purchaseDate: "2024-11-20", vendor: "Sony Center", warrantyEnd: "2026-11-20",
    depreciationYears: 3, depreciationRate: 33.3, notes: "Kèm Lens 24-70mm GM II",
    icon: "photo_camera", iconColor: "rose"
  },
  {
    id: "8", code: "12.03.45", name: "Laptop Dell Vostro 3520", category: "Laptop", group: "Thiết bị IT",
    manufacturer: "Dell", user: "Hoàng Văn Nam", department: "SEO", position: "SEO Specialist",
    status: "active", price: 12500000, purchaseDate: "2025-01-05", vendor: "Thế giới di động", warrantyEnd: "2026-01-05",
    depreciationYears: 2, depreciationRate: 50, notes: "Core i5, 8GB RAM",
    icon: "laptop_mac", iconColor: "blue"
  },
  {
    id: "9", code: "11.05.12", name: "Bàn làm việc gỗ sồi", category: "Nội thất", group: "Thiết bị văn phòng",
    manufacturer: "Hòa Phát", user: "Ngô Thanh Huyền", department: "Truyền thông số", position: "TP truyền thông",
    status: "active", price: 2800000, purchaseDate: "2025-10-10", vendor: "Nội thất Hòa Phát", warrantyEnd: "2030-10-10",
    depreciationYears: 10, depreciationRate: 10, notes: "Bàn dài 1m2 cho quản lý",
    icon: "table_restaurant", iconColor: "emerald"
  },
  {
    id: "10", code: "12.03.99", name: "HP Pavilion 15", category: "Laptop", group: "Thiết bị IT",
    manufacturer: "HP", user: "Bùi Thị Ngọc", department: "Marketing", position: "Content Creator",
    status: "active", price: 16200000, purchaseDate: "2024-03-12", vendor: "Phong Vũ", warrantyEnd: "2026-03-12",
    depreciationYears: 2, depreciationRate: 50, notes: "Màu Gold, RAM 16GB",
    icon: "laptop_mac", iconColor: "amber"
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: "1", timestamp: "2025-10-16T14:30:00", action: "create", assetName: "Laptop ASUS vivobook S14",
    assetCode: "12.03.02", user: "Admin", description: "Bàn giao tài sản cho Nguyễn Thị Tuyết Nhung (Phòng Kinh doanh)"
  },
  {
    id: "2", timestamp: "2025-10-09T09:15:00", action: "create", assetName: "Laptop ASUS vivobook S14",
    assetCode: "12.03.01", user: "Admin", description: "Bàn giao tài sản cho Ngô Thanh Huyền (Phòng Truyền thông số)"
  },
  {
    id: "3", timestamp: "2025-10-09T09:20:00", action: "create", assetName: "Sạc Pin Laptop ASUS vivobook",
    assetCode: "12.17.01", user: "Admin", description: "Bàn giao sạc pin kèm laptop"
  },
  {
    id: "4", timestamp: "2026-04-09T15:00:00", action: "edit", assetName: "MacBook Pro M3 Max",
    assetCode: "12.03.03", field: "Trạng thái", oldValue: "active", newValue: "maintenance",
    user: "Kế toán", description: "Cập nhật trạng thái bảo trì định kỳ"
  },
  {
    id: "5", timestamp: "2026-04-08T10:00:00", action: "export", assetName: "Toàn bộ tài sản",
    assetCode: "ALL", user: "Admin", description: "Xuất báo cáo tài sản phục vụ kiểm kê đầu quý"
  },
];

export const statusLabels: Record<Asset["status"], string> = {
  active: "Đang sử dụng",
  unused: "Chưa sử dụng",
  maintenance: "Đang bảo trì",
  liquidated: "Đã thanh lý",
};

export const statusColors: Record<Asset["status"], { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-green-500/10", text: "text-green-600", dot: "bg-green-600" },
  unused: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-600" },
  maintenance: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-600" },
  liquidated: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-600" },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export const summaryStats = {
  totalAssets: 216,
  totalValue: 5680000000,
  activeUsers: 112,
  departments: 7,
  inUse: 198,
  unused: 12,
  maintenance: 4,
  liquidated: 2,
  unassigned: 8,
  missingInfo: 3,
};
