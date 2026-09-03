**ĐỀ CƯƠNG / KẾ HOẠCH ĐỒ ÁN TỐT NGHIỆP**

**Nền tảng tổng hợp việc làm ứng dụng AI (AI-Powered Job Aggregator Platform)**

# **1\. Giới thiệu đề tài**

## **1.1. Bối cảnh và lý do chọn đề tài**

Hiện nay, người tìm việc thường phải truy cập và thao tác trên nhiều nền tảng tuyển dụng riêng lẻ (TopCV, VietnamWorks, Joboko, v.v.) để tìm kiếm cơ hội việc làm phù hợp. Việc này dẫn đến một số bất tiện: tốn thời gian so sánh thủ công giữa nhiều nguồn, tin tuyển dụng trùng lặp giữa các nền tảng, và thiếu công cụ hỗ trợ đánh giá mức độ phù hợp giữa hồ sơ cá nhân (CV) với yêu cầu công việc (JD).

Đề tài hướng tới xây dựng một nền tảng tổng hợp việc làm (job aggregator) tự động thu thập dữ liệu tuyển dụng từ nhiều nguồn khác nhau, đồng thời tích hợp trí tuệ nhân tạo (AI) để nâng cao trải nghiệm tìm việc — không chỉ dừng ở việc tổng hợp thông tin mà còn hỗ trợ người dùng phân tích, đề xuất và tư vấn dựa trên dữ liệu thực tế.

## **1.2. Mục tiêu đề tài**

* Xây dựng hệ thống tự động thu thập (crawl) dữ liệu tuyển dụng từ nhiều nguồn, chuẩn hoá và lưu trữ tập trung.

* Cung cấp công cụ tìm kiếm, lọc việc làm theo nhiều tiêu chí thực tế của người dùng.

* Tích hợp AI để phân tích hồ sơ ứng viên (CV) và đề xuất việc làm phù hợp dựa trên mức độ tương đồng ngữ nghĩa, thay vì chỉ so khớp từ khoá.

* Xây dựng chatbot tư vấn nghề nghiệp có căn cứ trên dữ liệu tuyển dụng thực tế đã thu thập được.

* Xây dựng công cụ quản trị giúp vận hành và giám sát hệ thống thu thập dữ liệu.

## **1.3. Đối tượng người dùng**

| Vai trò | Nhu cầu chính |
| :---- | :---- |
| Người tìm việc (User) | Tìm kiếm việc làm nhanh chóng, lọc theo tiêu chí cá nhân, nhận đề xuất việc làm phù hợp, được tư vấn nghề nghiệp |
| Quản trị viên (Admin) | Theo dõi và quản lý tình trạng thu thập dữ liệu từ các nguồn tuyển dụng |

# **2\. Phạm vi hệ thống**

Hệ thống được triển khai dưới dạng hai phân hệ (site) riêng biệt:

* User Site: dành cho người tìm việc, tập trung vào trải nghiệm tìm kiếm, lưu trữ và nhận đề xuất việc làm.

* Admin Site: dành cho quản trị viên, tập trung vào giám sát và vận hành hệ thống thu thập dữ liệu.

*Phạm vi đề tài tập trung vào lõi nghiệp vụ "tổng hợp – tìm kiếm – đề xuất – tư vấn việc làm ứng dụng AI". Các định hướng mở rộng (nếu còn thời gian triển khai) được trình bày riêng tại Mục 5\.*

# **3\. Danh sách chức năng — User Site**

## **3.1. Thu thập dữ liệu việc làm (Crawler)**

* Tự động thu thập tin tuyển dụng định kỳ từ nhiều nguồn tuyển dụng khác nhau.

* Chuẩn hoá dữ liệu về cùng một cấu trúc chung (tên công việc, công ty, mức lương, địa điểm, kỹ năng yêu cầu, hạn nộp hồ sơ...).

* Phát hiện và loại bỏ tin tuyển dụng trùng lặp giữa các nguồn.

## **3.2. Tìm kiếm và lọc việc làm**

* Tìm kiếm việc làm theo từ khoá.

* Lọc theo địa điểm làm việc.

* Lọc theo mức lương.

* Lọc theo ngành nghề.

* Lọc theo cấp bậc (thực tập sinh, nhân viên, trưởng nhóm, quản lý...).

* Lọc theo hình thức làm việc (toàn thời gian, bán thời gian, từ xa, tại văn phòng).

## **3.3. Lưu tin yêu thích**

* Cho phép người dùng lưu lại các tin tuyển dụng quan tâm để xem lại sau.

