const ASPECTS = [
    {
        id: "income_stability",
        name: "Độ ổn định thu nhập",
        question: "Thu nhập hàng tháng của Bạn ổn định ở mức nào?",
        options: [
            { text: "Rất bấp bênh, không đoán trước", score: 1 },
            { text: "Thường xuyên biến động mạnh", score: 2 },
            { text: "Có khung nhưng lệch nhiều", score: 3 },
            { text: "Khá ổn định, lệch nhẹ", score: 4 },
            { text: "Ổn định cao, dự đoán được", score: 5 }
        ]
    },
    {
        id: "income_sources",
        name: "Số lượng nguồn thu",
        question: "Hiện tại Bạn có bao nhiêu nguồn thu thực sự?",
        options: [
            { text: "1 nguồn duy nhất", score: 1 },
            { text: "1 nguồn chính + thu phụ rất nhỏ", score: 2 },
            { text: "2 nguồn có ý nghĩa", score: 3 },
            { text: "2–3 nguồn độc lập", score: 4 },
            { text: "≥3 nguồn độc lập, bền", score: 5 }
        ]
    },
    {
        id: "active_passive",
        name: "Phụ thuộc vào công sức cá nhân",
        question: "Thu nhập của Bạn phụ thuộc bao nhiêu vào việc “làm mới có tiền”?",
        options: [
            { text: "Phụ thuộc 100%", score: 1 },
            { text: "Phụ thuộc phần lớn", score: 2 },
            { text: "Bắt đầu có phần không phụ thuộc", score: 3 },
            { text: "Phụ thuộc ít dần", score: 4 },
            { text: "Có thu nhập không cần hiện diện", score: 5 }
        ]
    },
    {
        id: "income_growth",
        name: "Tốc độ tăng thu nhập",
        question: "Thu nhập của Bạn trong 2–3 năm gần đây như thế nào?",
        options: [
            { text: "Giảm hoặc đứng yên", score: 1 },
            { text: "Tăng rất chậm", score: 2 },
            { text: "Tăng ngang lạm phát", score: 3 },
            { text: "Tăng đều hàng năm", score: 4 },
            { text: "Tăng nhanh, có chiến lược", score: 5 }
        ]
    },
    {
        id: "financial_runway",
        name: "Khả năng thay thế thu nhập",
        question: "Nếu mất nguồn thu chính, Bạn trụ được bao lâu?",
        options: [
            { text: "< 1 tháng", score: 1 },
            { text: "1–2 tháng", score: 2 },
            { text: "3–6 tháng", score: 3 },
            { text: "6–12 tháng", score: 4 },
            { text: ">12 tháng", score: 5 }
        ]
    },
    {
        id: "income_tracking",
        name: "Quản lý & theo dõi thu nhập",
        question: "Bạn có theo dõi chi tiết các nguồn thu không?",
        options: [
            { text: "Không theo dõi", score: 1 },
            { text: "Ước chừng", score: 2 },
            { text: "Ghi chép không đều", score: 3 },
            { text: "Theo dõi khá rõ", score: 4 },
            { text: "Theo dõi chuẩn, có hệ thống", score: 5 }
        ]
    },
    {
        id: "risk_control",
        name: "Khả năng kiểm soát rủi ro thu nhập",
        question: "Thu nhập của Bạn dễ bị ảnh hưởng bởi yếu tố nào?",
        options: [
            { text: "Rất dễ “sập”", score: 1 },
            { text: "Dễ bị tác động", score: 2 },
            { text: "Có rủi ro nhưng kiểm soát một phần", score: 3 },
            { text: "Khá an toàn", score: 4 },
            { text: "Phân tán rủi ro tốt", score: 5 }
        ]
    },
    {
        id: "self_investment",
        name: "Nâng cấp giá trị bản thân",
        question: "Bạn đầu tư cho kỹ năng tạo thu nhập ra sao?",
        options: [
            { text: "Không đầu tư", score: 1 },
            { text: "Đầu tư bị động", score: 2 },
            { text: "Có học nhưng thiếu chiến lược", score: 3 },
            { text: "Học có định hướng", score: 4 },
            { text: "Liên tục nâng cấp có hệ thống", score: 5 }
        ]
    },
    {
        id: "market_comparison",
        name: "So sánh với thu nhập bình quân nhân sự cùng ngành",
        question: "Thu nhập của Bạn so sánh với bình quân nhân sự cùng ngành, cùng kinh nghiệm?",
        options: [
            { text: "Thấp hơn >30% so với Trung bình ngành", score: 1 },
            { text: "Thấp hơn từ 10% - 30% so với Trung bình ngành", score: 2 },
            { text: "Tương đương", score: 3 },
            { text: "Cao hơn từ 10% - 30% so với Trung bình ngành", score: 4 },
            { text: "Cao hơn >30% so với Trung bình ngành", score: 5 }
        ]
    },
    {
        id: "long_term_vision",
        name: "Tầm nhìn thu nhập dài hạn",
        question: "Bạn có chiến lược thu nhập 3–5 năm không?",
        options: [
            { text: "Không có", score: 1 },
            { text: "Mơ hồ", score: 2 },
            { text: "Có ý tưởng", score: 3 },
            { text: "Có kế hoạch rõ", score: 4 },
            { text: "Có lộ trình & KPI", score: 5 }
        ]
    }
];
