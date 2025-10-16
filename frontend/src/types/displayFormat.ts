// 日付フォーマット関数
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  // YYYY-MM-DD 形式を YYYY/M/D 形式に変換
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};

// 金額を万単位に変換
export const formatToMan = (amount: number): string => {
  const man = amount / 10000;
  if (man % 1 === 0) {
    return `${man}万`;
  }
  return `${man.toFixed(1)}万`;
};
