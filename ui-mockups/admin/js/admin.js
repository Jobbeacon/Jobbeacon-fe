const TODAY = "2026-10-19";
const fmt = new Intl.NumberFormat("vi-VN");
const SOURCE_LABEL = {
  "topcv.vn": "TopCV",
  "itviec.com": "ITviec",
};
const SOURCE_ORDER = ["topcv.vn", "itviec.com"];

const jobs = [
  {
    id: "j1",
    title: "Java Backend Developer",
    category: "Backend Developer",
    company: "FPT Software",
    type: "Toàn thời gian",
    exp: 24,
    location: "Hà Nội",
    min: 25000000,
    max: 40000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-12",
    expired: "2026-11-12",
    description: "Xây API tuyển dụng, nhận tin đã parse và ghi nhận vào nền tảng.",
    benefits: "Lương tháng 13, bảo hiểm, hai ngày làm từ xa.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-19T06:14", url: "https://www.topcv.vn/viec-lam/java-backend-developer/224611" },
      { domain: "itviec.com", at: "2026-10-19T02:41", url: "https://itviec.com/it-jobs/java-backend-developer-fpt" },
    ],
  },
  {
    id: "j2",
    title: "Product Designer",
    category: "",
    company: "Tiki",
    type: "Toàn thời gian",
    exp: 12,
    location: "Hồ Chí Minh",
    min: 20000000,
    max: 30000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-11",
    expired: "2026-11-15",
    description: "Thiết kế luồng tìm kiếm và trang chi tiết tin trên ứng dụng mua sắm.",
    benefits: "Khám sức khỏe năm, ngân sách học thiết kế.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-19T05:58", url: "https://www.topcv.vn/viec-lam/product-designer/198220" },
    ],
  },
  {
    id: "j3",
    title: "Data Analyst",
    category: "Data Analyst",
    company: "VNG",
    type: "Toàn thời gian",
    exp: 18,
    location: "Hồ Chí Minh",
    min: null,
    max: null,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-09",
    expired: "2026-11-09",
    description: "Đọc số liệu sản phẩm, viết báo cáo tuần cho nhóm tăng trưởng.",
    benefits: "Lịch làm linh hoạt, bảo hiểm sức khỏe.",
    mappings: [
      { domain: "itviec.com", at: "2026-10-19T05:40", url: "https://itviec.com/it-jobs/data-analyst-vng" },
    ],
  },
  {
    id: "j4",
    title: "DevOps Engineer",
    category: "DevOps Engineer",
    company: "MoMo",
    type: "Toàn thời gian",
    exp: 36,
    location: "Hà Nội, TP.HCM",
    min: 30000000,
    max: 45000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-08",
    expired: "2026-11-20",
    description: "Giữ pipeline triển khai và cụm chạy dịch vụ đồng bộ tìm kiếm.",
    benefits: "Thưởng theo quý, hỗ trợ chứng chỉ cloud.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-18T22:16", url: "https://www.topcv.vn/viec-lam/devops-engineer/188431" },
      { domain: "itviec.com", at: "2026-10-18T21:02", url: "https://itviec.com/it-jobs/devops-engineer-momo" },
    ],
  },
  {
    id: "j5",
    title: "Business Analyst",
    category: "Business Analyst (Phân tích nghiệp vụ)",
    company: "Viettel Digital",
    type: "Toàn thời gian",
    exp: 12,
    location: "Hà Nội",
    min: 18000000,
    max: 25000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-07",
    expired: "2026-11-07",
    description: "Viết yêu cầu cho cổng việc làm nội bộ và đối soát dữ liệu với vận hành.",
    benefits: "Phụ cấp ăn trưa, xe đưa đón một số ca.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-18T21:40", url: "https://www.topcv.vn/viec-lam/business-analyst/176002" },
    ],
  },
  {
    id: "j6",
    title: "Frontend React",
    category: "Frontend Developer",
    company: "KMS Technology",
    type: "Toàn thời gian",
    exp: 24,
    location: "Hồ Chí Minh",
    min: 20000000,
    max: 35000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-06",
    expired: "2026-11-18",
    description: "Dựng giao diện danh sách việc và bộ lọc trên React.",
    benefits: "Laptop công ty, review lương hai lần một năm.",
    mappings: [
      { domain: "itviec.com", at: "2026-10-18T14:05", url: "https://itviec.com/it-jobs/frontend-react-kms" },
      { domain: "topcv.vn", at: "2026-10-18T11:20", url: "https://www.topcv.vn/viec-lam/frontend-react/165778" },
    ],
  },
  {
    id: "j7",
    title: "QA Automation",
    category: "Automation Tester",
    company: "NashTech",
    type: "Toàn thời gian",
    exp: 12,
    location: "Đà Nẵng",
    min: 15000000,
    max: 22000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-09-12",
    expired: "2026-10-01",
    description: "Viết kịch bản kiểm thử luồng crawl và trang quản trị.",
    benefits: "Làm việc từ Đà Nẵng, hỗ trợ thi chứng chỉ.",
    mappings: [
      { domain: "itviec.com", at: "2026-10-17T09:12", url: "https://itviec.com/it-jobs/qa-automation-nashtech" },
    ],
  },
  {
    id: "j8",
    title: "Nhân viên nhân sự",
    category: "Nhân sự",
    company: "Thế Giới Di Động",
    type: "Toàn thời gian",
    exp: 0,
    location: "Hà Nội",
    min: 12000000,
    max: 16000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-10",
    expired: "2026-11-10",
    description: "Sàng hồ sơ cửa hàng và lịch phỏng vấn vòng một.",
    benefits: "Giảm giá nội bộ, thưởng lễ.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-17T08:33", url: "https://www.topcv.vn/viec-lam/nhan-vien-nhan-su/154220" },
    ],
  },
  {
    id: "j9",
    title: "Fullstack Java Developer",
    category: "Fullstack Developer",
    company: "FPT Software",
    type: "Toàn thời gian",
    exp: 36,
    location: "Hà Nội",
    min: 30000000,
    max: 45000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-15",
    expired: "2026-11-15",
    description: "Phát triển dịch vụ nội bộ phục vụ đối soát dữ liệu tuyển dụng.",
    benefits: "Lương tháng 13, bảo hiểm, hai ngày làm từ xa.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-19T04:02", url: "https://www.topcv.vn/viec-lam/fullstack-java-developer/224988" },
      { domain: "itviec.com", at: "2026-10-19T01:18", url: "https://itviec.com/it-jobs/fullstack-java-developer-fpt" },
    ],
  },
  {
    id: "j10",
    title: "UI/UX Designer",
    category: "",
    company: "Tiki",
    type: "Toàn thời gian",
    exp: 24,
    location: "Hồ Chí Minh",
    min: 22000000,
    max: 32000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-14",
    expired: "2026-11-14",
    description: "Thiết kế trải nghiệm cho luồng thanh toán và theo dõi đơn hàng.",
    benefits: "Khám sức khỏe năm, ngân sách học thiết kế.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-18T09:27", url: "https://www.topcv.vn/viec-lam/ui-ux-designer/199015" },
    ],
  },
  {
    id: "j11",
    title: "DevOps/SRE Engineer",
    category: "DevOps Engineer",
    company: "MoMo",
    type: "Toàn thời gian",
    exp: 30,
    location: "Hà Nội",
    min: 28000000,
    max: 42000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-16",
    expired: "2026-11-20",
    description: "Theo dõi độ ổn định cụm dịch vụ đồng bộ và cảnh báo sự cố.",
    benefits: "Thưởng theo quý, hỗ trợ chứng chỉ cloud.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-18T20:44", url: "https://www.topcv.vn/viec-lam/devops-sre-engineer/188560" },
      { domain: "itviec.com", at: "2026-10-18T19:30", url: "https://itviec.com/it-jobs/devops-sre-engineer-momo" },
    ],
  },
  {
    id: "j12",
    title: "Backend Developer (NodeJS)",
    category: "Backend Developer",
    company: "VNG",
    type: "Toàn thời gian",
    exp: 18,
    location: "Hồ Chí Minh",
    min: 22000000,
    max: 32000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-13",
    expired: "2026-11-13",
    description: "Xây API cho sản phẩm nội bộ, làm việc cùng nhóm dữ liệu.",
    benefits: "Lịch làm linh hoạt, bảo hiểm sức khỏe.",
    mappings: [
      { domain: "itviec.com", at: "2026-10-18T07:52", url: "https://itviec.com/it-jobs/backend-developer-nodejs-vng" },
    ],
  },
  {
    id: "j13",
    title: "React Native Developer",
    category: "Mobile Developer",
    company: "KMS Technology",
    type: "Toàn thời gian",
    exp: 18,
    location: "Hồ Chí Minh",
    min: 22000000,
    max: 30000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-05",
    expired: "2026-11-05",
    description: "Dựng ứng dụng di động cho một khách hàng thương mại điện tử.",
    benefits: "Laptop công ty, review lương hai lần một năm.",
    mappings: [
      { domain: "itviec.com", at: "2026-10-17T13:48", url: "https://itviec.com/it-jobs/react-native-developer-kms" },
      { domain: "topcv.vn", at: "2026-10-17T10:05", url: "https://www.topcv.vn/viec-lam/react-native-developer/165901" },
    ],
  },
  {
    id: "j14",
    title: "Nhân viên tuyển dụng",
    category: "Nhân sự",
    company: "Thế Giới Di Động",
    type: "Toàn thời gian",
    exp: 6,
    location: "Hà Nội",
    min: 10000000,
    max: 14000000,
    currency: "VND",
    period: "tháng",
    posted: "2026-10-14",
    expired: "2026-11-14",
    description: "Đăng tin, sàng lọc hồ sơ và sắp lịch phỏng vấn cho khối vận hành.",
    benefits: "Giảm giá nội bộ, thưởng lễ.",
    mappings: [
      { domain: "topcv.vn", at: "2026-10-17T07:50", url: "https://www.topcv.vn/viec-lam/nhan-vien-tuyen-dung/154401" },
    ],
  },
];

const PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Bắc Ninh", "Đồng Nai", "Quảng Ninh", "Khánh Hòa",
  "Thái Nguyên", "Hưng Yên", "Ninh Bình", "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Trị", "Quảng Ngãi", "Gia Lai", "Đắk Lắk",
  "Lâm Đồng", "Tây Ninh", "Đồng Tháp", "Vĩnh Long", "An Giang", "Cà Mau", "Phú Thọ", "Lào Cai", "Tuyên Quang", "Cao Bằng",
  "Lạng Sơn", "Sơn La", "Điện Biên", "Lai Châu",
];

// Giá trị lưu trong DB giống enum phía ứng viên (candidate-profile.types.ts).
const EMPLOYMENT_LABEL = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  CONTRACTOR: "Hợp đồng/Freelance",
  TEMPORARY: "Thời vụ",
  INTERN: "Thực tập",
};
const PERIOD_LABEL = { HOUR: "giờ", DAY: "ngày", MONTH: "tháng", YEAR: "năm" };

// Tên công ty giữ nguyên cách nguồn ghi. Backend chỉ khớp đúng tên (không phân biệt hoa thường),
// nên cùng một công ty từ TopCV và ITviec thường thành hai bản ghi.
const COMPANY_SEED = [
  ["CÔNG TY TNHH PHẦN MỀM FPT", 1, "2026-03-04"], ["FPT Software", 1, "2026-03-09"],
  ["Công ty Cổ phần Tiki", 1, "2026-03-12"], ["Công ty Cổ phần VNG", 1, "2026-03-05"], ["VNG Corporation", 1, "2026-04-21"],
  ["Công ty Cổ phần Dịch vụ Di Động Trực Tuyến (MoMo)", 1, "2026-03-18"], ["MoMo", 0, "2026-10-15"],
  ["Tổng Công ty Dịch vụ Số Viettel", 1, "2026-03-22"], ["KMS Technology", 1, "2026-03-10"],
  ["Công ty TNHH NashTech Việt Nam", 1, "2026-04-02"], ["NashTech Vietnam", 0, "2026-10-14"],
  ["Công ty Cổ phần Thế Giới Di Động", 1, "2026-03-08"], ["Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)", 1, "2026-03-03"],
  ["Ngân hàng TMCP Quân Đội", 1, "2026-03-11"], ["Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)", 1, "2026-03-15"],
  ["Công ty Cổ phần Giao Hàng Tiết Kiệm", 1, "2026-04-08"], ["Công ty TNHH Shopee", 1, "2026-03-27"],
  ["CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN ĐẤT XANH", 0, "2026-05-06"], ["Công ty TNHH Bảo hiểm Nhân thọ Prudential Việt Nam", 1, "2026-04-14"],
  ["Công ty Cổ phần Sữa Việt Nam (Vinamilk)", 1, "2026-05-19"], ["CÔNG TY TNHH LOGISTICS TÂN CẢNG", 0, "2026-06-03"],
  ["Công ty Cổ phần Giáo dục Hocmai", 1, "2026-06-11"], ["Công ty TNHH Samsung Electronics Việt Nam", 1, "2026-03-29"],
  ["Công ty Cổ phần Tập đoàn Masan", 1, "2026-04-25"], ["Công ty TNHH Grab", 1, "2026-05-02"],
  ["CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ AN PHÁT", 0, "2026-07-14"], ["Công ty Cổ phần Công nghệ Sapo", 1, "2026-05-23"],
  ["Công ty Cổ phần MISA", 1, "2026-04-17"], ["Haravan", 1, "2026-06-20"], ["Axon Active Vietnam", 1, "2026-05-28"],
  ["Công ty TNHH Bosch Việt Nam", 1, "2026-06-09"], ["CÔNG TY CỔ PHẦN DƯỢC PHẨM AN KHANG", 0, "2026-07-30"],
  ["Công ty TNHH Kế toán Thuế Việt Á", 0, "2026-08-12"], ["Công ty Cổ phần Nhà hàng Golden Gate", 1, "2026-06-25"],
  ["CÔNG TY TNHH XÂY DỰNG HÒA BÌNH MIỀN NAM", 0, "2026-08-05"], ["Công ty TNHH Một Thành Viên Vận tải Mai Linh", 1, "2026-07-02"],
  ["Ngân hàng TMCP Á Châu (ACB)", 1, "2026-03-20"], ["Công ty Cổ phần Bkav", 1, "2026-05-14"],
  ["Công ty TNHH Zalo Pay", 1, "2026-09-03"], ["Công ty Cổ phần Tập đoàn Hòa Phát", 1, "2026-04-29"],
  ["CÔNG TY TNHH TƯ VẤN DU HỌC ÂU MỸ", 0, "2026-09-18"], ["Công ty TNHH LG Display Việt Nam Hải Phòng", 1, "2026-06-30"],
  ["Công ty Cổ phần Vận tải Biển Việt Nam", 0, "2026-08-22"], ["Công ty TNHH Thiết kế Nội thất Nhà Xinh", 1, "2026-07-21"],
  ["Công ty Cổ phần Phát triển Phần mềm Vĩnh Hưng", 0, "2026-10-13"], ["CÔNG TY TNHH DỊCH VỤ BẢO VỆ AN NINH SÀI GÒN", 0, "2026-10-17"],
];

