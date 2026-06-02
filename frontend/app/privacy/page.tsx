import React from "react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Thông tin chúng tôi thu thập",
      content: "Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt vé hoặc đăng ký nhận bản tin. Thông tin bao gồm tên, địa chỉ email, số điện thoại và thông tin giao dịch.",
    },
    {
      title: "2. Cách chúng tôi sử dụng thông tin",
      content: "Thông tin của bạn được sử dụng để xử lý các giao dịch, cá nhân hóa trải nghiệm của bạn, cải thiện dịch vụ khách hàng và gửi các thông báo liên quan đến đơn hàng hoặc khuyến mãi.",
    },
    {
      title: "3. Bảo mật thông tin",
      content: "Luxe Cinema thực hiện các biện pháp bảo mật tiên tiến để đảm bảo an toàn cho thông tin cá nhân của bạn. Dữ liệu nhạy cảm được mã hóa và truyền tải qua các giao thức an toàn.",
    },
    {
      title: "4. Chia sẻ thông tin với bên thứ ba",
      content: "Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba ngoại trừ các đối tác tin cậy hỗ trợ chúng tôi trong việc vận hành trang web và cung cấp dịch vụ cho bạn.",
    },
    {
      title: "5. Quyền của bạn",
      content: "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua phần cài đặt tài khoản hoặc liên hệ trực tiếp với chúng tôi.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12 tracking-wide font-medium">Cập nhật lần cuối: 16 tháng 5, 2026</p>
        
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-[#c9a84c] tracking-wide uppercase">{section.title}</h2>
              <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
          <p className="text-white/40 text-sm italic text-center">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi qua trang Liên hệ.
          </p>
        </div>
      </div>
    </div>
  );
}
