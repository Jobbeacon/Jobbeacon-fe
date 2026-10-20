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
    category: "Backend",
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
    location: "TP.HCM",
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
    category: "Dữ liệu",
    company: "VNG",
    type: "Toàn thời gian",
    exp: 18,
    location: "TP.HCM",
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
    category: "Vận hành",
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
    category: "Kinh doanh",
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
    category: "Frontend",
    company: "KMS Technology",
    type: "Toàn thời gian",
    exp: 24,
    location: "TP.HCM",
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
    category: "Kiểm thử",
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
];

const companies = [
  { id: "c1", name: "FPT Software", logo: "", jobs: 128, sources: ["topcv.vn", "itviec.com"], crawled: "2026-10-19T06:14" },
  { id: "c2", name: "Tiki", logo: "", jobs: 46, sources: ["topcv.vn"], crawled: "2026-10-19T05:58" },
  { id: "c3", name: "VNG", logo: "", jobs: 39, sources: ["itviec.com"], crawled: "2026-10-19T05:40" },
  { id: "c4", name: "MoMo", logo: "", jobs: 52, sources: ["topcv.vn", "itviec.com"], crawled: "2026-10-18T22:16" },
  { id: "c5", name: "Viettel Digital", logo: "", jobs: 33, sources: ["topcv.vn"], crawled: "2026-10-18T21:40" },
  { id: "c6", name: "KMS Technology", logo: "", jobs: 31, sources: ["itviec.com", "topcv.vn"], crawled: "2026-10-18T14:05" },
  { id: "c7", name: "NashTech", logo: "", jobs: 18, sources: ["itviec.com"], crawled: "2026-10-17T09:12" },
  { id: "c8", name: "Thế Giới Di Động", logo: "", jobs: 22, sources: ["topcv.vn"], crawled: "2026-10-17T08:33" },
];

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
    const topcv = Math.round((92 + hash(i, 1) * 26) * factor);
    const itviec = Math.round((46 + hash(i, 2) * 14) * factor);
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
  { label: "T5", hint: "", "topcv.vn": 2140, "itviec.com": 1010 },
  { label: "T6", hint: "", "topcv.vn": 2380, "itviec.com": 1160 },
  { label: "T7", hint: "", "topcv.vn": 1960, "itviec.com": 980 },
  { label: "T8", hint: "", "topcv.vn": 2620, "itviec.com": 1290 },
  { label: "T9", hint: "", "topcv.vn": 2810, "itviec.com": 1420 },
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

