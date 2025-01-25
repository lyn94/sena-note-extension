document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");

  // 저장된 상태 불러오기
  chrome.storage.sync.get("isEnabled", function (data) {
    toggleSwitch.checked = data.isEnabled ?? true;
  });

  // 상태 변경 시 저장
  toggleSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({
      isEnabled: toggleSwitch.checked,
    });
  });
});
