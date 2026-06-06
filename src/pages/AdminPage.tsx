import { useEffect, useState } from "react"
import { useDataStore } from "@/store/dataStore"
import LoginForm from "@/components/LoginForm"
import AdminTabs from "@/components/AdminTabs"
import BannerMgr from "@/components/BannerMgr"
import CategoryMgr from "@/components/CategoryMgr"
import ProductMgr from "@/components/ProductMgr"
import SettingMgr from "@/components/SettingMgr"
import type { TabKey } from "@/types"

export default function AdminPage() {
  const {
    data,
    isLoaded,
    isPasswordSet,
    loginState,
    init,
    login,
    setPassword,
    logout,
    updateBanners,
    updateCategories,
    updateProducts,
    updateSiteInfo,
  } = useDataStore()

  const [activeTab, setActiveTab] = useState<TabKey>("banner")

  useEffect(() => {
    if (!isLoaded) init()
  }, [isLoaded, init])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-400">加载中...</span>
        </div>
      </div>
    )
  }

  if (!loginState.isLoggedIn) {
    return (
      <LoginForm
        isPasswordSet={isPasswordSet}
        onLogin={login}
        onSetPassword={setPassword}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">后台管理</h1>
            <p className="text-xs text-gray-400 mt-0.5">{data.siteInfo.name || "内容管理"}</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs text-blue-500 font-medium hover:text-blue-600 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            查看前台
          </a>
        </div>
        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        />
      </div>

      <div>
        {activeTab === "banner" && (
          <BannerMgr
            banners={data.banners}
            updateBanners={updateBanners}
          />
        )}
        {activeTab === "category" && (
          <CategoryMgr
            categories={data.categories}
            updateCategories={updateCategories}
          />
        )}
        {activeTab === "product" && (
          <ProductMgr
            products={data.products}
            categories={data.categories}
            updateProducts={updateProducts}
          />
        )}
        {activeTab === "setting" && (
          <SettingMgr info={data.siteInfo} onUpdate={updateSiteInfo} />
        )}
      </div>
    </div>
  )
}
