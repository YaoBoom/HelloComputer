import type { AppData, AdminConfig } from "@/types"

const APP_DATA_KEY = "app_data"
const ADMIN_CONFIG_KEY = "admin_config"
const ADMIN_SESSION_KEY = "admin_session"

export function getDefaultAppData(): AppData {
  return {
    banners: [
      { id: "1", title: "哈喽精品数码", imageUrl: "", sort: 0 },
    ],
    categories: [
      { id: "1", name: "显卡", icon: "gpu", sort: 0 },
      { id: "2", name: "处理器", icon: "cpu", sort: 1 },
      { id: "3", name: "主板", icon: "motherboard", sort: 2 },
      { id: "4", name: "电源", icon: "power", sort: 3 },
      { id: "5", name: "硬盘", icon: "storage", sort: 4 },
      { id: "6", name: "内存", icon: "memory", sort: 5 },
      { id: "7", name: "散热器", icon: "cooling", sort: 6 },
      { id: "8", name: "机箱", icon: "case", sort: 7 },
    ],
    products: [
      {
        id: "1",
        name: "RTX 4060 Ti 8G 独立显卡",
        imageUrl: "",
        images: [],
        description: "新一代光线追踪显卡，支持DLSS 3技术\n显存容量：8GB GDDR6\n核心频率：2535MHz\n接口：PCI-E 4.0 x8",
        price: "¥2999",
        categoryId: "1",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "i5-13600KF 处理器",
        imageUrl: "",
        images: [],
        description: "第13代酷睿处理器\n14核心20线程\n最大睿频5.1GHz\nLGA1700接口",
        price: "¥1899",
        categoryId: "2",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "B760M 芯片组主板",
        imageUrl: "",
        images: [],
        description: "M-ATX紧凑设计\nDDR5内存支持\nPCIe 5.0插槽\nWi-Fi 6E无线网卡",
        price: "¥899",
        categoryId: "3",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "750W 金牌全模组电源",
        imageUrl: "",
        images: [],
        description: "80PLUS金牌认证\n全模组设计\n全日系电容\n静音风扇",
        price: "¥599",
        categoryId: "4",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "1TB NVMe M.2 固态硬盘",
        imageUrl: "",
        images: [],
        description: "读取速度7000MB/s\nPCIe 4.0接口\nTLC颗粒\n5年质保",
        price: "¥499",
        categoryId: "5",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "6",
        name: "DDR5 32GB 6000MHz 内存",
        imageUrl: "",
        images: [],
        description: "16GB x 2套条\n时序CL30\n支持XMP 3.0\n终身质保",
        price: "¥699",
        categoryId: "6",
        sort: 0,
        createdAt: new Date().toISOString(),
      },
    ],
    siteInfo: {
      name: "哈喽精品数码",
      subtitle: "DIGITAL HARDWARE SOLUTION",
      address: "请在后天设置地址",
      phone: "13800138000",
      douyin: "",
      wechat: "",
      logo: "",
    },
  }
}

export function getDefaultAdminConfig(): AdminConfig {
  return {
    passwordHash: "",
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(APP_DATA_KEY)
    if (raw) {
      return JSON.parse(raw) as AppData
    }
  } catch {
    // fallback
  }
  const defaults = getDefaultAppData()
  saveAppData(defaults)
  return defaults
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data))
}

export function loadAdminConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY)
    if (raw) {
      return JSON.parse(raw) as AdminConfig
    }
  } catch {
    // fallback
  }
  const defaults = getDefaultAdminConfig()
  saveAdminConfig(defaults)
  return defaults
}

export function saveAdminConfig(config: AdminConfig): void {
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config))
}

export function saveSession(token: string): void {
  localStorage.setItem(ADMIN_SESSION_KEY, token)
}

export function getSession(): string | null {
  return localStorage.getItem(ADMIN_SESSION_KEY)
}

export function clearSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}
