#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).parent

ICONS = {
    "job": '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
    "company": '<svg viewBox="0 0 24 24"><path d="M4 20V6a2 2 0 0 1 2-2h6v16"/><path d="M12 10h6a2 2 0 0 1 2 2v8"/><path d="M8 8h.01M8 12h.01M8 16h.01M16 14h.01M16 18h.01"/></svg>',
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    "money": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    "heart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 8.6a5 5 0 0 0-8.8-3.4L12 5.4l-.99-.2A5 5 0 0 0 3.2 8.6c0 6 8.8 11 8.8 11s8.8-5 8.8-11z"/></svg>',
    "users": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    "star": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.6 5.3L20 9.2l-4 3.9.9 5.6L12 16.5 7.1 18.7 8 13.1 4 9.2l5.4-.9z"/></svg>',
    "briefcase": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
}

PAGES = [
    ("index.html", "Trang chủ"),
    ("jobs.html", "Tìm việc"),
    ("job-detail.html", "Chi tiết việc làm"),
    ("companies.html", "Danh sách công ty"),
    ("company-detail.html", "Chi tiết công ty"),
    ("saved-jobs.html", "Việc đã lưu"),
    ("job-alerts.html", "Job Alert"),
    ("profile.html", "Hồ sơ"),
    ("login.html", "Đăng nhập"),
    ("register.html", "Đăng ký"),
]


def mock_index(current):
    links = "\n".join(
        f'<a href="{href}" class="{"is-here" if href==current else ""}">{label}</a>'
        for href, label in PAGES
    )
    return f"""
<div class="mock-index">
  <details>
    <summary>Mockup · 10 màn</summary>
    {links}
  </details>
</div>
"""


def header(active="home", logged_in=False):
    def nav(key, href, label, icon):
        cls = "nav-link is-active" if active == key else "nav-link"
        return f'<a class="{cls}" href="{href}">{ICONS[icon]} {label}</a>'

    if logged_in:
        actions = """
        <div class="user-chip">
          <div class="avatar">MH</div>
          <strong>Minh Hiếu</strong>
          <div class="user-menu">
            <a href="profile.html">Hồ sơ của tôi</a>
            <a href="saved-jobs.html">Việc làm đã lưu</a>
            <a href="job-alerts.html">Job Alert</a>
            <a href="index.html">Đăng xuất</a>
          </div>
        </div>
        """
    else:
        actions = """
        <a class="btn-login" href="login.html">Đăng nhập</a>
        <a class="btn-register" href="register.html">Đăng ký</a>
        """

    return f"""
<header class="site-header">
  <div class="header-inner">
    <button class="menu-btn" type="button" data-menu aria-label="Mở menu">{ICONS["menu"]}</button>
    <a class="logo" href="index.html"><img src="assets/logo.svg" alt="JobBeacon"></a>
    <nav class="nav">
      {nav("jobs", "jobs.html", "Việc làm", "job")}
      {nav("companies", "companies.html", "Công ty", "company")}
    </nav>
    <div class="header-actions">{actions}</div>
  </div>
</header>
<nav class="mobile-nav" data-mobile-nav>
  <a href="jobs.html">Việc làm</a>
  <a href="companies.html">Công ty</a>
  <a href="saved-jobs.html">Việc đã lưu</a>
  <a href="job-alerts.html">Job Alert</a>
  <a href="profile.html">Hồ sơ</a>
  <a href="login.html">Đăng nhập</a>
</nav>
<div class="header-spacer"></div>
"""


def footer():
    return """
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="assets/logo.svg" alt="JobBeacon">
      <p>Kết nối cơ hội, kiến tạo tương lai</p>
    </div>
    <div>
      <strong>Dành cho ứng viên</strong>
      <a href="jobs.html">Tìm việc làm</a>
      <a href="profile.html">Tạo hồ sơ</a>
      <a href="job-alerts.html">Cẩm nang nghề nghiệp</a>
    </div>
    <div>
      <strong>Dành cho nhà tuyển dụng</strong>
      <a href="#">Đăng tin tuyển dụng</a>
      <a href="#">Giải pháp tuyển dụng</a>
      <a href="#">Liên hệ</a>
    </div>
    <div>
      <strong>Về JobBeacon</strong>
      <a href="#">Giới thiệu</a>
      <a href="#">Blog</a>
      <a href="#">Điều khoản</a>
    </div>
    <div>
      <strong>Kết nối với chúng tôi</strong>
      <div class="footer-socials"><span>f</span><span>in</span><span>▶</span><span>X</span></div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 JobBeacon. All rights reserved.</span>
    <span>Việc tốt hơn, gần hơn mỗi ngày ♥</span>
  </div>
</footer>
"""


