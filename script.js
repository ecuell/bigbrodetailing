document.addEventListener("DOMContentLoaded", () => {
  /* NAV toggle */
  const navToggle = document.querySelector(".nav-toggle");
  const navRight = document.querySelector(".nav-right");
  navToggle.addEventListener("click", () => {
    navRight.classList.toggle("show");
  });
});

/* Toggle card details */
document.querySelectorAll(".toggle-details").forEach((btn) => {
  btn.addEventListener("click", () => {
    const details = btn.nextElementSibling;
    const isOpen = details.style.display === "block";
    details.style.display = isOpen ? "none" : "block";
    btn.textContent = isOpen ? "Show details ▾" : "Hide details ▴";
  });
});

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Car models + quote calc */
const carModels = {
  Acura: ["ILX", "TLX", "RDX", "MDX", "NSX"],
  AlfaRomeo: ["Giulia", "Stelvio", "Tonale"],
  AstonMartin: ["DB11", "DBX", "Vantage"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  Bentley: ["Continental", "Bentayga"],
  BMW: [
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "7 Series",
    "X3",
    "X5",
    "X7",
    "i3",
    "iX",
  ],
  Buick: ["Encore", "Envision", "Enclave", "Regal"],
  Cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"],
  Chevrolet: [
    "Spark",
    "Malibu",
    "Impala",
    "Camaro",
    "Equinox",
    "Traverse",
    "Tahoe",
    "Suburban",
    "Silverado",
  ],
  Chrysler: ["300", "Pacifica"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Ram 1500"],
  Fiat: ["500", "500X", "Punto"],
  Ford: ["Fusion", "Mustang", "Escape", "Explorer", "F-150", "Edge", "Bronco"],
  Genesis: ["G70", "G80", "G90", "GV70", "GV80"],
  GMC: ["Sierra", "Yukon", "Terrain", "Acadia"],
  Honda: ["Civic", "Accord", "Fit", "CR-V", "Pilot", "Odyssey", "Insight"],
  Hyundai: ["Elantra", "Sonata", "Santa Fe", "Tucson", "Kona", "Palisade"],
  Infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80"],
  Jaguar: ["XE", "XF", "F-Pace", "I-Pace"],
  Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade"],
  Kia: ["Rio", "Forte", "Soul", "Sportage", "Sorento", "Telluride", "K5"],
  LandRover: ["Range Rover", "Discovery", "Evoque"],
  Lexus: ["IS", "ES", "GS", "LS", "NX", "RX", "GX", "LX"],
  Lincoln: ["Corsair", "Aviator", "Navigator", "MKZ"],
  Maserati: ["Ghibli", "Levante", "Quattroporte"],
  Mazda: ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9"],
  "Mercedes-Benz": [
    "C-Class",
    "E-Class",
    "S-Class",
    "GLC",
    "GLE",
    "GLS",
    "A-Class",
  ],
  Mini: ["Cooper", "Countryman", "Clubman"],
  Mitsubishi: ["Mirage", "Outlander", "Eclipse Cross"],
  Nissan: [
    "Sentra",
    "Altima",
    "Maxima",
    "Leaf",
    "Rogue",
    "Murano",
    "Pathfinder",
    "Armada",
  ],
  Polestar: ["Polestar 1", "Polestar 2"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  Subaru: ["Impreza", "Legacy", "Crosstrek", "Forester", "Outback", "Ascent"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Toyota: [
    "Corolla",
    "Camry",
    "Prius",
    "RAV4",
    "Highlander",
    "Tacoma",
    "Tundra",
  ],
  Volkswagen: ["Jetta", "Passat", "Golf", "Tiguan", "Atlas", "ID.4"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
  // add more as needed...
};

const makeSelect = document.getElementById("car-make");
const modelSelect = document.getElementById("car-model");
makeSelect.addEventListener("change", () => {
  modelSelect.innerHTML = '<option value="">— Select Model —</option>';
  const selected = makeSelect.value;
  if (carModels[selected]) {
    carModels[selected].forEach((model) => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  }
});

const packagePrices = { Exterior: 100, Interior: 169, "Signature Duo": 229 };
const addonPrices = {
  "Pet Hair Removal": 50,
  "Engine Bay Cleaning": 40,
  "Headlight Restoration": 60,
  "Ceramic Coating": 200,
};

const form = document.getElementById("booking-form");
const quoteBox = document.getElementById("quote-box");
form.addEventListener("change", () => {
  let total = 0;
  const pkg = form.package.value;
  if (packagePrices[pkg]) total += packagePrices[pkg];
  const addons = [...form.querySelectorAll("input[name='addons']:checked")];
  addons.forEach((a) => (total += addonPrices[a.value] || 0));
  if (pkg) {
    quoteBox.textContent = `Estimated total: $${total}+`;
  } else {
    quoteBox.textContent =
      "Choose make, model, package and add-ons to see an estimated quote.";
  }
});

/* Form submit */
const messages = document.getElementById("form-messages");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  messages.textContent = "Thanks! Your request has been submitted.";
  form.reset();
  quoteBox.textContent =
    "Choose make, model, package and add-ons to see an estimated quote.";
});
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
