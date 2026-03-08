import "./styles.css"

import { FC, ReactElement } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Top from "./Pages/Top"
import Other from "./Pages/Other"

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
            children: [
                {
                    index: true,
                    element: <Top />,
                },
                {
                    path: "other",
                    element: <Other />,
                },
            ],
        },
    ])

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default Routing
