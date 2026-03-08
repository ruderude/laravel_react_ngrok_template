import "./styles.css"

import { ExoticComponent, FC, lazy, ReactElement, Suspense } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import Error from "./Components/Error"
import Loading from "./Components/Loading"
import ProtectedRoute from "./Components/ProtectedRoute"

const Routing: FC = (): ReactElement => {
    const Dashboard: ExoticComponent = lazy(() => import("./Pages/Dashboard"))

    const router = createBrowserRouter(
        [
            {
                path: "/",
                Component() {
                    return (
                        <>
                            <Outlet />
                        </>
                    )
                },
                errorElement: <Error />,
                children: [
                    // パブリックルート（認証不要）
                    {
                        path: "/",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <>
                                    {/* TODO */}
                                    テスト画面
                                </>
                            </Suspense>
                        ),
                    },
                    // プロテクトルート（認証必要）
                    {
                        path: "/dashboard",
                        element: (
                            <>
                                <Suspense fallback={<Loading />}>
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                </Suspense>
                            </>
                        ),
                    },
                ],
            },
        ],
        {
            basename: "/main",
        }
    )

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default Routing
