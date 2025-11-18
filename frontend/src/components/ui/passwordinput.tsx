"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils";
import type { PasswordInputProps } from "@/types/auth.ts";

export function PasswordInput({
  className,
  showToggle = true,
  onValueChange,
  onChange,
  value,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(showToggle && "pr-10", className)}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-8 h-full text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
