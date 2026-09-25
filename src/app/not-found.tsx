import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-gold-500">404</p>
        <h1 className="mt-3 text-2xl font-semibold">This page isn&apos;t on the menu</h1>
        <Link href="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </div>
  );
}
