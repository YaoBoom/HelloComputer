import { create } from "zustand"
import type { AppData, Banner, Category, Product, SiteInfo, LoginState } from "@/types"
import {
  loadAppData,
  saveAppData,
  loadAdminConfig,
  saveAdminConfig,
  saveSession,
  getSession,
  clearSession,
} from "@/utils/storage"
import {
  generateId,
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "@/utils/crypto"

interface DataStore {
  data: AppData
  isLoaded: boolean
  selectedCategoryId: string
  loginState: LoginState
  isPasswordSet: boolean

  init: () => void
  setSelectedCategoryId: (id: string) => void

  updateBanners: (banners: Banner[]) => void
  updateCategories: (categories: Category[]) => void
  updateProducts: (products: Product[]) => void
  updateSiteInfo: (info: SiteInfo) => void

  addBanner: (banner: Omit<Banner, "id" | "sort">) => void
  addCategory: (category: Omit<Category, "id" | "sort">) => void
  addProduct: (product: Omit<Product, "id" | "sort" | "createdAt">) => void

  deleteBanner: (id: string) => void
  deleteCategory: (id: string) => void
  deleteProduct: (id: string) => void

  setPassword: (password: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
  login: (password: string) => Promise<boolean>
  logout: () => void
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: {
    banners: [],
    categories: [],
    products: [],
    siteInfo: { name: "", subtitle: "", address: "", phone: "", douyin: "", wechat: "", logo: "" },
  },
  isLoaded: false,
  selectedCategoryId: "",
  loginState: {
    isLoggedIn: false,
    sessionToken: "",
  },
  isPasswordSet: false,

  init: () => {
    const data = loadAppData()
    const config = loadAdminConfig()
    const session = getSession()
    set({
      data,
      isLoaded: true,
      isPasswordSet: !!config.passwordHash,
      loginState: {
        isLoggedIn: !!session,
        sessionToken: session || "",
      },
    })
  },

  setSelectedCategoryId: (id: string) => set({ selectedCategoryId: id }),

  _persist: (data: AppData) => {
    saveAppData(data)
    set({ data })
  },

  updateBanners: (banners: Banner[]) => {
    const next = { ...get().data, banners }
    saveAppData(next)
    set({ data: next })
  },
  updateCategories: (categories: Category[]) => {
    const next = { ...get().data, categories }
    saveAppData(next)
    set({ data: next })
  },
  updateProducts: (products: Product[]) => {
    const next = { ...get().data, products }
    saveAppData(next)
    set({ data: next })
  },
  updateSiteInfo: (info: SiteInfo) => {
    const next = { ...get().data, siteInfo: info }
    saveAppData(next)
    set({ data: next })
  },

  addBanner: (banner) => {
    const { data } = get()
    const banners = data.banners
    const newBanner: Banner = {
      ...banner,
      id: generateId(),
      sort: banners.length,
    }
    const next = { ...data, banners: [...banners, newBanner] }
    saveAppData(next)
    set({ data: next })
  },
  addCategory: (category) => {
    const { data } = get()
    const categories = data.categories
    const newCategory: Category = {
      ...category,
      id: generateId(),
      sort: categories.length,
    }
    const next = { ...data, categories: [...categories, newCategory] }
    saveAppData(next)
    set({ data: next })
  },
  addProduct: (product) => {
    const { data } = get()
    const products = data.products
    const newProduct: Product = {
      ...product,
      images: product.images || [],
      id: generateId(),
      sort: products.length,
      createdAt: new Date().toISOString(),
    }
    const next = { ...data, products: [...products, newProduct] }
    saveAppData(next)
    set({ data: next })
  },

  deleteBanner: (id: string) => {
    const { data } = get()
    const banners = data.banners.filter((b) => b.id !== id)
    const next = { ...data, banners }
    saveAppData(next)
    set({ data: next })
  },
  deleteCategory: (id: string) => {
    const { data } = get()
    const categories = data.categories.filter((c) => c.id !== id)
    const products = data.products.filter((p) => p.categoryId !== id)
    const next = { ...data, categories, products }
    saveAppData(next)
    set({ data: next })
  },
  deleteProduct: (id: string) => {
    const { data } = get()
    const products = data.products.filter((p) => p.id !== id)
    const next = { ...data, products }
    saveAppData(next)
    set({ data: next })
  },

  setPassword: async (password: string) => {
    const hash = await hashPassword(password)
    const config = loadAdminConfig()
    config.passwordHash = hash
    saveAdminConfig(config)
    set({ isPasswordSet: true })
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const config = loadAdminConfig()
    const ok = await verifyPassword(oldPassword, config.passwordHash)
    if (!ok) return false
    const hash = await hashPassword(newPassword)
    config.passwordHash = hash
    saveAdminConfig(config)
    return true
  },

  login: async (password: string) => {
    const config = loadAdminConfig()
    const ok = await verifyPassword(password, config.passwordHash)
    if (ok) {
      const token = generateSessionToken()
      saveSession(token)
      set({
        loginState: { isLoggedIn: true, sessionToken: token },
      })
      return true
    }
    return false
  },

  logout: () => {
    clearSession()
    set({
      loginState: { isLoggedIn: false, sessionToken: "" },
    })
  },
}))
