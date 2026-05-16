import React from "react";

export default function TermsPage() {
  const terms = [
    {
      title: "1. Chấp nhận các Điều khoản",
      content: "Bằng việc truy cập và sử dụng dịch vụ của Luxe Cinema, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ của chúng tôi.",
    },
    {
      title: "2. Tài khoản Người dùng",
      content: "Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Bạn đồng ý chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của mình.",
    },
    {
      title: "3. Quy định đặt vé và Hoàn tiền",
      content: "Vé đã mua không thể thay đổi hoặc hoàn tiền trừ trường hợp lỗi kỹ thuật từ hệ thống của chúng tôi. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận thanh toán.",
    },
    {
      title: "4. Sở hữu trí tuệ",
      content: "Tất cả nội dung trên trang web này, bao gồm logo, hình ảnh, văn bản và phần mềm, đều thuộc sở hữu của Luxe Cinema và được bảo vệ bởi luật bản quyền.",
    },
    {
      title: "5. Giới hạn Trách nhiệm",
      content: "Luxe Cinema không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp hoặc ngẫu nhiên nào phát sinh từ việc bạn sử dụng dịch vụ của chúng tôi.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12 tracking-wide font-medium">Cập nhật lần cuối: 16 tháng 5, 2026</p>
        
        <div className="space-y-12">
          {terms.map((term, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-[#c9a84c] tracking-wide uppercase">{term.title}</h2>
              <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
                {term.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl text-center">
          <p className="text-white/40 text-sm">
            Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận mọi thay đổi trong Điều khoản của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
