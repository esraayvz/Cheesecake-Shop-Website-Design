document.addEventListener("DOMContentLoaded", function () {
  const isDarkMode = sessionStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDarkMode);

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    sessionStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  }

  const darkModeLink = document.getElementById("darkModeLink");
  if (darkModeLink) {
    darkModeLink.addEventListener("click", toggleDarkMode);
  }

  function updateTime() {
    const currentTimeElement = document.getElementById("current-time");
    if (!currentTimeElement) return;
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    currentTimeElement.textContent =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes;
  }

  updateTime();
  setInterval(updateTime, 1000);
});

function kontrolVeGonder() {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  let cevaplananSoruSayisi = 0;

  radioButtons.forEach(function (radioButton) {
    if (radioButton.checked) {
      cevaplananSoruSayisi++;
    }
  });

  if (cevaplananSoruSayisi === 0) {
    Swal.fire({
      icon: "warning",
      title: "Eksik anket",
      text: "En az bir soruyu cevaplamanız gerekmektedir.",
      confirmButtonText: "Tamam",
      confirmButtonColor: "rgb(99, 20, 0)",
      background: "#fffdf9",
      color: "#1a0a05",
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Teşekkürler!",
    text: "Ankete katıldığınız için teşekkür ederiz.",
    confirmButtonText: "Tamam",
    confirmButtonColor: "rgb(99, 20, 0)",
    background: "#fffdf9",
    color: "#1a0a05",
  }).then(function () {
    const anketContainer = document.getElementById("anketForm");
    if (anketContainer) {
      anketContainer.innerHTML =
        '<p class="anket-katildiniz">Ankete tekrar katılmak için sayfayı yenileyin!</p>';
    }
  });
}