const COMPANY_NOISE = /\b(tong cong ty|cong ty|tnhh|mot thanh vien|co phan|cp|tap doan|jsc|corporation|corp|co\.?,? ltd|ltd|viet nam|vietnam|ngan hang tmcp)\b/g;

// URL logo là thứ lưu trong DB; LOGO_ART chỉ để mockup vẽ được ảnh mà không cần mạng.
const LOGO_ART = {};
const companies = COMPANY_SEED.map(([name, hasLogo, created], index) => {
  const logo = hasLogo ? `https://cdn-new.topcv.vn/unsafe/company_logos/${slug(name).slice(0, 40)}.png` : "";
  if (logo) LOGO_ART[logo] = logoData(name, index);
  return { id: `co${index}`, name, logo, created };
});


// Logo giả dạng SVG nhúng, để mockup không phụ thuộc ảnh ngoài.
function logoData(name, index) {
  const tones = ["#2563eb", "#0f766e", "#7c3aed", "#db2777", "#ea580c", "#0891b2", "#16a34a", "#4f46e5"];
  const mark = companyKey(name).split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "C";
  const svgText = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='8' fill='${tones[index % tones.length]}'/><text x='20' y='26' font-family='Arial' font-size='15' font-weight='700' fill='white' text-anchor='middle'>${mark}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svgText)}`;
}



function companyKey(name) {
  return foldText(name.replace(/\(.*?\)/g, " ")).replace(COMPANY_NOISE, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function companyKeys(name) {
  const keys = new Set([companyKey(name)]);
  const inner = name.match(/\(([^)]+)\)/);
  if (inner) keys.add(companyKey(inner[1]));
  keys.delete("");
  return keys;
}

const GENERIC_WORDS = new Set(["tnhh", "jsc", "corporation", "corp", "ltd", "vietnam", "software", "technology", "group", "solutions", "services", "digital", "tmcp", "the", "and"]);

// Từ thương hiệu: viết không dấu và không phải từ chung (FPT, VNG, Golden…), vì từ tiếng Việt có dấu trùng rất nhiều.
function brandWords(name) {
  return new Set(name.replace(/\(.*?\)/g, " ").split(/[^\p{L}\p{N}]+/u)
    .map((word) => word.toLowerCase())
    .filter((word) => word.length >= 3 && foldText(word) === word && !GENERIC_WORDS.has(word)));
}

// Nghi trùng khi tên rút gọn trùng nhau, hoặc hai tên chung một từ hiếm (chỉ hai công ty này có).
function duplicateOf(company) {
  const mine = companyKeys(company.name);
  const words = brandWords(company.name);
  return companies.filter((other) => {
    if (other.id === company.id) return false;
    if ([...companyKeys(other.name)].some((key) => mine.has(key))) return true;
    return [...brandWords(other.name)].some((word) => words.has(word)
      && companies.filter((item) => brandWords(item.name).has(word)).length === 2);
  });
}

const JOB_TEMPLATES = [
  ["Java Developer", "Backend Developer", ["Java", "Spring Boot", "MySQL"], "FULL_TIME", 18, 35, 24],
  ["Senior Backend Engineer (Golang)", "Backend Developer", ["Go", "PostgreSQL", "Kafka", "Docker"], "FULL_TIME", 1800, 3200, 48, "USD"],
  ["Frontend Developer (ReactJS)", "Frontend Developer", ["React", "TypeScript", "HTML", "CSS"], "FULL_TIME", 15, 30, 12],
  ["Mobile Developer (Flutter)", "Mobile Developer", ["Flutter", "Dart"], "FULL_TIME", 18, 32, 24],
  ["Data Engineer", "Data Engineer", ["Python", "Apache Spark", "Airflow", "SQL"], "FULL_TIME", 25, 45, 36],
  ["Data Analyst", "Data Analyst", ["SQL", "Power BI", "Excel"], "FULL_TIME", 14, 25, 12],
  ["DevOps Engineer", "DevOps Engineer", ["Kubernetes", "AWS", "Terraform", "CI/CD"], "FULL_TIME", 1500, 2800, 36, "USD"],
  ["QA Engineer", "QA Engineer", ["Manual Testing", "Postman", "Jira"], "FULL_TIME", 12, 22, 12],
  ["Automation Tester", "Automation Tester", ["Selenium", "Java", "Cypress"], "FULL_TIME", 18, 30, 24],
  ["Business Analyst", "Business Analyst (Phân tích nghiệp vụ)", ["Agile", "Jira", "SQL"], "FULL_TIME", 18, 30, 24],
  ["UI/UX Designer", "UI/UX Design", ["Figma", "UI/UX Design"], "FULL_TIME", 15, 28, 18],
  ["Thực tập sinh Lập trình", "Software Engineer", ["Java", "Git"], "INTERN", 3, 5, 0],
  ["Nhân viên Kinh doanh Bất động sản", "Sales bất động sản/Môi giới bất động sản", ["Bán hàng", "Đàm phán", "Giao tiếp"], "FULL_TIME", 10, 30, 6],
  ["Nhân viên Telesales", "Sales Admin/Sales Support/Sales Associate", ["Telesales", "Giao tiếp"], "FULL_TIME", 8, 15, 0],
  ["Kế toán tổng hợp", "Kế toán tổng hợp", ["Kế toán tổng hợp", "MISA", "Excel"], "FULL_TIME", 12, 18, 24],
  ["Kế toán thuế", "Kế toán thuế", ["Kế toán thuế", "MISA"], "FULL_TIME", 12, 20, 36],
  ["Chuyên viên Tuyển dụng", "Tuyển dụng", ["Tuyển dụng", "Giao tiếp"], "FULL_TIME", 10, 16, 12],
  ["Digital Marketing Executive", "Digital Marketing", ["Digital Marketing", "Facebook Ads", "Google Ads"], "FULL_TIME", 12, 20, 12],
  ["Content Writer", "Content Marketing", ["Content Marketing", "Copywriting", "SEO"], "PART_TIME", 8, 12, 6],
  ["Nhân viên Chăm sóc khách hàng", "Chăm sóc khách hàng", ["Chăm sóc khách hàng", "Giao tiếp"], "FULL_TIME", 8, 12, 0],
  ["Nhân viên Xuất nhập khẩu", "Chứng từ xuất nhập khẩu", ["Xuất nhập khẩu", "Tiếng Anh", "Logistics"], "FULL_TIME", 10, 18, 12],
  ["Tài xế giao hàng", "Tài xế", ["Lái xe"], "TEMPORARY", 9, 14, 0],
  ["Phiên dịch tiếng Nhật", "Biên phiên dịch tiếng Nhật", ["Tiếng Nhật", "Phiên dịch"], "CONTRACTOR", 15, 25, 24],
  ["Kỹ sư Xây dựng", "Kỹ sư xây dựng", ["AutoCAD", "Revit"], "FULL_TIME", 15, 25, 24],
  ["Giáo viên Tiếng Anh", "Giáo viên tiếng Anh", ["Tiếng Anh", "Thuyết trình"], "PART_TIME", 0, 0, 12],
];

function slug(text) {
  return foldText(text).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function shiftDate(iso, days) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function generateJobs(count) {
  const out = [];
  for (let index = 0; index < count; index += 1) {
    const [title, category, jobSkills, type, min, max, exp, currency = "VND"] = JOB_TEMPLATES[index % JOB_TEMPLATES.length];
    const company = companies[Math.floor(hash(index, 21) * companies.length)].name;
    const posted = shiftDate(TODAY, -Math.floor(hash(index, 23) * 55) - 1);
    const expired = shiftDate(posted, 20 + Math.floor(hash(index, 25) * 30));
    const isIt = jobSkills.some((skill) => ["Java", "Go", "React", "Flutter", "Python", "Kubernetes", "Selenium", "Figma", "Manual Testing", "SQL"].includes(skill));
    const domains = isIt && hash(index, 27) < 0.45 ? (hash(index, 29) < 0.5 ? ["itviec.com"] : ["topcv.vn", "itviec.com"]) : ["topcv.vn"];
    const hour = String(Math.floor(hash(index, 31) * 24)).padStart(2, "0");
    const minute = String(Math.floor(hash(index, 33) * 60)).padStart(2, "0");
    const crawledDay = shiftDate(TODAY, -Math.floor(hash(index, 35) * Math.min(25, (new Date(TODAY) - new Date(posted)) / 86400000)));
    const places = hash(index, 37) < 0.18 ? ["Hà Nội", "Hồ Chí Minh"] : [PROVINCES[Math.floor(Math.pow(hash(index, 39), 3) * 12)]];
    const negotiable = min === 0 || hash(index, 41) < 0.12;
    // Một ít tin AI không phân loại được hoặc không trích được kỹ năng, chờ quản trị gán tay.
    const unclassified = hash(index, 43) < 0.06;
    const noSkills = hash(index, 45) < 0.05;
    out.push({
      id: `g${index}`,
      title,
      category: unclassified ? "" : category,
      skills: noSkills ? [] : [...jobSkills],
      company,
      type,
      exp,
      locations: places,
      min: negotiable ? null : (currency === "USD" ? min : min * 1000000),
      max: negotiable ? null : (currency === "USD" ? max : max * 1000000),
      currency,
      period: "MONTH",
      posted,
      expired,
      description: `${title} tại ${company}. Mô tả đầy đủ lấy từ trang nguồn.`,
      benefits: "Bảo hiểm đầy đủ, thưởng theo hiệu quả, review lương hằng năm.",
      mappings: domains.map((domain, at) => ({
        domain,
        at: `${at ? shiftDate(crawledDay, -1) : crawledDay}T${hour}:${minute}`,
        url: domain === "topcv.vn"
          ? `https://www.topcv.vn/viec-lam/${slug(title)}/${1800000 + index * 37}.html`
          : `https://itviec.com/it-jobs/${slug(title)}-${slug(company).slice(0, 18)}-${1200 + index}`,
      })),
    });
  }
  return out;
}

// Chuẩn hóa 14 tin viết tay về đúng dạng dữ liệu thật rồi thêm tin sinh tự động.
const LEGACY_COMPANY = {
  "FPT Software": "FPT Software", Tiki: "Công ty Cổ phần Tiki", VNG: "Công ty Cổ phần VNG",
  MoMo: "Công ty Cổ phần Dịch vụ Di Động Trực Tuyến (MoMo)", "Viettel Digital": "Tổng Công ty Dịch vụ Số Viettel",
  "KMS Technology": "KMS Technology", NashTech: "Công ty TNHH NashTech Việt Nam", "Thế Giới Di Động": "Công ty Cổ phần Thế Giới Di Động",
};
const LEGACY_TYPE = { "Toàn thời gian": "FULL_TIME", "Bán thời gian": "PART_TIME", "Hợp đồng": "CONTRACTOR", "Thực tập": "INTERN" };
const LEGACY_SKILLS = {
  "Backend Developer": ["Java", "Spring Boot", "PostgreSQL"], "Frontend Developer": ["React", "TypeScript"],
  "Mobile Developer": ["React Native", "TypeScript"], "Fullstack Developer": ["Java", "React", "MySQL"],
  "Data Analyst": ["SQL", "Python", "Power BI"], "DevOps Engineer": ["Docker", "Kubernetes", "AWS"],
  "Automation Tester": ["Selenium", "Java"], "Business Analyst (Phân tích nghiệp vụ)": ["Agile", "Jira"],
  "Nhân sự": ["Tuyển dụng", "Giao tiếp"],
};
jobs.forEach((job) => {
  job.company = LEGACY_COMPANY[job.company] || job.company;
  job.type = LEGACY_TYPE[job.type] || job.type;
  job.period = { tháng: "MONTH", năm: "YEAR", giờ: "HOUR" }[job.period] || "MONTH";
  job.locations = job.location.split(",").map((place) => place.trim().replace(/^TP\.HCM$/, "Hồ Chí Minh")).filter(Boolean);
  delete job.location;
  job.skills = LEGACY_SKILLS[job.category] || (job.title.includes("Designer") ? ["Figma", "UI/UX Design"] : []);
  if (!job.category && job.title.includes("Designer")) job.category = "UI/UX Design";
});
jobs.push(...generateJobs(150));



function hash(i, salt) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildDays() {
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date(2026, 9, 19);
    date.setDate(date.getDate() - i);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const wave = 1 + 0.14 * Math.sin((29 - i) / 3.2);
    const factor = (weekend ? 0.46 : 1) * wave;
    const topcv = Math.round((7 + hash(i, 1) * 4) * factor);
    const itviec = Math.round((4 + hash(i, 2) * 3) * factor);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    days.push({
      label: `${dd}.${mm}`,
      weekend,
      "topcv.vn": topcv,
      "itviec.com": itviec,
      total: topcv + itviec,
    });
  }
  return days;
}

const DAYS = buildDays();
const OCTOBER = DAYS.filter((day) => day.label.endsWith(".10"));

const MONTHS = [
  { label: "T5", hint: "", "topcv.vn": 150, "itviec.com": 72 },
  { label: "T6", hint: "", "topcv.vn": 168, "itviec.com": 84 },
  { label: "T7", hint: "", "topcv.vn": 142, "itviec.com": 70 },
  { label: "T8", hint: "", "topcv.vn": 186, "itviec.com": 95 },
  { label: "T9", hint: "", "topcv.vn": 201, "itviec.com": 103 },
  {
    label: "T10",
    hint: "1–19",
    partial: true,
    "topcv.vn": sum(OCTOBER, "topcv.vn"),
    "itviec.com": sum(OCTOBER, "itviec.com"),
  },
];
MONTHS.forEach((month) => {
  month.total = month["topcv.vn"] + month["itviec.com"];
});

const HOUR_WEIGHTS = [80, 220, 660, 820, 700, 280, 120, 70, 160, 90, 60, 40, 30, 25, 30, 40, 50, 40, 35, 40, 90, 420, 640, 310];

