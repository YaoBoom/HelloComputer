export interface Banner {
  id: string
  title: string
  imageUrl: string
  link?: string
  sort: number
}

export interface Category {
  id: string
  name: string
  icon: string
  sort: number
}

export interface Product {
  id: string
  name: string
  imageUrl: string
  images: string[]
  description: string
  price: string
  categoryId: string
  sort: number
  createdAt: string
}

export interface SiteInfo {
  name: string
  subtitle: string
  address: string
  phone: string
  douyin: string
  wechat: string
  logo: string
}

export interface AppData {
  banners: Banner[]
  categories: Category[]
  products: Product[]
  siteInfo: SiteInfo
}

export interface AdminConfig {
  passwordHash: string
}

export type TabKey = "banner" | "category" | "product" | "setting"

export interface LoginState {
  isLoggedIn: boolean
  sessionToken: string
}
