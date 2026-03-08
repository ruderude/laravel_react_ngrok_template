import "./styles.css"

import { FC, ReactElement } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

const Routing: FC = (): ReactElement => {
    const router = createBrowserRouter([
        {
            path: "/",
            Component() {
                return (
                    <>
                        <Outlet />
                    </>
                )
            },
            errorElement: <>エラー</>,
        },
    ])

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default Routing
