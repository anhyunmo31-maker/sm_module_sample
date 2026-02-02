// 네비 드롭다운: 클릭으로 열고/닫기 (hover 끊김 문제 해결)
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll("nav .nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      // 드롭다운 안 링크 클릭이면 이동 허용
      const link = e.target.closest("a");
      if (link) return;

      e.stopPropagation();

      // 다른 메뉴 닫기
      navItems.forEach(x => { if (x !== item) x.classList.remove("open"); });

      // 토글
      item.classList.toggle("open");
    });
  });

  // 바깥 클릭 시 닫기
  document.addEventListener("click", () => {
    navItems.forEach(x => x.classList.remove("open"));
  });
});

document.addEventListener("DOMContentLoaded", () => {

  // 🔹 공통 nav 로드
  fetch("nav.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("nav-container").innerHTML = html;

      // nav가 로드된 이후에 드롭다운 이벤트 다시 바인딩
      bindNavDropdown();
    });

});

/* 🔽 기존 드롭다운 로직을 함수로 분리 */
function bindNavDropdown(){
  const navItems = document.querySelectorAll("nav .nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link) return;

      e.stopPropagation();

      navItems.forEach(x => {
        if (x !== item) x.classList.remove("open");
      });

      item.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    navItems.forEach(x => x.classList.remove("open"));
  });
}
