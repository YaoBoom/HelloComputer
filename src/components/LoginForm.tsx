import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"

interface Props {
  isPasswordSet: boolean
  onLogin: (password: string) => Promise<boolean>
  onSetPassword: (password: string) => Promise<void>
}

export default function LoginForm({ isPasswordSet, onLogin, onSetPassword }: Props) {
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError("请输入密码")
      return
    }
    setLoading(true)
    setError("")
    try {
      if (isPasswordSet) {
        const ok = await onLogin(password)
        if (!ok) {
          setError("密码错误")
        }
      } else {
        await onSetPassword(password)
      }
    } catch {
      setError("操作失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {isPasswordSet ? "管理员登录" : "设置管理密码"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isPasswordSet ? "请输入管理密码" : "首次使用，请设置管理密码"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="请输入密码"
              className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-2 ml-1">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 mt-4 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-blue-200"
          >
            {loading ? "处理中..." : isPasswordSet ? "登录" : "设置密码"}
          </button>
        </div>
      </div>
    </div>
  )
}
