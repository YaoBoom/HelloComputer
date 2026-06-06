import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner as BannerType } from "@/types"

interface Props {
  banners: BannerType[]
}

export default function Banner({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const count = banners.length

  const goTo = useCallback(
    (index: number) => setCurrent(((index % count) + count) % count),
    [count]
  )
  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (count <= 1 || isHovering) return
    const timer = setInterval(goNext, 3500)
    return () => clearInterval(timer)
  }, [goNext, count, isHovering])

  if (count === 0) return null

  return (
    <div className="mx-4 mt-3 mb-4 animate-fade-down animate-stagger-1">
      <div
        className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="flex h-full transition-transform duration-600 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((b) => (
            <div key={b.id} className="min-w-full h-full flex-shrink-0 relative">
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-600/40 via-blue-600/25 to-purple-600/40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 shimmer-bg" />
                  <span className="text-gray-300/50 text-sm font-medium tracking-wider relative z-10">
                    {b.title || "WELCOME"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-cyan-300 flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-cyan-300 flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-5 bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.5)]"
                      : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