* Quản lý danh sách việc làm đã lưu.

## **3.4. Đề xuất việc làm phù hợp với hồ sơ cá nhân**

* Phân tích hồ sơ (CV) và mức độ phù hợp với các tin tuyển dụng hiện có dựa trên kỹ thuật so khớp ngữ nghĩa (semantic matching).

* Gửi thông báo việc làm phù hợp qua email.

* Gửi thông báo việc làm phù hợp qua notification trên ứng dụng/nền tảng web.

## **3.5. Quản lý hồ sơ ứng viên (CV)**

* Cho phép người dùng tải lên CV (định dạng PDF/DOCX).

* Tự động trích xuất thông tin từ CV (kỹ năng, kinh nghiệm, học vấn) để xây dựng hồ sơ số hoá cho người dùng.

## **3.6. Chatbot tư vấn nghề nghiệp**

* Tư vấn về kỹ năng cần thiết cho từng vị trí công việc.

* Tư vấn khoảng mức lương tham khảo theo vị trí/kinh nghiệm, dựa trên dữ liệu tuyển dụng thực tế đã thu thập được.

* Trả lời các câu hỏi liên quan đến định hướng nghề nghiệp của người dùng.

# **4\. Danh sách chức năng — Admin Site**

## **4.1. Quản lý nguồn thu thập dữ liệu (Crawl Source Management)**

* Xem danh sách các nguồn tuyển dụng đang được thu thập dữ liệu.

* Theo dõi tình trạng hoạt động của từng nguồn (thành công, lỗi, tạm dừng).

* Bật/tắt việc thu thập dữ liệu theo từng nguồn.

* Xem lịch sử và nhật ký (log) các lần thu thập dữ liệu.

# **5\. Định hướng mở rộng (nếu còn thời gian triển khai)**

Các hạng mục dưới đây không thuộc phạm vi bắt buộc của đề tài, được xem xét bổ sung nếu tiến độ nhóm cho phép, nhằm tăng chiều sâu kỹ thuật và giá trị sản phẩm:

* Bảng phân tích xu hướng thị trường tuyển dụng (mức lương trung bình, xu hướng kỹ năng theo thời gian, theo khu vực/ngành nghề) dựa trên dữ liệu đã thu thập.

* Phân tích khoảng cách kỹ năng (skill gap) giữa hồ sơ người dùng và yêu cầu tuyển dụng phổ biến trên thị trường.

* Phát hiện tin tuyển dụng có dấu hiệu bất thường/lừa đảo.

# **6\. Định hướng công nghệ dự kiến**

| Thành phần | Công nghệ dự kiến |
| :---- | :---- |
| Backend | Java Spring Boot \+ Python |
| Cơ sở dữ liệu | PostgreSQL (kết hợp pgvector cho tìm kiếm ngữ nghĩa) |
| Tìm kiếm | Elasticsearch / PostgreSQL Full-text Search |
| AI / LLM | Tích hợp mô hình ngôn ngữ lớn cho trích xuất CV, so khớp ngữ nghĩa và chatbot tư vấn |
| Frontend | Xây dựng với sự hỗ trợ của công cụ AI |
| Thu thập dữ liệu | Crawler theo kiến trúc adapter, cấu hình riêng theo từng nguồn |

# **7\. Phân công nhóm (dự kiến)**

| Thành viên | Phạm vi phụ trách |
| :---- | :---- |
| Thành viên 1 | Module thu thập dữ liệu (Crawler/ETL) và Admin Site |
| Thành viên 2 | Module tìm kiếm, lọc, lưu tin yêu thích, hệ thống thông báo (email/app) |
| Thành viên 3 | Module AI: trích xuất CV, đề xuất việc làm phù hợp, chatbot tư vấn |

# **8\. Kế hoạch triển khai tổng quan (dự kiến)**

| Giai đoạn | Nội dung chính |
| :---- | :---- |
| Giai đoạn 1 | Phân tích yêu cầu, thiết kế hệ thống, xây dựng module thu thập dữ liệu cơ bản |
| Giai đoạn 2 | Xây dựng module tìm kiếm, lọc, lưu tin yêu thích; hoàn thiện pipeline dữ liệu |
| Giai đoạn 3 | Xây dựng module AI: trích xuất CV, đề xuất việc làm, chatbot tư vấn |
| Giai đoạn 4 | Hoàn thiện Admin Site, kiểm thử toàn hệ thống, tối ưu và chuẩn bị báo cáo |

