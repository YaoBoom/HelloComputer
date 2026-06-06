import { MapPin, Phone, Music, MessageCircle, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { SiteInfo } from "@/types"

interface Props {
  info: SiteInfo
}

export default function ContactInfo({ info }: Props) {
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedWechat, setCopiedWechat] = useState(false)

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setter(true)
    setTimeout(() => setter(false), 1500)
  }

  return (
    <div className="mx-4 mb-10 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm animate-fade-up animate-stagger-1 hover:border-cyan-500/15 transition-all duration-500">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Phone className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          联系方式
        </h3>
      </div>

      <div className="space-y-3.5">
        {info.douyin && (
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300">
              <Music className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 mb-0.5">抖音</p>
              <p className="text-sm text-gray-300 font-medium truncate">{info.douyin}</p>
            </div>
          </div>
        )}

        {info.wechat && (
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 mb-0.5">微信</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-300 font-medium truncate">{info.wechat}</p>
                <button
                  onClick={() => copyText(info.wechat, setCopiedWechat)}
                  className="shrink-0 w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                  {copiedWechat ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {info.phone && (
          <div className="flex items-center gap-3 group">
            <a
              href={`tel:${info.phone}`}
              className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:animate-pulse transition-all duration-300"
            >
              <Phone className="w-5 h-5 text-cyan-400" />
            </a>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 mb-0.5">电话</p>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${info.phone}`}
                  className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors truncate"
                >
                  {info.phone}
                </a>
                <button
                  onClick={() => copyText(info.phone, setCopiedPhone)}
                  className="shrink-0 w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                  {copiedPhone ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {info.address && (
          <div className="flex items-start gap-3 text-sm text-gray-400 group">
            <div className="w-10 flex justify-center flex-shrink-0 pt-0.5">
              <MapPin className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <span className="leading-relaxed pt-0.5">{info.address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