function sum(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function average(rows) {
  return rows.reduce((total, row) => total + row.total, 0) / rows.length;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function trieuText(amount) {
  if (amount == null || amount === "") return "";
  const value = amount / 1000000;
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
}

function trieuNumber(value) {
  const text = String(value ?? "").trim().replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? Math.round(number * 1000000) : NaN;
}


function stamp(iso) {
  const [date, time] = iso.split("T");
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year} · ${time}`;
}

function latestMapping(job) {
  return job.mappings.reduce((latest, mapping) => (mapping.at > latest.at ? mapping : latest));
}

function isExpired(job) {
  return Boolean(job.expired && job.expired < TODAY);
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function swatch(name) {
  const palette = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6"];
  let index = 0;
  for (const char of name) index += char.charCodeAt(0);
  return palette[index % palette.length];
}

function chips(domains) {
  return domains.map((domain) => (
    `<a class="chip chip-link" href="jobs.html?source=${encodeURIComponent(domain)}"><i data-domain="${esc(domain)}"></i>${esc(domain)}</a>`
  )).join("");
}

function svg(name, attrs) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function ticks(max, count = 4) {
  const rough = (max * 1.12) / count;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const error = rough / pow;
  let step = pow;
  if (error >= 7.5) step = 10 * pow;
  else if (error >= 3.5) step = 5 * pow;
  else if (error >= 1.5) step = 2 * pow;
  const top = Math.ceil((max * 1.12) / step) * step;
  const marks = [];
  for (let value = 0; value <= top + step / 10; value += step) marks.push(Math.round(value));
  return { top, marks };
}

function toast(message) {
  let node = document.getElementById("toast");
  if (!node) {
    node = document.createElement("div");
    node.id = "toast";
    node.setAttribute("role", "status");
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.dataset.show = "1";
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    delete node.dataset.show;
  }, 2400);
}

function confirmAction({ title, copy, ok = "Xóa", cancel = "Giữ lại" }) {
  const dialog = document.getElementById("confirm");
  dialog.querySelector("h2").textContent = title;
  dialog.querySelector("p").textContent = copy;
  dialog.querySelector("[value=cancel]").textContent = cancel;
  dialog.querySelector("[value=ok]").textContent = ok;
  return new Promise((resolve) => {
    const done = () => {
      dialog.removeEventListener("close", done);
      resolve(dialog.returnValue === "ok");
    };
    dialog.addEventListener("close", done);
    dialog.showModal();
  });
}

function placeTip(clientX, clientY, html) {
  const tip = document.getElementById("tip");
  const plot = document.getElementById("plot");
  const bounds = plot.getBoundingClientRect();
  tip.innerHTML = html;
  tip.hidden = false;
  const width = tip.offsetWidth;
  let left = clientX - bounds.left + 14;
  if (left + width > bounds.width - 8) left = clientX - bounds.left - width - 14;
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${Math.max(8, clientY - bounds.top - 28)}px`;
}

function bindHit(hit, label, html) {
  hit.setAttribute("tabindex", "0");
  hit.setAttribute("role", "img");
  hit.setAttribute("aria-label", label);
  const showAtPointer = (event) => placeTip(event.clientX, event.clientY, html);
  const showAtFocus = () => {
    const rect = hit.getBoundingClientRect();
    placeTip(rect.left + rect.width / 2, rect.top, html);
  };
  hit.addEventListener("mousemove", showAtPointer);
  hit.addEventListener("mouseleave", hideTip);
  hit.addEventListener("focus", showAtFocus);
  hit.addEventListener("blur", hideTip);
}

function hideTip() {
  const tip = document.getElementById("tip");
  if (tip) tip.hidden = true;
}

function sourceLines(row) {
  return SOURCE_ORDER.map((domain) => `${SOURCE_LABEL[domain]} ${fmt.format(row[domain])}`).join("<br>");
}

const CHART_FONT = "Inter, sans-serif";
const TOPCV_COLOR = "#3b82f6";
const ITVIEC_COLOR = "#a5b4fc";

function roundTop(x, y, w, h, r) {
  if (h <= 0.5) return "";
  const radius = Math.min(r, w / 2, h);
  return `M ${x} ${y + h} L ${x} ${y + radius} Q ${x} ${y} ${x + radius} ${y} L ${x + w - radius} ${y} Q ${x + w} ${y} ${x + w} ${y + radius} L ${x + w} ${y + h} Z`;
}

function drawAxis(root, marks, y, pad, width) {
  marks.forEach((mark) => {
    const yPos = y(mark);
    root.append(svg("line", {
      x1: pad.l,
      x2: width - pad.r,
      y1: yPos,
      y2: yPos,
      stroke: mark === 0 ? "#e2e8f0" : "#f1f5f9",
    }));
    if (mark === 0) return;
    const label = svg("text", {
      x: pad.l - 10,
      y: yPos + 4,
      "text-anchor": "end",
      fill: "#94a3b8",
      "font-family": CHART_FONT,
      "font-size": 11,
    });
    label.textContent = fmt.format(mark);
    root.append(label);
  });
}

function drawDays() {
  const plot = document.getElementById("plot");
  plot.replaceChildren();
  const width = 960;
  const height = 286;
  const pad = { l: 48, r: 8, t: 14, b: 28 };
  const { top, marks } = ticks(Math.max(...DAYS.map((day) => day.total)));
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const step = innerW / DAYS.length;
  const barW = Math.min(14, step * 0.52);
  const x = (index) => pad.l + step * index + step / 2;
  const y = (value) => pad.t + innerH - (value / top) * innerH;
  const root = svg("svg", { viewBox: `0 0 ${width} ${height}`, role: "img" });
  const title = svg("title", {});
  title.textContent = "Số lần ghi nhận theo ngày, xếp TopCV dưới và ITviec trên";
  root.append(title);
  drawAxis(root, marks, y, pad, width);

  DAYS.forEach((day, index) => {
    const bx = x(index) - barW / 2;
    const yTotal = y(day.total);
    const yTop = y(day["topcv.vn"]);
    const base = y(0);
    const topPath = roundTop(bx, yTop, barW, base - yTop, 0);
    if (topPath) {
      root.append(svg("path", { d: topPath, fill: TOPCV_COLOR }));
    }
    const itPath = roundTop(bx, yTotal, barW, yTop - yTotal + 0.75, 3);
    if (itPath) {
      root.append(svg("path", { d: itPath, fill: ITVIEC_COLOR }));
    }
  });

  DAYS.forEach((day, index) => {
    if (index % 5 !== 0 && index !== DAYS.length - 1) return;
    const label = svg("text", {
      x: x(index),
      y: height - 8,
      "text-anchor": "middle",
      fill: "#94a3b8",
      "font-family": CHART_FONT,
      "font-size": 11,
    });
    label.textContent = day.label;
    root.append(label);
  });

  DAYS.forEach((day, index) => {
    const hit = svg("rect", {
      x: pad.l + step * index,
      y: pad.t,
      width: step,
      height: innerH,
      fill: "transparent",
    });
    const html = `<strong>${day.label}</strong><br>${sourceLines(day)}<br>Cộng ${fmt.format(day.total)}`;
    const label = `${day.label}: ${SOURCE_ORDER.map((domain) => `${SOURCE_LABEL[domain]} ${fmt.format(day[domain])}`).join(", ")}, cộng ${fmt.format(day.total)}`;
    bindHit(hit, label, html);
    root.append(hit);
  });

  plot.append(root);
  const peak = DAYS.reduce((best, day) => (day.total > best.total ? day : best));
  const weekday = average(DAYS.filter((day) => !day.weekend));
  const weekend = average(DAYS.filter((day) => day.weekend));
  document.getElementById("legend").innerHTML = `<span><i class="swatch"></i> TopCV</span><span><i class="swatch swatch--itviec"></i> ITviec</span>`;
  document.getElementById("chart-title").textContent = "30 ngày gần nhất";
  document.getElementById("chart-read").textContent = `Chiều cao là tổng hai nguồn. Đỉnh ${peak.label} với ${fmt.format(peak.total)} dòng. Ngày thường trung bình ${fmt.format(Math.round(weekday))} dòng, cuối tuần ${fmt.format(Math.round(weekend))}.`;
  renderPlatforms(DAYS, `30 ngày · ${DAYS[0].label}–${DAYS.at(-1).label}`);
}

function drawMonths() {
  const plot = document.getElementById("plot");
  plot.replaceChildren();
  const width = 960;
  const height = 286;
  const pad = { l: 52, r: 12, t: 14, b: 40 };
  const max = Math.max(...MONTHS.flatMap((month) => SOURCE_ORDER.map((domain) => month[domain])));
  const { top, marks } = ticks(max);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const groupW = innerW / MONTHS.length;
  const barW = 22;
  const y = (value) => pad.t + innerH - (value / top) * innerH;
  const colors = { "topcv.vn": TOPCV_COLOR, "itviec.com": ITVIEC_COLOR };
  const root = svg("svg", { viewBox: `0 0 ${width} ${height}`, role: "img" });
  const title = svg("title", {});
  title.textContent = "Số lần ghi nhận theo tháng và nguồn";
  root.append(title);
  drawAxis(root, marks, y, pad, width);

  MONTHS.forEach((month, index) => {
    const origin = pad.l + index * groupW;
    SOURCE_ORDER.forEach((domain, sourceIndex) => {
      const value = month[domain];
      const barX = origin + groupW / 2 - barW - 3 + sourceIndex * (barW + 6);
      const barY = y(value);
      const path = roundTop(barX, barY, barW, Math.max(0, y(0) - barY), 4);
      if (path) root.append(svg("path", { d: path, fill: colors[domain] }));
    });
    const name = svg("text", {
      x: origin + groupW / 2,
      y: month.hint ? height - 22 : height - 10,
      "text-anchor": "middle",
      fill: "#334155",
      "font-family": CHART_FONT,
      "font-size": 13,
      "font-weight": 600,
    });
    name.textContent = month.label;
    root.append(name);
    if (month.hint) {
      const hint = svg("text", {
        x: origin + groupW / 2,
        y: height - 8,
        "text-anchor": "middle",
        fill: "#94a3b8",
        "font-family": CHART_FONT,
        "font-size": 11,
      });
      hint.textContent = month.hint;
      root.append(hint);
    }

    const hit = svg("rect", {
      x: origin,
      y: pad.t,
      width: groupW,
      height: innerH,
      fill: "transparent",
    });
    const partial = month.partial ? "<br>Chưa đủ tháng" : "";
    const html = `<strong>${month.label}</strong><br>${sourceLines(month)}<br>Cộng ${fmt.format(month.total)}${partial}`;
    const label = `${month.label}: ${SOURCE_ORDER.map((domain) => `${SOURCE_LABEL[domain]} ${fmt.format(month[domain])}`).join(", ")}, cộng ${fmt.format(month.total)}${month.partial ? ", chưa đủ tháng" : ""}`;
    bindHit(hit, label, html);
    root.append(hit);
  });

  plot.append(root);
  const peak = MONTHS.reduce((best, month) => (month.total > best.total ? month : best));
  document.getElementById("legend").innerHTML = `<span><i class="swatch"></i> TopCV</span><span><i class="swatch swatch--itviec"></i> ITviec</span>`;
  document.getElementById("chart-title").textContent = "Sáu tháng gần nhất";
  document.getElementById("chart-read").textContent = `${peak.label} cao nhất: TopCV ${fmt.format(peak["topcv.vn"])} và ITviec ${fmt.format(peak["itviec.com"])}, cộng ${fmt.format(peak.total)} dòng. T10 chỉ tính đến 19.10.`;
  renderPlatforms(MONTHS, "Sáu tháng · T10 tính đến 19.10");
}

function renderPlatforms(rows, caption) {
  const totals = SOURCE_ORDER.map((domain) => ({
    domain,
    value: sum(rows, domain),
  }));
  const total = totals.reduce((count, row) => count + row.value, 0);
  const host = document.getElementById("platforms");
  const share = totals.map((row) => {
    const width = total ? (row.value / total) * 100 : 0;
    const color = row.domain === "topcv.vn" ? TOPCV_COLOR : ITVIEC_COLOR;
    return `<span style="width:${width}%;background:${color}"></span>`;
  }).join("");
  host.innerHTML = `<div class="share">${share}</div>` + totals.map((row) => {
    const width = total ? (row.value / total) * 100 : 0;
    return `<div class="plat">
      <div class="plat-name"><i data-domain="${esc(row.domain)}"></i>${esc(SOURCE_LABEL[row.domain])}<em>${esc(row.domain)}</em></div>
      <b>${fmt.format(row.value)}</b>
      <b>${Math.round(width)}%</b>
    </div>`;
  }).join("") + `<p class="unwired">VietnamWorks và Joboko chưa có crawler, nên không có số.</p>`;
  document.getElementById("platform-caption").textContent = caption;
}

function renderHours(total) {
  const weightSum = HOUR_WEIGHTS.reduce((count, value) => count + value, 0);
  const hours = HOUR_WEIGHTS.map((weight) => Math.floor((total * weight) / weightSum));
  hours[3] += total - hours.reduce((count, value) => count + value, 0);
  const peak = Math.max(...hours);
  const peakHour = hours.indexOf(peak);
  const host = document.getElementById("hours");
  host.innerHTML = hours.map((value, hour) => {
    const hot = (hour >= 2 && hour <= 4) || (hour >= 21 && hour <= 22);
    const height = Math.max(2, (value / peak) * 100);
    const label = `${String(hour).padStart(2, "0")}:00 · ${fmt.format(value)} dòng`;
    return `<span${hot ? ' data-hot="1"' : ""} style="height:${height}%" title="${esc(label)}" tabindex="0" role="img" aria-label="${esc(label)}"></span>`;
  }).join("");
  document.getElementById("hour-labels").innerHTML = hours.map((_, hour) => (
    hour % 3 === 0 ? `<span>${String(hour).padStart(2, "0")}</span>` : "<span></span>"
  )).join("");
  document.getElementById("hour-caption").textContent = `Phân bổ ${fmt.format(total)} dòng của 30 ngày. Đỉnh ${String(peakHour).padStart(2, "0")}:00 với ${fmt.format(peak)} dòng.`;
}

function renderKpis() {
  const today = DAYS.at(-1);
  const month = sum(OCTOBER, "total");
  const windowTotal = sum(DAYS, "total");
  const topcvShare = Math.round((sum(DAYS, "topcv.vn") / windowTotal) * 100);
  const cards = [
    ["30 ngày", fmt.format(windowTotal), `${DAYS[0].label} – ${today.label}`, "jobs.html"],
    ["Hôm nay", fmt.format(today.total), `TopCV ${fmt.format(today["topcv.vn"])} · ITviec ${fmt.format(today["itviec.com"])}`, "jobs.html?crawled=today"],
    ["Tháng 10", fmt.format(month), "Đến 19.10, chưa hết tháng", "jobs.html?crawled=month"],
    ["TopCV", `${topcvShare}%`, `${fmt.format(sum(DAYS, "topcv.vn"))} dòng trong 30 ngày`, "jobs.html?source=topcv.vn"],
  ];
  document.getElementById("kpis").innerHTML = cards.map(([label, value, note, href]) => `
    <a class="metric" href="${href}"><span>${label}</span><strong>${value}</strong><small>${note}</small></a>`).join("");
}

function renderQuietSources() {
  const quiet = SOURCE_ORDER.filter((domain) => !jobs.some((job) => (
    job.mappings.some((mapping) => mapping.domain === domain && mapping.at.startsWith(TODAY))
  )));
  const node = document.getElementById("quiet");
  if (!quiet.length) {
    node.hidden = true;
    return;
  }
  node.hidden = false;
  node.textContent = quiet.map((domain) => `${SOURCE_LABEL[domain]} hôm nay chưa có ghi nhận.`).join(" ");
}

function renderCrawls() {
  const rows = jobs.flatMap((job) => job.mappings.map((mapping) => ({ ...mapping, job })))
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 12);
  document.getElementById("crawl-rows").innerHTML = rows.map((row) => `
    <tr>
      <td class="when">${stamp(row.at)}</td>
      <td>${chips([row.domain])}</td>
      <td><a class="row-link" href="jobs.html?job=${esc(row.job.id)}">${esc(row.job.title)}</a></td>
      <td><a class="row-link" href="jobs.html?company=${encodeURIComponent(row.job.company)}">${esc(row.job.company)}</a></td>
      <td><div class="url" title="${esc(row.url)}">${esc(row.url.replace(/^https?:\/\//, ""))}</div></td>
    </tr>`).join("");
}

















