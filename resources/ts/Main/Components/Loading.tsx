import { FC, ReactElement } from "react"

const Loading: FC = (): ReactElement => {
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>読み込み中...</h1>
                <p>しばらくお待ちください。</p>
            </div>
        </>
    )
}

export default Loading