function money(min, max) {
  const trieu = (amount) => {
    const value = amount / 1000000;
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
  };
  if (!min && !max) return "Thỏa thuận";
  if (min && max) return `${trieu(min)}–${trieu(max)} triệu`;
  if (min) return `Từ ${trieu(min)} triệu`;
  return `Đến ${trieu(max)} triệu`;
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
  const palette = ["#163e70", "#0b1b33", "#1d4e89", "#24527a", "#0e7490", "#334155"];
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

function placeTip(event, html) {
  const tip = document.getElementById("tip");
  const plot = document.getElementById("plot");
  const bounds = plot.getBoundingClientRect();
  tip.innerHTML = html;
  tip.hidden = false;
  const width = tip.offsetWidth;
  let left = event.clientX - bounds.left + 14;
  if (left + width > bounds.width - 8) left = event.clientX - bounds.left - width - 14;
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${Math.max(8, event.clientY - bounds.top - 28)}px`;
}

function hideTip() {
  const tip = document.getElementById("tip");
  if (tip) tip.hidden = true;
}

function sourceLines(row) {
  return SOURCE_ORDER.map((domain) => `${SOURCE_LABEL[domain]} ${fmt.format(row[domain])}`).join("<br>");
}

const CHART_FONT = "Inter, sans-serif";
const TOPCV_COLOR = "#1687FF";
const ITVIEC_COLOR = "#163E70";

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
      stroke: mark === 0 ? "#e3e7ee" : "#eef0f4",
    }));
    if (mark === 0) return;
    const label = svg("text", {
      x: pad.l - 10,
      y: yPos + 4,
      "text-anchor": "end",
      fill: "#8b95a6",
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
      fill: "#8b95a6",
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
    hit.addEventListener("mousemove", (event) => {
      placeTip(event, `<strong>${day.label}</strong><br>${sourceLines(day)}<br>Cộng ${fmt.format(day.total)}`);
    });
    hit.addEventListener("mouseleave", hideTip);
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
      fill: "#0b1b33",
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
        fill: "#8b95a6",
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
    hit.addEventListener("mousemove", (event) => {
      const partial = month.partial ? "<br>Chưa đủ tháng" : "";
      placeTip(event, `<strong>${month.label}</strong><br>${sourceLines(month)}<br>Cộng ${fmt.format(month.total)}${partial}`);
    });
    hit.addEventListener("mouseleave", hideTip);
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
    return `<span${hot ? ' data-hot="1"' : ""} style="height:${height}%" title="${label}"></span>`;
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
  const quiet = sources.filter((source) => source.connected && source.enabled && !jobs.some((job) => (
    job.mappings.some((mapping) => mapping.domain === source.domain && mapping.at.startsWith(TODAY))
  )));
  const node = document.getElementById("quiet");
  if (!quiet.length) {
    node.hidden = true;
    return;
  }
  node.hidden = false;
  node.textContent = quiet.map((source) => `${source.name} đang bật nhưng hôm nay chưa có ghi nhận.`).join(" ");
}

function renderCrawls() {
  const rows = jobs.flatMap((job) => job.mappings.map((mapping) => ({ ...mapping, job })))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  document.getElementById("crawl-rows").innerHTML = rows.map((row) => `
    <tr>
      <td class="when">${stamp(row.at)}</td>
      <td>${chips([row.domain])}</td>
      <td><a class="row-link" href="jobs.html?job=${esc(row.job.id)}">${esc(row.job.title)}</a></td>
      <td><a class="row-link" href="jobs.html?company=${encodeURIComponent(row.job.company)}">${esc(row.job.company)}</a></td>
      <td><div class="url" title="${esc(row.url)}">${esc(row.url.replace(/^https?:\/\//, ""))}</div></td>
    </tr>`).join("");
}

const jobScope = { company: "", category: "", crawled: "", term: "" };

function jobInCategory(job, name) {
  if (!name) return true;
  if (job.category === name) return true;
  const selected = categories.find((item) => item.name === name);
  if (!selected) return false;
  return categories.some((item) => item.parent === selected.id && item.name === job.category);
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

function emptyJobCopy() {
  if (jobScope.term === "closed") return "Không có tin hết hạn.";
  if (jobScope.term === "open") return "Không có tin còn hạn.";
  if (jobScope.term === "multi") return "Không có tin trùng nguồn.";
  if (jobScope.company) return `Không có tin của ${jobScope.company}.`;
  if (jobScope.category) return `Không có tin trong danh mục ${jobScope.category}.`;
  if (jobScope.crawled === "today") return "Hôm nay chưa có tin được ghi nhận.";
  if (jobScope.crawled === "month") return "Tháng 10 chưa có tin được ghi nhận.";
  const source = document.getElementById("source").value;
  if (source) return `Không có tin từ ${source}.`;
  if (document.getElementById("q").value.trim()) return "Không có tin khớp từ khóa.";
  return "Không có tin nào.";
}

function renderJobScope() {
  const bits = [];
  if (jobScope.company) bits.push(`Công ty: ${jobScope.company}`);
  if (jobScope.category) bits.push(`Danh mục: ${jobScope.category}`);
  if (jobScope.crawled === "today") bits.push("Ghi nhận hôm nay");
  if (jobScope.crawled === "month") bits.push("Ghi nhận tháng 10");
  const node = document.getElementById("job-scope");
  if (!bits.length) {
    node.hidden = true;
    node.textContent = "";
    return;
  }
  node.hidden = false;
  node.innerHTML = `${esc(bits.join(" · "))} <button type="button" data-action="clear-scope">Bỏ lọc</button>`;
}

function termPill(job) {
  return isExpired(job)
    ? `<span class="pill pill--off"><i></i>Hết hạn</span>`
    : `<span class="pill"><i></i>Còn hạn</span>`;
}

function renderJobs() {
  const query = document.getElementById("q").value.trim().toLowerCase();
  const source = document.getElementById("source").value;
  const sort = document.getElementById("sort").value;
  const matched = jobs.filter((job) => {
    const haystack = `${job.title} ${job.location}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (jobScope.company && job.company !== jobScope.company) return false;
    if (!jobInCategory(job, jobScope.category)) return false;
    if (!crawledIn(job, jobScope.crawled)) return false;
    if (jobScope.term === "multi" && job.mappings.length < 2) return false;
    if (source && !job.mappings.some((mapping) => mapping.domain === source)) return false;
    if (jobScope.term === "open" && isExpired(job)) return false;
    if (jobScope.term === "closed" && !isExpired(job)) return false;
    return true;
  });
  matched.sort((left, right) => {
    const order = latestMapping(left).at < latestMapping(right).at ? -1 : 1;
    return sort === "old" ? order : -order;
  });
  const body = document.getElementById("job-rows");
  document.getElementById("job-count").textContent = `Đang hiện ${matched.length} / ${jobs.length} tin`;
  renderJobScope();
  if (!matched.length) {
    body.innerHTML = `<tr><td class="empty" colspan="8">${esc(emptyJobCopy())}</td></tr>`;
    return;
  }
  body.innerHTML = matched.map((job) => {
    const latest = latestMapping(job);
    return `<tr data-id="${job.id}">
      <td><button class="name-btn" type="button" data-action="edit">${esc(job.title)}</button><span class="sub">${esc(job.type)}</span></td>
      <td><a class="row-link" href="jobs.html?company=${encodeURIComponent(job.company)}">${esc(job.company)}</a></td>
      <td>${esc(job.location)}</td>
      <td>${esc(money(job.min, job.max))}</td>
      <td>${termPill(job)}</td>
      <td><div class="sources">${chips(job.mappings.map((mapping) => mapping.domain))}</div></td>
      <td class="when">${stamp(latest.at)}</td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`;
  }).join("");
}

function fillCompanyOptions(selected) {
  const select = document.querySelector("#job-form select[name=company]");
  const names = [...new Set([...companies.map((company) => company.name), selected])];
  select.innerHTML = names.map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join("");
  select.value = selected;
}

function openJob(id) {
  const job = jobs.find((item) => item.id === id);
  const form = document.getElementById("job-form");
  form.dataset.id = id;
  fillCompanyOptions(job.company);
  ["title", "type", "exp", "location", "period", "posted", "expired", "description", "benefits"].forEach((name) => {
    form.elements[name].value = job[name] ?? "";
  });
  form.elements.min.value = trieuText(job.min);
  form.elements.max.value = trieuText(job.max);
  form.elements.max.setCustomValidity("");
  document.getElementById("public-job").href = `http://127.0.0.1:5173/jobs?keyword=${encodeURIComponent(job.title)}`;
  document.getElementById("job-mappings").innerHTML = job.mappings
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .map((mapping) => `
      <li>
        ${chips([mapping.domain])}
        <span class="when">${stamp(mapping.at)}</span>
        <span class="url" title="${esc(mapping.url)}">${esc(mapping.url)}</span>
      </li>`).join("");
  document.getElementById("editor").showModal();
  form.elements.title.focus();
}

async function deleteJob(id) {
  const job = jobs.find((item) => item.id === id);
  const ok = await confirmAction({
    title: "Gỡ tin này?",
    copy: `“${job.title}” sẽ bị gỡ khỏi danh sách việc làm.`,
  });
  if (!ok) return false;
  jobs.splice(jobs.findIndex((item) => item.id === id), 1);
  renderJobs();
  toast(`Đã gỡ ${job.title}.`);
  return true;
}

function saveJob(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const min = trieuNumber(form.elements.min.value);
  const max = trieuNumber(form.elements.max.value);
  const minBad = Number.isNaN(min);
  const maxBad = Number.isNaN(max);
  form.elements.min.setCustomValidity(minBad ? "Nhập số triệu, ví dụ 25 hoặc 25,5." : "");
  form.elements.max.setCustomValidity(
    maxBad ? "Nhập số triệu, ví dụ 25 hoặc 25,5." : (min && max && max < min ? "Mức trần đang thấp hơn mức sàn." : "")
  );
  if (!form.reportValidity()) return;
  const job = jobs.find((item) => item.id === form.dataset.id);
  job.title = form.elements.title.value.trim();
  job.company = form.elements.company.value;
  job.type = form.elements.type.value;
  job.exp = Number(form.elements.exp.value || 0);
  job.location = form.elements.location.value.trim();
  job.min = min;
  job.max = max;
  job.currency = "VND";
  job.period = form.elements.period.value;
  job.posted = form.elements.posted.value;
  job.expired = form.elements.expired.value;
  job.description = form.elements.description.value.trim();
  job.benefits = form.elements.benefits.value.trim();
  document.getElementById("editor").close();
  renderJobs();
  toast(`Đã lưu “${job.title}”.`);
}

function renderCompanies() {
  const query = document.getElementById("company-q").value.trim().toLowerCase();
  const matched = companies.filter((company) => company.name.toLowerCase().includes(query));
  document.getElementById("company-count").textContent = `Đang hiện ${matched.length} / ${companies.length} công ty`;
  const body = document.getElementById("company-rows");
  if (!matched.length) {
    body.innerHTML = `<tr><td class="empty" colspan="5">Không có công ty nào khớp.</td></tr>`;
    return;
  }
  body.innerHTML = matched.map((company) => `
    <tr data-id="${company.id}">
      <td>
        <div class="who">
          <span class="mono-mark" style="background:${swatch(company.name)}">${company.logo ? `<img alt="" src="${esc(company.logo)}">` : esc(initials(company.name))}</span>
          <a class="row-link" href="jobs.html?company=${encodeURIComponent(company.name)}">${esc(company.name)}</a>
        </div>
      </td>
      <td>${fmt.format(company.jobs)}</td>
      <td><div class="sources">${chips(company.sources)}</div></td>
      <td class="when">${stamp(company.crawled)}</td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("");
}

function previewLogo() {
  const form = document.getElementById("company-form");
  const name = form.elements.name.value.trim() || "Công ty";
  const logo = form.elements.logo.value.trim();
  const mark = document.getElementById("logo-preview");
  document.getElementById("company-preview-name").textContent = name;
  mark.style.background = swatch(name);
  if (!logo) {
    mark.textContent = initials(name);
    return;
  }
  mark.innerHTML = `<img alt="" src="${esc(logo)}">`;
  mark.querySelector("img").addEventListener("error", () => {
    mark.textContent = initials(name);
  });
}

function openCompany(id) {
  const company = companies.find((item) => item.id === id);
  const form = document.getElementById("company-form");
  form.dataset.id = id;
  form.elements.name.value = company.name;
  form.elements.logo.value = company.logo;
  document.getElementById("company-facts").textContent = `${fmt.format(company.jobs)} tin · crawl ${stamp(company.crawled)} · ${company.sources.join(", ")}`;
  previewLogo();
  document.getElementById("editor").showModal();
  form.elements.name.focus();
}

async function deleteCompany(id) {
  const company = companies.find((item) => item.id === id);
  const ok = await confirmAction({
    title: "Gỡ công ty này?",
    copy: `“${company.name}” sẽ bị gỡ khỏi danh sách. Tin việc làm không mất theo.`,
  });
  if (!ok) return false;
  companies.splice(companies.findIndex((item) => item.id === id), 1);
  renderCompanies();
  toast(`Đã gỡ ${company.name}.`);
  return true;
}

function saveCompany(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const company = companies.find((item) => item.id === form.dataset.id);
  company.name = form.elements.name.value.trim();
  company.logo = form.elements.logo.value.trim();
  document.getElementById("editor").close();
  renderCompanies();
  toast(`Đã lưu “${company.name}”.`);
}

function bindDialog(dialog) {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
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

function bootJobs() {
  const params = new URLSearchParams(window.location.search);
  jobScope.company = params.get("company") || "";
  jobScope.category = params.get("category") || "";
  jobScope.crawled = params.get("crawled") || "";
  jobScope.term = params.get("term") || "";
  const source = params.get("source");
  if (source) document.getElementById("source").value = source;
  document.querySelectorAll("#job-seg button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.term === jobScope.term));
  });
  renderJobs();
  document.getElementById("q").addEventListener("input", renderJobs);
  document.getElementById("source").addEventListener("change", renderJobs);
  document.getElementById("sort").addEventListener("change", renderJobs);
  document.getElementById("job-seg").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    jobScope.term = button.dataset.term;
    document.querySelectorAll("#job-seg button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderJobs();
  });
  document.getElementById("job-scope").addEventListener("click", (event) => {
    if (event.target.dataset.action !== "clear-scope") return;
    jobScope.company = "";
    jobScope.category = "";
    jobScope.crawled = "";
    const url = new URL(window.location.href);
    ["company", "category", "crawled", "job"].forEach((key) => url.searchParams.delete(key));
    history.replaceState(null, "", url);
    renderJobs();
  });
  document.getElementById("job-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.action !== "edit") return;
    openJob(button.closest("tr").dataset.id);
  });
  const jobForm = document.getElementById("job-form");
  jobForm.addEventListener("submit", saveJob);
  document.getElementById("delete-job").addEventListener("click", async () => {
    const removed = await deleteJob(jobForm.dataset.id);
    if (removed) document.getElementById("editor").close();
  });
  ["min", "max"].forEach((name) => {
    jobForm.elements[name].addEventListener("input", () => {
      jobForm.elements.min.setCustomValidity("");
      jobForm.elements.max.setCustomValidity("");
    });
  });
  document.querySelector("#editor [data-close]").addEventListener("click", () => {
    document.getElementById("editor").close();
  });
  bindDialog(document.getElementById("editor"));
  bindDialog(document.getElementById("confirm"));
  const openId = params.get("job");
  if (openId && jobs.some((job) => job.id === openId)) openJob(openId);
}

function bootCompanies() {
  renderCompanies();
  document.getElementById("company-q").addEventListener("input", renderCompanies);
  document.getElementById("company-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.action !== "edit") return;
    openCompany(button.closest("tr").dataset.id);
  });
  document.getElementById("company-form").addEventListener("submit", saveCompany);
  document.getElementById("delete-company").addEventListener("click", async () => {
    const form = document.getElementById("company-form");
    const removed = await deleteCompany(form.dataset.id);
    if (removed) document.getElementById("editor").close();
  });
  document.getElementById("company-form").elements.name.addEventListener("input", previewLogo);
  document.getElementById("company-form").elements.logo.addEventListener("input", previewLogo);
  document.querySelector("#editor [data-close]").addEventListener("click", () => {
    document.getElementById("editor").close();
  });
  bindDialog(document.getElementById("editor"));
  bindDialog(document.getElementById("confirm"));
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
    preference: { titles: ["Product Designer"], types: ["Toàn thời gian"], remote: false, min: 20000000, max: 32000000, provinces: ["TP.HCM"], open: true },
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
    preference: { titles: ["Data Analyst"], types: ["Toàn thời gian"], remote: true, min: null, max: null, provinces: ["TP.HCM", "Hà Nội"], open: false },
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

const sources = [
  { id: "s1", name: "TopCV", domain: "topcv.vn", connected: true, enabled: true, last: "2026-10-19T06:14", volume: 2757 },
  { id: "s2", name: "ITviec", domain: "itviec.com", connected: true, enabled: true, last: "2026-10-19T05:40", volume: 1384 },
  { id: "s3", name: "VietnamWorks", domain: "vietnamworks.com", connected: false, enabled: false, last: null, volume: null },
  { id: "s4", name: "Joboko", domain: "joboko.com", connected: false, enabled: false, last: null, volume: null },
];

const categories = [
  { id: "cat1", name: "Công nghệ thông tin", parent: "", jobs: 214 },
  { id: "cat2", name: "Backend", parent: "cat1", jobs: 86 },
  { id: "cat3", name: "Frontend", parent: "cat1", jobs: 74 },
  { id: "cat4", name: "Dữ liệu", parent: "cat1", jobs: 28 },
  { id: "cat5", name: "Vận hành", parent: "cat1", jobs: 19 },
  { id: "cat6", name: "Kiểm thử", parent: "cat1", jobs: 7 },
  { id: "cat7", name: "Kinh doanh", parent: "", jobs: 41 },
  { id: "cat8", name: "Nhân sự", parent: "cat7", jobs: 16 },
];

const skills = [
  { id: "sk1", name: "Java", aliases: ["java", "j2ee"] },
  { id: "sk2", name: "Spring", aliases: ["spring boot"] },
  { id: "sk3", name: "React", aliases: ["reactjs", "react.js"] },
  { id: "sk4", name: "SQL", aliases: ["postgresql"] },
  { id: "sk5", name: "Docker", aliases: [] },
  { id: "sk6", name: "Figma", aliases: [] },
  { id: "sk7", name: "Python", aliases: ["py"] },
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

function emptyUserCopy(status, cv) {
  if (status === "SUSPENDED") return "Không có tài khoản đã khóa.";
  if (status === "DELETED") return "Không có tài khoản đã xóa.";
  if (status === "ACTIVE") return "Không có tài khoản đang dùng.";
  if (cv === "yes") return "Không có tài khoản đã có CV.";
  if (cv === "no") return "Không có tài khoản chưa có CV.";
  return "Không có tài khoản khớp bộ lọc.";
}

function lockLabel(account) {
  if (account.status === "DELETED") return "";
  const label = account.status === "SUSPENDED" ? "Mở khóa" : "Khóa";
  return `<button class="linkish" type="button" data-action="lock">${label}</button>`;
}

function renderUsers() {
  const query = document.getElementById("user-q").value.trim().toLowerCase();
  const role = document.getElementById("user-role").value;
  const status = document.getElementById("user-status").value;
  const cv = document.getElementById("user-cv").value;
  const matched = accounts.filter((account) => {
    const haystack = `${account.name} ${account.email}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (role && account.role !== role) return false;
    if (status && account.status !== status) return false;
    if (cv === "yes" && !account.cv) return false;
    if (cv === "no" && account.cv) return false;
    return true;
  });
  document.getElementById("user-count").textContent = `Đang hiện ${matched.length} / ${accounts.length} tài khoản`;
  const body = document.getElementById("user-rows");
  if (!matched.length) {
    body.innerHTML = `<tr><td class="empty" colspan="6">${esc(emptyUserCopy(status, cv))}</td></tr>`;
    return;
  }
  body.innerHTML = matched.map((account) => `
    <tr data-id="${account.id}">
      <td>
        <div class="who">
          <span class="mono-mark">${esc(initials(account.name))}</span>
          <span>
            <button class="name-btn" type="button" data-action="edit">${esc(account.name)}</button>
            <span class="sub">${esc(account.email)}${account.verified ? "" : " · chưa xác minh"}</span>
          </span>
        </div>
      </td>
      <td>${ROLE_LABEL[account.role]}</td>
      <td>${statusMark(account.status)}</td>
      <td>${account.cv ? "Có CV" : "Chưa có"}</td>
      <td class="when">${account.login ? stamp(account.login) : "—"}</td>
      <td class="actions">${lockLabel(account)}<button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("");
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

function saveUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const account = accounts.find((item) => item.id === form.dataset.id);
  const nextRole = form.elements.role.value;
  const nextStatus = form.elements.status.value;
  const staysAdmin = nextRole === "ADMIN" && nextStatus !== "DELETED";
  const livingAdmins = accounts.filter((item) => item.id !== account.id && item.role === "ADMIN" && item.status !== "DELETED");
  if (account.role === "ADMIN" && account.status !== "DELETED" && !staysAdmin && livingAdmins.length === 0) {
    toast("Cần giữ ít nhất một quản trị đang dùng.");
    return;
  }
  account.name = form.elements.name.value.trim();
  account.role = nextRole;
  account.status = nextStatus;
  document.getElementById("editor").close();
  renderUsers();
  toast(`Đã lưu “${account.name}”.`);
}

function livingAdmins(exceptId) {
  return accounts.filter((item) => item.id !== exceptId && item.role === "ADMIN" && item.status === "ACTIVE");
}

async function lockUser(id) {
  const account = accounts.find((item) => item.id === id);
  if (!account || account.status === "DELETED") return;
  const next = account.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
  if (account.role === "ADMIN" && account.status === "ACTIVE" && next === "SUSPENDED" && livingAdmins(account.id).length === 0) {
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

function bootUsers() {
  renderUsers();
  document.getElementById("user-q").addEventListener("input", renderUsers);
  document.getElementById("user-role").addEventListener("change", renderUsers);
  document.getElementById("user-status").addEventListener("change", renderUsers);
  document.getElementById("user-cv").addEventListener("change", renderUsers);
  document.getElementById("user-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const id = button.closest("tr").dataset.id;
    if (button.dataset.action === "edit") openUser(id);
    if (button.dataset.action === "lock") lockUser(id);
  });
  document.getElementById("user-form").addEventListener("submit", saveUser);
  document.querySelector("#editor [data-close]").addEventListener("click", () => {
    document.getElementById("editor").close();
  });
  bindDialog(document.getElementById("editor"));
  bindDialog(document.getElementById("confirm"));
}

function sourceState(source) {
  if (!source.connected) return `<span class="state state--muted"><i></i>Chưa kết nối</span>`;
  if (!source.enabled) return `<span class="state state--off"><i></i>Đang tắt</span>`;
  return `<span class="state"><i></i>Đang chạy</span>`;
}

function renderSources() {
  document.getElementById("source-rows").innerHTML = sources.map((source) => `
    <tr data-id="${source.id}">
      <td><span class="name">${esc(source.name)}</span><span class="sub">${esc(source.domain)}</span></td>
      <td>${sourceState(source)}</td>
      <td class="when">${source.last ? stamp(source.last) : "—"}</td>
      <td>${source.volume == null ? "—" : fmt.format(source.volume)}</td>
      <td>${source.connected
        ? `<button class="toggle" type="button" data-action="toggle" aria-pressed="${source.enabled ? "true" : "false"}" aria-label="${source.enabled ? "Tắt" : "Bật"} ${esc(source.name)}"></button>`
        : "—"}</td>
      <td class="actions">${source.connected
        ? `<a class="text-link" href="jobs.html?source=${encodeURIComponent(source.domain)}">Xem tin</a>`
        : ""}</td>
    </tr>`).join("");
}

async function toggleSource(id) {
  const source = sources.find((item) => item.id === id);
  if (!source.connected) return;
  if (source.enabled) {
    const ok = await confirmAction({
      title: `Tắt ${source.name}?`,
      copy: `Nguồn ngừng nhận tin mới. ${fmt.format(source.volume)} dòng trong 30 ngày vẫn giữ trên Tổng quan.`,
      ok: "Tắt",
      cancel: "Giữ chạy",
    });
    if (!ok) return;
  }
  source.enabled = !source.enabled;
  renderSources();
  toast(source.enabled ? `Đã bật ${source.name}.` : `Đã tắt ${source.name}.`);
}

function bootSources() {
  renderSources();
  document.getElementById("source-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    toggleSource(button.closest("tr").dataset.id);
  });
  bindDialog(document.getElementById("confirm"));
}

function orderedCategories() {
  const rows = [];
  categories.filter((item) => !item.parent).forEach((root) => {
    rows.push(root);
    categories.filter((item) => item.parent === root.id).forEach((child) => rows.push(child));
  });
  categories.forEach((item) => {
    if (!rows.includes(item)) rows.push(item);
  });
  return rows;
}

function categoryName(id) {
  return categories.find((item) => item.id === id)?.name || "—";
}

function renderCategories() {
  document.getElementById("category-rows").innerHTML = orderedCategories().map((category) => `
    <tr data-id="${category.id}">
      <td><button class="name-btn${category.parent ? " child-name" : ""}" type="button" data-action="edit">${esc(category.name)}</button></td>
      <td>${category.parent ? esc(categoryName(category.parent)) : "—"}</td>
      <td><a class="text-link" href="jobs.html?category=${encodeURIComponent(category.name)}">${fmt.format(category.jobs)}</a></td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("");
}

function fillCategoryParents(selectedId, parentId) {
  const select = document.querySelector("#category-form select[name=parent]");
  const blocked = new Set();
  if (selectedId) {
    blocked.add(selectedId);
    categories.forEach((item) => {
      if (item.parent === selectedId) blocked.add(item.id);
    });
  }
  const options = [`<option value="">Không thuộc mục nào</option>`].concat(
    categories
      .filter((item) => !blocked.has(item.id))
      .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`),
  );
  select.innerHTML = options.join("");
  select.value = parentId || "";
}

function openCategory(id) {
  const form = document.getElementById("category-form");
  const category = id ? categories.find((item) => item.id === id) : null;
  form.dataset.id = id || "";
  form.elements.name.value = category ? category.name : "";
  fillCategoryParents(id || "", category ? category.parent : "");
  document.getElementById("category-heading").textContent = category ? "Sửa danh mục" : "Thêm danh mục";
  document.getElementById("delete-category").hidden = !category;
  document.getElementById("category-editor").showModal();
  form.elements.name.focus();
}

function saveCategory(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const parent = form.elements.parent.value;
  if (form.dataset.id) {
    const category = categories.find((item) => item.id === form.dataset.id);
    category.name = name;
    category.parent = parent;
  } else {
    categories.push({ id: `cat-${Date.now()}`, name, parent, jobs: 0 });
  }
  document.getElementById("category-editor").close();
  renderCategories();
  toast(`Đã lưu “${name}”.`);
}

async function deleteCategory(id) {
  const category = categories.find((item) => item.id === id);
  if (!category) return false;
  if (categories.some((item) => item.parent === id)) {
    toast("Còn danh mục con. Gỡ những mục đó trước.");
    return false;
  }
  const ok = await confirmAction({
    title: "Gỡ danh mục này?",
    copy: `“${category.name}” sẽ bị gỡ khỏi danh sách. Tin đã gán không mất theo.`,
  });
  if (!ok) return false;
  categories.splice(categories.findIndex((item) => item.id === id), 1);
  renderCategories();
  toast(`Đã gỡ ${category.name}.`);
  return true;
}

function renderSkills() {
  const query = document.getElementById("skill-q").value.trim().toLowerCase();
  const matched = skills.filter((skill) => {
    if (!query) return true;
    const haystack = [skill.name, ...skill.aliases].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  const body = document.getElementById("skill-rows");
  if (!matched.length) {
    body.innerHTML = `<tr><td class="empty" colspan="4">Không có kỹ năng khớp “${esc(query)}”.</td></tr>`;
    return;
  }
  body.innerHTML = matched.map((skill) => `
    <tr data-id="${skill.id}">
      <td><button class="name-btn" type="button" data-action="edit">${esc(skill.name)}</button></td>
      <td>${esc(normalizeName(skill.name))}</td>
      <td>${skill.aliases.length ? esc(skill.aliases.join(", ")) : "—"}</td>
      <td class="actions"><button class="linkish" type="button" data-action="edit">Sửa</button></td>
    </tr>`).join("");
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

function openSkill(id) {
  const form = document.getElementById("skill-form");
  const skill = id ? skills.find((item) => item.id === id) : null;
  form.dataset.id = id || "";
  form.elements.name.value = skill ? skill.name : "";
  form.elements.aliases.value = skill ? skill.aliases.join(", ") : "";
  document.getElementById("skill-heading").textContent = skill ? "Sửa kỹ năng" : "Thêm kỹ năng";
  document.getElementById("delete-skill").hidden = !skill;
  showSkillKey();
  document.getElementById("skill-editor").showModal();
  form.elements.name.focus();
}

function saveSkill(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const exceptId = form.dataset.id;
  if (takenAlias(name, exceptId)) {
    toast("Tên này đã là một kỹ năng hoặc tên gọi khác.");
    return;
  }
  const aliases = [];
  form.elements.aliases.value.split(",").forEach((part) => {
    const alias = part.trim();
    if (!alias || normalizeName(alias) === normalizeName(name)) return;
    if (takenAlias(alias, exceptId) || aliases.some((item) => normalizeName(item) === normalizeName(alias))) return;
    aliases.push(alias);
  });
  if (exceptId) {
    const skill = skills.find((item) => item.id === exceptId);
    skill.name = name;
    skill.aliases = aliases;
  } else {
    skills.push({ id: `sk-${Date.now()}`, name, aliases });
  }
  document.getElementById("skill-editor").close();
  renderSkills();
  toast(`Đã lưu “${name}”.`);
}

async function deleteSkill(id) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return false;
  const ok = await confirmAction({
    title: "Gỡ kỹ năng này?",
    copy: `“${skill.name}” và tên gọi khác của nó sẽ bị gỡ khỏi danh sách.`,
  });
  if (!ok) return false;
  skills.splice(skills.findIndex((item) => item.id === id), 1);
  renderSkills();
  toast(`Đã gỡ ${skill.name}.`);
  return true;
}

function bootCatalog() {
  renderCategories();
  renderSkills();
  document.getElementById("add-category").addEventListener("click", () => openCategory(""));
  document.getElementById("add-skill").addEventListener("click", () => openSkill(""));
  document.getElementById("skill-q").addEventListener("input", renderSkills);
  document.getElementById("category-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.action !== "edit") return;
    openCategory(button.closest("tr").dataset.id);
  });
  document.getElementById("skill-rows").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.action !== "edit") return;
    openSkill(button.closest("tr").dataset.id);
  });
  document.getElementById("delete-category").addEventListener("click", async () => {
    const id = document.getElementById("category-form").dataset.id;
    if (await deleteCategory(id)) document.getElementById("category-editor").close();
  });
  document.getElementById("delete-skill").addEventListener("click", async () => {
    const id = document.getElementById("skill-form").dataset.id;
    if (await deleteSkill(id)) document.getElementById("skill-editor").close();
  });
  document.getElementById("category-form").addEventListener("submit", saveCategory);
  document.getElementById("skill-form").addEventListener("submit", saveSkill);
  document.getElementById("skill-form").elements.name.addEventListener("input", showSkillKey);
  document.querySelectorAll("dialog [data-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  document.querySelectorAll("dialog.drawer, dialog.editor, #confirm").forEach((dialog) => bindDialog(dialog));
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "overview") bootOverview();
  if (page === "jobs") bootJobs();
  if (page === "companies") bootCompanies();
  if (page === "login") bootLogin();
  if (page === "users") bootUsers();
  if (page === "sources") bootSources();
  if (page === "catalog") bootCatalog();
});
