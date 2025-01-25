let isEnabled = true; // 팝업에서 받는 상태
let targetFont = "font-nanumStudent";
let toBeReplaced = "font-pretendard";

function changeClasses() {
  const elements = document.querySelectorAll(`.${targetFont}`);
  console.log("Found elements:", elements.length, elements);

  elements.forEach((element) => {
    try {
      element.classList.remove(targetFont);
      element.classList.add(toBeReplaced);
    } catch (e) {
      console.error("에러발생!!!!::::", e);
    }
  });
}

function revertClasses() {
  const elements = document.querySelectorAll(`.${toBeReplaced}`);
  elements.forEach((element) => {
    try {
      element.classList.remove(toBeReplaced);
      element.classList.add(targetFont);
    } catch (e) {
      console.error("Error reverting class:", e);
    }
  });
}

// DOM 변경 감지를 위한 MutationObserver 설정
const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  let shouldUpdate = mutations.some(
    (mutation) =>
      (mutation.type === "attributes" && mutation.attributeName === "class") ||
      mutation.type === "childList"
  );

  if (shouldUpdate) {
    setTimeout(changeClasses, 100);
  }
});

function initialize() {
  changeClasses();
  observer.observe(document.body, {
    childList: true, // 자식 요소 추가/제거 감지
    subtree: true, // 모든 하위 요소 감지
    attributes: true, // 속성 변경 감지
    attributeFilter: ["class"], // class 속성 변경만 감지
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initialize, 500);
  });
} else {
  initialize();
}

// 초기 상태 로드
chrome.storage.sync.get("isEnabled", function (data) {
  isEnabled = data.isEnabled ?? true;
});

// 스토리지 변경 감지
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;

    if (isEnabled) {
      initialize();
    } else {
      revertClasses();
    }
  }
});

window.addEventListener("load", () => {
  setTimeout(changeClasses, 3000);
});
