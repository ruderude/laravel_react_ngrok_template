/**
 * API通信ヘルパー関数
 *
 * 【機能】
 * - Laravel APIとの通信を統一的に処理
 * - CSRF トークンの自動付与
 * - キャメルケース ⇔ スネークケース の自動変換
 * - エラーハンドリング（422バリデーション、401認証、その他）
 * - BigInt のサポート（53bit以上の整数）
 *
 * @param url - APIエンドポイント（例: /api/sites）
 * @param data - リクエストボディ（POSTまたはPUT時）
 * @param method - HTTPメソッド（GET/POST/PUT）
 * @returns APIレスポンス（型安全）
 * @throws バリデーションエラー、認証エラー、その他APIエラー
 *
 * @example
 * ```typescript
 * // GET リクエスト
 * const sites = await ApiHelper<Site[]>('/api/sites', {}, 'GET');
 *
 * // POST リクエスト
 * const result = await ApiHelper<SiteRegistrationResponse>('/api/sites', {
 *   domain: 'example.com'
 * });
 * ```
 */
const ApiHelper = async <Type>(url: string, data: {} = {}, method: "GET" | "POST" | "PUT" = "POST"): Promise<Type> => {
    // CSRF トークンを取得（Laravel標準）
    const token: string = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? ""

    // fetch オプションを構築
    const init: any = {
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token, // Laravel CSRF 保護
        },
        credentials: "include", // Cookie（セッション）を含める
    }

    // POST/PUT の場合はリクエストボディを設定
    // キャメルケース → スネークケース に自動変換
    if (method === "POST" || method === "PUT") {
        init.body = JSON.stringify(toSnakeCase(data), (_: string, value: any): any => {
            // BigInt を文字列に変換（JSON.stringify は BigInt を扱えないため）
            return typeof value === "bigint" ? value.toString() : value
        })
    }

    // API呼び出し
    const response: Response = await fetch(url, init)

    // ========================================
    // エラーハンドリング
    // ========================================

    // 422エラー: バリデーションエラー
    // Laravel FormRequest のバリデーション失敗
    if (response.status === 422) {
        const error = {
            statusCode: response.status,
            isValidationError: true,
            message: "Validation Error",
            errors: {},
        }
        const json = await response.json()
        Object.entries(json.errors).forEach(([key, value]: [string, any]): void => {
            if (Array.isArray(value)) {
                ;(error.errors as any)[key] = value
            }
        })
        error.message = json.message
        throw error
    }

    // 401エラー: 認証エラー
    // ログインが必要または認証トークンが無効
    if (response.status === 401) {
        throw {
            statusCode: response.status,
            message: "認証エラーが発生しました",
            errors: {},
        }
    }

    // その他のエラー（400, 403, 500等）
    if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
        const json = await response.json()
        const error = {
            statusCode: response.status,
            message: json.message || "エラーが発生しました",
            errors: json.errors || {},
        }
        if (json.errors) {
            error.errors = toCamelCase(json.errors)
        }
        throw error
    }

    // ========================================
    // 正常レスポンスの処理
    // ========================================

    // 204 No Content: レスポンスボディなし
    // DELETE 成功などで使用
    if (response.status === 204) {
        return {} as Type
    }

    const text: string = await response.text()

    // レスポンスが空の場合
    if (!text) {
        return {} as Type
    }

    // JSON パース処理
    let json: any
    try {
        json = JSON.parse(text, (_: string, value: any): any => {
            // 数値文字列を適切な型に変換
            // 53bit以上の整数は BigInt に変換（JavaScriptのNumber型の限界対策）
            if (typeof value === "string" && value.match(/^[0-9]+$/)) {
                if (value.length > 15) {
                    return BigInt(value)
                }
            }
            return value
        })
    } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Response text:", text)
        throw {
            statusCode: response.status,
            message: "サーバーからのレスポンスが無効なJSON形式です",
            errors: {},
        }
    }

    // 配列レスポンスの場合（例: サイト一覧）
    // 各要素をスネークケース → キャメルケースに変換
    if (Array.isArray(json)) {
        const result: Type | unknown[] = []
        json.forEach((obj: object): void => {
            result.push(toCamelCase(obj))
        })
        return result as Type
    }

    // オブジェクトレスポンスの場合
    // スネークケース → キャメルケースに変換
    return toCamelCase<Type>(json)
}

