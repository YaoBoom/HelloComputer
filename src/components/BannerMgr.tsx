import { useState } from "react"
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react"
import type { Banner } from "@/types"
import type { EditField } from "./EditModal"
import EditModal from "./EditModal"
import { generateId } from "@/utils/crypto"

interface Props {
  banners: Banner[]
  updateBanners: (banners: Banner[]) => void
}

const fields: EditField[] = [
  { key: "title", label: "标题", type: "text", placeholder: "输入 Banner 标题" },
  { key: "imageUrl", label: "Banner 图片", type: "image" },
]

export default function BannerMgr({ banners, updateBanners }: Props) {
  const [editing, setEditing] = useState<Banner | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleSave = (data: Record<string, string>) => {
    if (editing) {
      updateBanners(
        banners.map((b) => (b.id === editing.id ? { ...b, ...data } : b))
      )
      setEditing(null)
    }
  }

  const handleAdd = (data: Record<string, string>) => {
    const newBanner: Banner = {
      id: generateId(),
      title: data.title || "",
      imageUrl: data.imageUrl || "",
      sort: banners.length,
    }
    updateBanners([...banners, newBanner])
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    updateBanners(banners.filter((b) => b.id !== id))
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{banners.length} 张图片</span>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          添加
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">暂无 Banner</p>
        </div>
      ) : (
        <div className="space-y-2">
          {banners
            .sort((a, b) => a.sort - b.sort)
            .map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {banner.title || "未命名"}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {banner.imageUrl || "无图片"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(banner)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <EditModal
          title="编辑 Banner"
          fields={fields}
          initialData={{ title: editing.title, imageUrl: editing.imageUrl }}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      {showAdd && (
        <EditModal
          title="添加 Banner"
          fields={fields}
          initialData={{ title: "", imageUrl: "" }}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
