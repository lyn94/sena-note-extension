let isEnabled = true; // 익스텐션 팝업에서 상태 변경

// 클래스 변경
function changeClasses() {
  const elements = document.querySelectorAll(".font-nanumStudent");
  console.log("Found elements:", elements.length, elements);

  elements.forEach((element) => {
    console.log("Processing element:", element.tagName, element);
    try {
      element.classList.remove("font-nanumStudent");
      element.classList.add("font-pretendard");
    } catch (e) {
      console.error("Error changing class:", e);
    }
  });
}

// DOM 변경 감지를 위한 MutationObserver 설정
const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  let shouldUpdate = false;
  mutations.forEach((mutation) => {
    // class 속성이 변경되었거나 새로운 노드가 추가된 경우
    if (
      (mutation.type === "attributes" && mutation.attributeName === "class") ||
      mutation.type === "childList"
    ) {
      shouldUpdate = true;
    }
  });

  if (shouldUpdate) {
    setTimeout(changeClasses, 100);
  }
});

// 초기 설정
function initialize() {
  console.log("Initializing class changer...");

  changeClasses();

  // DOM 변경 감지 시작
  observer.observe(document.body, {
    childList: true, // 자식 요소 추가/제거 감지
    subtree: true, // 모든 하위 요소 감지
    attributes: true, // 속성 변경 감지
    attributeFilter: ["class"], // class 속성 변경만 감지
  });
}

// 페이지 로드 완료 후 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    setTimeout(initialize, 500);
  });
} else {
  initialize();
}

// 스토리지 상태 확인 및 초기화
chrome.storage.sync.get("isEnabled", function (data) {
  isEnabled = data.isEnabled ?? true;
});

// 스토리지 변경 감지
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;
    if (isEnabled) {
      initialize();
    }
  }
});

// 1초마다 isEnabled 상태인지 확인
setInterval(() => {
  if (isEnabled) {
    changeClasses();
  }
}, 1000); // 1초마다 확인

// 페이지가 완전히 로드된 후 한 번 더 실행
window.addEventListener("load", () => {
  console.log("로드 완료");
  setTimeout(changeClasses, 3000);
});
