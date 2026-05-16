import React from "react";
import { Download, FileText, Image as ImageIcon, Share2 } from "lucide-react";

export default function PressPage() {
  const assets = [
    { name: "Brand Guidelines", size: "4.2 MB", icon: FileText },
    { name: "Logo Pack (SVG/PNG)", size: "12.8 MB", icon: ImageIcon },
    { name: "Press Kit 2026", size: "24.5 MB", icon: Download },
  ];

  const news = [
    {
      date: "12 Tháng 5, 2026",
      title: "Luxe Cinema mở rộng hệ thống rạp chiếu tại khu vực miền Trung.",
      excerpt: "Chúng tôi tự hào thông báo việc khai trương thêm 3 cụm rạp mới tiêu chuẩn quốc tế tại Đà Nẵng và Nha Trang.",
    },
    {
      date: "05 Tháng 5, 2026",
      title: "Hợp tác chiến lược cùng các hãng phim lớn toàn cầu.",
      excerpt: "Luxe Cinema ký kết thỏa thuận phân phối độc quyền các suất chiếu sớm cho các bom tấn mùa hè.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Press & Media</h1>
          <p className="text-white/50 text-lg font-light max-w-2xl mx-auto">
            Tài liệu báo chí, tài sản thương hiệu và những tin tức mới nhất về Luxe Cinema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (News) */}
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Share2 className="text-[#c9a84c]" size={24} />
              Thông cáo báo chí
            </h2>
            <div className="space-y-8">
              {news.map((item, idx) => (
                <article key={idx} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                  <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">{item.date}</span>
                  <h3 className="text-xl font-bold text-white/90 mt-2 mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.excerpt}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar (Assets) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Media Assets</h2>
            <div className="space-y-4">
              {assets.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <asset.icon size={18} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/80">{asset.name}</p>
                      <p className="text-[10px] text-white/30 uppercase font-medium">{asset.size}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-[#c9a84c]">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20">
              <h3 className="text-sm font-bold text-white mb-2">Media Inquiries</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                Đối với các yêu cầu phỏng vấn hoặc thông tin báo chí, vui lòng liên hệ bộ phận truyền thông.
              </p>
              <p className="text-sm font-bold text-[#c9a84c]">press@luxecinema.com</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
