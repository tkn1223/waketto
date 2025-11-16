"use client";

import { useEffect,useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { postPartnerSetting } from "@/lib/api.ts";

export const useSettingForm = () => {
  const { userInfo } = useAuth();
  const [partnerId, setPartnerId] = useState("");
  const [userName, setUserName] = useState("");

  // 各フィールドの初期化状態を追跡
  const [userNameInitialized, setUserNameInitialized] = useState(false);

  // userInfoが更新された時、フィールドが空の場合のみ初期値を設定
  useEffect(() => {
    if (!userNameInitialized && userInfo?.name) {
      setUserName(userInfo.name);
      setUserNameInitialized(true);
    }

    if (userInfo?.partner_user_id) {
      setPartnerId(userInfo.partner_user_id);
    }
  }, [userInfo, userNameInitialized]);

  const handleUserName = (value: string) => {
    setUserName(value);

    // ユーザーが手動で編集した場合も、初期化済みとしてマーク
    if (!userNameInitialized) {
      setUserNameInitialized(true);
    }
  };

  const handlePartnerId = (value: string) => {
    setPartnerId(value);
  };

  const handleUserInfoSave = async () => {
    try {
      const response = await postPartnerSetting(userName, partnerId);

      if (response.status) {
        toast.success("ユーザー情報を保存しました", {
          className: "!bg-yellow-600 !text-white !border-yellow-800",
        });
      } else {
        toast.error(response.message, {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("ユーザー情報の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  return {
    userInfo,
    userName,
    partnerId,
    handleUserName,
    handlePartnerId,
    handleUserInfoSave,
  };
};
