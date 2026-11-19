const productPrices = {
  "Orjinal Cheesecake": 80,
  "Çikolatalı Cheesecake": 110,
  "Çikolata Soslu San Sebastian Cheesecake": 130,
  "Limonlu Cheesecake": 110,
  "Frambuazlı Cheesecake": 120,
  "Yaban Mersinli Cheesecake": 120,
  "Oreolu Cheesecake": 150,
  "Lotuslu Cheesecake": 150,
  "Kurabiyeli Cheesecake": 150,
  "Brownie Cheesecake": 130,
};

let cart = [];

const swalTheme = {
  confirmButtonText: "Tamam",
  confirmButtonColor: "rgb(99, 20, 0)",
  background: "#fffdf9",
  color: "#1a0a05",
};

function showAlert(icon, title, text) {
  return Swal.fire({
    icon: icon,
    title: title,
    text: text,
    ...swalTheme,
  });
}

function addToCart() {
  const productSelection = document.getElementById("productSelection");
  if (!productSelection || productSelection.selectedOptions.length === 0) {
    showAlert(
      "warning",
      "Ürün seçilmedi",
      "Sepete eklemek için en az bir ürün seçiniz."
    );
    return;
  }

  Array.from(productSelection.selectedOptions).forEach((option) => {
    const selectedProduct = option.value;
    const existingCartItem = cart.find(
      (item) => item.product === selectedProduct
    );

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cart.push({ product: selectedProduct, quantity: 1 });
    }
  });

  updateCartDisplay();
  productSelection.selectedIndex = -1;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartList = document.getElementById("cartList");
  const totalPriceElement = document.getElementById("totalPrice");
  const submitButton = document.getElementById("submitButton");

  if (!cartList || !totalPriceElement) return;

  cartList.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "cart-row";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cart-item-name";
    nameSpan.textContent = `${item.quantity} adet ${item.product}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.className = "remove-button";
    removeButton.onclick = () => removeFromCart(index);

    listItem.appendChild(nameSpan);
    listItem.appendChild(removeButton);
    cartList.appendChild(listItem);
    totalPrice += productPrices[item.product] * item.quantity;
  });

  totalPriceElement.textContent = `Toplam Fiyat: ${totalPrice} TL`;

  if (submitButton) {
    submitButton.disabled = cart.length === 0;
  }
}

function isValidName(value) {
  return /^[A-Za-zÇĞİÖŞÜçğıöşü\s'-]{2,40}$/.test(value.trim());
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** Türkiye cep / sabit: 10 hane (5XXXXXXXXX) veya 11 hane (05XXXXXXXXX) */
function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && /^[5][0-9]{9}$/.test(digits)) return true;
  if (digits.length === 11 && /^0[5][0-9]{9}$/.test(digits)) return true;
  return false;
}

function formatPhoneDisplay(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (!digits) return "";

  let result = "(" + digits.slice(0, 3);
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += " " + digits.slice(3, 6);
  if (digits.length > 6) result += " " + digits.slice(6, 8);
  if (digits.length > 8) result += " " + digits.slice(8, 10);
  return result;
}

function validateOrderForm() {
  const ad = document.getElementById("ad").value.trim();
  const soyad = document.getElementById("soyad").value.trim();
  const telefon = document.getElementById("telefon").value.trim();
  const eposta = document.getElementById("eposta").value.trim();
  const adres = document.getElementById("adres").value.trim();

  if (!ad || !soyad || !telefon || !eposta || !adres || cart.length === 0) {
    showAlert(
      "warning",
      "Eksik bilgi",
      "Zorunlu alanları lütfen doldurunuz."
    );
    return false;
  }

  if (!isValidName(ad) || !isValidName(soyad)) {
    showAlert(
      "error",
      "Geçersiz isim",
      "Ad ve soyad yalnızca harf içermeli ve en az 2 karakter olmalıdır."
    );
    return false;
  }

  if (!isValidPhone(telefon)) {
    showAlert(
      "error",
      "Geçersiz telefon",
      "Lütfen geçerli bir telefon numarası giriniz. Örnek: (555) 123 45 67"
    );
    return false;
  }

  if (!isValidEmail(eposta)) {
    showAlert(
      "error",
      "Geçersiz e-posta",
      "Lütfen geçerli bir e-posta adresi giriniz. Örnek: ornek@mail.com"
    );
    return false;
  }

  if (adres.length < 10) {
    showAlert(
      "error",
      "Eksik adres",
      "Lütfen teslimat için daha ayrıntılı bir adres yazınız."
    );
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  const telefonInput = document.getElementById("telefon");

  if (telefonInput) {
    telefonInput.addEventListener("input", function () {
      const caretAtEnd =
        telefonInput.selectionStart === telefonInput.value.length;
      telefonInput.value = formatPhoneDisplay(telefonInput.value);
      if (caretAtEnd) {
        const len = telefonInput.value.length;
        telefonInput.setSelectionRange(len, len);
      }
    });
  }

  if (orderForm) {
    orderForm.setAttribute("novalidate", "novalidate");

    orderForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateOrderForm()) return;

      const telefonInputEl = document.getElementById("telefon");
      telefonInputEl.value = formatPhoneDisplay(telefonInputEl.value);

      showAlert(
        "success",
        "Sipariş alındı",
        "Siparişiniz verilen adrese doğru yola çıkmıştır."
      ).then(function () {
        orderForm.reset();
        cart = [];
        updateCartDisplay();
      });
    });
  }

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
