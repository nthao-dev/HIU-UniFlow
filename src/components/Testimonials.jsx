import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const testimonialsData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Sinh viên CNTT",
    avatar:
      "/img/people-1.jpg",
    quote:
      "UniFlow giúp tôi dễ dàng tìm các sự kiện phù hợp với sở thích và ngành học. Tính năng AI gợi ý rất thông minh!"
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Chủ nhiệm CLB Văn hóa",
    avatar:
      "/img/people-2.jpg",
    quote:
      "UniFlow giúp CLB tổ chức sự kiện chuyên nghiệp hơn, từ đăng ký đến quản lý điểm rèn luyện."
  },
  {
    id: 3,
    name: "Phạm Minh C",
    role: "Giảng viên",
    avatar:
      "/img/people-3.jpg",
    quote:
      "Nền tảng này hỗ trợ sinh viên tham gia sự kiện hiệu quả, đồng thời giúp nhà trường theo dõi điểm rèn luyện dễ dàng."
  }
];

const Testimonials = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center animate-fade-in">
        UniFlow sẽ được yêu thích như thế nào
        <span className="ml-2 inline-block px-2 py-1 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
          AI Powered
        </span>
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Ý tưởng về cách UniFlow sẽ hỗ trợ sinh viên, CLB, và nhà trường
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <FaQuoteLeft className="text-indigo-600 text-2xl mb-4" />
            <p className="text-gray-600 mb-4">{testimonial.quote}</p>
            <div className="flex items-center">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-indigo-800">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
