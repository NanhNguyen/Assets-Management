const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://skrylujulvqyxxwdybim.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnlsdWp1bHZxeXh4d2R5YmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTE4OTcsImV4cCI6MjA5MTg4Nzg5N30.th8nMuDfLolMxUX65m_MfnNZxG-XGaFuLqXSRXrwSHg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mockAssets = [
  {
    code: "TS-001",
    name: "MacBook Pro M3 14\"",
    category: "Laptop",
    group_name: "Thiết bị IT",
    manufacturer: "Apple",
    assigned_user: "Nguyễn Anh",
    department: "Công nghệ",
    position: "P.402",
    status: "active",
    price: 45000000,
    purchase_date: "2024-01-15",
    vendor: "FPT Shop",
    depreciation_months: "24",
    notes: "Nguyên seal, kèm sạc 96W",
    icon: "laptop_mac",
    icon_color: "indigo"
  },
  {
    code: "TS-002",
    name: "iPhone 15 Pro Max 256GB",
    category: "Điện thoại",
    group_name: "Thiết bị IT",
    manufacturer: "Apple",
    assigned_user: "Trần Bình",
    department: "Kinh doanh",
    position: "P.301",
    status: "active",
    price: 32000000,
    purchase_date: "2024-02-10",
    vendor: "TopZone",
    depreciation_months: "12",
    notes: "Màu Titan xanh",
    icon: "smartphone",
    icon_color: "blue"
  },
  {
    code: "TS-003",
    name: "Ghế xoay công thái học",
    category: "Nội thất",
    group_name: "Công cụ dụng cụ",
    manufacturer: "Hòa Phát",
    assigned_user: "Lê Chi",
    department: "Nhân sự",
    position: "P.105",
    status: "active",
    price: 3500000,
    purchase_date: "2023-12-01",
    vendor: "Nội thất Hòa Phát",
    depreciation_months: "36",
    notes: "Bảo hành 12 tháng",
    icon: "event_seat",
    icon_color: "emerald"
  }
];

async function seed() {
  console.log("Seeding data to Supabase...");
  const { data, error } = await supabase
    .from('assets')
    .insert(mockAssets);

  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Seed successful!");
  }
}

seed();