def page(title, body, active="home", logged_in=False, extra_class="page", filename="index.html"):
    return f"""<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} · JobBeacon</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="{extra_class}">
{header(active, logged_in)}
{body}
{footer()}
{mock_index(filename)}
<script src="js/app.js"></script>
</body>
</html>
"""


def auth_page(title, body, filename):
    return f"""<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} · JobBeacon</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
{body}
{mock_index(filename)}
</body>
</html>
"""


JOBS = [
    dict(mark="FPT", title="Java Developer", company="FPT Software", loc="Hà Nội", salary="25 - 35 triệu", tags=["Java", "Spring", "SQL"], source="TopCV", source_cls="source--topcv", time="2 giờ trước"),
    dict(mark="ABC", title="Backend Engineer", company="ABC Technology", loc="Hồ Chí Minh", salary="30 - 45 triệu", tags=["Java", "Kafka", "Redis"], source="ITviec", source_cls="source--itviec", time="2 giờ trước"),
    dict(mark="T", title="Frontend Developer", company="TechViet", loc="Hà Nội", salary="20 - 35 triệu", tags=["ReactJS", "TypeScript", "CSS"], source="VietnamWorks", source_cls="source--vnworks", time="3 giờ trước"),
    dict(mark="V", title="Data Analyst", company="Viettel Digital", loc="Hồ Chí Minh", salary="20 - 30 triệu", tags=["SQL", "Python", "Data Visualization"], source="TopCV", source_cls="source--topcv", time="4 giờ trước"),
    dict(mark="M", title="Product Designer", company="MoMo", loc="Hồ Chí Minh", salary="25 - 40 triệu", tags=["Figma", "UX Research", "UI"], source="ITviec", source_cls="source--itviec", time="5 giờ trước"),
    dict(mark="S", title="DevOps Engineer", company="Shopee", loc="Hà Nội", salary="40 - 60 triệu", tags=["AWS", "Kubernetes", "CI/CD"], source="CareerViet", source_cls="source--careerviet", time="1 ngày trước"),
    dict(mark="VN", title="QA Engineer", company="VNG", loc="Hồ Chí Minh", salary="18 - 28 triệu", tags=["Selenium", "API Test", "Jira"], source="TopCV", source_cls="source--topcv", time="1 ngày trước"),
    dict(mark="TIK", title="Mobile Developer", company="TikTok Vietnam", loc="Hà Nội", salary="35 - 55 triệu", tags=["Kotlin", "Swift", "Flutter"], source="ITviec", source_cls="source--itviec", time="2 ngày trước"),
]


def job_card(job, href="job-detail.html"):
    tags = "".join(f"<span class='pill'>{t}</span>" for t in job["tags"])
    return f"""
<article class="job-card">
  <div class="job-card-top">
    <div class="company-mark">{job["mark"]}</div>
    <span class="badge-new">Mới</span>
  </div>
  <h3><a href="{href}">{job["title"]}</a></h3>
  <p class="company"><a href="company-detail.html">{job["company"]}</a></p>
  <ul class="meta">
    <li>{ICONS["pin"]} {job["loc"]}</li>
    <li>{ICONS["money"]} {job["salary"]}</li>
  </ul>
  <div class="tags">{tags}</div>
  <div class="job-card-foot">
    <span>{ICONS["clock"]} {job["time"]}</span>
    <button class="icon-btn" data-save type="button" aria-label="Lưu việc">{ICONS["heart"]}</button>
  </div>
</article>
"""


def job_row(job, dup=None, saved=False):
    tags = "".join(f"<span class='pill'>{t}</span>" for t in job["tags"])
    dup_html = f'<div class="dup-note">Cùng tin này còn trên <a href="#">{dup}</a> · JobBeacon đã gộp trùng</div>' if dup else ""
    saved_cls = "icon-btn is-saved" if saved else "icon-btn"
    return f"""
<article class="job-row">
  <div class="company-mark">{job["mark"]}</div>
  <div>
    <h3><a href="job-detail.html">{job["title"]}</a></h3>
    <p class="company"><a href="company-detail.html">{job["company"]}</a></p>
    <div class="job-facts">
      <span>{ICONS["pin"]} {job["loc"]}</span>
      <span>{ICONS["money"]} {job["salary"]}</span>
      <span>{ICONS["briefcase"]} Full-time</span>
    </div>
    <div class="tags" style="min-height:auto;margin-top:10px">{tags}</div>
    {dup_html}
  </div>
  <div class="job-row-side">
    <span class="source {job["source_cls"]}">Nguồn: {job["source"]}</span>
    <span class="meta">{job["time"]}</span>
    <button class="{saved_cls}" data-save type="button" aria-label="Lưu việc">{ICONS["heart"]}</button>
  </div>
</article>
"""


