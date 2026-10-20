import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-gray-600">주소가 잘못되었거나 이동·삭제된 페이지입니다.</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
        홈으로 이동
      </Link>
    </div>
  );
}
