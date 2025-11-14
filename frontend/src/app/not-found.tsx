"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}