# ---------- pages ----------
home = f"""
<section class="hero">
  <div class="hero-copy">
    <h1>Tìm công việc<br><span>phù hợp với bạn</span></h1>
    <p>Hàng nghìn cơ hội việc làm từ nhiều nguồn tuyển dụng</p>
    <form class="search-box" action="jobs.html">
      <label>{ICONS["search"]} <input name="q" placeholder="Vị trí, kỹ năng, công việc..."></label>
      <label>{ICONS["pin"]} <input name="loc" placeholder="Địa điểm"></label>
      <button type="submit">{ICONS["search"]} Tìm việc</button>
    </form>
    <div class="popular">Phổ biến:
      <button type="button">Java</button>
      <button type="button">ReactJS</button>
      <button type="button">Data Analyst</button>
      <button type="button">Tester</button>
      <button type="button">Marketing</button>
      <button type="button">Python</button>
      <button type="button">Business Analyst</button>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><span>{ICONS["briefcase"]}</span><div><strong>10.000+</strong><small>Việc làm</small></div></div>
    <div class="stat"><span>{ICONS["company"]}</span><div><strong>2.000+</strong><small>Công ty</small></div></div>
    <div class="stat"><span>{ICONS["users"]}</span><div><strong>50+</strong><small>Nguồn tuyển dụng</small></div></div>
    <div class="stat"><span>{ICONS["star"]}</span><div><strong>100%</strong><small>Miễn phí cho ứng viên</small></div></div>
  </div>
</section>

<section class="section latest">
  <div class="section-head">
    <h2>Việc làm mới nhất</h2>
    <a href="jobs.html">Xem tất cả việc làm →</a>
  </div>
  <div class="job-grid">
    {''.join(job_card(j) for j in JOBS[:4])}
  </div>
</section>

<section class="section">
  <div class="section-head">
    <h2>Khám phá theo ngành nghề</h2>
    <a href="jobs.html">Xem tất cả ngành nghề →</a>
  </div>
  <div class="cat-grid">
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["briefcase"]}</span><span><strong>Công nghệ</strong><small>2.430 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["money"]}</span><span><strong>Tài chính</strong><small>1.250 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["star"]}</span><span><strong>Marketing</strong><small>840 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["company"]}</span><span><strong>Bán hàng</strong><small>1.320 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["users"]}</span><span><strong>Sản xuất</strong><small>680 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["pin"]}</span><span><strong>Xây dựng</strong><small>480 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["clock"]}</span><span><strong>Logistics</strong><small>410 việc</small></span><b>›</b></a>
    <a class="cat-item" href="jobs.html"><span class="cat-icon">{ICONS["star"]}</span><span><strong>Khác</strong><small>2.100 việc</small></span><b>›</b></a>
  </div>
</section>

<section class="cta">
  <div>
    <h2>Bắt đầu hành trình nghề nghiệp cùng JobBeacon</h2>
    <p>Khám phá hàng nghìn cơ hội việc làm, kết nối với các công ty uy tín và tìm thấy công việc phù hợp nhất cho bạn.</p>
    <div class="cta-actions">
      <a class="btn-primary" href="jobs.html">Tìm việc ngay →</a>
      <a class="btn-outline" href="profile.html">Tạo hồ sơ của bạn</a>
    </div>
  </div>
  <div class="cta-art">
    <div class="cta-window"></div>
    <div class="cta-search">{ICONS["search"]}</div>
  </div>
</section>
"""

