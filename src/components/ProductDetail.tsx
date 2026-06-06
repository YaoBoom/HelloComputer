import { useState } from "react"
import { X, Package, ChevronLeft, ChevronRight, Tag, Phone } from "lucide-react"
import type { Product } from "@/types"
import { useDataStore } from "@/store/dataStore"

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: Props) {
  const { data } = useDataStore()
  const phone = data.siteInfo.phone
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)

  const goNext = () => setActiveIndex((prev) => (prev + 1) % allImages.length)
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#111318] rounded-t-2xl max-h-[92vh] overflow-y-auto animate-slide-up border-t border-white/[0.06]">
        <div className="sticky top-0 bg-[#111318]/95 backdrop-blur-md z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-gray-200">产品详情</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="relative bg-[#0a0c12]">
          {allImages.length > 0 ? (
            <>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={allImages[activeIndex]}
                  alt={`${product.name} - ${activeIndex + 1}`}
                  className="w-full h-full object-contain bg-[#0a0c12]"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-gray-400">
                  {activeIndex + 1} / {allImages.length}
                </div>
              </div>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-cyan-400" />
                  </button>

                  <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-t border-white/[0.04]">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-all ${
                          i === activeIndex
                            ? "border-cyan-400 opacity-100"
                            : "border-white/[0.06] opacity-60 hover:opacity-100 hover:border-white/[0.15]"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-[#0a0c12]">
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <Package className="w-16 h-16" />
                <span className="text-sm">暂无图片</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-100 leading-tight">
            {product.name}
          </h2>

          {product.price && (
            <div className="flex items-baseline gap-2 mt-3">
              <Tag className="w-4 h-4 text-cyan-400" />
              <p className="text-2xl font-bold text-cyan-300">
                {product.price}
              </p>
            </div>
          )}

          {product.description && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full inline-block" />
                规格参数
              </h4>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 mb-2">
            <a
              href={phone ? `tel:${phone}` : "#"}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium text-sm hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              电话咨询
            </a>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}
