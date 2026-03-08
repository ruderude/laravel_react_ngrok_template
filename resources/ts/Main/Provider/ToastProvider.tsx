import { createContext, ReactNode, useContext, useState } from "react"

type ToastMessage = {
    id?: number
    type?: string
    title: string
    message: string
    delay?: number
}

interface ToastContextType {
    show: (context: ToastMessage) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const show = (context: ToastMessage): void => {
        const { delay } = context
        // TODO
    }

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div>{/* TODO */}</div>
        </ToastContext.Provider>
    )
}

export const useToast: () => ToastContextType = (): ToastContextType => {
    const toast: ToastContextType = useContext(ToastContext)
    if (!toast) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return toast
}
