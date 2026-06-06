import { useState } from "react"
import { Plus, Pencil, Trash2, Box } from "lucide-react"
import type { Category } from "@/types"
import type { EditField } from "./EditModal"
import EditModal from "./EditModal"
import { generateId } from "@/utils/crypto"

interface Props {
  categories: Category[]
  updateCategories: (categories: Category[]) => void
}

const fields: EditField[] = [
  { key: "name", label: "分类名称", type: "text", placeholder: "输入分类名称如：显卡、处理器" },
  { key: "icon", label: "分类图标", type: "image" },
]

function isImageUrl(val: string): boolean {
  return /^(https?:\/\/|data:|blob:)/i.test(val)
}

export default function CategoryMgr({ categories, updateCategories }: Props) {
  const [editing, setEditing] = useState<Category | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleSave = (data: Record<string, string>) => {
    if (editing) {
      updateCategories(
        categories.map((c) =>
          c.id === editing.id ? { ...c, ...data } : c
        )
      )
      setEditing(null)
    }
  }

  const handleAdd = (data: Record<string, string>) => {
    const newCat: Category = {
      id: generateId(),
      name: data.name || "",
      icon: data.icon || "",
      sort: categories.length,
    }
    updateCategories([...categories, newCat])
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    updateCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">
          {categories.length} 个分类
        </span>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          添加分类
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">暂无分类</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories
            .sort((a, b) => a.sort - b.sort)
            .map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {isImageUrl(cat.icon) ? (
                    <img src={cat.icon} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Box className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {cat.name || "未命名"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(cat)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
          title="编辑分类"
          fields={fields}
          initialData={{ name: editing.name, icon: editing.icon }}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      {showAdd && (
        <EditModal
          title="添加分类"
          fields={fields}
          initialData={{ name: "", icon: "" }}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
