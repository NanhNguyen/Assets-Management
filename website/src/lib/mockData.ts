export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  group_name: string;
  user: string;
  position: string;
  department: string;
  handoverDate: string;
  handoverMinutesNo: string;
  price: number;
  purchaseDate: string;
  vendor: string;
  warrantyPeriod?: string;
  depreciation_months: string;
  notes: string;
  status: "active" | "maintenance" | "liquidated";
  icon: string;
  iconColor: string;
  manufacturer?: string;
  warrantyEnd?: string;
  technicalSpecs?: string;
  quantity?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  assetName: string;
  assetCode: string;
  description: string;
  timestamp: string;
  user: string;
  reason?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(value)
    .replace("₫", "đ");
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString || "N/A";
    return new Intl.DateTimeFormat("vi-VN").format(date);
  } catch (e) {
    return dateString;
  }
};

export const statusLabels: Record<string, string> = {
  active: "Đang sử dụng",
  maintenance: "Bảo trì",
  liquidated: "Đã thanh lý",
  unused: "Chưa sử dụng"
};

export const statusColors: Record<string, string> = {
  active: "emerald",
  maintenance: "amber",
  liquidated: "red",
  unused: "slate"
};

export const DEPARTMENTS = ["Tất cả", "Cơ điện", "Công nghệ", "Truyền thông số", "Hành chính", "Marketing", "Kế toán", "Media"];
export const CATEGORIES = ["Tất cả", "Laptop", "Máy tính", "Thiết bị văn phòng", "Nội thất", "Công cụ dụng cụ"];
export const STATUSES = ["active", "maintenance", "liquidated"];
export const WARRANTY_PERIODS = ["12 tháng", "24 tháng", "36 tháng", "60 tháng", "Trọn đời"];

export const assets: Asset[] = [
  {
    id: "1",
    code: "12.03.01",
    name: "Laptop ASUS vivobook S14",
    category: "Laptop",
    group_name: "Thiết bị IT",
    user: "Ngô Thanh Huyền",
    position: "TP truyền thông",
    department: "Truyền thông số",
    handoverDate: "2025-09-10",
    handoverMinutesNo: "01/25/BBBG",
    price: 18150000,
    purchaseDate: "2025-09-29",
    vendor: "Công ty CP Phát triển Công nghệ Gia Linh",
    warrantyPeriod: "24 tháng",
    depreciation_months: "24",
    notes: "",
    status: "active",
    icon: "laptop_mac",
    iconColor: "indigo",
    manufacturer: "ASUS",
    warrantyEnd: "2027-09-29",
    technicalSpecs: "Intel Core i5, 16GB RAM, 512GB SSD",
    quantity: 1
  },
  {
    id: "2",
    code: "12.03.02",
    name: "MacBook Pro M3 Max",
    category: "Laptop",
    group_name: "Thiết bị IT",
    user: "Nguyễn Hoàng Nam",
    position: "CTO",
    department: "Công nghệ",
    handoverDate: "2024-01-15",
    handoverMinutesNo: "02/24/BBBG",
    price: 82500000,
    purchaseDate: "2024-01-12",
    vendor: "FPT Shop",
    depreciation_months: "36",
    notes: "36GB RAM, 1TB SSD",
    status: "active",
    icon: "laptop_mac",
    iconColor: "indigo",
    manufacturer: "Apple",
    warrantyEnd: "2026-01-12",
    technicalSpecs: "M3 Max, 36GB RAM, 1TB SSD",
    quantity: 1
  },
  {
    id: "3",
    code: "12.03.03",
    name: "HP Pavilion 15",
    category: "Laptop",
    group_name: "Thiết bị IT",
    user: "Bùi Thị Ngọc",
    position: "Content Creator",
    department: "Marketing",
    handoverDate: "2024-03-20",
    handoverMinutesNo: "05/24/BBBG",
    price: 16200000,
    purchaseDate: "2024-03-12",
    vendor: "Phong Vũ",
    depreciation_months: "24",
    notes: "Màu Gold, RAM 16GB",
    status: "active",
    icon: "laptop_mac",
    iconColor: "amber",
    manufacturer: "HP",
    warrantyEnd: "2026-03-12",
    technicalSpecs: "Intel Core i7, 16GB RAM, 512GB SSD",
    quantity: 1
  }
];

export const mockAssets = assets;
export const summaryStats = {
  totalAssets: 156,
  totalValue: 2450000000,
  activeAssets: 142,
  maintenanceAssets: 8,
  liquidatedAssets: 6
};
