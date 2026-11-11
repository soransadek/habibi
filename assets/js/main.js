/**
 * Habibi DONER - Chicken Grill
 * Main Interactive Frontend Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Load initial store
  const restaurantInfo = MenuStore.getRestaurantInfo();
  const categories = MenuStore.getCategories();
  let items = MenuStore.getItems();

  // State
  let activeCategory = "all";
  let searchQuery = "";
  let cart = [];
  let orderType = "Afhalen"; // or "Ter plaatse eten"

  // DOM Elements
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDropdown = document.getElementById("mobileDropdown");
  const categoryMobileSelect = document.getElementById("categoryMobileSelect");
  const searchInput = document.getElementById("menuSearchInput");
  const categoryPillsContainer = document.getElementById("categoryPillsContainer");
  const menuContainer = document.getElementById("menuContainer");
  const cartBtn = document.getElementById("cartFloatingBtn");
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalPriceEl = document.getElementById("cartTotalPrice");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const orderTypeBtns = document.querySelectorAll(".order-type-btn");
  const btnWhatsAppOrder = document.getElementById("btnWhatsAppOrder");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");
  const allergenModal = document.getElementById("allergenModal");
  const allergenTriggers = document.querySelectorAll(".allergen-trigger-btn");
  const closeAllergenBtn = document.getElementById("closeAllergenBtn");

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  if (mobileMenuBtn && mobileDropdown) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileDropdown.classList.contains("active");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on navigation link click and handle category accordion opening
    mobileDropdown.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        const catTarget = link.getAttribute("data-open-cat");
        if (catTarget) {
          selectCategory(catTarget);
        }
        closeMobileMenu();
      });
    });

    // Close if clicked outside
    document.addEventListener("click", (e) => {
      if (!mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileDropdown.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileDropdown.classList.add("active");
    mobileMenuBtn.classList.add("open");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    mobileDropdown.classList.remove("active");
    mobileMenuBtn.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  // ==========================================
  // DYNAMIC RESTAURANT INFO SYNC
  // ==========================================
  function syncRestaurantInfo() {
    const info = MenuStore.getRestaurantInfo();
    document.querySelectorAll(".dyn-phone").forEach(el => {
      el.textContent = info.phone;
      if (el.tagName === "A") {
        el.href = `tel:${info.phone.replace(/\s+/g, '')}`;
      }
    });
    document.querySelectorAll(".dyn-slogan").forEach(el => {
      el.textContent = info.slogan;
    });
    document.querySelectorAll(".dyn-allergen-text").forEach(el => {
      el.textContent = info.allergenWarning;
    });

    // Dynamic Opening Hours in Footer
    const openingList = document.getElementById("footerOpeningHoursList");
    if (openingList && info.openingHours && Array.isArray(info.openingHours)) {
      openingList.innerHTML = info.openingHours.map(item => `
        <li><span>${escapeHtml(item.day)}:</span> <strong>${escapeHtml(item.hours)}</strong></li>
      `).join("");
    }
  }
  syncRestaurantInfo();

  // ==========================================
  // PROMO / RECLAME BANNER RENDER
  // ==========================================
  function renderPromoBanner() {
    const promo = MenuStore.getPromoBanner();
    const bannerSec = document.getElementById("promoBannerSection");
    const promoCard = document.getElementById("promoCard");
    const badgeEl = document.getElementById("promoBadge");
    const titleEl = document.getElementById("promoTitle");
    const descEl = document.getElementById("promoDesc");
    const validityEl = document.getElementById("promoValidityText");
    const oldPriceEl = document.getElementById("promoPriceOld");
    const newPriceEl = document.getElementById("promoPriceNew");
    const ctaBtn = document.getElementById("btnClaimPromo");
    const ctaTextEl = document.getElementById("promoCtaText");
    const closeBtn = document.getElementById("closePromoBannerBtn");

    if (!bannerSec) return;

    if (!promo || !promo.active) {
      bannerSec.classList.add("hidden");
      return;
    }

    bannerSec.classList.remove("hidden");

    if (promoCard) {
      promoCard.className = `promo-card promo-style-${promo.style || 'gold'}`;
    }
    if (badgeEl) badgeEl.textContent = promo.badge || "ACTIE";
    if (titleEl) titleEl.textContent = promo.title || "";
    if (descEl) descEl.textContent = promo.description || "";
    if (validityEl) validityEl.textContent = promo.validity || "Tijdelijk geldig!";
    
    if (oldPriceEl) {
      if (promo.priceOld && promo.priceOld.trim() !== "") {
        oldPriceEl.textContent = promo.priceOld;
        oldPriceEl.style.display = "inline";
      } else {
        oldPriceEl.style.display = "none";
      }
    }

    if (newPriceEl) {
      newPriceEl.textContent = promo.pricePromo || "";
    }

    if (ctaTextEl) {
      ctaTextEl.textContent = promo.ctaText || "Direct Bestellen via WhatsApp";
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        bannerSec.classList.add("hidden");
      };
    }

    if (ctaBtn) {
      ctaBtn.onclick = () => {
        const info = MenuStore.getRestaurantInfo();
        const cleanPhone = (info.whatsapp || "31644983884").replace(/\D/g, "");
        const msg = `*ACTIE BESTELLING BIJ HABIBI DONER - CHICKEN GRILL*\n\nHallo, ik wil graag gebruik maken van de actie:\n🔥 *${promo.title}*\nPrijs: *${promo.pricePromo}*\n\nKunt u mij laten weten of deze actie nu beschikbaar is voor afhalen/eten? Bedankt!`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");
      };
    }
  }
  renderPromoBanner();

  // ==========================================
  // CATEGORY PILLS & DROPDOWN RENDER
  // ==========================================
  function renderCategoryPills() {
    // 1. Render Desktop/Tablet horizontal pills
    if (categoryPillsContainer) {
      let html = `<button class="cat-pill ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">Alles</button>`;
      categories.forEach(cat => {
        const isActive = activeCategory === cat.id ? 'active' : '';
        html += `<button class="cat-pill ${isActive}" data-cat="${cat.id}">${cat.name}</button>`;
      });
      categoryPillsContainer.innerHTML = html;

      // Attach listeners
      categoryPillsContainer.querySelectorAll(".cat-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          const cat = pill.getAttribute("data-cat");
          selectCategory(cat);
        });
      });
    }

    // 2. Render Mobile category dropdown select
    if (categoryMobileSelect) {
      let optionsHtml = `<option value="all" ${activeCategory === 'all' ? 'selected' : ''}>🌟 Alle Categorieën</option>`;
      categories.forEach(cat => {
        const isSelected = activeCategory === cat.id ? 'selected' : '';
        optionsHtml += `<option value="${cat.id}" ${isSelected}>${cat.name}</option>`;
      });
      categoryMobileSelect.innerHTML = optionsHtml;

      categoryMobileSelect.onchange = (e) => {
        selectCategory(e.target.value);
      };
    }
  }

  function selectCategory(cat) {
    activeCategory = cat;

    if (cat !== 'all') {
      openCategories.add(cat);
    } else {
      // open all if "all" is picked
      categories.forEach(c => openCategories.add(c.id));
    }

    // Sync pills
    if (categoryPillsContainer) {
      categoryPillsContainer.querySelectorAll(".cat-pill").forEach(p => {
        if (p.getAttribute("data-cat") === cat) {
          p.classList.add("active");
          p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          p.classList.remove("active");
        }
      });
    }

    // Sync mobile select
    if (categoryMobileSelect) {
      categoryMobileSelect.value = cat;
    }

    renderMenu();

    if (cat !== 'all') {
      setTimeout(() => {
        const targetSection = document.getElementById(`cat-${cat}`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  // ==========================================
  // MENU RENDER (ACCORDION SUPPORT FOR MOBILE & DESKTOP)
  // ==========================================
  // Track open accordion state per category (default: first open, or if category chosen open that)
  const openCategories = new Set();
  let initialAccordionSet = false;

  const CATEGORY_EMOJIS = {
    broodjes: "🥪",
    durum: "🌯",
    kapsalon: "🍟",
    kip: "🍗",
    schotels: "🍽️",
    box: "📦",
    pizza: "🍕",
    soep: "🍲",
    extra: "🥫",
    dranken: "🥤"
  };

  function renderMenu() {
    if (!menuContainer) return;
    items = MenuStore.getItems();

    const filteredItems = items.filter(item => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const matchSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (filteredItems.length === 0) {
      menuContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--gold-primary);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3 style="color: #fff; margin-bottom: 6px;">Geen gerechten gevonden</h3>
          <p>Probeer een andere zoekterm of categorie.</p>
        </div>
      `;
      return;
    }

    // Group items by category
    const grouped = {};
    categories.forEach(c => { grouped[c.id] = []; });
    filteredItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    // Determine initial accordion state
    if (!initialAccordionSet) {
      // By default open all or open the first category
      if (categories.length > 0) {
        openCategories.add(categories[0].id);
      }
      initialAccordionSet = true;
    }

    // If searching, open all matching categories
    const isSearching = searchQuery.trim() !== "";
    if (isSearching) {
      categories.forEach(c => {
        if (grouped[c.id] && grouped[c.id].length > 0) openCategories.add(c.id);
      });
    } else if (activeCategory !== "all") {
      openCategories.add(activeCategory);
    }

    let html = "";
    categories.forEach(cat => {
      const catItems = grouped[cat.id];
      if (!catItems || catItems.length === 0) return;

      const isOpen = openCategories.has(cat.id);
      const emoji = CATEGORY_EMOJIS[cat.id] || "🍽️";

      html += `
        <section class="category-block ${isOpen ? 'open' : 'collapsed'}" id="cat-${cat.id}" data-category-id="${cat.id}">
          <button type="button" class="category-accordion-btn" aria-expanded="${isOpen}">
            <div class="category-accordion-left">
              <span class="category-emoji-badge">${emoji}</span>
              <div class="cat-heading-text">
                <h3>${cat.name}</h3>
                <p>${cat.subtitle || 'Vers bereid volgens traditioneel recept'}</p>
              </div>
            </div>
            <div class="category-accordion-right">
              <span class="category-item-count">${catItems.length} items</span>
              <svg class="category-chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>

          <div class="category-collapse-content" style="${isOpen ? '' : 'display: none;'}">
            <div class="dishes-grid">
              ${catItems.map(item => `
                <div class="dish-card" data-id="${item.id}">
                  <div class="dish-header">
                    <h4 class="dish-name">${escapeHtml(item.name)}</h4>
                    <span class="dish-price">${MenuStore.formatPrice(item.price)}</span>
                  </div>
                  <div class="dish-footer">
                    <div>
                      ${item.tag ? `<span class="dish-tag ${item.tag.toLowerCase().includes('vega') ? 'vega' : ''}">${escapeHtml(item.tag)}</span>` : `<span style="font-size:0.75rem; color:var(--text-muted);">100% Halal</span>`}
                    </div>
                    <button class="btn-add-item" data-add="${item.id}" title="Voeg toe aan bestelling">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Bestel
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    });

    menuContainer.innerHTML = html;

    // Attach Accordion Toggle Click Handlers
    menuContainer.querySelectorAll(".category-accordion-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const block = btn.closest(".category-block");
        const catId = block.getAttribute("data-category-id");
        const content = block.querySelector(".category-collapse-content");
        const isCurrentlyOpen = block.classList.contains("open");

        if (isCurrentlyOpen) {
          block.classList.remove("open");
          block.classList.add("collapsed");
          btn.setAttribute("aria-expanded", "false");
          content.style.display = "none";
          openCategories.delete(catId);
        } else {
          block.classList.add("open");
          block.classList.remove("collapsed");
          btn.setAttribute("aria-expanded", "true");
          content.style.display = "block";
          openCategories.add(catId);
        }
      });
    });

    // Attach Add to cart buttons
    menuContainer.querySelectorAll(".btn-add-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-add");
        addToCart(id);
      });
    });
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderMenu();
    });
  }

  // ==========================================
  // CART / ORDER BUILDER
  // ==========================================
  function addToCart(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const existing = cart.find(c => c.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    showToast(`Toegevoegd: ${item.name}`);
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update counts
    cartCountBadges.forEach(b => b.textContent = totalCount);
    if (cartTotalPriceEl) {
      cartTotalPriceEl.textContent = MenuStore.formatPrice(totalPrice);
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--gold-primary);">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p>Uw winkelmandje is nog leeg.</p>
          <p style="font-size: 0.82rem; margin-top: 4px;">Kies een lekker gerecht uit het menu!</p>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = `
      <div class="cart-items-list">
        ${cart.map(c => `
          <div class="cart-row-item">
            <div>
              <div class="cart-item-title">${escapeHtml(c.name)}</div>
              <div class="cart-item-unit-price">${MenuStore.formatPrice(c.price * c.quantity)} (${MenuStore.formatPrice(c.price)} p.st.)</div>
            </div>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" data-minus="${c.id}">-</button>
              <span style="font-weight: 700; min-width: 20px; text-align: center;">${c.quantity}</span>
              <button class="qty-btn" data-plus="${c.id}">+</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Quantity buttons
    cartItemsContainer.querySelectorAll("[data-plus]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-plus");
        const found = cart.find(i => i.id === id);
        if (found) {
          found.quantity += 1;
          updateCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll("[data-minus]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-minus");
        const found = cart.find(i => i.id === id);
        if (found) {
          found.quantity -= 1;
          if (found.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      });
    });
  }

  // Cart drawer toggle
  function openCart() {
    if (cartDrawerOverlay && cartDrawer) {
      cartDrawerOverlay.classList.add("active");
      cartDrawer.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCart() {
    if (cartDrawerOverlay && cartDrawer) {
      cartDrawerOverlay.classList.remove("active");
      cartDrawer.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener("click", closeCart);

  // Order type selection (Afhalen / Ter plaatse eten)
  const dineInReservationBox = document.getElementById("dineInReservationBox");
  const reservationTimeSelect = document.getElementById("reservationTimeSelect");
  const reservationGuestsSelect = document.getElementById("reservationGuestsSelect");

  function populateReservationTimes() {
    if (!reservationTimeSelect) return;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    let options = `<option value="Z.s.m. (binnen 20-30 min)">⚡ Z.s.m. (20-30 min)</option>`;

    // Generate timeslots from 11:00 to 23:30 at 15-minute intervals
    for (let h = 11; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        // If today, only show future timeslots (at least 15 min from now)
        const slotMinutes = h * 60 + m;
        const nowMinutes = currentHour * 60 + currentMin;
        const timeFormatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} uur`;
        
        if (slotMinutes > nowMinutes + 10) {
          options += `<option value="Vandaag om ${timeFormatted}">Vandaag om ${timeFormatted}</option>`;
        } else {
          // Also allow choosing for later if evening has passed, or indicate tomorrow
          options += `<option value="${timeFormatted}">${timeFormatted}</option>`;
        }
      }
    }
    reservationTimeSelect.innerHTML = options;
  }
  populateReservationTimes();

  orderTypeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      orderTypeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      orderType = btn.getAttribute("data-type") || "Afhalen";

      if (dineInReservationBox) {
        if (orderType === "Ter plaatse eten") {
          dineInReservationBox.style.display = "block";
          populateReservationTimes();
        } else {
          dineInReservationBox.style.display = "none";
        }
      }
    });
  });

  // WhatsApp Order Sending
  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Voeg eerst een gerecht toe aan uw bestelling!");
        return;
      }
      const info = MenuStore.getRestaurantInfo();
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      let msg = `*BESTELLING BIJ HABIBI DONER - CHICKEN GRILL*\n`;
      msg += `Type: *${orderType}*\n`;

      if (orderType === "Ter plaatse eten") {
        const reservedTime = reservationTimeSelect ? reservationTimeSelect.value : "Z.s.m.";
        const guestCount = reservationGuestsSelect ? reservationGuestsSelect.value : "2 personen";
        msg += `🕒 *Gewenst tijdstip:* ${reservedTime}\n`;
        msg += `👥 *Aantal personen:* ${guestCount}\n`;
      }

      msg += `--------------------------------\n`;
      cart.forEach(item => {
        msg += `• ${item.quantity}x ${item.name} (${MenuStore.formatPrice(item.price * item.quantity)})\n`;
      });
      msg += `--------------------------------\n`;
      msg += `*Totaalbedrag:* ${MenuStore.formatPrice(totalPrice)}\n\n`;

      if (orderType === "Ter plaatse eten") {
        msg += `_Graag een tafel voor ons reserveren en de bestelling voorbereiden. Eventuele sauzen / opmerkingen geven we hieronder door!_`;
      } else {
        msg += `_Graag bevestigen en eventuele sauzen / opmerkingen doorgeven. Dank u wel!_`;
      }

      const encoded = encodeURIComponent(msg);
      const cleanPhone = (info.whatsapp || "31644983884").replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
      
      window.open(whatsappUrl, "_blank");
    });
  }

  // Spotlight Order Buttons
  document.querySelectorAll(".spotlight-order-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-add");
      if (id) addToCart(id);
    });
  });

  // ==========================================
  // ALLERGEN MODAL
  // ==========================================
  allergenTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (allergenModal) {
        allergenModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  if (closeAllergenBtn && allergenModal) {
    closeAllergenBtn.addEventListener("click", () => {
      allergenModal.classList.remove("active");
      document.body.style.overflow = "";
    });
    allergenModal.addEventListener("click", (e) => {
      if (e.target === allergenModal) {
        allergenModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById("siteToastNotification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "siteToastNotification";
      toast.style.position = "fixed";
      toast.style.bottom = "84px";
      toast.style.right = "24px";
      toast.style.background = "#121216";
      toast.style.border = "1px solid #e6b85c";
      toast.style.color = "#fbe39d";
      toast.style.padding = "10px 18px";
      toast.style.borderRadius = "9999px";
      toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.7)";
      toast.style.fontSize = "0.88rem";
      toast.style.fontWeight = "600";
      toast.style.zIndex = "9999";
      toast.style.transition = "all 0.3s ease";
      toast.style.transform = "translateY(20px)";
      toast.style.opacity = "0";
      toast.style.pointerEvents = "none";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 2200);
  }

  // HTML Escape helper
  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Initial Renders
  renderCategoryPills();
  renderMenu();
  updateCartUI();
});
