import { Asset, AuditLog } from "./mockData";

export async function fetchAssets(): Promise<Asset[]> {
  const res = await fetch("http://localhost:3002/api/assets", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch assets");
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  
  return json.data.map((row: any) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    group: row.group_name,
    manufacturer: row.manufacturer,
    user: row.assigned_user,
    department: row.department,
    position: row.position,
    status: row.status,
    price: Number(row.price),
    purchaseDate: row.purchase_date,
    vendor: row.vendor,
    warrantyEnd: row.warranty_end,
    depreciationYears: row.depreciation_years,
    depreciationRate: Number(row.depreciation_rate),
    notes: row.notes,
    icon: row.icon,
    iconColor: row.icon_color,
  }));
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch("http://localhost:3002/api/audit-logs", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  const json = await res.json();
  if (!json.success) throw new Error(json.error);

  return json.data.map((row: any) => ({
    id: row.id,
    timestamp: row.created_at,
    action: row.action,
    assetName: row.asset_name,
    assetCode: row.asset_code,
    field: row.field,
    oldValue: row.old_value,
    newValue: row.new_value,
    user: row.user_email,
    description: row.description,
    reason: row.reason,
  }));
}

export function generateSummaryStats(assets: Asset[]) {
  const departmentsMap = new Map();
  const usersSet = new Set();
  let totalValue = 0;
  let inUse = 0, unused = 0, maintenance = 0, liquidated = 0;

  assets.forEach(a => {
    totalValue += a.price;
    usersSet.add(a.user);
    if (a.status === "active") inUse++;
    else if (a.status === "unused") unused++;
    else if (a.status === "maintenance") maintenance++;
    else if (a.status === "liquidated") liquidated++;

    if (!departmentsMap.has(a.department)) {
      departmentsMap.set(a.department, { name: a.department, code: a.department, assetCount: 0, totalValue: 0, percentage: 0 });
    }
    const d = departmentsMap.get(a.department);
    d.assetCount++;
    d.totalValue += a.price;
  });

  const departmentsArray = Array.from(departmentsMap.values());
  departmentsArray.forEach(d => {
    d.percentage = totalValue > 0 ? (d.totalValue / totalValue) * 100 : 0;
  });

  return {
    totalAssets: assets.length,
    totalValue,
    activeUsers: usersSet.size,
    departmentsCount: departmentsMap.size,
    inUse, unused, maintenance, liquidated,
    departments: departmentsArray.sort((a, b) => b.totalValue - a.totalValue)
  };
}
