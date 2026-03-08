import { createRoot } from "react-dom/client"

import Routing from "./App/Routing"

const root: HTMLElement | null = document.getElementById("root")
if (root) {
    createRoot(root).render(<Routing />)
}
