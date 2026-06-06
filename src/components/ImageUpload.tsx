import { useRef, useState } from "react"
import { Upload, Link, X } from "lucide-react"

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showUrl, setShowUrl] = useState(false)
  const [urlInput, setUrlInput] = useState(value || "")

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
      setUrlInput(reader.result as string)
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleUrlConfirm = () => {
    onChange(urlInput)
    setShowUrl(false)
  }

  const handleClear = () => {
    onChange("")
    setUrlInput("")
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="预览"
            className="w-full h-36 object-cover rounded-xl border border-gray-200"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70 transition-colors"
          >
            更换图片
          </button>
        </div>
      ) : showUrl ? (
        <div className="space-y-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="输入图片链接地址"
            className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleUrlConfirm}
              className="flex-1 h-9 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              确定
            </button>
            <button
              onClick={() => setShowUrl(false)}
              className="flex-1 h-9 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs">上传图片</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUrl(true)
              setUrlInput("")
            }}
            className="flex-1 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors"
          >
            <Link className="w-6 h-6" />
            <span className="text-xs">输入链接</span>
          </button>
        </div>
      )}
    </div>
  )
}