jobs = f"""
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · Việc làm</div>
  <h1>Tìm kiếm việc làm</h1>
  <p>Tổng hợp tin tuyển dụng từ TopCV, ITviec, VietnamWorks và nhiều nguồn khác. JobBeacon chuẩn hóa dữ liệu và gộp tin trùng.</p>
  <form class="search-bar" action="jobs.html">
    <label>{ICONS["search"]} <input value="Java Developer" placeholder="Vị trí, kỹ năng, công ty"></label>
    <label>{ICONS["pin"]} <input value="Hà Nội" placeholder="Địa điểm"></label>
    <button type="submit">Tìm việc</button>
  </form>
</section>

<div class="jobs-layout">
  <form class="filter-card">
    <h2>Bộ lọc <button type="button" data-reset-filters>Xóa lọc</button></h2>
    <div class="filter-group">
      <h3>Địa điểm</h3>
      <label class="filter-option"><input type="checkbox" checked> Hà Nội <span>1.240</span></label>
      <label class="filter-option"><input type="checkbox"> Hồ Chí Minh <span>2.180</span></label>
      <label class="filter-option"><input type="checkbox"> Đà Nẵng <span>310</span></label>
      <label class="filter-option"><input type="checkbox"> Remote <span>420</span></label>
    </div>
    <div class="filter-group">
      <h3>Ngành nghề</h3>
      <label class="filter-option"><input type="checkbox" checked> Công nghệ <span>2.430</span></label>
      <label class="filter-option"><input type="checkbox"> Tài chính <span>1.250</span></label>
      <label class="filter-option"><input type="checkbox"> Marketing <span>840</span></label>
    </div>
    <div class="filter-group">
      <h3>Kỹ năng</h3>
      <label class="filter-option"><input type="checkbox" checked> Java <span>640</span></label>
      <label class="filter-option"><input type="checkbox"> Spring <span>210</span></label>
      <label class="filter-option"><input type="checkbox"> SQL <span>880</span></label>
      <label class="filter-option"><input type="checkbox"> ReactJS <span>390</span></label>
    </div>
    <div class="filter-group">
      <h3>Mức lương (triệu)</h3>
      <div class="salary-row">
        <input placeholder="Từ" value="20">
        <input placeholder="Đến" value="45">
      </div>
    </div>
    <div class="filter-group">
      <h3>Kinh nghiệm</h3>
      <label class="filter-option"><input type="checkbox"> Chưa có KN</label>
      <label class="filter-option"><input type="checkbox" checked> 1 - 3 năm</label>
      <label class="filter-option"><input type="checkbox"> 3 - 5 năm</label>
      <label class="filter-option"><input type="checkbox"> Trên 5 năm</label>
    </div>
    <div class="filter-group">
      <h3>Loại hình</h3>
      <label class="filter-option"><input type="checkbox" checked> Full-time</label>
      <label class="filter-option"><input type="checkbox"> Part-time</label>
      <label class="filter-option"><input type="checkbox"> Hợp đồng</label>
      <label class="filter-option"><input type="checkbox"> Internship</label>
    </div>
    <div class="filter-group">
      <h3>Ngày đăng</h3>
      <label class="filter-option"><input type="checkbox"> 24 giờ qua</label>
      <label class="filter-option"><input type="checkbox" checked> 7 ngày qua</label>
      <label class="filter-option"><input type="checkbox"> 30 ngày qua</label>
    </div>
    <div class="filter-group">
      <h3>Nguồn tuyển dụng</h3>
      <label class="filter-option"><input type="checkbox" checked> TopCV</label>
      <label class="filter-option"><input type="checkbox" checked> ITviec</label>
      <label class="filter-option"><input type="checkbox"> VietnamWorks</label>
      <label class="filter-option"><input type="checkbox"> CareerViet</label>
    </div>
  </form>

  <div>
    <div class="results-head">
      <h2>128 việc làm cho “Java Developer” tại Hà Nội</h2>
      <select>
        <option>Mới nhất</option>
        <option>Phù hợp nhất</option>
        <option>Lương cao đến thấp</option>
      </select>
    </div>
    <div class="active-filters">
      <span class="chip">Java</span>
      <span class="chip">Hà Nội</span>
      <span class="chip">1 - 3 năm</span>
      <span class="chip">Full-time</span>
      <a class="chip" href="job-alerts.html">+ Tạo Job Alert từ bộ lọc này</a>
    </div>
    {job_row(JOBS[0], dup="ITviec")}
    {job_row(JOBS[1])}
    {job_row(JOBS[5])}
    {job_row(JOBS[2])}
    {job_row(JOBS[7])}
    {job_row(JOBS[6])}
    <div class="pagination">
      <span class="is-active">1</span>
      <a href="#">2</a>
      <a href="#">3</a>
      <a href="#">›</a>
    </div>
  </div>
</div>
"""

