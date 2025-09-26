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
