import { Cpu, Monitor, CircuitBoard, Plug, HardDrive, MemoryStick, Fan, Box, Keyboard, ArrowLeft } from "lucide-react"
import type { Category } from "@/types"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  gpu: Monitor, cpu: Cpu, motherboard: CircuitBoard, power: Plug,
  storage: HardDrive, memory: MemoryStick, cooling: Fan, case: Box,
  monitor: Monitor, peripheral: Keyboard, keyboard: Keyboard,
}

function getFallbackIcon(key: string): LucideIcon {
  return iconMap[key] || Box
}

function isImageUrl(val: string): boolean {
  return /^(https?:\/\/|data:|blob:)/i.test(val)
}

interface Props {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
  onBack?: () => void
  compact?: boolean
}

export default function CategoryNav({ categories, selectedId, onSelect, onBack, compact }: Props) {
  if (compact && selectedId) {
    return (
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
        </button>
        <span className="text-sm font-semibold text-gray-200">
          {categories.find((c) => c.id === selectedId)?.name || ""}
        </span>
      </div>
    )
  }

  return (
    <div className="animate-fade-in px-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const hasImageIcon = isImageUrl(cat.icon)
          const FallbackIcon = getFallbackIcon(cat.icon)
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 active:scale-[0.97] border backdrop-blur-sm bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-lg hover:shadow-cyan-500/10 card-enter"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-white/[0.05] overflow-hidden">
                {hasImageIcon ? (
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                ) : cat.icon ? (
                  <FallbackIcon className="w-7 h-7 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                ) : (
                  <Box className="w-7 h-7 text-gray-600" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
