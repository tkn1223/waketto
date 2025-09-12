"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
      loginWith: {
        email: true,
        username: false, // メールアドレスログインを使用
      },
      signUpVerificationMethod: "code" as const,
    },
  },
};

interface AmplifyProviderProps {
  children: React.ReactNode;
}

export default function AmplifyProvider({ children }: AmplifyProviderProps) {
  useEffect(() => {
    // SSR対応でAmplifyを初期化
    Amplify.configure(amplifyConfig, { ssr: true });
  }, []);

  return <>{children}</>;
}
