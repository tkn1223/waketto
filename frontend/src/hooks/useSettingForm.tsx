"use client";

import { useState } from "react";

export const useSettingForm = () => {
  const [partnerId, setPartnerId] = useState("");

  const handlePartnerId = (value: string) => {
    setPartnerId(value);
  };

  const handleSave = () => {
    console.log(partnerId);
  };

  return {
    partnerId,
    handlePartnerId,
    handleSave,
  };
};