function bindDialog(dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function bootOverview() {
  renderKpis();
  renderQuietSources();
  renderHours(sum(DAYS, "total"));
  renderCrawls();
  const tabs = document.querySelectorAll(".switch button");
  const show = (range) => {
    hideTip();
    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.range === range)));
    if (range === "month") drawMonths();
    else drawDays();
  };
  tabs.forEach((tab) => tab.addEventListener("click", () => show(tab.dataset.range)));
  show("day");
}



const ROLE_LABEL = { ADMIN: "Quản trị", USER: "Người dùng" };
const STATUS_LABEL = { ACTIVE: "Đang dùng", SUSPENDED: "Đã khóa", DELETED: "Đã xóa" };

const accounts = [
  {
    id: "u1",
    name: "Trần Minh Anh",
    email: "minh.anh@jobbeacon.vn",
    verified: true,
    role: "ADMIN",
    status: "ACTIVE",
    created: "2026-05-02T09:00",
    login: "2026-10-19T08:12",
    cv: null,
    preference: null,
  },
  {
    id: "u2",
    name: "Phạm Quốc Huy",
    email: "huy.pham@jobbeacon.vn",
    verified: true,
    role: "ADMIN",
    status: "ACTIVE",
    created: "2026-06-18T14:30",
    login: "2026-10-18T19:44",
    cv: null,
    preference: null,
  },
  {
    id: "u3",
    name: "Lê Hoàng Nam",
    email: "hoang.nam@gmail.com",
    verified: true,
    role: "USER",
    status: "ACTIVE",
    created: "2026-08-14T11:20",
    login: "2026-10-18T21:05",
    cv: { title: "Java Backend Developer", months: 28, status: "Đã đọc", skills: ["Java", "Spring", "SQL"] },
    preference: { titles: ["Java Backend", "Backend Engineer"], types: ["Toàn thời gian"], remote: true, min: 25000000, max: 40000000, provinces: ["Hà Nội"], open: true },
  },
  {
    id: "u4",
    name: "Ngô Thu Hà",
    email: "thu.ha@tiki.vn",
    verified: true,
    role: "USER",
    status: "ACTIVE",
    created: "2026-09-02T08:15",
    login: "2026-10-17T22:18",
    cv: { title: "Product Designer", months: 36, status: "Đã đọc", skills: ["Figma"] },
    preference: { titles: ["Product Designer"], types: ["Toàn thời gian"], remote: false, min: 20000000, max: 32000000, provinces: ["Hồ Chí Minh"], open: true },
  },
  {
    id: "u5",
    name: "Đỗ Gia Bảo",
    email: "giabao.do@gmail.com",
    verified: false,
    role: "USER",
    status: "ACTIVE",
    created: "2026-10-16T16:02",
    login: "2026-10-16T16:04",
    cv: null,
    preference: null,
  },
  {
    id: "u6",
    name: "Vũ Mai Chi",
    email: "maichi.vu@vng.com.vn",
    verified: true,
    role: "USER",
    status: "SUSPENDED",
    created: "2026-07-21T10:00",
    login: "2026-09-30T07:41",
    cv: { title: "Data Analyst", months: 20, status: "Đã đọc", skills: ["SQL", "Python"] },
    preference: { titles: ["Data Analyst"], types: ["Toàn thời gian"], remote: true, min: null, max: null, provinces: ["Hồ Chí Minh", "Hà Nội"], open: false },
  },
  {
    id: "u7",
    name: "Bùi Thanh Tùng",
    email: "thanhtung.bui@gmail.com",
    verified: true,
    role: "USER",
    status: "DELETED",
    created: "2026-04-11T09:12",
    login: "2026-08-02T18:20",
    cv: null,
    preference: null,
  },
  {
    id: "u8",
    name: "Hoàng Khánh Linh",
    email: "khanhlinh.hoang@gmail.com",
    verified: true,
    role: "USER",
    status: "ACTIVE",
    created: "2026-09-28T13:45",
    login: "2026-10-15T12:06",
    cv: null,
    preference: { titles: ["Nhân viên nhân sự"], types: ["Toàn thời gian"], remote: false, min: 12000000, max: 18000000, provinces: ["Hà Nội"], open: true },
  },
];


const categories = CATEGORY_SEED.map(([name, parent], index) => ({
  id: `c${index}`,
  name,
  parent: parent < 0 ? "" : `c${parent}`,
}));

const LEVEL_LABEL = ["Nhóm ngành", "Nhóm nghề", "Vị trí"];

function childrenOf(id) {
  return categories.filter((item) => item.parent === id);
}

function categoryById(id) {
  return categories.find((item) => item.id === id);
}

function categoryPath(id) {
  const path = [];
  let node = categoryById(id);
  while (node) {
    path.unshift(node);
    node = node.parent ? categoryById(node.parent) : null;
  }
  return path;
}

// Tin thật trong mockup quá ít để thấy được quy mô, nên mỗi mục lá được cộng thêm một số giả cố định.
function seededJobs(category) {
  const index = Number(category.id.slice(1));
  if (!Number.isInteger(index)) return 0;
  const roll = hash(index, 7);
  return roll < 0.35 ? 0 : Math.round(roll * roll * 60);
}

let categoryTotals = new Map();

function countCategoryJobs() {
  const totals = new Map();
  const visit = (category) => {
    let total = jobs.filter((job) => job.category === category.name).length;
    const kids = childrenOf(category.id);
    total += kids.length ? kids.reduce((sum, child) => sum + visit(child), 0) : seededJobs(category);
    totals.set(category.id, total);
    return total;
  };
  categories.filter((item) => !item.parent).forEach(visit);
  categoryTotals = totals;
}

function totalJobCount(id) {
  return categoryTotals.get(id) || 0;
}

const SKILL_SEED = [
  ["Java", ["j2ee", "java core"]], ["Spring Boot", ["springboot", "spring-boot"]], ["Spring", ["spring framework"]],
  ["JavaScript", ["js", "es6"]], ["TypeScript", ["ts"]], ["React", ["reactjs", "react.js"]], ["Next.js", ["nextjs"]],
  ["Vue.js", ["vuejs", "vue"]], ["Angular", ["angularjs"]], ["Node.js", ["nodejs", "node"]], ["NestJS", []],
  ["Express", ["expressjs"]], ["Python", ["python3", "py"]], ["Django", []], ["FastAPI", []], ["Flask", []],
  ["Go", ["golang"]], ["Rust", []], ["C", []], ["C++", ["cpp"]], ["C#", ["csharp", "c sharp"]], [".NET", ["dotnet", ".net core"]],
  ["ASP.NET Core", ["asp.net"]], ["PHP", []], ["Laravel", []], ["Ruby on Rails", ["rails", "ror"]], ["Kotlin", []],
  ["Swift", []], ["Flutter", []], ["Dart", []], ["React Native", ["rn"]], ["Android", ["android sdk"]], ["iOS", []],
  ["SQL", ["t-sql"]], ["MySQL", []], ["PostgreSQL", ["postgres", "psql"]], ["SQL Server", ["mssql"]], ["Oracle", ["oracle db"]],
  ["MongoDB", ["mongo"]], ["Redis", []], ["Elasticsearch", ["elastic search", "es"]], ["Kafka", ["apache kafka"]],
  ["RabbitMQ", []], ["Docker", []], ["Kubernetes", ["k8s"]], ["AWS", ["amazon web services"]], ["Azure", ["microsoft azure"]],
  ["Google Cloud", ["gcp"]], ["Linux", ["ubuntu", "centos"]], ["Git", ["github", "gitlab"]], ["CI/CD", ["cicd"]],
  ["Jenkins", []], ["Terraform", []], ["Ansible", []], ["Microservices", ["micro service"]], ["RESTful API", ["rest api", "restful"]],
  ["GraphQL", []], ["HTML", ["html5"]], ["CSS", ["css3", "scss", "sass"]], ["Tailwind CSS", ["tailwind"]], ["Figma", []],
  ["Adobe Photoshop", ["photoshop", "ps"]], ["Adobe Illustrator", ["illustrator", "ai"]], ["UI/UX Design", ["ui/ux", "ux design"]],
  ["Selenium", []], ["Cypress", []], ["Jest", []], ["JUnit", []], ["Postman", []], ["Manual Testing", ["kiểm thử thủ công"]],
  ["Automation Testing", ["test automation", "kiểm thử tự động"]], ["Machine Learning", ["ml", "học máy"]],
  ["Deep Learning", ["dl"]], ["TensorFlow", []], ["PyTorch", []], ["NLP", ["xử lý ngôn ngữ tự nhiên"]], ["Computer Vision", ["cv"]],
  ["Data Analysis", ["phân tích dữ liệu"]], ["Power BI", ["powerbi"]], ["Tableau", []], ["Excel", ["ms excel", "microsoft excel"]],
  ["Pandas", []], ["Apache Spark", ["spark", "pyspark"]], ["Hadoop", []], ["Airflow", ["apache airflow"]], ["ETL", []],
  ["Agile", []], ["Scrum", []], ["Jira", []], ["Blockchain", []], ["Solidity", []], ["Unity", ["unity3d"]], ["Unreal Engine", ["ue5"]],
  ["Embedded C", ["lập trình nhúng"]], ["IoT", ["internet of things"]], ["Networking", ["ccna", "mạng máy tính"]],
  ["Cybersecurity", ["an ninh mạng", "bảo mật"]], ["Penetration Testing", ["pentest"]], ["SAP", ["sap erp"]], ["Salesforce", []],
  ["Tiếng Anh", ["english", "anh văn"]], ["Tiếng Nhật", ["japanese", "jlpt"]], ["Tiếng Trung", ["chinese", "hsk"]],
  ["Tiếng Hàn", ["korean", "topik"]], ["Làm việc nhóm", ["teamwork", "làm việc theo nhóm"]], ["Giao tiếp", ["communication"]],
  ["Thuyết trình", ["presentation"]], ["Giải quyết vấn đề", ["problem solving"]], ["Quản lý thời gian", ["time management"]],
  ["Đàm phán", ["negotiation"]], ["Chăm sóc khách hàng", ["customer service", "cskh"]], ["Telesales", []],
  ["Bán hàng", ["sales", "kỹ năng bán hàng"]], ["Kế toán tổng hợp", ["general accounting"]], ["Kế toán thuế", ["tax accounting"]],
  ["MISA", ["phần mềm misa"]], ["Kiểm toán", ["audit"]], ["Phân tích tài chính", ["financial analysis"]], ["Tuyển dụng", ["recruitment"]],
  ["C&B", ["compensation & benefits"]], ["Đào tạo nội bộ", ["training"]], ["Luật lao động", []], ["Digital Marketing", []],
  ["SEO", []], ["Google Ads", ["adwords"]], ["Facebook Ads", ["fb ads"]], ["Content Marketing", ["viết content"]],
  ["Copywriting", []], ["Quản lý dự án", ["project management", "pm"]], ["Tin học văn phòng", ["ms office", "office"]],
  ["AutoCAD", ["cad"]], ["Revit", []], ["SketchUp", []], ["Logistics", []], ["Xuất nhập khẩu", ["import export", "xnk"]],
  ["Quản lý kho", ["warehouse management"]], ["Lái xe", ["bằng lái b2"]], ["Biên dịch", ["translation"]], ["Phiên dịch", ["interpretation"]],
];

// Kỹ năng crawler vừa tạo trong 7 ngày: phần lớn là bản trùng mà AI chưa gộp được, chờ quản trị gộp tay.
const RECENT_SKILLS = [
  ["Kỹ năng giao tiếp tốt", 3], ["MS Excel nâng cao", 2], ["Spring framework 6", 1], ["Postgre SQL", 2],
  ["NodeJs Express", 1], ["Chịu được áp lực", 9], ["Tiếng Anh giao tiếp", 6], ["Zalo Ads", 2],
];

const skills = [
  ...SKILL_SEED.map(([name, aliases], index) => ({
    id: `sk${index}`,
    name,
    aliases: [...aliases],
    jobs: Math.max(0, Math.round(900 / Math.pow(index + 1, 0.85) * (0.4 + hash(index, 3)) - 12)),
    cvs: Math.round(160 / Math.pow(index + 1, 0.7) * hash(index, 5)),
    added: `2026-${String(3 + Math.floor(hash(index, 9) * 6)).padStart(2, "0")}-${String(1 + Math.floor(hash(index, 11) * 27)).padStart(2, "0")}`,
    by: hash(index, 13) < 0.15 ? "admin" : "crawler",
  })),
  ...RECENT_SKILLS.map(([name, count], index) => ({
    id: `skn${index}`,
    name,
    aliases: [],
    jobs: count,
    cvs: 0,
    added: `2026-10-${String(13 + (index % 7)).padStart(2, "0")}`,
    by: "crawler",
  })),
];

function statusMark(status) {
  const kind = status === "ACTIVE" ? "" : status === "SUSPENDED" ? " state--off" : " state--muted";
  return `<span class="state${kind}"><i></i>${STATUS_LABEL[status]}</span>`;
}

function normalizeName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function bootLogin() {
  const form = document.getElementById("login-form");
  const error = document.getElementById("login-error");
  form.addEventListener("input", () => {
    error.textContent = "";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    if (email.toLowerCase() !== "minh.anh@jobbeacon.vn" || password !== "admin") {
      error.textContent = "Sai tài khoản. Dùng minh.anh@jobbeacon.vn và mật khẩu admin.";
      return;
    }
    window.location.href = "index.html";
  });
}


function lockLabel(account) {
  if (account.status === "DELETED") return "";
  const label = account.status === "SUSPENDED" ? "Mở khóa" : "Khóa";
  return `<button class="linkish" type="button" data-action="lock">${label}</button>`;
}