job_detail = f"""
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · <a href="jobs.html">Việc làm</a> · Java Developer</div>
</section>
<div class="detail-layout">
  <article class="detail-main">
    <div class="job-title-row">
      <div class="company-mark lg">FPT</div>
      <div>
        <h1>Java Developer</h1>
        <p class="company" style="margin:6px 0 10px"><a href="company-detail.html">FPT Software</a> · Công nghệ thông tin</p>
        <div class="tags" style="min-height:auto">
          <span class="pill">Java</span><span class="pill">Spring Boot</span><span class="pill">SQL</span><span class="pill">Microservices</span>
        </div>
      </div>
    </div>
    <ul class="detail-facts">
      <li>{ICONS["money"]} 25 - 35 triệu / tháng</li>
      <li>{ICONS["pin"]} Hà Nội · Hybrid</li>
      <li>{ICONS["briefcase"]} Full-time · 1-3 năm KN</li>
      <li>{ICONS["clock"]} Đăng 2 giờ trước</li>
    </ul>
    <p><span class="source source--topcv">Nguồn: TopCV</span> <span class="dup-note" style="display:inline;margin:0 0 0 8px">Cũng thấy trên ITviec · đã gộp trùng</span></p>

    <div class="prose">
      <h2>Mô tả công việc</h2>
      <ul>
        <li>Phát triển và bảo trì hệ thống backend Java / Spring Boot.</li>
        <li>Thiết kế API, tối ưu truy vấn SQL và tích hợp microservices.</li>
        <li>Tham gia code review, viết unit test và phối hợp với team frontend/QA.</li>
        <li>Theo dõi log, xử lý sự cố production theo sprint 2 tuần.</li>
      </ul>
      <h2>Yêu cầu</h2>
      <ul>
        <li>1-3 năm kinh nghiệm Java, nắm vững OOP và Spring ecosystem.</li>
        <li>Có kinh nghiệm SQL, Redis hoặc Kafka là lợi thế.</li>
        <li>Tiếng Anh đọc tài liệu kỹ thuật.</li>
      </ul>
      <h2>Quyền lợi</h2>
      <ul>
        <li>Lương 25-35 triệu, 13 tháng lương, review 2 lần/năm.</li>
        <li>Bảo hiểm đầy đủ, hybrid 2 ngày/tuần.</li>
        <li>Đào tạo nội bộ, hỗ trợ chứng chỉ AWS/Java.</li>
      </ul>
    </div>
  </article>

  <aside class="detail-side">
    <div class="apply-card">
      <small style="color:#7b8da3;font-weight:700;letter-spacing:.04em;text-transform:uppercase">Mức lương</small>
      <div class="price">25 - 35 triệu</div>
      <a class="btn-primary" href="#">Ứng tuyển trên TopCV →</a>
      <button class="btn-outline" data-save type="button">♡ Lưu việc làm</button>
      <p style="color:#7b8da3;font-size:.82rem;margin-top:12px;line-height:1.5">JobBeacon là nền tảng tổng hợp. Nút ứng tuyển sẽ mở tin gốc để bạn nộp hồ sơ tại nguồn tuyển dụng.</p>
    </div>
    <div class="company-mini">
      <div style="display:flex;gap:12px;align-items:center">
        <div class="company-mark">FPT</div>
        <div>
          <strong>FPT Software</strong>
          <div class="industry" style="color:#687d98;font-size:.86rem">Công nghệ · Hà Nội</div>
        </div>
      </div>
      <p>Công ty thành viên FPT, chuyên gia công phần mềm và chuyển đổi số cho khách hàng toàn cầu.</p>
      <a class="btn-ghost" href="company-detail.html">Xem trang công ty</a>
    </div>
  </aside>
</div>

<section class="section">
  <div class="section-head">
    <h2>Việc làm tương tự</h2>
    <a href="jobs.html">Xem thêm →</a>
  </div>
  <div class="job-grid">
    {''.join(job_card(j) for j in JOBS[1:5])}
  </div>
</section>
"""

