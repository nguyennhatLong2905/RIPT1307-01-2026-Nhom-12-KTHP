import Link from "next/link";

export default function Footer() {
  // Đưa danh sách link ra một mảng để code gọn gàng, dễ bảo trì hơn
  const footerLinks = [
    { label: "PRIVACY POLICY", href: "/privacy" },
    { label: "TERMS OF SERVICE", href: "/terms" },
    { label: "CONTACT", href: "/contact" },
    { label: "PRESS", href: "/press" },
  ];

  return (
    <footer className="w-full px-8 py-4 bg-[#0a0a0a] border-t border-white/5">
      <div className="flex items-center justify-between">

        {/* Cột 1: Logo (Canh trái) */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.15em] hover:opacity-80 transition-opacity"
            style={{ color: "#c9a84c" }}
          >
            LUXE CINEMA
          </Link>
        </div>

        {/* Cột 2: Các đường dẫn (Canh giữa) */}
        <ul className="hidden md:flex flex-wrap items-center justify-center gap-8">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[11px] tracking-widest text-[#888888] hover:text-[#e0e0e0] transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Cột 3: Copyright (Canh phải) */}
        <div className="flex-shrink-0">
          <span className="text-[11px] tracking-wider text-[#555555]">
            © 2026 ALL RIGHTS RESERVED.
          </span>
        </div>

      </div>
    </footer>
  );
}
