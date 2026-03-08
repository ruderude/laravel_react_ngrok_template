import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import * as AuthApi from "../Api/Auth"
import User from "../Types/User"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<User>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const isAuthenticated = user !== null

    // 初期化時にユーザー情報を取得
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await AuthApi.me()
                setUser(userData)
            } catch (err: any) {
                setUser(null)
                // 初期化時は401エラーでもログイン画面に遷移しない
                // （認証不要のページもあるため）
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth().then(() => {})
    }, [])

    const login = async (email: string, password: string): Promise<User> => {
        const userData = await AuthApi.login(email, password)
        setUser(userData)
        return userData
    }

    const logout = async (): Promise<void> => {
        try {
            await AuthApi.logout()
        } catch (error) {
            // ログアウトAPIでエラーが発生してもログアウト処理は継続
        } finally {
            // サーバーサイドでセッションが破棄されるため、
            // 新しいセッションとCSRFトークンを取得するためにログイン画面にリダイレクト
            window.location.href = "/login"
        }
    }

    const refreshUser = async (): Promise<void> => {
        try {
            const userData = await AuthApi.me()
            setUser(userData)
        } catch (error: any) {
            setUser(null)
            // 401エラーの場合はログイン画面に遷移
            if (error.statusCode === 401) {
                navigate("/login", { replace: true })
            }
        }
    }

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export default useAuth