companies = """
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · Công ty</div>
  <h1>Khám phá công ty</h1>
  <p>JobBeacon chuẩn hóa công ty từ nhiều nguồn. Cùng một doanh nghiệp trên TopCV và ITviec sẽ chỉ hiện một lần.</p>
  <form class="search-bar" action="companies.html">
    <label>{ICONS["search"]} <input placeholder="Tên công ty, ngành nghề"></label>
    <label>{ICONS["pin"]} <input placeholder="Địa điểm"></label>
    <button type="submit">Tìm công ty</button>
  </form>
</section>
<section class="section">
  <div class="company-grid">
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">FPT</div><div><h3>FPT Software</h3><div class="industry">Công nghệ · Hà Nội</div></div></header>
      <p>Tập đoàn công nghệ Việt Nam, cung cấp dịch vụ phần mềm, AI và chuyển đổi số cho khách hàng toàn cầu.</p>
      <footer><span>86 việc đang tuyển</span><span>TopCV · ITviec</span></footer>
    </a>
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">V</div><div><h3>Viettel Digital</h3><div class="industry">Công nghệ · Hồ Chí Minh</div></div></header>
      <p>Đơn vị số của Viettel, xây dựng sản phẩm data, fintech và nền tảng số cho hệ sinh thái Viettel.</p>
      <footer><span>24 việc đang tuyển</span><span>TopCV · VietnamWorks</span></footer>
    </a>
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">S</div><div><h3>Shopee</h3><div class="industry">Thương mại điện tử · Hà Nội</div></div></header>
      <p>Nền tảng TMĐT hàng đầu Đông Nam Á, tuyển kỹ sư backend, data và product tại Việt Nam.</p>
      <footer><span>41 việc đang tuyển</span><span>ITviec · CareerViet</span></footer>
    </a>
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">M</div><div><h3>MoMo</h3><div class="industry">Fintech · Hồ Chí Minh</div></div></header>
      <p>Ví điện tử và siêu ứng dụng tài chính, tập trung trải nghiệm người dùng và hạ tầng thanh toán.</p>
      <footer><span>19 việc đang tuyển</span><span>ITviec · TopCV</span></footer>
    </a>
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">VN</div><div><h3>VNG</h3><div class="industry">Internet · Hồ Chí Minh</div></div></header>
      <p>Công ty internet Việt Nam với game, Zalo và các nền tảng số phục vụ hàng chục triệu người dùng.</p>
      <footer><span>33 việc đang tuyển</span><span>TopCV · ITviec</span></footer>
    </a>
    <a class="company-card" href="company-detail.html">
      <header><div class="company-mark lg">T</div><div><h3>TechViet</h3><div class="industry">Outsourcing · Hà Nội</div></div></header>
      <p>Công ty phần mềm vừa và nhỏ, chuyên frontend/backend cho khách hàng Nhật Bản và châu Âu.</p>
      <footer><span>12 việc đang tuyển</span><span>VietnamWorks</span></footer>
    </a>
  </div>
</section>
"""

company_detail = f"""
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · <a href="companies.html">Công ty</a> · FPT Software</div>
</section>
<section class="section" style="padding-top:8px">
  <div class="company-hero">
    <div class="company-mark lg">FPT</div>
    <div>
      <h1>FPT Software</h1>
      <p style="color:#687d98;margin-top:6px">Công nghệ thông tin · Hà Nội, Hồ Chí Minh, Đà Nẵng</p>
      <div class="stat-pills">
        <span>5.000+ nhân sự</span>
        <span>86 việc đang tuyển</span>
        <span>Nguồn: TopCV · ITviec · VietnamWorks</span>
      </div>
    </div>
    <a class="btn-primary" href="job-alerts.html">Theo dõi việc mới</a>
  </div>

  <div class="panel profile-card" style="margin-bottom:22px">
    <h2 style="margin-bottom:10px">Giới thiệu công ty</h2>
    <p class="prose">FPT Software là công ty thành viên của Tập đoàn FPT, cung cấp dịch vụ gia công phần mềm, chuyển đổi số, AI và cloud cho khách hàng tại Nhật Bản, châu Âu, Mỹ và Việt Nam. Trên JobBeacon, hồ sơ công ty được chuẩn hóa từ nhiều nguồn tuyển dụng để tránh trùng lặp.</p>
  </div>

  <div class="section-head">
    <h2>Việc đang tuyển tại FPT Software</h2>
    <a href="jobs.html">Xem tất cả →</a>
  </div>
  {job_row(dict(JOBS[0], title="Java Developer"), dup="ITviec")}
  {job_row(dict(mark="FPT", title="Senior Backend Engineer", company="FPT Software", loc="Hà Nội", salary="35 - 50 triệu", tags=["Java", "Kafka", "AWS"], source="ITviec", source_cls="source--itviec", time="5 giờ trước"))}
  {job_row(dict(mark="FPT", title="Frontend Developer", company="FPT Software", loc="Đà Nẵng", salary="20 - 32 triệu", tags=["ReactJS", "TypeScript", "CSS"], source="VietnamWorks", source_cls="source--vnworks", time="1 ngày trước"))}
</section>
"""

