import { useState } from "react"
import { Eye, EyeOff, KeyRound, Music, MessageCircle } from "lucide-react"
import type { SiteInfo } from "@/types"
import type { EditField } from "./EditModal"
import EditModal from "./EditModal"
import { Store, MapPin, Phone, Image as ImageIcon } from "lucide-react"
import { useDataStore } from "@/store/dataStore"

interface Props {
  info: SiteInfo
  onUpdate: (info: SiteInfo) => void
}

const fields: EditField[] = [
  { key: "name", label: "店铺名称", type: "text", placeholder: "输入店铺名称" },
  { key: "subtitle", label: "副标题 / Slogan", type: "text", placeholder: "如：DIGITAL HARDWARE SOLUTION" },
  { key: "douyin", label: "抖音号", type: "text", placeholder: "输入抖音号/抖音名" },
  { key: "wechat", label: "微信号", type: "text", placeholder: "输入微信号" },
  { key: "phone", label: "电话", type: "text", placeholder: "输入联系电话" },
  { key: "address", label: "地址", type: "text", placeholder: "输入店铺地址" },
  { key: "logo", label: "店铺 Logo", type: "image" },
]

export default function SettingMgr({ info, onUpdate }: Props) {
  const changePassword = useDataStore((s) => s.changePassword)
  const [editing, setEditing] = useState(false)

  const [showPwdForm, setShowPwdForm] = useState(false)
  const [oldPwd, setOldPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pwdLoading, setPwdLoading] = useState(false)

  const handleSave = (data: Record<string, string>) => {
    onUpdate({
      name: data.name || "",
      subtitle: data.subtitle || "",
      address: data.address || "",
      phone: data.phone || "",
      douyin: data.douyin || "",
      wechat: data.wechat || "",
      logo: data.logo || "",
    })
    setEditing(false)
  }

  const handleChangePwd = async () => {
    if (!oldPwd.trim() || !newPwd.trim()) {
      setPwdMsg({ type: "error", text: "请填写旧密码和新密码" })
      return
    }
    if (newPwd.length < 4) {
      setPwdMsg({ type: "error", text: "新密码至少4位" })
      return
    }
    setPwdLoading(true)
    setPwdMsg(null)
    try {
      const ok = await changePassword(oldPwd, newPwd)
      if (ok) {
        setPwdMsg({ type: "success", text: "密码修改成功" })
        setOldPwd("")
        setNewPwd("")
        setShowPwdForm(false)
      } else {
        setPwdMsg({ type: "error", text: "旧密码错误" })
      }
    } catch {
      setPwdMsg({ type: "error", text: "操作失败，请重试" })
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {info.logo ? (
              <img src={info.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {info.name || "未设置"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">店铺基本信息</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{info.phone || "未设置电话"}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <Music className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{info.douyin || "未设置抖音"}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{info.wechat || "未设置微信"}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{info.address || "未设置地址"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{info.logo || "未设置 Logo"}</span>
          </div>
        </div>

        <button
          onClick={() => setEditing(true)}
          className="w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200"
        >
          编辑信息
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">安全设置</h3>
        </div>

        {showPwdForm ? (
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPwd}
                onChange={(e) => { setOldPwd(e.target.value); setPwdMsg(null) }}
                placeholder="输入旧密码"
                className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPwd}
                onChange={(e) => { setNewPwd(e.target.value); setPwdMsg(null) }}
                placeholder="输入新密码（至少4位）"
                className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pwdMsg && (
              <p className={`text-xs ${pwdMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {pwdMsg.text}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setShowPwdForm(false); setOldPwd(""); setNewPwd(""); setPwdMsg(null) }}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleChangePwd}
                disabled={pwdLoading}
                className="flex-1 h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {pwdLoading ? "修改中..." : "确认修改"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowPwdForm(true)
              setOldPwd("")
              setNewPwd("")
              setPwdMsg(null)
            }}
            className="w-full h-10 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all"
          >
            修改登录密码
          </button>
        )}
      </div>

      {editing && (
        <EditModal
          title="编辑站点信息"
          fields={fields}
          initialData={{
            name: info.name,
            subtitle: info.subtitle,
            douyin: info.douyin,
            wechat: info.wechat,
            phone: info.phone,
            address: info.address,
            logo: info.logo,
          }}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
