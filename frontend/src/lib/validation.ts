/**
 * パスワードのバリデーション
 * @param password 検証するパスワード
 * @returns エラーメッセージの配列（エラーがない場合は空配列）
 */
export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("8文字以上で入力してください");
  }

  if (!/\d/.test(password)) {
    errors.push("少なくとも1つの数字を含めてください");
  }

  const specialChars = /[$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=]/;
  if (!specialChars.test(password)) {
    errors.push(
      "少なくとも1つの特殊文字を含めてください（例: ~ $ * . [ ] { } ( ) ? - \" ! @ # % & / \\ , > < ' : ; | _ ` + =）"
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("少なくとも1つの大文字を含めてください");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("少なくとも1つの小文字を含めてください");
  }

  return errors;
}

/**
 * パスワードと確認用パスワードの一致を検証
 * @param password パスワード
 * @param passwordConfirm 確認用パスワード
 * @returns エラーメッセージ（エラーがない場合はnull）
 */
export function validatePasswordMatch(
  password: string,
  passwordConfirm: string
): string | null {
  if (password !== passwordConfirm) {
    return "パスワードが一致しません";
  }
  return null;
}

/**
 * パスワードの完全なバリデーション（ルールと一致チェック）
 * @param password パスワード
 * @param passwordConfirm 確認用パスワード
 * @returns エラーメッセージの配列（エラーがない場合は空配列）
 */
export function validatePasswordComplete(
  password: string,
  passwordConfirm: string
): string[] {
  const errors = validatePassword(password);
  const matchError = validatePasswordMatch(password, passwordConfirm);
  if (matchError) {
    errors.push(matchError);
  }
  return errors;
}