saved = f"""
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · Việc đã lưu</div>
  <h1>Việc làm đã lưu</h1>
  <p>Các tin bạn đánh dấu để xem lại. Ứng tuyển vẫn được chuyển tới nguồn gốc.</p>
</section>
<section class="section">
  <div class="toolbar">
    <div class="tabs">
      <a class="is-active" href="saved-jobs.html">Đã lưu (3)</a>
      <a href="#">Đã ứng tuyển (1)</a>
    </div>
    <select><option>Mới lưu nhất</option><option>Lương cao</option></select>
  </div>
  {job_row(JOBS[0], saved=True)}
  {job_row(JOBS[4], saved=True)}
  {job_row(JOBS[5], saved=True)}
</section>
"""

alerts = """
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · Job Alert</div>
  <h1>Thông báo việc mới</h1>
  <p>Lưu bộ lọc tìm kiếm. Khi crawler đưa tin mới khớp điều kiện, JobBeacon sẽ gửi thông báo cho bạn.</p>
</section>
<section class="section">
  <div class="toolbar">
    <h2 style="font-size:1.15rem">3 cảnh báo đang bật</h2>
    <a class="btn-primary" href="jobs.html">+ Tạo alert từ trang tìm việc</a>
  </div>
  <article class="panel alert-card">
    <div>
      <h3>Java Developer · Hà Nội</h3>
      <p>Full-time · 1-3 năm KN · 20-45 triệu · Nguồn: TopCV, ITviec</p>
      <div class="tags" style="min-height:auto"><span class="pill">Java</span><span class="pill">Spring</span><span class="chip">Gửi hằng ngày</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="switch is-on" data-switch type="button" aria-checked="true"></button>
      <button class="btn-outline" type="button">Sửa</button>
    </div>
  </article>
  <article class="panel alert-card">
    <div>
      <h3>Data Analyst · Hồ Chí Minh</h3>
      <p>SQL, Python · Toàn thời gian · Nguồn: mọi nguồn</p>
      <div class="tags" style="min-height:auto"><span class="pill">SQL</span><span class="pill">Python</span><span class="chip">Gửi ngay khi có tin mới</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="switch is-on" data-switch type="button"></button>
      <button class="btn-outline" type="button">Sửa</button>
    </div>
  </article>
  <article class="panel alert-card">
    <div>
      <h3>Frontend · Remote</h3>
      <p>ReactJS · 7 ngày gần nhất</p>
      <div class="tags" style="min-height:auto"><span class="pill">ReactJS</span><span class="chip">Tạm tắt</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="switch" data-switch type="button"></button>
      <button class="btn-outline" type="button">Sửa</button>
    </div>
  </article>
</section>
"""

profile = """
<section class="page-hero">
  <div class="breadcrumb"><a href="index.html">Trang chủ</a> · Hồ sơ</div>
  <h1>Hồ sơ của bạn</h1>
  <p>Skill, kinh nghiệm và vị trí mong muốn sẽ dùng cho gợi ý việc làm sau này.</p>
</section>
<section class="section">
  <div class="profile-grid">
    <aside class="panel profile-card">
      <div class="profile-summary">
        <div class="avatar xl">MH</div>
        <div>
          <h2>Minh Hiếu</h2>
          <p style="color:#687d98;margin-top:4px">hieu.minh@email.com</p>
          <span class="badge-new" style="display:inline-block;margin-top:8px">Đã xác thực</span>
        </div>
      </div>
      <hr style="border:0;border-top:1px solid #eef2f6;margin:22px 0">
      <p style="color:#5b6f86;line-height:1.6">Backend developer, quan tâm Java/Spring và các vị trí data engineer tại Hà Nội.</p>
    </aside>
    <form class="panel profile-card">
      <div class="field"><label>Vị trí mong muốn</label><input value="Java Developer / Backend Engineer"></div>
      <div class="field"><label>Địa điểm làm việc</label><input value="Hà Nội, Hybrid"></div>
      <div class="field"><label>Mức lương kỳ vọng</label><input value="25 - 35 triệu"></div>
      <div class="field"><label>Kinh nghiệm</label><select><option>1 - 3 năm</option><option>3 - 5 năm</option></select></div>
      <div class="field"><label>Kỹ năng</label>
        <div class="skill-editor">
          <span class="pill">Java ×</span>
          <span class="pill">Spring Boot ×</span>
          <span class="pill">SQL ×</span>
          <span class="pill">Redis ×</span>
          <input placeholder="Thêm kỹ năng" style="min-height:34px;width:140px">
        </div>
      </div>
      <div class="field"><label>CV</label><input type="text" value="CV_MinhHieu_Java.pdf"></div>
      <div class="field"><label>Giới thiệu ngắn</label><textarea>Backend developer 2 năm, từng làm hệ thống ngân hàng lõi với Java, Spring Boot và Kafka.</textarea></div>
      <button class="btn-primary" type="button">Lưu hồ sơ</button>
    </form>
  </div>
</section>
"""

