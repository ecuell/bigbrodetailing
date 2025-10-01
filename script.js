/* script.js - small interactive behaviors for Big Bro Detailing */

document.addEventListener("DOMContentLoaded", () => {
  /* NAV - mobile toggle */
  const navToggle = document.querySelector(".nav-toggle");
  const navRight = document.querySelector(".nav-right");

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navRight.classList.toggle("show");
  });

  /* Cards - toggle details */
  document.querySelectorAll(".toggle-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const details = btn.nextElementSibling;
      if (!details) return;
      const isOpen = details.style.display === "block";
      details.style.display = isOpen ? "none" : "block";
      btn.textContent = isOpen ? "Show details ▾" : "Hide details ▴";
    });
  });

  /* Year in footer */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Populate models by make and live quote */
  const carModels = {
    Toyota: ["Corolla", "Camry", "RAV4", "Prius", "Highlander"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot"],
    Ford: ["F-150", "Escape", "Explorer", "Mustang"],
    BMW: ["3 Series", "5 Series", "X3", "X5"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLA", "GLE"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Jeep: ["Wrangler", "Cherokee", "Grand Cherokee"],
    Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe"],
  };

  // approximate size categories by model keywords
  function guessSize(make, model) {
    if (!model) return "standard";
    const small = ["Corolla", "Civic", "Prius", "Malibu", "Model 3"];
    const midsize = ["Camry", "Accord", "Mustang", "Model S", "Model Y"];
    const suv = [
      "RAV4",
      "CR-V",
      "Escape",
      "Explorer",
      "X5",
      "GLA",
      "GLE",
      "Highlander",
      "Pilot",
      "Tahoe",
      "Equinox",
      "Grand Cherokee",
      "Wrangler",
    ];
    const truck = ["F-150", "Silverado"];
    if (small.includes(model)) return "compact";
    if (midsize.includes(model)) return "midsize";
    if (suv.includes(model)) return "suv";
    if (truck.includes(model)) return "truck";
    // fallback: check keywords
    if (
      model.toLowerCase().includes("x") ||
      model.toLowerCase().includes("series")
    )
      return "suv";
    return "standard";
  }

  // base prices for packages (these will be used for quote calc)
  const basePrices = {
    Exterior: 100,
    Interior: 169,
    "Signature Duo": 229,
  };

  // size multipliers
  const sizeAdjustment = {
    compact: 0.95,
    standard: 1,
    midsize: 1.08,
    suv: 1.15,
    truck: 1.18,
  };

  const makeSelect = document.getElementById("car-make");
  const modelSelect = document.getElementById("car-model");
  const packageSelect = document.getElementById("package");
  const quoteBox = document.getElementById("quote-box");
  const addonsFieldset = document.querySelector(".addons");
  const bookingForm = document.getElementById("booking-form");

  // when make changes populate model dropdown
  makeSelect.addEventListener("change", () => {
    const make = makeSelect.value;
    modelSelect.innerHTML = '<option value="">— Select Model —</option>';
    if (carModels[make]) {
      carModels[make].forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });
    } else if (make === "Other") {
      const opt = document.createElement("option");
      opt.value = "Other";
      opt.textContent = "Other";
      modelSelect.appendChild(opt);
    }
    updateQuote();
  });

  // update quote on multiple inputs
  ["change", "input"].forEach((evt) => {
    modelSelect.addEventListener(evt, updateQuote);
    packageSelect.addEventListener(evt, updateQuote);
    addonsFieldset.addEventListener("change", updateQuote);
  });

  function updateQuote() {
    const pkg = packageSelect.value;
    if (!pkg) {
      quoteBox.textContent = "Choose a package to see an estimated quote.";
      return;
    }
    const make = makeSelect.value;
    const model = modelSelect.value;
    const size = guessSize(make, model);
    let price = basePrices[pkg] || 0;
    // add-ons
    const addons = Array.from(
      document.querySelectorAll('input[name="addons"]:checked')
    ).map((i) => i.value);
    const addonPrices = {
      "Pet Hair Removal": 50,
      "Engine Bay Cleaning": 40,
      "Headlight Restoration": 60,
      "Ceramic Coating": 200,
    };
    const addonsTotal = addons.reduce((s, a) => s + (addonPrices[a] || 0), 0);
    // apply size multiplier
    const multiplier = sizeAdjustment[size] || 1;
    const subtotal = (price + addonsTotal) * multiplier;
    // round to nearest dollar
    const estimate = Math.round(subtotal);
    const sizeLabel = size.charAt(0).toUpperCase() + size.slice(1);
    quoteBox.innerHTML = `
        <strong>Estimated:</strong> $${estimate} <span style="color:#666">(${pkg}${
      addons.length ? " + add-ons" : ""
    })</span>
        <div style="font-size:0.9rem;color:#666;margin-top:6px">Vehicle size: ${sizeLabel} • Multiplier: ${multiplier}</div>
      `;
  }

  // basic form submit (demo)
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // simple validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pkg = packageSelect.value;
    if (!name || !email || !phone || !pkg) {
      document.getElementById("form-messages").textContent =
        "Please complete the required fields.";
      document.getElementById("form-messages").style.color = "crimson";
      return;
    }
    // show success (in real app, you'd send to server)
    document.getElementById("form-messages").style.color = "green";
    document.getElementById("form-messages").textContent = `Thanks ${
      name.split(" ")[0]
    } — we received your request. We'll follow up via email.`;
    bookingForm.reset();
    modelSelect.innerHTML = '<option value="">— Select Model —</option>';
    quoteBox.textContent =
      "Choose make, model, package and add-ons to see an estimated quote.";
  });

  // initial call to set quote prompt
  updateQuote();
});
/* Reviews section JS enhancements */
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll to reviews when "reviews" hash is clicked
  const reviewsLink = document.querySelector('a[href="#reviews"]');
  if (reviewsLink) {
    reviewsLink.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#reviews").scrollIntoView({ behavior: "smooth" });
    });
  }
});
// Before/After slider logic
document.querySelectorAll(".ba-container").forEach((container) => {
  const overlay = container.querySelector(".ba-overlay");
  const handle = container.querySelector(".ba-handle");

  let active = false;

  const startSlide = () => {
    active = true;
  };
  const endSlide = () => {
    active = false;
  };
  const moveSlide = (x) => {
    let rect = container.getBoundingClientRect();
    let position = Math.min(Math.max(0, x - rect.left), rect.width);
    let percent = (position / rect.width) * 100;
    overlay.style.width = percent + "%";
    handle.style.left = percent + "%";
  };

  container.addEventListener("mousedown", (e) => {
    startSlide();
    moveSlide(e.pageX);
  });
  container.addEventListener("mouseup", endSlide);
  container.addEventListener("mouseleave", endSlide);
  container.addEventListener("mousemove", (e) => {
    if (active) moveSlide(e.pageX);
  });

  container.addEventListener("touchstart", (e) => {
    startSlide();
    moveSlide(e.touches[0].pageX);
  });
  container.addEventListener("touchend", endSlide);
  container.addEventListener("touchcancel", endSlide);
  container.addEventListener("touchmove", (e) => {
    if (active) moveSlide(e.touches[0].pageX);
  });
});

// Carousel navigation
const carousel = document.querySelector(".ba-carousel");
const slides = document.querySelectorAll(".ba-slide");
let currentIndex = 0;

function showSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  currentIndex = index;
  carousel.scrollTo({
    left: carousel.offsetWidth * currentIndex,
    behavior: "smooth",
  });
}

document.querySelector(".ba-nav.prev").addEventListener("click", () => {
  showSlide(currentIndex - 1);
});
document.querySelector(".ba-nav.next").addEventListener("click", () => {
  showSlide(currentIndex + 1);
});
