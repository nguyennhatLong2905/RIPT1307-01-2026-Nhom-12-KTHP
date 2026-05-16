import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Info */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Contact Us</h1>
              <p className="text-white/50 text-lg font-light leading-relaxed max-w-md">
                Chúng tôi luôn sẵn sàng lắng nghe ý kiến và hỗ trợ bạn. Đừng ngần ngại liên hệ với đội ngũ Luxe Cinema.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <Mail className="text-[#c9a84c]" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-wider text-xs">Email</h3>
                  <p className="text-white/60">support@luxecinema.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <Phone className="text-[#c9a84c]" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-wider text-xs">Điện thoại</h3>
                  <p className="text-white/60">+84 (028) 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#c9a84c]" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-wider text-xs">Địa chỉ</h3>
                  <p className="text-white/60">122 Đường Hoàng Quốc Việt, Quận Cầu Giấy, TP. Hà Nội</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a84c]/20 to-transparent blur-3xl opacity-20 -z-10" />
            <div className="p-8 md:p-10 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Họ tên</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A" 
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Chủ đề</label>
                  <input 
                    type="text" 
                    placeholder="Tôi cần hỗ trợ về..." 
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Tin nhắn</label>
                  <textarea 
                    rows={4} 
                    placeholder="Nhập nội dung tin nhắn của bạn..." 
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors resize-none"
                  />
                </div>

                <button 
                  type="button"
                  className="w-full h-14 rounded-xl bg-[#c9a84c] text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  <Send size={18} />
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