login = """
<main class="auth-layout">
  <div class="auth-card">
    <a class="logo" href="index.html"><img src="assets/logo.svg" alt="JobBeacon"></a>
    <h1>Chào mừng bạn trở lại</h1>
    <p class="sub">Đăng nhập để lưu việc, tạo Job Alert và nhận gợi ý phù hợp.</p>
    <button class="google-btn" type="button">
      <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.3z"/><path fill="#34A853" d="M12 24c3.2 0 5.8-1 7.7-2.8l-3.7-2.8c-1 .7-2.3 1.1-4 1.1-3 0-5.6-2-6.5-4.8H1.6v3c1.9 3.8 5.9 6.3 10.4 6.3z"/><path fill="#FBBC05" d="M5.5 14.7A7.2 7.2 0 0 1 5.1 12c0-.9.2-1.8.4-2.7V6.3H1.6A12 12 0 0 0 0 12c0 1.9.5 3.8 1.6 5.7l3.9-3z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.8 1.1 15.2 0 12 0 7.5 0 3.5 2.5 1.6 6.3l3.9 3C6.4 6.8 9 4.8 12 4.8z"/></svg>
      Đăng nhập bằng Google
    </button>
    <div class="auth-or">Hoặc đăng nhập bằng email</div>
    <form class="auth-form" action="profile.html">
      <div class="field"><label>Email</label><input type="email" placeholder="Nhập email"></div>
      <div class="field">
        <div class="field-head"><label>Mật khẩu</label><a href="#" class="forgot">Quên mật khẩu</a></div>
        <input type="password" placeholder="Nhập mật khẩu">
      </div>
      <button class="btn-primary" type="submit">Đăng nhập →</button>
    </form>
    <p class="auth-switch">Bạn chưa có tài khoản? <a href="register.html">Đăng ký ngay</a></p>
  </div>
  <p class="auth-foot">© 2026 JobBeacon. All rights reserved.</p>
</main>
"""

register = """
<main class="auth-layout">
  <div class="auth-card">
    <a class="logo" href="index.html"><img src="assets/logo.svg" alt="JobBeacon"></a>
    <h1>Tạo tài khoản JobBeacon</h1>
    <p class="sub">Lưu việc làm, nhận alert tin mới và xây hồ sơ để hệ thống gợi ý việc phù hợp.</p>
    <button class="google-btn" type="button">Đăng ký bằng Google</button>
    <div class="auth-or">Hoặc đăng ký bằng email</div>
    <form class="auth-form" action="profile.html">
      <div class="field"><label>Họ và tên</label><input placeholder="Nguyễn Minh Hiếu"></div>
      <div class="field"><label>Email</label><input type="email" placeholder="Nhập email"></div>
      <div class="field"><label>Mật khẩu</label><input type="password" placeholder="Tối thiểu 8 ký tự"></div>
      <button class="btn-primary" type="submit">Tạo tài khoản →</button>
    </form>
    <p class="auth-switch">Đã có tài khoản? <a href="login.html">Đăng nhập</a></p>
  </div>
  <p class="auth-foot">© 2026 JobBeacon. All rights reserved.</p>
</main>
"""


def write(name, html):
    (ROOT / name).write_text(html, encoding="utf-8")
    print("wrote", name, len(html))


write("index.html", page("Trang chủ", home, "home", filename="index.html"))
write("jobs.html", page("Tìm việc", jobs, "jobs", extra_class="page page--tint", filename="jobs.html"))
write("job-detail.html", page("Java Developer", job_detail, "jobs", extra_class="page page--tint", filename="job-detail.html"))
write("companies.html", page("Công ty", companies, "companies", extra_class="page page--tint", filename="companies.html"))
write("company-detail.html", page("FPT Software", company_detail, "companies", extra_class="page page--tint", filename="company-detail.html"))
write("saved-jobs.html", page("Việc đã lưu", saved, "jobs", logged_in=True, extra_class="page page--tint", filename="saved-jobs.html"))
write("job-alerts.html", page("Job Alert", alerts, "jobs", logged_in=True, extra_class="page page--tint", filename="job-alerts.html"))
write("profile.html", page("Hồ sơ", profile, "home", logged_in=True, extra_class="page page--tint", filename="profile.html"))
write("login.html", auth_page("Đăng nhập", login, "login.html"))
write("register.html", auth_page("Đăng ký", register, "register.html"))
