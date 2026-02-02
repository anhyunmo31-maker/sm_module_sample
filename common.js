// common.js (NAV 공통 로드 + 드롭다운 클릭 토글 + 폴더 경로 자동 보정)

document.addEventListener("DOMContentLoaded", () => {
  loadNav();
});

function loadNav() {
  const container = document.getElementById("nav-container");
  if (!container) return;

  // 현재 페이지 깊이 계산
  // 예)
  //  - /sm_module_sample/index.html          -> depth 1(or 0 depending) but we treat by last segment
  //  - /sm_module_sample/info/biz_owner.html -> depth 2
  // 아래 방식은 "파일이 있는 폴더 깊이"만큼 ../ 붙이기 위한 계산
  const parts = location.pathname.split("/").filter(Boolean);
  const depth = Math.max(0, parts.length - 1); // 마지막은 파일명
  const prefix = depth > 1 ? "../".repeat(depth - 1) : ""; 
  // 위: repo가 /sm_module_sample/ 처럼 한 단계 더 있을 수 있어서 -1 보정

  // nav.html 로드 (폴더에서도 동작)
  fetch(prefix + "nav.html")
    .then(res => {
      if (!res.ok) throw new Error("nav.html load failed: " + res.status);
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;

      // nav 안 링크 경로 보정: 폴더 페이지에서 클릭해도 깨지지 않게
      container.querySelectorAll("a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href) return;

        // 외부링크/앵커/이미 절대경로/이미 ../ 있는 건 건드리지 않음
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("#") ||
          href.startsWith("/") ||
          href.startsWith("../")
        ) return;

        a.setAttribute("href", prefix + href);
      });

      // 브랜드(로고) 클릭 홈 이동도 보정(페이지마다 inline onclick 없어도 됨)
      const brand = document.querySelector(".brand");
      if (brand) {
        brand.onclick = () => (location.href = prefix + "index.html");
      }

      bindNavDropdown();
    })
    .catch(err => {
      // nav가 로드 안 되어도 본문은 보이게
      console.error(err);
    });
}

function bindNavDropdown() {
  const navItems = document.querySelectorAll("nav .nav-item");
  if (!navItems.length) return;

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      // 드롭다운 안 링크 클릭이면 이동 허용
      const link = e.target.closest("a");
      if (link) return;

      e.stopPropagation();

      // 다른 메뉴 닫기
      navItems.forEach(x => {
        if (x !== item) x.classList.remove("open");
      });

      // 토글
      item.classList.toggle("open");
    });
  });

  // 바깥 클릭 시 닫기
  document.addEventListener("click", () => {
    navItems.forEach(x => x.classList.remove("open"));
  });
}
