import { useEffect, useState } from "react"
import { useDataStore } from "@/store/dataStore"
import Banner from "@/components/Banner"
import CategoryNav from "@/components/CategoryNav"
import ProductList from "@/components/ProductList"
import ProductDetail from "@/components/ProductDetail"
import ContactInfo from "@/components/ContactInfo"
import { ArrowLeft } from "lucide-react"
import type { Product } from "@/types"

export default function FrontPage() {
  const {
    data,
    isLoaded,
    selectedCategoryId,
    init,
    setSelectedCategoryId,
  } = useDataStore()

  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isLoaded) init()
  }, [isLoaded, init])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090d]">
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-pulse" />
          </div>
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  const filteredProducts = selectedCategoryId
    ? data.products.filter((p) => p.categoryId === selectedCategoryId)
    : []

  const handleSelectCategory = (id: string) => {
    if (selectedCategoryId === id) return
    setSelectedCategoryId(id)
  }

  const handleBack = () => {
    setSelectedCategoryId("")
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#08090d] relative">
      <div className="pt-5 pb-2 relative z-10">
        <div className="px-4 mb-6">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-tight animate-fade-down animate-stagger-1">
            {data.siteInfo.name || "哈喽精品数码"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 tracking-wider animate-fade-up animate-stagger-2">
            {data.siteInfo.subtitle || "DIGITAL HARDWARE SOLUTION"}
          </p>
        </div>

        {!selectedCategoryId ? (
          <>
            <Banner banners={data.banners} />

            <div className="px-4 mt-8 mb-6 animate-fade-up animate-stagger-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase shrink-0">
                  商品分类
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              </div>
            </div>

            <CategoryNav
              categories={data.categories}
              selectedId={selectedCategoryId}
              onSelect={handleSelectCategory}
            />

            <div className="px-4 mt-10 mb-6 animate-fade-up animate-stagger-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase shrink-0">
                  联系方式
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              </div>
            </div>

            <ContactInfo info={data.siteInfo} />
          </>
        ) : (
          <div className="animate-fade-in pt-1 relative z-10">
            <div className="flex items-center gap-3 px-4 py-3 sticky top-0 bg-[#08090d]/90 backdrop-blur-md z-20 border-b border-white/[0.04]">
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:border-cyan-500/30 active:scale-90 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
              <div>
                <h2 className="text-base font-bold text-gray-200 animate-fade-down animate-stagger-1">
                  {data.categories.find((c) => c.id === selectedCategoryId)?.name || ""}
                </h2>
                <p className="text-[11px] text-gray-500 animate-fade-up animate-stagger-2">
                  {filteredProducts.length} 件商品
                </p>
              </div>
            </div>

            <ProductList
              products={filteredProducts.sort((a, b) => a.sort - b.sort)}
              onProductClick={setDetailProduct}
            />
          </div>
        )}
      </div>

      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  )
}
