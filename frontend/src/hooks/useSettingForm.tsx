"use client";

import { useState } from "react";
import { toast } from "sonner";
import { postPartnerSetting } from "@/lib/api.ts";

export const useSettingForm = () => {
  const [partnerId, setPartnerId] = useState("");

  const handlePartnerId = (value: string) => {
    setPartnerId(value);
  };

  const handleSave = async () => {
    try {
      const response = await postPartnerSetting(partnerId);

      if (response.status) {
        toast.success("パートナー設定を保存しました", {
          className: "!bg-yellow-600 !text-white !border-yellow-800",
        });
      } else {
        toast.error(response.message, {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("パートナー設定の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  return {
    partnerId,
    handlePartnerId,
    handleSave,
  };
};
