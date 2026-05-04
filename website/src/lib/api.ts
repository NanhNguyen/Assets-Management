import { formatCurrency, formatDate, type Asset, DEPARTMENTS, CATEGORIES } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");
  
  const getHeaders = (t: string | null) => ({
    ...options.headers,
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  });

  let response = await fetch(url, { ...options, headers: getHeaders(token) });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          token = data.accessToken;
          // Retry original request
          response = await fetch(url, { ...options, headers: getHeaders(token) });
        } else {
          // Refresh failed
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = '/login';
    }
  }

  return response;
}

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetchWithAuth(`${API_URL}/assets`);

  const data = await response.json();
  if (response.status === 401 || !data.success) {
    throw new Error(data?.error || "Failed to fetch assets");
  }

  return data.data.map((row: any) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    group_name: row.group_name,
    manufacturer: row.manufacturer,
    user: row.assigned_user || "Chưa bàn giao",
    department: row.department,
    position: row.position,
    status: row.status,
    price: Number(row.price),
    purchaseDate: row.purchase_date,
    handoverDate: row.handover_date || row.purchase_date,
    handoverMinutesNo: row.handover_minutes_no || "",
    vendor: row.vendor,
    warrantyEnd: row.warranty_end,
    depreciation_months: row.depreciation_months || "0",
    notes: row.notes,
    icon: row.icon || "inventory_2",
    iconColor: row.icon_color || "indigo",
  }));
};

export const fetchAuditLogs = async () => {
  const response = await fetchWithAuth(`${API_URL}/audit-logs`);

  const data = await response.json();
  if (response.status === 401 || !data.success) {
    throw new Error(data?.error || "Failed to fetch audit logs");
  }

  return data.data.map((log: any) => ({
    id: log.id,
    action: log.action,
    assetName: log.asset_name || log.assetName,
    assetCode: log.asset_code || log.assetCode,
    description: log.description,
    timestamp: log.created_at || log.timestamp,
    user: log.user_email || log.user,
    reason: log.reason,
    field: log.field,
    oldValue: log.old_value || log.oldValue,
    newValue: log.new_value || log.newValue,
  }));
};

export const createAsset = async (assetData: any): Promise<Asset> => {
  const response = await fetchWithAuth(`${API_URL}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetData),
  });

  const row = await response.json();
  if (response.status === 401 || !row.success) {
    throw new Error(row?.error || "Failed to create asset");
  }

  const data = row.data;
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    category: data.category,
    group_name: data.group_name,
    manufacturer: data.manufacturer,
    user: data.assigned_user || "Chưa bàn giao",
    department: data.department,
    position: data.position,
    status: data.status,
    price: Number(data.price),
    purchaseDate: data.purchase_date,
    handoverDate: data.handover_date || data.purchase_date,
    handoverMinutesNo: data.handover_minutes_no || "",
    vendor: data.vendor,
    warrantyEnd: data.warranty_end,
    depreciation_months: data.depreciation_months || "0",
    notes: data.notes,
    icon: data.icon || "inventory_2",
    iconColor: data.icon_color || "indigo",
  };
};

export const generateSummaryStats = (assets: Asset[]) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.price, 0);
  const totalAssets = assets.length;
  
  const deptMap = assets.reduce((acc, asset) => {
    acc[asset.department] = (acc[asset.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDeps = Object.entries(deptMap)
    .map(([name, count]) => ({
      name,
      assetCount: count,
      code: name.toLowerCase().replace(/\s+/g, '-'),
      percentage: (count / (totalAssets || 1)) * 100
    }))
    .sort((a, b) => b.assetCount - a.assetCount);

  return {
    totalValue,
    totalAssets,
    departments: sortedDeps
  };
};

export const getStats = (assets: Asset[]) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.price, 0);
  const totalAssets = assets.length;
  
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalValue,
    totalAssets,
    statusCounts,
    activeAssets: statusCounts['active'] || 0,
    maintenanceAssets: statusCounts['maintenance'] || 0,
    brokenAssets: statusCounts['broken'] || 0,
    liquidationAssets: statusCounts['liquidation'] || 0,
  };
};

export const updateAsset = async (assetData: any): Promise<Asset> => {
  const response = await fetchWithAuth(`${API_URL}/assets/${assetData.id}`, {
    method: "POST", // Backend uses @Post for update too as per previous edit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetData),
  });

  const row = await response.json();
  if (!row.success) {
    throw new Error(row?.error || "Failed to update asset");
  }

  const data = row.data;
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    category: data.category,
    group_name: data.group_name,
    manufacturer: data.manufacturer,
    user: data.assigned_user || "Chưa bàn giao",
    department: data.department,
    position: data.position,
    status: data.status,
    price: Number(data.price),
    purchaseDate: data.purchase_date,
    handoverDate: data.handover_date || data.purchase_date,
    handoverMinutesNo: data.handover_minutes_no || "",
    vendor: data.vendor,
    warrantyEnd: data.warranty_end,
    depreciation_months: data.depreciation_months || "0",
    notes: data.notes,
    icon: data.icon || "inventory_2",
    iconColor: data.icon_color || "indigo",
  };
};

export const getAssetHandovers = async (id: string) => {
  const response = await fetchWithAuth(`${API_URL}/assets/${id}/handovers`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data?.error || "Failed to fetch handovers");
  }
  return data.data;
};