/**
 * 文字列をキャメルケースに変換
 *
 * スネークケース（snake_case）→ キャメルケース（camelCase）
 *
 * @param str - 変換する文字列（例: created_at）
 * @returns キャメルケース文字列（例: createdAt）
 *
 * @example
 * ```typescript
 * toCamelCaseString('created_at') // => 'createdAt'
 * toCamelCaseString('user_id') // => 'userId'
 * ```
 */
const toCamelCaseString = (str: string): string => {
    return str.replace(/_([a-z])/g, (_: string, group) => group.toUpperCase())
}

/**
 * オブジェクトのキーをキャメルケースに変換（再帰的）
 *
 * Laravel API レスポンス（スネークケース）→ TypeScript（キャメルケース）
 * ネストしたオブジェクトや配列も再帰的に変換
 *
 * @param object - 変換するオブジェクト
 * @returns キャメルケース化されたオブジェクト
 *
 * @example
 * ```typescript
 * toCamelCase({ user_id: 1, created_at: '2025-01-01' })
 * // => { userId: 1, createdAt: '2025-01-01' }
 * ```
 */
const toCamelCase = <Type>(object: { [key: string]: any }): Type => {
    const result: { [key: string]: any } = {}
    Object.keys(object).forEach((org: string): void => {
        const key: string = toCamelCaseString(org)

        if (Array.isArray(object[org])) {
            // 配列の場合: 各要素を再帰的に変換
            const arrayResult: any[] = []

            object[org].forEach((item: any): void => {
                if (item !== null && typeof item === "object") {
                    arrayResult.push(toCamelCase(item))
                } else {
                    arrayResult.push(item)
                }
            })

            result[key] = arrayResult
        } else if (object[org] !== null && typeof object[org] === "object") {
            // オブジェクトの場合: 再帰的に変換
            result[key] = toCamelCase(object[org])
        } else {
            // プリミティブ値の場合: そのまま設定
            result[key] = object[org]
        }
    })
    return result as Type
}

/**
 * 文字列をスネークケースに変換
 *
 * キャメルケース（camelCase）→ スネークケース（snake_case）
 *
 * @param text - 変換する文字列（例: createdAt）
 * @returns スネークケース文字列（例: created_at）
 *
 * @example
 * ```typescript
 * toSnakeCaseString('createdAt') // => 'created_at'
 * toSnakeCaseString('userId') // => 'user_id'
 * ```
 */
const toSnakeCaseString = (text: string): string => {
    return text
        .split(/(?=[A-Z])/)
        .map((word: string): string => {
            return word.toLowerCase()
        })
        .join("_")
}

/**
 * オブジェクトのキーをスネークケースに変換（再帰的）
 *
 * TypeScript（キャメルケース）→ Laravel API リクエスト（スネークケース）
 * ネストしたオブジェクトや配列も再帰的に変換
 *
 * @param obj - 変換するオブジェクト
 * @returns スネークケース化されたオブジェクト
 *
 * @example
 * ```typescript
 * toSnakeCase({ userId: 1, createdAt: '2025-01-01' })
 * // => { user_id: 1, created_at: '2025-01-01' }
 * ```
 */
const toSnakeCase = (obj: object): object => {
    return Object.entries(obj).reduce((result: object, [key, value]) => {
        let newValue = value
        if (value && typeof value === "object" && !Array.isArray(value)) {
            // オブジェクトの場合: 再帰的に変換
            newValue = toSnakeCase(value)
        } else if (Array.isArray(value)) {
            // 配列の場合: 各要素を再帰的に変換
            newValue = value.map((item): object | any => {
                if (item && typeof item === "object" && !Array.isArray(item)) {
                    return toSnakeCase(item)
                }
                return item
            })
        }
        return { ...result, [toSnakeCaseString(key)]: newValue }
    }, {})
}

export default ApiHelper
