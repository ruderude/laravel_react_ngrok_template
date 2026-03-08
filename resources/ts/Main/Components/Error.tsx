import { FC, ReactElement } from "react"

const Error: FC = (): ReactElement => {
    const handleGoHome = () => {
        window.location.href = "/"
    }

    return (
        <>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>エラー</h1>
                <p>申し訳ありませんが、エラーが発生しました。ページを表示できません。</p>
                <button onClick={handleGoHome} style={{ padding: "10px 20px", fontSize: "16px" }}>
                    ホームに戻る
                </button>
            </div>
        </>
    )
}

export default Error
