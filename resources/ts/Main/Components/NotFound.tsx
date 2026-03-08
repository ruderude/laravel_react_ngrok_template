import { FC, ReactElement } from "react"

const NotFound: FC = (): ReactElement => {
    const handleGoHome = () => {
        window.location.href = "/"
    }

    return (
        <>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>404 - Not Found</h1>
                <p>お探しのページは見つかりませんでした。</p>
                <button onClick={handleGoHome} style={{ padding: "10px 20px", fontSize: "16px" }}>
                    ホームに戻る
                </button>
            </div>
        </>
    )
}

export default NotFound
