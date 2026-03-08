import { FC, ReactElement, ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import Loading from "./Loading"
import useAuth from "../Provider/AuthProvider"

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }): ReactElement => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    // 認証状態の確認中はローディング表示
    if (isLoading) {
        return <Loading />
    }

    // 未認証の場合はログイン画面へリダイレクト
    // 現在のパスを保存して、ログイン後に元のページに戻れるようにする
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 認証済みの場合は子コンポーネントを表示
    return <>{children}</>
}

export default ProtectedRoute
