// script.js
// Big Bro Detailing - full frontend behavior
// ---------------------------
// Features:
// - Package details toggle
// - Dynamic model dropdown based on selected make
// - Auto-detect car size (Sedan/Coupe, SUV/Truck, Full Size)
// - Live quote calculation based on package + size
// - Form validation + success message
// - Support for "Other" make (manual model input)

// ---------- DATA ----------
// Add more makes/models here as you like
const carData = {
    Toyota: [
      { model: "Corolla", size: "Sedan/Coupe" },
      { model: "Camry", size: "Sedan/Coupe" },
      { model: "Prius", size: "Sedan/Coupe" },
      { model: "RAV4", size: "SUV/Truck" },
      { model: "Highlander", size: "Full Size" },
      { model: "Tacoma", size: "Truck" }
    ],
    Honda: [
      { model: "Civic", size: "Sedan/Coupe" },
      { model: "Accord", size: "Sedan/Coupe" },
      { model: "Insight", size: "Sedan/Coupe" },
      { model: "CR-V", size: "SUV/Truck" },
      { model: "Pilot", size: "Full Size" }
    ],
    Ford: [
      { model: "Focus", size: "Sedan/Coupe" },
      { model: "Fusion", size: "Sedan/Coupe" },
      { model: "Escape", size: "SUV/Truck" },
      { model: "Explorer", size: "Full Size" },
      { model: "F-150", size: "Truck" }
    ],
    Chevrolet: [
      { model: "Spark", size: "Sedan/Coupe" },
      { model: "Malibu", size: "Sedan/Coupe" },
      { model: "Equinox", size: "SUV/Truck" },
      { model: "Tahoe", size: "Full Size" },
      { model: "Silverado", size: "Truck" }
    ],
    BMW: [
      { model: "3 Series", size: "Sedan/Coupe" },
      { model: "5 Series", size: "Sedan/Coupe" },
      { model: "X3", size: "SUV/Truck" },
      { model: "X5", size: "Full Size" }
    ],
    "Mercedes-Benz": [
      { model: "C-Class", size: "Sedan/Coupe" },
      { model: "E-Class", size: "Sedan/Coupe" },
      { model: "GLC", size: "SUV/Truck" },
      { model: "GLE", size: "Full Size" }
    ],
    Audi: [
      { model: "A3", size: "Sedan/Coupe" },
      { model: "A4", size: "Sedan/Coupe" },
      { model: "Q5", size: "SUV/Truck" },
      { model: "Q7", size: "Full Size" }
    ],
    Tesla: [
      { model: "Model 3", size: "Sedan/Coupe" },
      { model: "Model S", size: "Sedan/Coupe" },
      { model: "Model X", size: "Full Size" },
      { model: "Model Y", size: "SUV/Truck" }
    ],
    Jeep: [
      { model: "Wrangler", size: "SUV/Truck" },
      { model: "Cherokee", size: "SUV/Truck" },
      { model: "Grand Cherokee", size: "Full Size" }
    ],
    Hyundai: [
      { model: "Accent", size: "Sedan/Coupe" },
      { model: "Elantra", size: "Sedan/Coupe" },
      { model: "Tucson", size: "SUV/Truck" },
      { model: "Santa Fe", size: "Full Size" }
    ],
    Kia: [
      { model: "Rio", size: "Sedan/Coupe" },
      { model: "Forte", size: "Sedan/Coupe" },
      { model: "Sportage", size: "SUV/Truck" },
      { model: "Sorento", size: "Full Size" }
    ],
    Nissan: [
      { model: "Sentra", size: "Sedan/Coupe" },
      { model: "Altima", size: "Sedan/Coupe" },
      { model: "Rogue", size: "SUV/Truck" },
      { model: "Pathfinder", size: "Full Size" }
    ],
    Subaru: [
      { model: "Impreza", size: "Sedan/Coupe" },
      { model: "Legacy", size: "Sedan/Coupe" },
      { model: "Forester", size: "SUV/Truck" },
      { model: "Outback", size: "Full Size" }
    ],
    Mazda: [
      { model: "Mazda3", size: "Sedan/Coupe" },
      { model: "Mazda6", size: "Sedan/Coupe" },
      { model: "CX-5", size: "SUV/Truck" },
      { model: "CX-9", size: "Full Size" }
    ],
    Volvo: [
      { model: "S60", size: "Sedan/Coupe" },
      { model: "S90", size: "Full Size" },
      { model: "XC40", size: "SUV/Truck" },
      { model: "XC90", size: "Full Size" }
    ]
  };
  
  // Prices for packages by size
  const packagePrices = {
    "Exterior": { "Sedan/Coupe": 100, "SUV/Truck": 120, "Full Size": 140, "Truck": 150 },
    "Interior": { "Sedan/Coupe": 169, "SUV/Truck": 199, "Full Size": 229, "Truck": 249 },
    "Signature Duo": { "Sedan/Coupe": 229, "SUV/Truck": 259, "Full Size": 289, "Truck": 309 },
    // Add-ons base price; actual add-ons could be listed separately
    "Add-ons": { "Sedan/Coupe": 50, "SUV/Truck": 70, "Full Size": 90, "Truck": 110 }
  };
  
  // ---------- UTILS ----------
  function createOption(value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    return opt;
  }
  
  // normalize size names to match packagePrices keys
  function normalizeSize(size) {
    if (!size) return "Sedan/Coupe";
    const s = size.toLowerCase();
    if (s.includes("truck")) return "Truck";
    if (s.includes("full")) return "Full Size";
    if (s.includes("suv")) return "SUV/Truck";
    return "Sedan/Coupe";
  }
  
  // ---------- DOM BEHAVIOR ----------
  document.addEventListener("DOMContentLoaded", () => {
    // Toggle package details
    const toggleButtons = document.querySelectorAll(".toggle-details");
    toggleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const details = btn.nextElementSibling;
        if (!details) return;
        const isOpen = details.classList.toggle("open");
        details.style.display = isOpen ? "block" : "none";
        btn.textContent = isOpen ? "Hide Details" : "Details";
      });
    });
  
    // Booking form elements
    const bookingForm = document.getElementById("booking-form") || document.querySelector("form#booking-form") || document.getElementById("contact") || document.querySelector("form");
    // We'll try to find the elements by ID so it works with slight HTML differences
    const makeSelect = document.getElementById("car-make");
    const modelSelect = document.getElementById("car-model");
    const packageSelect = document.getElementById("package");
    const quoteBox = document.getElementById("quote-box");
    const messagesBox = document.getElementById("form-messages");
  
    // Create "manual model" input if user picks Other
    let manualModelInput =
  