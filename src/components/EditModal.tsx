import { useState, useEffect, useRef } from "react"
import { X, Upload } from "lucide-react"
import ImageUpload from "./ImageUpload"

export interface EditField {
  key: string
  label: string
  type: "text" | "textarea" | "select" | "image" | "imagelist"
  placeholder?: string
  options?: { value: string; label: string }[]
  hint?: string
}

interface Props {
  title: string
  fields: EditField[]
  initialData: Record<string, string>
  onSave: (data: Record<string, string>) => void
  onClose: () => void
}

export default function EditModal({ title, fields, initialData, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormData({ ...initialData })
  }, [initialData])

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave({ ...formData })
  }

  const handleUploadToField = (key: string) => {
    fileRef.current?.click()
    ;(fileRef.current as any).__targetKey = key
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const targetKey = (fileRef.current as any).__targetKey as string
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (targetKey) {
        const prev = formData[targetKey] || ""
        setFormData((f) => ({
          ...f,
          [targetKey]: prev ? prev + "\n" + dataUrl : dataUrl,
        }))
      }
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleRemoveImageLine = (key: string, index: number) => {
    const lines = (formData[key] || "").split("\n").filter(Boolean)
    lines.splice(index, 1)
    handleChange(key, lines.join("\n"))
  }

  const renderImagelist = (field: EditField) => {
    const lines = (formData[field.key] || "").split("\n").filter(Boolean)
    return (
      <div>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleUploadToField(field.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            上传图片
          </button>
          <span className="text-xs text-gray-300 self-center">
            也可在下方文本框粘贴URL或已有图片数据
          </span>
        </div>
        {lines.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {lines.map((url, i) => (
              <div key={i} className="relative flex-shrink-0 group">
                <img
                  src={url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <button
                  onClick={() => handleRemoveImageLine(field.key, i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <textarea
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || "每行一个图片链接，也可点击上方按钮上传"}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
        />
        {field.hint && (
          <p className="text-xs text-gray-400 mt-1">{field.hint}</p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all bg-white"
                >
                  <option value="">请选择</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "image" ? (
                <ImageUpload
                  value={formData[field.key] || ""}
                  onChange={(v) => handleChange(field.key, v)}
                />
              ) : field.type === "imagelist" ? (
                renderImagelist(field)
              ) : (
                <input
                  type="text"
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-4 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200"
          >
            保存
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