function preferenceText(preference) {
  if (!preference) return `<p class="fine">Chưa khai nguyện vọng.</p>`;
  const salary = preference.min || preference.max ? money(preference.min, preference.max) : "Thỏa thuận";
  return `<dl class="meta">
    <div><dt>Vị trí muốn</dt><dd>${esc(preference.titles.join(", "))}</dd></div>
    <div><dt>Hình thức</dt><dd>${esc(preference.types.join(", "))}${preference.remote ? " · từ xa" : ""}</dd></div>
    <div><dt>Lương</dt><dd>${esc(salary)}</dd></div>
    <div><dt>Tỉnh thành</dt><dd>${esc(preference.provinces.join(", "))}</dd></div>
    <div><dt>Đang tìm việc</dt><dd>${preference.open ? "Có" : "Không"}</dd></div>
  </dl>`;
}

function openUser(id) {
  const account = accounts.find((item) => item.id === id);
  const form = document.getElementById("user-form");
  form.dataset.id = id;
  form.elements.name.value = account.name;
  form.elements.role.value = account.role;
  form.elements.status.value = account.status;
  document.querySelector("#user-form h2").textContent = account.name;
  document.getElementById("user-account").innerHTML = `
    <div><dt>Email</dt><dd>${esc(account.email)}</dd></div>
    <div><dt>Xác minh</dt><dd>${account.verified ? "Đã xác minh" : "Chưa xác minh"}</dd></div>
    <div><dt>Đăng nhập</dt><dd>${account.login ? stamp(account.login) : "—"}</dd></div>`;
  const cv = document.getElementById("user-cv-view");
  cv.innerHTML = account.cv ? `<dl class="meta">
    <div><dt>Vị trí</dt><dd>${esc(account.cv.title)}</dd></div>
    <div><dt>Kinh nghiệm</dt><dd>${fmt.format(account.cv.months)} tháng</dd></div>
    <div><dt>Đọc CV</dt><dd>${esc(account.cv.status)}</dd></div>
    <div><dt>Kỹ năng</dt><dd>${esc(account.cv.skills.join(", "))}</dd></div>
  </dl>` : `<p class="fine">Chưa có CV.</p>`;
  document.getElementById("user-preference").innerHTML = preferenceText(account.preference);
  document.getElementById("editor").showModal();
  form.elements.name.focus();
}

function otherActiveAdmins(exceptId) {
  return accounts.filter((item) => item.id !== exceptId && item.role === "ADMIN" && item.status === "ACTIVE");
}

async function saveUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const account = accounts.find((item) => item.id === form.dataset.id);
  const nextRole = form.elements.role.value;
  const nextStatus = form.elements.status.value;
  const wasActiveAdmin = account.role === "ADMIN" && account.status === "ACTIVE";
  const staysActiveAdmin = nextRole === "ADMIN" && nextStatus === "ACTIVE";
  if (wasActiveAdmin && !staysActiveAdmin && otherActiveAdmins(account.id).length === 0) {
    toast("Cần giữ ít nhất một quản trị đang dùng.");
    return;
  }
  if (nextStatus === "DELETED" && account.status !== "DELETED") {
    const ok = await confirmAction({
      title: `Xóa ${account.name}?`,
      copy: "Tài khoản sẽ không đăng nhập được nữa.",
      ok: "Xóa",
      cancel: "Hủy",
    });
    if (!ok) return;
  }
  account.name = form.elements.name.value.trim();
  account.role = nextRole;
  account.status = nextStatus;
  document.getElementById("editor").close();
  renderUsers();
  toast(`Đã lưu “${account.name}”.`);
}

async function lockUser(id) {
  const account = accounts.find((item) => item.id === id);
  if (!account || account.status === "DELETED") return;
  const next = account.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
  if (account.role === "ADMIN" && account.status === "ACTIVE" && next === "SUSPENDED" && otherActiveAdmins(account.id).length === 0) {
    toast("Cần giữ ít nhất một quản trị đang dùng.");
    return;
  }
  const locking = next === "SUSPENDED";
  const ok = await confirmAction({
    title: locking ? `Khóa ${account.name}?` : `Mở khóa ${account.name}?`,
    copy: locking ? "Tài khoản không đăng nhập được cho đến khi mở khóa." : "Tài khoản được dùng lại.",
    ok: locking ? "Khóa" : "Mở khóa",
    cancel: "Hủy",
  });
  if (!ok) return;
  account.status = next;
  renderUsers();
  toast(locking ? `Đã khóa ${account.name}.` : `Đã mở khóa ${account.name}.`);
}






const CHEVRON = `<svg class="chev" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"></path></svg>`;
const PENCIL = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"></path></svg>`;

const browse = { l1: "", l2: "", q: "", flash: "" };

function foldText(value) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

function markMatch(name, query) {
  const at = foldText(name).indexOf(foldText(query));
  if (!query || at < 0) return esc(name);
  return `${esc(name.slice(0, at))}<mark>${esc(name.slice(at, at + query.length))}</mark>${esc(name.slice(at + query.length))}`;
}

function categoryColumn(level, parentId, items, selectedId) {
  const parent = parentId ? categoryById(parentId) : null;
  const rows = items.map((item) => {
    const kids = level < 2 ? childrenOf(item.id).length : 0;
    const meta = level < 2 ? `${fmt.format(kids)} mục con · ${fmt.format(totalJobCount(item.id))} tin` : "";
    return `
      <li class="col-row${item.id === selectedId ? " is-open" : ""}${item.id === browse.flash ? " is-flash" : ""}" data-id="${item.id}">
        <button class="col-item" type="button" data-action="${level < 2 ? "open" : "edit"}">
          <span class="col-name">${esc(item.name)}</span>
          ${meta ? `<span class="col-meta">${meta}</span>` : ""}
        </button>
        ${level === 2 ? `<a class="count-badge" href="jobs.html?category=${encodeURIComponent(item.name)}">${fmt.format(totalJobCount(item.id))} tin</a>` : ""}
        <button class="icon-btn" type="button" data-action="edit" title="Sửa ${esc(item.name)}" aria-label="Sửa ${esc(item.name)}">${PENCIL}</button>
        ${level < 2 ? CHEVRON : ""}
      </li>`;
  }).join("");
  const empty = level === 0 || parent
    ? `<li class="col-empty">Chưa có mục nào.</li>`
    : `<li class="col-empty">Chọn một ${LEVEL_LABEL[level - 1].toLowerCase()} bên trái.</li>`;
  return `
    <div class="col">
      <div class="col-head">
        <div>
          <h2>${LEVEL_LABEL[level]}</h2>
          <span class="aside">${parent ? esc(parent.name) : level === 0 ? "Cấp cao nhất" : "—"}</span>
        </div>
        ${level === 0 || parent ? `<button class="btn ghost xs" type="button" data-add="${parentId}">+ Thêm</button>` : ""}
      </div>
      <ul class="col-list">${items.length ? rows : empty}</ul>
    </div>`;
}

function renderCategoryStats() {
  const levels = [0, 0, 0];
  categories.forEach((item) => {
    levels[categoryPath(item.id).length - 1] += 1;
  });
  document.getElementById("category-stats").innerHTML = levels.map((count, level) => `
    <div class="stat"><strong>${fmt.format(count)}</strong><span>${LEVEL_LABEL[level]}</span></div>`).join("");
}

function renderCategoryBrowser() {
  const query = browse.q.trim();
  const columns = document.getElementById("category-columns");
  const results = document.getElementById("category-results");
  columns.hidden = Boolean(query);
  results.hidden = !query;
  if (query) {
    const key = foldText(query);
    const matched = categories.filter((item) => foldText(item.name).includes(key));
    const shown = matched.slice(0, 60);
    results.innerHTML = `
      <p class="results-head">${fmt.format(matched.length)} kết quả${matched.length > shown.length ? ` · hiện ${shown.length} đầu tiên` : ""}</p>
      <ul class="result-list">${shown.map((item) => {
        const path = categoryPath(item.id);
        return `
          <li data-id="${item.id}">
            <button class="result-item" type="button" data-action="reveal">
              <span class="level-tag">${LEVEL_LABEL[path.length - 1]}</span>
              <span class="result-name">${markMatch(item.name, query)}</span>
              <span class="crumbs">${path.slice(0, -1).map((node) => esc(node.name)).join(" › ") || "Cấp cao nhất"}</span>
            </button>
            <span class="count-badge">${fmt.format(totalJobCount(item.id))} tin</span>
          </li>`;
      }).join("") || `<li class="col-empty">Không có danh mục khớp “${esc(query)}”.</li>`}</ul>`;
    return;
  }
  const roots = categories.filter((item) => !item.parent);
  columns.innerHTML = [
    categoryColumn(0, "", roots, browse.l1),
    categoryColumn(1, browse.l1, browse.l1 ? childrenOf(browse.l1) : [], browse.l2),
    categoryColumn(2, browse.l2, browse.l2 ? childrenOf(browse.l2) : [], ""),
  ].join("");
  columns.querySelectorAll(".is-open, .is-flash").forEach((row) => row.scrollIntoView({ block: "nearest" }));
}

function revealCategory(id) {
  const path = categoryPath(id);
  browse.l1 = path[0]?.id || "";
  browse.l2 = path[1]?.id || "";
  browse.flash = id;
  browse.q = "";
  document.getElementById("category-q").value = "";
  renderCategoryBrowser();
}

function openCategory(id, parentId = "") {
  const form = document.getElementById("category-form");
  const category = id ? categoryById(id) : null;
  const parent = category ? category.parent : parentId;
  form.dataset.id = id || "";
  form.dataset.parent = parent;
  form.elements.name.value = category ? category.name : "";
  const path = parent ? categoryPath(parent) : [];
  const level = path.length;
  document.getElementById("category-heading").textContent = category ? `Sửa ${LEVEL_LABEL[level].toLowerCase()}` : `Thêm ${LEVEL_LABEL[level].toLowerCase()}`;
  document.getElementById("category-place").textContent = path.length ? path.map((node) => node.name).join(" › ") : "Cấp cao nhất";
  const usage = document.getElementById("category-usage");
  usage.hidden = !category;
  if (category) {
    const kids = childrenOf(id).length;
    usage.innerHTML = `
      <div><dt>Mục con</dt><dd>${fmt.format(kids)}</dd></div>
      <div><dt>Tin đã gán</dt><dd>${fmt.format(totalJobCount(id))} tin</dd></div>`;
  }
  document.getElementById("delete-category").hidden = !category;
  document.getElementById("category-editor").showModal();
  form.elements.name.focus();
}

function saveCategory(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const parent = form.dataset.parent;
  const clash = categories.some((item) => item.parent === parent && item.id !== form.dataset.id && normalizeName(item.name) === normalizeName(name));
  if (clash) {
    toast("Đã có mục cùng tên ở cấp này.");
    return;
  }
  let id = form.dataset.id;
  if (id) {
    categoryById(id).name = name;
  } else {
    id = `cat-${Date.now()}`;
    categories.push({ id, name, parent });
  }
  document.getElementById("category-editor").close();
  countCategoryJobs();
  renderCategoryStats();
  revealCategory(id);
  toast(`Đã lưu “${name}”.`);
}

async function deleteCategory(id) {
  const category = categoryById(id);
  if (!category) return false;
  const kids = childrenOf(id).length;
  if (kids) {
    toast(`Còn ${fmt.format(kids)} mục con. Gỡ những mục đó trước.`);
    return false;
  }
  const ok = await confirmAction({
    title: "Gỡ danh mục này?",
    copy: `“${category.name}” sẽ bị gỡ khỏi danh sách. ${fmt.format(totalJobCount(id))} tin đang gán sẽ không còn danh mục này.`,
  });
  if (!ok) return false;
  categories.splice(categories.indexOf(category), 1);
  if (browse.l2 === id) browse.l2 = "";
  if (browse.l1 === id) browse.l1 = "";
  countCategoryJobs();
  renderCategoryStats();
  renderCategoryBrowser();
  toast(`Đã gỡ ${category.name}.`);
  return true;
}

function bindEditorDialogs() {
  document.querySelectorAll("dialog [data-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => bindDialog(dialog));
}

function bootCategories() {
  countCategoryJobs();
  const it = categories.find((item) => !item.parent && item.name === "Công nghệ Thông tin");
  browse.l1 = it ? it.id : "";
  browse.l2 = it ? childrenOf(it.id)[0]?.id || "" : "";
  renderCategoryStats();
  renderCategoryBrowser();
  document.getElementById("category-q").addEventListener("input", (event) => {
    browse.q = event.target.value;
    renderCategoryBrowser();
  });
  document.getElementById("category-columns").addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      openCategory("", add.dataset.add);
      return;
    }
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.closest("li").dataset.id;
    if (button.dataset.action === "edit") {
      openCategory(id);
      return;
    }
    const level = categoryPath(id).length - 1;
    browse.flash = "";
    if (level === 0) {
      browse.l1 = id;
      browse.l2 = "";
    } else {
      browse.l2 = id;
    }
    renderCategoryBrowser();
  });
  document.getElementById("category-results").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action=reveal]");
    if (button) revealCategory(button.closest("li").dataset.id);
  });
  document.getElementById("add-root").addEventListener("click", () => openCategory("", ""));
  document.getElementById("category-form").addEventListener("submit", saveCategory);
  document.getElementById("delete-category").addEventListener("click", async () => {
    const id = document.getElementById("category-form").dataset.id;
    if (await deleteCategory(id)) document.getElementById("category-editor").close();
  });
  bindEditorDialogs();
}

const SKILL_PAGE = 20;
const skillView = { q: "", filter: "", sort: "jobs", page: 1 };
let draftAliases = [];

function isRecentSkill(skill) {
  return (new Date(TODAY) - new Date(skill.added)) / 86400000 <= 7;
}


function filteredSkills() {
  const key = foldText(skillView.q.trim());
  const rows = skills.filter((skill) => {
    if (skillView.filter === "recent" && !isRecentSkill(skill)) return false;
    if (skillView.filter === "unused" && skill.jobs > 0) return false;
    if (skillView.filter === "noalias" && skill.aliases.length) return false;
    if (!key) return true;
    return [skill.name, ...skill.aliases].some((name) => foldText(name).includes(key));
  });
  const sorters = {
    jobs: (a, b) => b.jobs - a.jobs || a.name.localeCompare(b.name, "vi"),
    recent: (a, b) => b.added.localeCompare(a.added) || a.name.localeCompare(b.name, "vi"),
    name: (a, b) => a.name.localeCompare(b.name, "vi"),
  };
  return rows.sort(sorters[skillView.sort]);
}

function renderSkillStats() {
  const recent = skills.filter(isRecentSkill).length;
  const aliasCount = skills.reduce((total, skill) => total + skill.aliases.length, 0);
  const unused = skills.filter((skill) => !skill.jobs).length;
  document.getElementById("skill-stats").innerHTML = `
    <div class="stat"><strong>${fmt.format(skills.length)}</strong><span>Kỹ năng</span></div>
    <div class="stat"><strong>${fmt.format(aliasCount)}</strong><span>Tên gọi khác</span></div>
    <button class="stat stat--warn" type="button" data-filter="recent"><strong>${fmt.format(recent)}</strong><span>Crawler thêm 7 ngày qua</span></button>
    <button class="stat" type="button" data-filter="unused"><strong>${fmt.format(unused)}</strong><span>Chưa gắn tin</span></button>`;
}

