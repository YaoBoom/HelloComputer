import type { TabKey } from "@/types"
import { Image, Grid3X3, Package, Settings, LogOut } from "lucide-react"

interface Props {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  onLogout: () => void
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "banner", label: "Banner", icon: <Image className="w-5 h-5" /> },
  { key: "category", label: "分类", icon: <Grid3X3 className="w-5 h-5" /> },
  { key: "product", label: "产品", icon: <Package className="w-5 h-5" /> },
  { key: "setting", label: "设置", icon: <Settings className="w-5 h-5" /> },
]

export default function AdminTabs({ activeTab, onTabChange, onLogout }: Props) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center justify-between px-3">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
