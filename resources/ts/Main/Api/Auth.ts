import ApiHelper from "../Helper/ApiHelper"
import User from "../Types/User"

/**
 * ログインAPI呼び出し
 *
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns ログインしたユーザー情報
 * @throws バリデーションエラー（422）、認証失敗（401）
 *
 * @example
 * ```typescript
 * try {
 *   const user = await login('user@example.com', 'password123');
 *   console.log('ログイン成功:', user.name);
 * } catch (error) {
 *   console.error('ログイン失敗:', error);
 * }
 * ```
 */
export const login = (email: string, password: string): Promise<User> => {
    return ApiHelper<User>("/api/login", {
        email: email,
        password: password,
    })
}

/**
 * ログアウトAPI呼び出し
 *
 * セッションを破棄してログアウトします
 *
 * @returns void（レスポンスなし）
 * @throws APIエラー
 *
 * @example
 * ```typescript
 * try {
 *   await logout();
 *   console.log('ログアウト成功');
 *   navigate('/login');
 * } catch (error) {
 *   console.error('ログアウト失敗:', error);
 * }
 * ```
 */
export const logout = (): Promise<void> => {
    return ApiHelper<void>("/api/logout")
}

export const me = (): Promise<User> => {
    return ApiHelper<User>("/api/me")
}