function aliasTags(aliases) {
  if (!aliases.length) return `<span class="empty">—</span>`;
  const shown = aliases.slice(0, 3).map((alias) => `<span class="tag">${esc(alias)}</span>`).join("");
  return `${shown}${aliases.length > 3 ? `<span class="tag tag--more">+${aliases.length - 3}</span>` : ""}`;
}

function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const list = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((page, index) => {
    if (index && page - list[index - 1] > 1) out.push("…");
    out.push(page);
  });
  return out;
}

function renderSkills() {
  const rows = filteredSkills();
  const pages = Math.max(1, Math.ceil(rows.length / SKILL_PAGE));
  skillView.page = Math.min(skillView.page, pages);
  const start = (skillView.page - 1) * SKILL_PAGE;
  const slice = rows.slice(start, start + SKILL_PAGE);
  const top = Math.max(1, ...skills.map((skill) => skill.jobs));
  document.querySelectorAll("#skill-filter button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === skillView.filter));
  });
  const body = document.getElementById("skill-rows");
  body.innerHTML = slice.length ? slice.map((skill) => `
    <tr data-id="${skill.id}">
      <td>
        <button class="name-btn" type="button" data-action="edit">${markMatch(skill.name, skillView.q.trim())}</button>
        <code class="norm-key">${esc(normalizeName(skill.name))}</code>
      </td>
      <td><div class="tags">${aliasTags(skill.aliases)}</div></td>
      <td class="num">
        <div class="usage"><span style="width:${Math.max(skill.jobs ? 3 : 0, Math.round(skill.jobs / top * 100))}%"></span></div>
        <b>${fmt.format(skill.jobs)}</b>
      </td>
      <td class="num">${fmt.format(skill.cvs)}</td>
      <td class="when">${shortDate(skill.added)}<span class="sub">${skill.by === "crawler" ? "Crawler tự thêm" : "Quản trị thêm"}${isRecentSkill(skill) ? ` · <em class="new">Mới</em>` : ""}</span></td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("") : `<tr><td class="empty" colspan="6">Không có kỹ năng khớp bộ lọc.</td></tr>`;
  document.getElementById("skill-range").textContent = rows.length
    ? `${fmt.format(start + 1)}–${fmt.format(start + slice.length)} / ${fmt.format(rows.length)} kỹ năng`
    : "0 kỹ năng";
  document.getElementById("skill-pages").innerHTML = `
    <button type="button" data-page="${skillView.page - 1}" ${skillView.page === 1 ? "disabled" : ""} aria-label="Trang trước">‹</button>
    ${pageList(skillView.page, pages).map((page) => page === "…"
      ? `<span>…</span>`
      : `<button type="button" data-page="${page}" ${page === skillView.page ? 'aria-current="page"' : ""}>${page}</button>`).join("")}
    <button type="button" data-page="${skillView.page + 1}" ${skillView.page === pages ? "disabled" : ""} aria-label="Trang sau">›</button>`;
}

function takenAlias(alias, exceptId) {
  const key = normalizeName(alias);
  if (!key) return false;
  return skills.some((skill) => skill.id !== exceptId && (
    normalizeName(skill.name) === key || skill.aliases.some((item) => normalizeName(item) === key)
  ));
}

function showSkillKey() {
  const name = document.querySelector("#skill-form [name=name]").value;
  const key = normalizeName(name);
  document.getElementById("skill-key").textContent = key ? `Tên chuẩn: ${key}` : "Tên chuẩn hiện khi gõ.";
}

function renderAliasDraft() {
  document.getElementById("alias-chips").innerHTML = draftAliases.map((alias, index) => `
    <span class="tag tag--edit">${esc(alias)}<button type="button" data-remove="${index}" aria-label="Bỏ ${esc(alias)}">×</button></span>`).join("");
}

function addAlias(raw) {
  const form = document.getElementById("skill-form");
  const name = form.elements.name.value;
  raw.split(",").forEach((part) => {
    const alias = part.trim();
    if (!alias) return;
    if (normalizeName(alias) === normalizeName(name) || draftAliases.some((item) => normalizeName(item) === normalizeName(alias))) return;
    if (takenAlias(alias, form.dataset.id)) {
      toast(`“${alias}” đã thuộc một kỹ năng khác.`);
      return;
    }
    draftAliases.push(alias);
  });
  renderAliasDraft();
}

function openSkill(id) {
  const form = document.getElementById("skill-form");
  const skill = id ? skills.find((item) => item.id === id) : null;
  form.dataset.id = id || "";
  form.elements.name.value = skill ? skill.name : "";
  form.elements.alias.value = "";
  draftAliases = skill ? [...skill.aliases] : [];
  renderAliasDraft();
  document.getElementById("skill-heading").textContent = skill ? "Sửa kỹ năng" : "Thêm kỹ năng";
  document.getElementById("delete-skill").hidden = !skill;
  document.getElementById("merge-block").hidden = !skill;
  const usage = document.getElementById("skill-usage");
  usage.hidden = !skill;
  if (skill) {
    usage.innerHTML = `
      <div><dt>Tin đang dùng</dt><dd>${fmt.format(skill.jobs)}</dd></div>
      <div><dt>CV đang dùng</dt><dd>${fmt.format(skill.cvs)}</dd></div>
      <div><dt>Thêm lúc</dt><dd>${shortDate(skill.added)} · ${skill.by === "crawler" ? "crawler tự thêm" : "quản trị thêm"}</dd></div>`;
    form.elements.target.value = "";
    document.getElementById("skill-names").innerHTML = skills
      .filter((item) => item.id !== id)
      .map((item) => `<option value="${esc(item.name)}"></option>`).join("");
  }
  showSkillKey();
  document.getElementById("skill-editor").showModal();
  form.elements.name.focus();
}

function saveSkill(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  if (form.elements.alias.value.trim()) addAlias(form.elements.alias.value);
  const name = form.elements.name.value.trim();
  const exceptId = form.dataset.id;
  if (takenAlias(name, exceptId)) {
    toast("Tên này đã là một kỹ năng hoặc tên gọi khác.");
    return;
  }
  const aliases = draftAliases.filter((alias) => normalizeName(alias) !== normalizeName(name));
  if (exceptId) {
    const skill = skills.find((item) => item.id === exceptId);
    skill.name = name;
    skill.aliases = aliases;
  } else {
    skills.push({ id: `sk-${Date.now()}`, name, aliases, jobs: 0, cvs: 0, added: TODAY, by: "admin" });
  }
  document.getElementById("skill-editor").close();
  renderSkillStats();
  renderSkills();
  toast(`Đã lưu “${name}”.`);
}

async function mergeSkill() {
  const form = document.getElementById("skill-form");
  const source = skills.find((item) => item.id === form.dataset.id);
  const targetName = form.elements.target.value.trim();
  const target = skills.find((item) => item.id !== source.id && normalizeName(item.name) === normalizeName(targetName));
  if (!target) {
    toast("Chọn một kỹ năng có trong danh sách.");
    return;
  }
  const ok = await confirmAction({
    title: `Gộp vào ${target.name}?`,
    copy: `“${source.name}” và ${source.aliases.length} tên gọi khác sẽ thành tên gọi khác của “${target.name}”. ${fmt.format(source.jobs)} tin và ${fmt.format(source.cvs)} CV chuyển sang kỹ năng này.`,
    ok: "Gộp",
    cancel: "Thôi",
  });
  if (!ok) return;
  [source.name, ...source.aliases].forEach((alias) => {
    if (!target.aliases.some((item) => normalizeName(item) === normalizeName(alias))) target.aliases.push(alias);
  });
  target.jobs += source.jobs;
  target.cvs += source.cvs;
  skills.splice(skills.indexOf(source), 1);
  document.getElementById("skill-editor").close();
  renderSkillStats();
  renderSkills();
  toast(`Đã gộp “${source.name}” vào “${target.name}”.`);
}

async function deleteSkill(id) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return false;
  const ok = await confirmAction({
    title: "Gỡ kỹ năng này?",
    copy: `“${skill.name}” và tên gọi khác của nó sẽ bị gỡ. ${fmt.format(skill.jobs)} tin và ${fmt.format(skill.cvs)} CV mất kỹ năng này. Nếu là bản trùng, hãy gộp thay vì gỡ.`,
  });
  if (!ok) return false;
  skills.splice(skills.indexOf(skill), 1);
  renderSkillStats();
  renderSkills();
  toast(`Đã gỡ ${skill.name}.`);
  return true;
}

function setSkillFilter(filter) {
  skillView.filter = filter;
  skillView.page = 1;
  renderSkills();
}

function bootSkills() {
  renderSkillStats();
  renderSkills();
  document.getElementById("skill-q").addEventListener("input", (event) => {
    skillView.q = event.target.value;
    skillView.page = 1;
    renderSkills();
  });
  document.getElementById("skill-sort").addEventListener("change", (event) => {
    skillView.sort = event.target.value;
    skillView.page = 1;
    renderSkills();
  });
  document.getElementById("skill-filter").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (button) setSkillFilter(button.dataset.filter);
  });
  document.getElementById("skill-stats").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (button) setSkillFilter(button.dataset.filter);
  });
  document.getElementById("skill-pages").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    skillView.page = Number(button.dataset.page);
    renderSkills();
    document.querySelector(".sheet").scrollIntoView({ block: "start", behavior: "smooth" });
  });
  document.getElementById("skill-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action=edit]");
    if (button) openSkill(button.closest("tr").dataset.id);
  });
  document.getElementById("add-skill").addEventListener("click", () => openSkill(""));
  const form = document.getElementById("skill-form");
  form.addEventListener("submit", saveSkill);
  form.elements.name.addEventListener("input", showSkillKey);
  form.elements.alias.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addAlias(event.target.value);
      event.target.value = "";
    } else if (event.key === "Backspace" && !event.target.value && draftAliases.length) {
      draftAliases.pop();
      renderAliasDraft();
    }
  });
  document.getElementById("alias-chips").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove]");
    if (!button) return;
    draftAliases.splice(Number(button.dataset.remove), 1);
    renderAliasDraft();
  });
  document.getElementById("merge-skill").addEventListener("click", mergeSkill);
  document.getElementById("delete-skill").addEventListener("click", async () => {
    if (await deleteSkill(form.dataset.id)) document.getElementById("skill-editor").close();
  });
  bindEditorDialogs();
}

const PAGE_SIZE = 20;

function pagerHtml(page, pages) {
  return `
    <button type="button" data-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Trang trước">‹</button>
    ${pageList(page, pages).map((item) => item === "…"
      ? `<span>…</span>`
      : `<button type="button" data-page="${item}" ${item === page ? 'aria-current="page"' : ""}>${item}</button>`).join("")}
    <button type="button" data-page="${page + 1}" ${page === pages ? "disabled" : ""} aria-label="Trang sau">›</button>`;
}

// Cắt trang và vẽ thanh phân trang chung cho mọi bảng.
function paginate(rows, view, rangeId, pagesId, unit) {
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  view.page = Math.min(Math.max(1, view.page), pages);
  const start = (view.page - 1) * PAGE_SIZE;
  const slice = rows.slice(start, start + PAGE_SIZE);
  document.getElementById(rangeId).textContent = rows.length
    ? `${fmt.format(start + 1)}–${fmt.format(start + slice.length)} / ${fmt.format(rows.length)} ${unit}`
    : `0 ${unit}`;
  document.getElementById(pagesId).innerHTML = pagerHtml(view.page, pages);
  return slice;
}

function bindPager(pagesId, view, render) {
  document.getElementById(pagesId).addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    view.page = Number(button.dataset.page);
    render();
    document.querySelector(".sheet").scrollIntoView({ block: "start", behavior: "smooth" });
  });
}

function statCards(id, cards, active) {
  document.getElementById(id).innerHTML = cards.map(([value, label, filter, tone]) => {
    const pressed = filter !== undefined ? ` aria-pressed="${filter === active}"` : "";
    const tag = filter !== undefined ? "button" : "div";
    return `<${tag} class="stat${tone ? ` stat--${tone}` : ""}"${tag === "button" ? ` type="button" data-filter="${filter}"${pressed}` : ""}><strong>${fmt.format(value)}</strong><span>${label}</span></${tag}>`;
  }).join("");
}

// Ô nhập dạng nhãn: Enter hoặc dấu phẩy để thêm, × để bỏ.
function tagField(id, { allowed } = {}) {
  const root = document.getElementById(id);
  const input = root.querySelector("input");
  const box = root.querySelector(".tags");
  let values = [];
  const paint = () => {
    box.innerHTML = values.map((value, index) => `
      <span class="tag tag--edit">${esc(value)}<button type="button" data-remove="${index}" aria-label="Bỏ ${esc(value)}">×</button></span>`).join("");
  };
  const add = (raw) => {
    raw.split(",").map((part) => part.trim()).filter(Boolean).forEach((value) => {
      const known = allowed ? allowed().find((item) => normalizeName(item) === normalizeName(value)) : value;
      if (!known) {
        toast(`“${value}” không có trong danh sách.`);
        return;
      }
      if (!values.some((item) => normalizeName(item) === normalizeName(known))) values.push(known);
    });
    paint();
  };
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(input.value);
      input.value = "";
    } else if (event.key === "Backspace" && !input.value && values.length) {
      values.pop();
      paint();
    }
  });
  input.addEventListener("input", (event) => {
    if (event.inputType === "insertReplacementText" || !event.inputType) {
      add(input.value);
      input.value = "";
    }
  });
  box.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove]");
    if (!button) return;
    values.splice(Number(button.dataset.remove), 1);
    paint();
  });
  return {
    get() {
      if (input.value.trim()) {
        add(input.value);
        input.value = "";
      }
      return [...values];
    },
    set(list) {
      values = [...list];
      input.value = "";
      paint();
    },
  };
}

function money(min, max, currency = "VND", period = "") {
  if (!min && !max) return "Thỏa thuận";
  const unit = (amount) => {
    if (currency === "USD") return fmt.format(amount);
    const value = amount / 1000000;
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
  };
  const label = currency === "USD" ? "USD" : "triệu";
  const per = period && PERIOD_LABEL[period] ? `/${PERIOD_LABEL[period]}` : "";
  if (min && max) return `${unit(min)}–${unit(max)} ${label}${per}`;
  if (min) return `Từ ${unit(min)} ${label}${per}`;
  return `Đến ${unit(max)} ${label}${per}`;
}

function placesText(places) {
  if (!places.length) return "—";
  return places.length > 1 ? `${esc(places[0])} <span class="more">+${places.length - 1}</span>` : esc(places[0]);
}

function shortDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function daysAgo(iso) {
  return (new Date(TODAY) - new Date(iso.slice(0, 10))) / 86400000;
}

/* ---------- Việc làm ---------- */

const jobScope = { company: "", category: "", crawled: "", term: "", page: 1 };
let jobSkillField;
let jobPlaceField;

function jobInCategory(job, name) {
  if (!name) return true;
  if (job.category === name) return true;
  const selected = categories.filter((item) => item.name === name);
  if (!selected.length) return false;
  return categories.some((item) => item.name === job.category && categoryPath(item.id).some((node) => selected.includes(node)));
}

function crawledIn(job, mode) {
  if (!mode) return true;
  return job.mappings.some((mapping) => {
    const day = mapping.at.slice(0, 10);
    if (mode === "today") return day === TODAY;
    if (mode === "month") return day.startsWith("2026-10");
    return true;
  });
}

function renderJobScope() {
  const bits = [];
  if (jobScope.company) bits.push(`Công ty: ${jobScope.company}`);
  if (jobScope.category) bits.push(`Danh mục: ${jobScope.category}`);
  if (jobScope.crawled === "today") bits.push("Ghi nhận hôm nay");
  if (jobScope.crawled === "month") bits.push("Ghi nhận tháng 10");
  const node = document.getElementById("job-scope");
  node.hidden = !bits.length;
  node.innerHTML = bits.length ? `${esc(bits.join(" · "))} <button type="button" data-action="clear-scope">Bỏ lọc</button>` : "";
}

function termPill(job) {
  if (isExpired(job)) return `<span class="pill pill--off"><i></i>Hết hạn</span><span class="sub">${shortDate(job.expired)}</span>`;
  return `<span class="pill"><i></i>Còn hạn</span><span class="sub">đến ${shortDate(job.expired)}</span>`;
}

function renderJobStats() {
  const open = jobs.filter((job) => !isExpired(job)).length;
  statCards("job-stats", [
    [jobs.length, "Tất cả tin", ""],
    [open, "Còn hạn", "open"],
    [jobs.length - open, "Hết hạn", "closed"],
    [jobs.filter((job) => job.mappings.length > 1).length, "Có ở nhiều nguồn", "multi"],
    [jobs.filter((job) => !job.category || !job.skills.length).length, "Thiếu danh mục / kỹ năng", "missing", "warn"],
  ], jobScope.term);
}

function jobSorter(sort) {
  const crawl = (job) => latestMapping(job).at;
  const pay = (job) => (job.currency === "USD" ? 25000 : 1) * (job.max || job.min || 0);
  return {
    new: (a, b) => crawl(b).localeCompare(crawl(a)),
    old: (a, b) => crawl(a).localeCompare(crawl(b)),
    expiring: (a, b) => a.expired.localeCompare(b.expired),
    salary: (a, b) => pay(b) - pay(a),
  }[sort];
}

function renderJobs() {
  const query = foldText(document.getElementById("q").value.trim());
  const source = document.getElementById("source").value;
  const type = document.getElementById("type").value;
  const matched = jobs.filter((job) => {
    if (query && !foldText(`${job.title} ${job.company} ${job.locations.join(" ")}`).includes(query)) return false;
    if (jobScope.company && job.company !== jobScope.company) return false;
    if (!jobInCategory(job, jobScope.category)) return false;
    if (!crawledIn(job, jobScope.crawled)) return false;
    if (source && !job.mappings.some((mapping) => mapping.domain === source)) return false;
    if (type && job.type !== type) return false;
    if (jobScope.term === "multi" && job.mappings.length < 2) return false;
    if (jobScope.term === "open" && isExpired(job)) return false;
    if (jobScope.term === "closed" && !isExpired(job)) return false;
    if (jobScope.term === "missing" && job.category && job.skills.length) return false;
    return true;
  }).sort(jobSorter(document.getElementById("sort").value));
  renderJobStats();
  renderJobScope();
  const slice = paginate(matched, jobScope, "job-range", "job-pages", "tin");
  document.getElementById("job-rows").innerHTML = slice.length ? slice.map((job) => {
    const latest = latestMapping(job);
    return `<tr data-id="${job.id}">
      <td class="job-cell">
        <button class="name-btn" type="button" data-action="edit">${esc(job.title)}</button>
        <span class="sub">${esc(EMPLOYMENT_LABEL[job.type] || job.type)} · ${job.category ? esc(job.category) : `<em class="flag">Chưa có danh mục</em>`}</span>
      </td>
      <td class="company-cell"><a class="row-link" href="jobs.html?company=${encodeURIComponent(job.company)}" title="${esc(job.company)}">${esc(job.company)}</a></td>
      <td class="when">${placesText(job.locations)}</td>
      <td class="when">${esc(money(job.min, job.max, job.currency))}</td>
      <td class="when">${termPill(job)}</td>
      <td><div class="sources">${chips(job.mappings.map((mapping) => mapping.domain))}</div></td>
      <td class="when">${stamp(latest.at)}</td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`;
  }).join("") : `<tr><td class="empty" colspan="8">Không có tin khớp bộ lọc.</td></tr>`;
}

function leafCategories() {
  return categories.filter((item) => !categories.some((child) => child.parent === item.id));
}

function showJobCategoryPath() {
  const form = document.getElementById("job-form");
  const name = form.elements.category.value.trim();
  const match = categories.find((item) => item.name === name);
  document.getElementById("job-category-path").textContent = !name
    ? "Chưa có danh mục. Tin sẽ không hiện khi lọc theo ngành."
    : match ? categoryPath(match.id).map((node) => node.name).join(" › ") : "Không có trong cây danh mục.";
}

function syncCurrency() {
  const form = document.getElementById("job-form");
  document.getElementById("salary-unit").textContent = form.elements.currency.value === "USD" ? "USD /" : "triệu /";
}

function salaryInput(amount, currency) {
  if (!amount) return "";
  return currency === "USD" ? String(amount) : trieuText(amount);
}

function openJob(id) {
  const job = jobs.find((item) => item.id === id);
  const form = document.getElementById("job-form");
  form.dataset.id = id;
  ["title", "company", "type", "exp", "category", "currency", "period", "posted", "expired", "description", "benefits"].forEach((name) => {
    form.elements[name].value = job[name] ?? "";
  });
  form.elements.min.value = salaryInput(job.min, job.currency);
  form.elements.max.value = salaryInput(job.max, job.currency);
  form.elements.max.setCustomValidity("");
  jobSkillField.set(job.skills);
  jobPlaceField.set(job.locations);
  syncCurrency();
  showJobCategoryPath();
  document.getElementById("job-heading").textContent = job.title;
  document.getElementById("public-job").href = "../job-detail.html";
  document.getElementById("job-mappings").innerHTML = job.mappings
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .map((mapping) => `
      <li>
        <div>${chips([mapping.domain])} <span class="when">${stamp(mapping.at)}</span></div>
        <a class="url" href="${esc(mapping.url)}" target="_blank" rel="noreferrer" title="${esc(mapping.url)}">${esc(mapping.url.replace(/^https?:\/\//, ""))}</a>
      </li>`).join("");
  document.getElementById("editor").showModal();
  form.elements.title.focus();
}

async function deleteJob(id) {
  const job = jobs.find((item) => item.id === id);
  const ok = await confirmAction({
    title: "Gỡ tin này?",
    copy: `“${job.title}” sẽ bị gỡ khỏi trang tìm việc và chỉ mục tìm kiếm. Lần crawl sau có thể ghi nhận lại nếu tin còn trên nguồn.`,
  });
  if (!ok) return false;
  jobs.splice(jobs.indexOf(job), 1);
  renderJobs();
  toast(`Đã gỡ ${job.title}.`);
  return true;
}

function readSalary(value, currency) {
  if (currency !== "USD") return trieuNumber(value);
  const text = value.trim().replace(/[.\s]/g, "");
  if (!text) return null;
  return /^\d+$/.test(text) ? Number(text) : Number.NaN;
}

function saveJob(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const currency = form.elements.currency.value;
  const min = readSalary(form.elements.min.value, currency);
  const max = readSalary(form.elements.max.value, currency);
  const hint = currency === "USD" ? "Nhập số USD, ví dụ 1500." : "Nhập số triệu, ví dụ 25 hoặc 25,5.";
  form.elements.min.setCustomValidity(Number.isNaN(min) ? hint : "");
  form.elements.max.setCustomValidity(Number.isNaN(max) ? hint : (min && max && max < min ? "Mức trần đang thấp hơn mức sàn." : ""));
  const category = form.elements.category.value.trim();
  form.elements.category.setCustomValidity(category && !categories.some((item) => item.name === category) ? "Chọn một vị trí có trong cây danh mục." : "");
  if (!form.reportValidity()) return;
  const job = jobs.find((item) => item.id === form.dataset.id);
  Object.assign(job, {
    title: form.elements.title.value.trim(),
    company: form.elements.company.value.trim(),
    type: form.elements.type.value,
    exp: Number(form.elements.exp.value || 0),
    category,
    skills: jobSkillField.get(),
    locations: jobPlaceField.get(),
    min,
    max,
    currency,
    period: form.elements.period.value,
    posted: form.elements.posted.value,
    expired: form.elements.expired.value,
    description: form.elements.description.value.trim(),
    benefits: form.elements.benefits.value.trim(),
  });
  if (!companies.some((item) => item.name === job.company)) {
    companies.push({ id: `co-${Date.now()}`, name: job.company, logo: "", created: TODAY });
  }
  document.getElementById("editor").close();
  renderJobs();
  toast(`Đã lưu “${job.title}”.`);
}

function bootJobs() {
  const params = new URLSearchParams(window.location.search);
  jobScope.company = params.get("company") || "";
  jobScope.category = params.get("category") || "";
  jobScope.crawled = params.get("crawled") || "";
  jobScope.term = params.get("term") || "";
  const source = params.get("source");
  if (source) document.getElementById("source").value = source;
  document.getElementById("type").innerHTML = `<option value="">Mọi loại hình</option>${Object.entries(EMPLOYMENT_LABEL)
    .map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}`;
  document.querySelector("#job-form select[name=type]").innerHTML = Object.entries(EMPLOYMENT_LABEL)
    .map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  document.querySelector("#job-form select[name=period]").innerHTML = Object.entries(PERIOD_LABEL)
    .map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  document.getElementById("company-names").innerHTML = companies.map((item) => `<option value="${esc(item.name)}"></option>`).join("");
  document.getElementById("category-leaves").innerHTML = leafCategories().map((item) => `<option value="${esc(item.name)}"></option>`).join("");
  document.getElementById("skill-list").innerHTML = skills.map((item) => `<option value="${esc(item.name)}"></option>`).join("");
  document.getElementById("province-list").innerHTML = PROVINCES.map((name) => `<option value="${esc(name)}"></option>`).join("");
  jobSkillField = tagField("job-skills", { allowed: () => skills.map((item) => item.name) });
  jobPlaceField = tagField("job-places", { allowed: () => PROVINCES });
  renderJobs();
  const reset = () => {
    jobScope.page = 1;
    renderJobs();
  };
  document.getElementById("q").addEventListener("input", reset);
  ["source", "sort", "type"].forEach((id) => document.getElementById(id).addEventListener("change", reset));
  document.getElementById("job-stats").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    jobScope.term = button.dataset.filter;
    reset();
  });
  bindPager("job-pages", jobScope, renderJobs);
  document.getElementById("job-scope").addEventListener("click", (event) => {
    if (event.target.dataset.action !== "clear-scope") return;
    jobScope.company = "";
    jobScope.category = "";
    jobScope.crawled = "";
    const url = new URL(window.location.href);
    ["company", "category", "crawled", "job"].forEach((key) => url.searchParams.delete(key));
    history.replaceState(null, "", url);
    reset();
  });
  document.getElementById("job-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action=edit]");
    if (button) openJob(button.closest("tr").dataset.id);
  });
  const form = document.getElementById("job-form");
  form.addEventListener("submit", saveJob);
  form.elements.category.addEventListener("input", () => {
    form.elements.category.setCustomValidity("");
    showJobCategoryPath();
  });
  form.elements.currency.addEventListener("change", syncCurrency);
  ["min", "max"].forEach((name) => form.elements[name].addEventListener("input", () => {
    form.elements.min.setCustomValidity("");
    form.elements.max.setCustomValidity("");
  }));
  document.getElementById("delete-job").addEventListener("click", async () => {
    if (await deleteJob(form.dataset.id)) document.getElementById("editor").close();
  });
  bindEditorDialogs();
  const openId = params.get("job");
  if (openId && jobs.some((job) => job.id === openId)) openJob(openId);
}

/* ---------- Công ty ---------- */

const companyView = { q: "", filter: "", sort: "jobs", page: 1 };

function companyJobs(name) {
  return jobs.filter((job) => job.company === name);
}

function companyStats(name) {
  const own = companyJobs(name);
  const sources = [...new Set(own.flatMap((job) => job.mappings.map((mapping) => mapping.domain)))]
    .sort((a, b) => SOURCE_ORDER.indexOf(a) - SOURCE_ORDER.indexOf(b));
  const crawled = own.flatMap((job) => job.mappings).reduce((latest, mapping) => (
    !latest || mapping.at > latest ? mapping.at : latest
  ), null);
  const locations = [...new Set(own.filter((job) => !isExpired(job)).flatMap((job) => job.locations))];
  return { count: own.length, open: own.filter((job) => !isExpired(job)).length, sources, crawled, locations };
}

function companyMark(company, large = false) {
  const size = large ? " lg" : "";
  if (company.logo) return `<span class="logo-mark${size}"><img alt="" src="${esc(LOGO_ART[company.logo] || company.logo)}"></span>`;
  return `<span class="logo-mark logo-mark--missing${size}" title="Chưa có logo">${esc(initials(companyKey(company.name) || company.name))}</span>`;
}

function renderCompanies() {
  const key = foldText(companyView.q.trim());
  const withStats = companies.map((company) => ({ company, stats: companyStats(company.name), twins: duplicateOf(company) }));
  const rows = withStats.filter(({ company, twins }) => {
    if (companyView.filter === "dupe" && !twins.length) return false;
    if (companyView.filter === "nologo" && company.logo) return false;
    if (companyView.filter === "recent" && daysAgo(company.created) > 7) return false;
    return !key || foldText(company.name).includes(key);
  });
  const sorters = {
    jobs: (a, b) => b.stats.count - a.stats.count || a.company.name.localeCompare(b.company.name, "vi"),
    recent: (a, b) => b.company.created.localeCompare(a.company.created),
    name: (a, b) => a.company.name.localeCompare(b.company.name, "vi"),
  };
  rows.sort(companyView.filter === "dupe" ? (a, b) => companyKey(a.company.name).localeCompare(companyKey(b.company.name)) : sorters[companyView.sort]);
  statCards("company-stats", [
    [companies.length, "Công ty", ""],
    [withStats.filter((row) => row.twins.length).length, "Nghi trùng tên", "dupe", "warn"],
    [companies.filter((company) => !company.logo).length, "Thiếu logo", "nologo"],
    [companies.filter((company) => daysAgo(company.created) <= 7).length, "Crawler thêm 7 ngày qua", "recent"],
  ], companyView.filter);
  const slice = paginate(rows, companyView, "company-range", "company-pages", "công ty");
  document.getElementById("company-rows").innerHTML = slice.length ? slice.map(({ company, stats, twins }) => `
    <tr data-id="${company.id}">
      <td>
        <div class="who">
          ${companyMark(company)}
          <span class="company-name">
            <button class="name-btn" type="button" data-action="edit">${markMatch(company.name, companyView.q.trim())}</button>
            ${twins.length
              ? `<span class="sub"><em class="dupe">Có thể trùng</em> ${esc(twins.map((twin) => twin.name).join(", "))}</span>`
              : `<span class="sub">${stats.locations.length ? esc(stats.locations.join(" · ")) : "Chưa có tin còn hạn"}</span>`}
          </span>
        </div>
      </td>
      <td class="num"><a class="text-link" href="jobs.html?company=${encodeURIComponent(company.name)}">${fmt.format(stats.count)}</a><span class="sub">${fmt.format(stats.open)} đang tuyển</span></td>
      <td><div class="sources">${stats.sources.length ? chips(stats.sources) : `<span class="empty">—</span>`}</div></td>
      <td class="when">${shortDate(company.created)}${daysAgo(company.created) <= 7 ? `<span class="sub"><em class="new">Mới</em></span>` : ""}</td>
      <td class="when">${stats.crawled ? stamp(stats.crawled) : "—"}</td>
      <td class="actions">${twins.length ? `<button class="linkish" type="button" data-action="merge">Gộp</button>` : ""}<button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("") : `<tr><td class="empty" colspan="6">Không có công ty khớp bộ lọc.</td></tr>`;
}


function previewLogo() {
  const form = document.getElementById("company-form");
  const name = form.elements.name.value.trim() || "Công ty";
  document.getElementById("company-preview-name").textContent = name;
  const mark = document.getElementById("logo-preview");
  mark.outerHTML = companyMark({ name, logo: form.elements.logo.value.trim() }, true).replace("<span class=\"logo-mark", "<span id=\"logo-preview\" class=\"logo-mark");
  const img = document.querySelector("#logo-preview img");
  if (img) {
    img.addEventListener("error", () => {
      document.getElementById("logo-preview").outerHTML = `<span id="logo-preview" class="logo-mark logo-mark--missing lg" title="Không tải được logo">!</span>`;
    });
  }
}

function openCompany(id, focusMerge = false) {
  const company = companies.find((item) => item.id === id);
  const form = document.getElementById("company-form");
  const stats = companyStats(company.name);
  const twins = duplicateOf(company);
  form.dataset.id = id;
  form.elements.name.value = company.name;
  form.elements.logo.value = company.logo;
  document.getElementById("company-public").href = "../company-detail.html";
  form.elements.target.value = twins[0] ? twins[0].name : "";
  document.getElementById("company-usage").innerHTML = `
    <div><dt>Tin</dt><dd>${fmt.format(stats.count)} tin · ${fmt.format(stats.open)} đang tuyển</dd></div>
    <div><dt>Địa điểm</dt><dd>${stats.locations.length ? esc(stats.locations.join(", ")) : "—"}</dd></div>
    <div><dt>Nguồn</dt><dd>${stats.sources.length ? stats.sources.join(", ") : "—"}</dd></div>
    <div><dt>Tạo lúc</dt><dd>${shortDate(company.created)} · crawler tự thêm</dd></div>`;
  document.getElementById("company-twins").innerHTML = twins.length
    ? `Có thể trùng với: ${twins.map((twin) => `<b>${esc(twin.name)}</b>`).join(", ")}.`
    : "Không thấy tên nào giống.";
  document.getElementById("company-names").innerHTML = companies.filter((item) => item.id !== id)
    .map((item) => `<option value="${esc(item.name)}"></option>`).join("");
  previewLogo();
  document.getElementById("editor").showModal();
  (focusMerge ? form.elements.target : form.elements.name).focus();
}

async function mergeCompany() {
  const form = document.getElementById("company-form");
  const source = companies.find((item) => item.id === form.dataset.id);
  const target = companies.find((item) => item.id !== source.id && item.name === form.elements.target.value.trim());
  if (!target) {
    toast("Chọn một công ty có trong danh sách.");
    return;
  }
  const count = companyJobs(source.name).length;
  const ok = await confirmAction({
    title: `Gộp vào ${target.name}?`,
    copy: `${fmt.format(count)} tin của “${source.name}” chuyển sang “${target.name}”, rồi “${source.name}” bị gỡ.${!target.logo && source.logo ? " Logo cũng được chuyển sang." : ""}`,
    ok: "Gộp",
    cancel: "Thôi",
  });
  if (!ok) return;
  jobs.forEach((job) => {
    if (job.company === source.name) job.company = target.name;
  });
  if (!target.logo && source.logo) target.logo = source.logo;
  companies.splice(companies.indexOf(source), 1);
  document.getElementById("editor").close();
  renderCompanies();
  toast(`Đã gộp ${fmt.format(count)} tin vào “${target.name}”.`);
}

async function deleteCompany(id) {
  const company = companies.find((item) => item.id === id);
  const count = companyJobs(company.name).length;
  if (count) {
    toast(`Còn ${fmt.format(count)} tin. Gộp công ty này vào công ty khác thay vì xóa.`);
    return false;
  }
  const ok = await confirmAction({ title: "Gỡ công ty này?", copy: `“${company.name}” không còn tin nào và sẽ bị gỡ.` });
  if (!ok) return false;
  companies.splice(companies.indexOf(company), 1);
  renderCompanies();
  toast(`Đã gỡ ${company.name}.`);
  return true;
}

function saveCompany(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const company = companies.find((item) => item.id === form.dataset.id);
  const name = form.elements.name.value.trim();
  if (companies.some((item) => item.id !== company.id && normalizeName(item.name) === normalizeName(name))) {
    toast("Đã có công ty trùng tên. Hãy gộp thay vì đổi tên.");
    return;
  }
  jobs.forEach((job) => {
    if (job.company === company.name) job.company = name;
  });
  company.name = name;
  company.logo = form.elements.logo.value.trim();
  document.getElementById("editor").close();
  renderCompanies();
  toast(`Đã lưu “${company.name}”.`);
}

function bootCompanies() {
  renderCompanies();
  const reset = () => {
    companyView.page = 1;
    renderCompanies();
  };
  document.getElementById("company-q").addEventListener("input", (event) => {
    companyView.q = event.target.value;
    reset();
  });
  document.getElementById("company-sort").addEventListener("change", (event) => {
    companyView.sort = event.target.value;
    reset();
  });
  document.getElementById("company-stats").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    companyView.filter = button.dataset.filter;
    reset();
  });
  bindPager("company-pages", companyView, renderCompanies);
  document.getElementById("company-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) openCompany(button.closest("tr").dataset.id, button.dataset.action === "merge");
  });
  const form = document.getElementById("company-form");
  form.addEventListener("submit", saveCompany);
  form.elements.name.addEventListener("input", previewLogo);
  form.elements.logo.addEventListener("input", previewLogo);
  document.getElementById("merge-company").addEventListener("click", mergeCompany);
  document.getElementById("delete-company").addEventListener("click", async () => {
    if (await deleteCompany(form.dataset.id)) document.getElementById("editor").close();
  });
  bindEditorDialogs();
}

