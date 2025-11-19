import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { VerificationCodeInputProps } from "@/types/auth.ts";

export function VerificationCodeInput({
  email,
  code,
  onCodeChange,
  error,
  className = "",
  labelClassName = "",
  errorClassName = "",
  id,
}: VerificationCodeInputProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Label
        htmlFor={id}
        className={`block text-gray-700 mb-6 leading-relaxed text-center ${labelClassName}`}
      >
        {email} に確認コードを送信しました。
        <br />
        メールに記載された6桁のコードを入力してください。
      </Label>
      <InputOTP
        id={id}
        required
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={code}
        onChange={onCodeChange}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-13 h-13 text-xl bg-zinc-50" />
          <InputOTPSlot index={1} className="w-13 h-13 text-xl bg-zinc-50" />
          <InputOTPSlot index={2} className="w-13 h-13 text-xl bg-zinc-50" />
          <InputOTPSlot index={3} className="w-13 h-13 text-xl bg-zinc-50" />
          <InputOTPSlot index={4} className="w-13 h-13 text-xl bg-zinc-50" />
          <InputOTPSlot index={5} className="w-13 h-13 text-xl bg-zinc-50" />
        </InputOTPGroup>
      </InputOTP>
      {error && (
        <div
          className={`text-red-600 text-sm text-center mt-4 ${errorClassName}`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
