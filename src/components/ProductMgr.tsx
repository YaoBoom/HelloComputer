import { useState } from "react"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
import type { Product, Category } from "@/types"
import type { EditField } from "./EditModal"
import EditModal from "./EditModal"
import { generateId } from "@/utils/crypto"

interface Props {
  products: Product[]
  categories: Category[]
  updateProducts: (products: Product[]) => void
}

const fields = (categories: Category[]): EditField[] => [
  { key: "name", label: "产品名称", type: "text", placeholder: "输入产品名称" },
  {
    key: "categoryId",
    label: "所属分类",
    type: "select",
    options: categories.map((c) => ({ value: c.id, label: c.name })),
  },
  { key: "imageUrl", label: "封面图片", type: "image" },
  {
    key: "detailImages",
    label: "详情图片（多张）",
    type: "imagelist",
    hint: "每行一个图片链接，或点击「上传图片」按钮从本地选取",
  },
  { key: "price", label: "售价", type: "text", placeholder: "如 ¥2999" },
  { key: "description", label: "规格参数", type: "textarea", placeholder: "输入产品规格参数" },
]

export default function ProductMgr({ products, categories, updateProducts }: Props) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const normalizeImages = (imagesStr: string): string[] => {
    return imagesStr
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const handleSave = (data: Record<string, string>) => {
    if (editing) {
      updateProducts(
        products.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: data.name || "",
                imageUrl: data.imageUrl || "",
                images: normalizeImages(data.detailImages || ""),
                price: data.price || "",
                categoryId: data.categoryId || "",
                description: data.description || "",
              }
            : p
        )
      )
      setEditing(null)
    }
  }

  const handleAdd = (data: Record<string, string>) => {
    const newProd: Product = {
      id: generateId(),
      name: data.name || "",
      imageUrl: data.imageUrl || "",
      images: normalizeImages(data.detailImages || ""),
      description: data.description || "",
      price: data.price || "",
      categoryId: data.categoryId || categories[0]?.id || "",
      sort: products.length,
      createdAt: new Date().toISOString(),
    }
    updateProducts([...products, newProd])
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    updateProducts(products.filter((p) => p.id !== id))
  }

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId)
    return cat ? cat.name : "未分类"
  }

  const sortedProducts = [...products].sort((a, b) => {
    const ci = categories.findIndex((c) => c.id === a.categoryId)
    const cj = categories.findIndex((c) => c.id === b.categoryId)
    if (ci !== cj) return ci - cj
    return a.sort - b.sort
  })

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">
          {products.length} 个产品
        </span>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          添加产品
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">暂无产品</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedProducts.map((product) => {
            const imgCount = product.images?.filter(Boolean).length || 0
            return (
              <div
                key={product.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {(product.imageUrl || product.images?.[0]) ? (
                    <img
                      src={product.imageUrl || product.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name || "未命名"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      {getCategoryName(product.categoryId)}
                    </span>
                    {product.price && (
                      <span className="text-xs font-bold text-red-500">
                        {product.price}
                      </span>
                    )}
                    {imgCount > 0 && (
                      <span className="text-xs text-gray-400">
                        {imgCount}张图
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(product)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <EditModal
          title="编辑产品"
          fields={fields(categories)}
          initialData={{
            name: editing.name,
            categoryId: editing.categoryId,
            imageUrl: editing.imageUrl,
            detailImages: editing.images?.join("\n") || "",
            price: editing.price,
            description: editing.description,
          }}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      {showAdd && (
        <EditModal
          title="添加产品"
          fields={fields(categories)}
          initialData={{
            name: "",
            categoryId: categories[0]?.id || "",
            imageUrl: "",
            detailImages: "",
            price: "",
            description: "",
          }}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