/* ---------- Người dùng ---------- */

const FAMILY = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const MIDDLE = ["Văn", "Thị", "Minh", "Hoàng", "Thanh", "Ngọc", "Đức", "Thu", "Quốc", "Gia", "Bảo", "Hữu"];
const GIVEN = ["An", "Bình", "Châu", "Dũng", "Giang", "Hà", "Hải", "Hạnh", "Hiếu", "Hùng", "Khánh", "Linh", "Long", "Mai", "Nam", "Ngân", "Phúc", "Quân", "Sơn", "Tâm", "Thảo", "Trang", "Tú", "Vy", "Yến"];
const MAIL = ["gmail.com", "gmail.com", "gmail.com", "yahoo.com", "outlook.com", "fpt.edu.vn", "hcmut.edu.vn"];
const CV_ROLES = [
  ["Java Backend Developer", ["Java", "Spring Boot", "MySQL"]], ["Frontend Developer", ["React", "TypeScript", "CSS"]],
  ["Data Analyst", ["SQL", "Power BI", "Excel"]], ["Kế toán tổng hợp", ["Kế toán tổng hợp", "MISA", "Excel"]],
  ["Nhân viên kinh doanh", ["Bán hàng", "Giao tiếp", "Đàm phán"]], ["QA Engineer", ["Manual Testing", "Postman"]],
  ["Digital Marketing", ["Digital Marketing", "Facebook Ads", "SEO"]], ["Chuyên viên tuyển dụng", ["Tuyển dụng", "Giao tiếp"]],
];
const CV_STATUS = { PARSED: "Đã đọc", PENDING: "Đang đọc", FAILED: "Lỗi đọc" };

