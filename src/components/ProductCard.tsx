import type { Product } from "@/types"
import { Package, Tag, Image as ImageIcon } from "lucide-react"

interface Props {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: Props) {
  const images = product.images?.filter(Boolean) || []
  const displayImage = product.imageUrl || images[0] || ""

  return (
    <button
      onClick={() => onClick(product)}
      className="card-enter bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06] active:scale-[0.97] transition-all duration-300 text-left w-full hover:bg-white/[0.08] hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 group"
    >
      <div className="aspect-square bg-white/[0.02] flex items-center justify-center overflow-hidden relative">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-600 group-hover:text-gray-500 transition-colors">
            <Package className="w-10 h-10" />
            <span className="text-[10px]">暂无图片</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <ImageIcon className="w-2.5 h-2.5" />
            {images.length}
          </span>
        )}
        {product.price && (
          <span className="absolute top-2 left-2 bg-cyan-500/90 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            {product.price}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-200 truncate leading-tight group-hover:text-cyan-300 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description?.replace(/\n/g, " · ") || "暂无描述"}
        </p>
        {product.price && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <Tag className="w-3 h-3 text-cyan-400" />
            <p className="text-sm font-bold text-cyan-300">
              {product.price}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}
