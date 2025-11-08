"use client";

import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
      loginWith: {
        email: true,
        username: false,
      },
      signUpVerificationMethod: "code" as const,
    },
  },
};

interface AmplifyProviderProps {
  children: React.ReactNode;
}

export default function AmplifyProvider({ children }: AmplifyProviderProps) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    try {
      Amplify.configure(amplifyConfig, { ssr: true });
      setIsConfigured(true);
    } catch (error) {
      console.error("Amplify設定エラー:", error);
    }
  }, []);

  // Amplifyの設定が完了するまで子コンポーネントをレンダリングしない
  if (!isConfigured) {
    return <></>;
  }

  return <>{children}</>;
}