function generateAccounts(count) {
  const out = [];
  for (let index = 0; index < count; index += 1) {
    const family = FAMILY[Math.floor(hash(index, 51) * FAMILY.length)];
    const middle = MIDDLE[Math.floor(hash(index, 53) * MIDDLE.length)];
    const given = GIVEN[Math.floor(hash(index, 55) * GIVEN.length)];
    const created = shiftDate(TODAY, -Math.floor(Math.pow(hash(index, 57), 0.7) * 160));
    const login = shiftDate(TODAY, -Math.floor(hash(index, 59) * Math.min(30, daysAgo(created))));
    const hasCv = hash(index, 61) < 0.55;
    const [title, cvSkills] = CV_ROLES[Math.floor(hash(index, 63) * CV_ROLES.length)];
    const roll = hash(index, 65);
    out.push({
      id: `ug${index}`,
      name: `${family} ${middle} ${given}`,
      email: `${slug(given)}.${slug(family)}${index + 10}@${MAIL[Math.floor(hash(index, 67) * MAIL.length)]}`,
      verified: hash(index, 69) < 0.86,
      role: "USER",
      status: roll < 0.04 ? "SUSPENDED" : roll < 0.07 ? "DELETED" : "ACTIVE",
      created: `${created}T09:${String(index % 60).padStart(2, "0")}`,
      login: `${login}T${String(7 + (index % 15)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`,
      cv: hasCv ? {
        title,
        months: Math.floor(hash(index, 71) * 72),
        status: CV_STATUS[hash(index, 73) < 0.85 ? "PARSED" : hash(index, 73) < 0.93 ? "PENDING" : "FAILED"],
        skills: cvSkills,
      } : null,
      preference: hasCv && hash(index, 75) < 0.7 ? {
        titles: [title],
        types: ["Toàn thời gian"],
        remote: hash(index, 77) < 0.3,
        min: 10000000 + Math.floor(hash(index, 79) * 20) * 1000000,
        max: 20000000 + Math.floor(hash(index, 81) * 25) * 1000000,
        provinces: [hash(index, 83) < 0.5 ? "Hà Nội" : "Hồ Chí Minh"],
        open: hash(index, 85) < 0.8,
      } : null,
    });
  }
  return out;
}

const userView = { q: "", filter: "", role: "", page: 1 };

function renderUsers() {
  const key = foldText(userView.q.trim());
  const rows = accounts.filter((account) => {
    if (key && !foldText(`${account.name} ${account.email}`).includes(key)) return false;
    if (userView.role && account.role !== userView.role) return false;
    if (userView.filter === "cv" && !account.cv) return false;
    if (userView.filter === "suspended" && account.status !== "SUSPENDED") return false;
    if (userView.filter === "unverified" && account.verified) return false;
    if (userView.filter === "recent" && daysAgo(account.created) > 7) return false;
    return true;
  }).sort((a, b) => (b.login || "").localeCompare(a.login || ""));
  statCards("user-stats", [
    [accounts.length, "Tài khoản", ""],
    [accounts.filter((account) => account.cv).length, "Đã tải CV", "cv"],
    [accounts.filter((account) => !account.verified).length, "Chưa xác minh email", "unverified"],
    [accounts.filter((account) => account.status === "SUSPENDED").length, "Đang khóa", "suspended", "warn"],
    [accounts.filter((account) => daysAgo(account.created) <= 7).length, "Đăng ký 7 ngày qua", "recent"],
  ], userView.filter);
  const slice = paginate(rows, userView, "user-range", "user-pages", "tài khoản");
  document.getElementById("user-rows").innerHTML = slice.length ? slice.map((account) => `
    <tr data-id="${account.id}">
      <td>
        <div class="who">
          <span class="mono-mark" style="background:${swatch(account.name)}">${esc(initials(account.name))}</span>
          <span>
            <button class="name-btn" type="button" data-action="edit">${markMatch(account.name, userView.q.trim())}</button>
            <span class="sub">${esc(account.email)}${account.verified ? "" : ` · <em class="flag">chưa xác minh</em>`}</span>
          </span>
        </div>
      </td>
      <td>${account.role === "ADMIN" ? `<span class="role-tag">Quản trị</span>` : "Người dùng"}</td>
      <td>${statusMark(account.status)}</td>
      <td>${account.cv ? `${esc(account.cv.title)}<span class="sub">${esc(account.cv.status)}</span>` : `<span class="empty">Chưa có</span>`}</td>
      <td class="when">${shortDate(account.created.slice(0, 10))}</td>
      <td class="when">${account.login ? stamp(account.login) : "—"}</td>
      <td class="actions">${lockLabel(account)}<button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("") : `<tr><td class="empty" colspan="7">Không có tài khoản khớp bộ lọc.</td></tr>`;
}

function bootUsers() {
  renderUsers();
  const reset = () => {
    userView.page = 1;
    renderUsers();
  };
  document.getElementById("user-q").addEventListener("input", (event) => {
    userView.q = event.target.value;
    reset();
  });
  document.getElementById("user-role").addEventListener("change", (event) => {
    userView.role = event.target.value;
    reset();
  });
  document.getElementById("user-stats").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    userView.filter = button.dataset.filter;
    reset();
  });
  bindPager("user-pages", userView, renderUsers);
  document.getElementById("user-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.closest("tr").dataset.id;
    if (button.dataset.action === "edit") openUser(id);
    if (button.dataset.action === "lock") lockUser(id);
  });
  document.getElementById("user-form").addEventListener("submit", saveUser);
  bindEditorDialogs();
}



accounts.push(...generateAccounts(64));

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "overview") bootOverview();
  if (page === "jobs") bootJobs();
  if (page === "companies") bootCompanies();
  if (page === "login") bootLogin();
  if (page === "users") bootUsers();
  if (page === "categories") bootCategories();
  if (page === "skills") bootSkills();
});
