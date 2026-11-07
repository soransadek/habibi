/**
 * Habibi DONER - Chicken Grill
 * Admin Dashboard Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const authOverlay = document.getElementById("adminAuthOverlay");
  const authPinInput = document.getElementById("adminPinInput");
  const btnAuthLogin = document.getElementById("btnAuthLogin");
  const authErrorMsg = document.getElementById("authErrorMsg");
  const btnLogout = document.getElementById("btnLogout");

  // Authentication check
  let isAuthenticated = sessionStorage.getItem("habibi_admin_logged_in") === "true";
  
  if (!isAuthenticated && authOverlay) {
    authOverlay.style.display = "flex";
  } else if (authOverlay) {
    authOverlay.style.display = "none";
  }

  if (btnAuthLogin) {
    btnAuthLogin.addEventListener("click", handleLogin);
    authPinInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  function handleLogin() {
    const pin = authPinInput.value.trim();
    // Default PINs: "1234" or "habibi2024" or custom stored pin
    const savedPin = localStorage.getItem("habibi_admin_pin") || "1234";
    if (pin === savedPin || pin === "1234" || pin === "habibi2024") {
      sessionStorage.setItem("habibi_admin_logged_in", "true");
      if (authOverlay) authOverlay.style.display = "none";
      showAdminToast("Succesvol ingelogd als beheerder!");
      initAdminPanel();
    } else {
      authErrorMsg.textContent = "Onjuiste pincode. Probeer 1234 of habibi2024";
      authPinInput.focus();
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("habibi_admin_logged_in");
      location.reload();
    });
  }

  // Admin Panel Setup
  function initAdminPanel() {
    setupTabs();
    loadPromoBannerForm();
    loadRestaurantInfoForm();
    loadCategoriesDropdown();
    renderAdminItemsTable();
    setupAddItemForm();
    setupBackupRestore();
  }

  if (isAuthenticated) {
    initAdminPanel();
  }

  // ==========================================
  // TABS
  // ==========================================
  function setupTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const activePane = document.getElementById(targetTab);
        if (activePane) activePane.classList.add("active");
      });
    });
  }

  // ==========================================
  // PROMO & RECLAME BANNER MANAGEMENT
  // ==========================================
  function loadPromoBannerForm() {
    const promo = MenuStore.getPromoBanner();
    const toggleActive = document.getElementById("promoActiveToggle");
    const badgeInput = document.getElementById("promoBadgeInput");
    const styleSelect = document.getElementById("promoStyleSelect");
    const titleInput = document.getElementById("promoTitleInput");
    const descInput = document.getElementById("promoDescInput");
    const priceOldInput = document.getElementById("promoPriceOldInput");
    const priceNewInput = document.getElementById("promoPriceNewInput");
    const validityInput = document.getElementById("promoValidityInput");
    const ctaInput = document.getElementById("promoCtaInput");
    const saveBtn = document.getElementById("btnSavePromo");
    const previewContainer = document.getElementById("adminPromoLivePreview");

    if (!toggleActive) return;

    toggleActive.checked = promo.active !== false;
    badgeInput.value = promo.badge || "";
    styleSelect.value = promo.style || "gold";
    titleInput.value = promo.title || "";
    descInput.value = promo.description || "";
    priceOldInput.value = promo.priceOld || "";
    priceNewInput.value = promo.pricePromo || "";
    validityInput.value = promo.validity || "";
    ctaInput.value = promo.ctaText || "";

    function updateLivePreview() {
      if (!previewContainer) return;
      const isActive = toggleActive.checked;
      const badge = badgeInput.value || "ACTIE";
      const style = styleSelect.value;
      const title = titleInput.value || "Titel van de actie";
      const desc = descInput.value || "Omschrijving van het actiemenu of aanbieding.";
      const oldPrice = priceOldInput.value.trim();
      const newPrice = priceNewInput.value || "Actieprijs";
      const validity = validityInput.value || "Geldig bij afhalen";
      const cta = ctaInput.value || "Direct Bestellen";

      const styleClass = style === "fire" ? "preview-banner-fire" : (style === "dark" ? "preview-banner-dark" : "preview-banner-gold");
      const badgeBg = style === "fire" ? "background:linear-gradient(135deg, #ff7675, #e74c3c); color:#fff;" : "background:var(--gold-accent); color:#000;";
      const priceColor = style === "fire" ? "color:#ff7675;" : "color:var(--gold-light);";

      previewContainer.className = styleClass;
      previewContainer.innerHTML = `
        <div style="opacity: ${isActive ? '1' : '0.45'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="${badgeBg} font-weight:800; font-size:0.75rem; padding:4px 12px; border-radius:999px; letter-spacing:0.1em; text-transform:uppercase;">
              ${escapeHtml(badge)}
            </span>
            <span style="font-size:0.8rem; color:${isActive ? '#2ecc71' : '#e74c3c'}; font-weight:700;">
              ${isActive ? '● ZICHTBAAR OP WEBSITE' : '○ UITGESCHAKELD'}
            </span>
          </div>
          <h3 style="font-family:'Cinzel', serif; font-size:1.35rem; color:#fff; margin-bottom:6px;">
            ${escapeHtml(title)}
          </h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px; line-height:1.4;">
            ${escapeHtml(desc)}
          </p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
            <div>
              <span style="font-size:0.8rem; color:var(--gold-accent);">⏱️ ${escapeHtml(validity)}</span>
              <div style="display:flex; align-items:baseline; gap:8px; margin-top:4px;">
                ${oldPrice ? `<span style="font-size:0.95rem; text-decoration:line-through; color:var(--text-muted);">${escapeHtml(oldPrice)}</span>` : ''}
                <span style="font-size:1.5rem; font-weight:800; ${priceColor}">${escapeHtml(newPrice)}</span>
              </div>
            </div>
            <div style="background:var(--gold-accent); color:#000; font-weight:700; padding:8px 16px; border-radius:999px; font-size:0.85rem;">
              ${escapeHtml(cta)}
            </div>
          </div>
        </div>
      `;
    }

    // Attach listeners for live preview updates
    [toggleActive, badgeInput, styleSelect, titleInput, descInput, priceOldInput, priceNewInput, validityInput, ctaInput].forEach(el => {
      el.addEventListener("input", updateLivePreview);
      el.addEventListener("change", updateLivePreview);
    });

    updateLivePreview();

    // Save Promo
    if (saveBtn) {
      saveBtn.onclick = () => {
        const title = titleInput.value.trim();
        if (!title) {
          alert("Vul een titel in voor de actie.");
          titleInput.focus();
          return;
        }

        const updatedPromo = {
          active: toggleActive.checked,
          badge: badgeInput.value.trim(),
          style: styleSelect.value,
          title: title,
          description: descInput.value.trim(),
          priceOld: priceOldInput.value.trim(),
          pricePromo: priceNewInput.value.trim(),
          validity: validityInput.value.trim(),
          ctaText: ctaInput.value.trim()
        };

        MenuStore.savePromoBanner(updatedPromo);
        showAdminToast(updatedPromo.active ? "Actiebanner opgeslagen en direct live gezet!" : "Actie opgeslagen (status: uitgeschakeld).");
        updateLivePreview();
      };
    }
  }

  // ==========================================
  // RESTAURANT INFO FORM
  // ==========================================
  function loadRestaurantInfoForm() {
    const info = MenuStore.getRestaurantInfo();
    const nameInput = document.getElementById("infoName");
    const sloganInput = document.getElementById("infoSlogan");
    const phoneInput = document.getElementById("infoPhone");
    const whatsappInput = document.getElementById("infoWhatsapp");
    const allergenInput = document.getElementById("infoAllergen");
    const saveInfoBtn = document.getElementById("btnSaveInfo");

    if (nameInput) nameInput.value = info.name || "";
    if (sloganInput) sloganInput.value = info.slogan || "";
    if (phoneInput) phoneInput.value = info.phone || "";
    if (whatsappInput) whatsappInput.value = info.whatsapp || "";
    if (allergenInput) allergenInput.value = info.allergenWarning || "";

    if (saveInfoBtn) {
      saveInfoBtn.onclick = () => {
        const updated = {
          ...MenuStore.getRestaurantInfo(),
          name: nameInput.value.trim(),
          slogan: sloganInput.value.trim(),
          phone: phoneInput.value.trim(),
          whatsapp: whatsappInput.value.trim(),
          allergenWarning: allergenInput.value.trim()
        };
        MenuStore.saveRestaurantInfo(updated);
        showAdminToast("Restaurant gegevens succesvol opgeslagen!");
      };
    }

    // ==========================================
    // OPENING HOURS MANAGEMENT
    // ==========================================
    const hoursContainer = document.getElementById("adminOpeningHoursContainer");
    const saveHoursBtn = document.getElementById("btnSaveOpeningHours");
    const presetHoursBtn = document.getElementById("btnPresetDefaultHours");

    const defaultSchedule = [
      { day: "Maandag", hours: "11:00 - 23:00" },
      { day: "Dinsdag", hours: "11:00 - 23:00" },
      { day: "Woensdag", hours: "11:00 - 23:00" },
      { day: "Donderdag", hours: "11:00 - 23:00" },
      { day: "Vrijdag", hours: "11:00 - 00:00" },
      { day: "Zaterdag", hours: "11:00 - 00:00" },
      { day: "Zondag", hours: "12:00 - 23:00" }
    ];

    function renderOpeningHoursInputs() {
      if (!hoursContainer) return;
      const currentInfo = MenuStore.getRestaurantInfo();
      const currentHours = (currentInfo.openingHours && currentInfo.openingHours.length === 7) 
        ? currentInfo.openingHours 
        : defaultSchedule;

      hoursContainer.innerHTML = currentHours.map((item, idx) => `
        <div class="form-group" style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${escapeHtml(item.day)}</span>
            <span style="font-size: 0.72rem; color: var(--gold-accent);">Dag ${idx + 1}</span>
          </label>
          <input type="text" class="form-control admin-day-hours-input" data-day="${escapeHtml(item.day)}" value="${escapeHtml(item.hours)}" placeholder="11:00 - 23:00 of Gesloten">
        </div>
      `).join("");
    }

    renderOpeningHoursInputs();

    if (presetHoursBtn) {
      presetHoursBtn.onclick = () => {
        const inputs = hoursContainer.querySelectorAll(".admin-day-hours-input");
        inputs.forEach(input => {
          const day = input.getAttribute("data-day");
          const found = defaultSchedule.find(d => d.day === day);
          if (found) input.value = found.hours;
        });
        showAdminToast("Standaardtijden ingevuld (nog niet opgeslagen).");
      };
    }

    if (saveHoursBtn) {
      saveHoursBtn.onclick = () => {
        const inputs = hoursContainer.querySelectorAll(".admin-day-hours-input");
        const newHours = [];
        inputs.forEach(input => {
          const day = input.getAttribute("data-day");
          const hours = input.value.trim() || "Gesloten";
          newHours.push({ day, hours });
        });

        const currentInfo = MenuStore.getRestaurantInfo();
        currentInfo.openingHours = newHours;
        MenuStore.saveRestaurantInfo(currentInfo);
        showAdminToast("Openingstijden succesvol opgeslagen en live gezet!");
      };
    }
  }

  // ==========================================
  // CATEGORIES DROPDOWN
  // ==========================================
  function loadCategoriesDropdown() {
    const categories = MenuStore.getCategories();
    const selectFilter = document.getElementById("filterCategorySelect");
    const selectNew = document.getElementById("newItemCategory");

    const optionsHtml = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    
    if (selectFilter) {
      selectFilter.innerHTML = `<option value="all">Alle categorieën</option>` + optionsHtml;
      selectFilter.onchange = () => renderAdminItemsTable();
    }
    if (selectNew) {
      selectNew.innerHTML = optionsHtml;
    }
  }

  // ==========================================
  // MENU ITEMS TABLE & EDITING
  // ==========================================
  function renderAdminItemsTable() {
    const tableBody = document.getElementById("adminItemsTableBody");
    const filterCat = document.getElementById("filterCategorySelect")?.value || "all";
    const searchFilter = document.getElementById("adminSearchItemInput")?.value.toLowerCase().trim() || "";
    
    if (!tableBody) return;

    let items = MenuStore.getItems();
    const categories = MenuStore.getCategories();
    const catMap = {};
    categories.forEach(c => catMap[c.id] = c.name);

    const filtered = items.filter(item => {
      const matchCat = filterCat === "all" || item.category === filterCat;
      const matchSearch = searchFilter === "" || item.name.toLowerCase().includes(searchFilter);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">Geen gerechten gevonden.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map((item, index) => `
      <tr data-id="${item.id}">
        <td><strong>#${index + 1}</strong></td>
        <td>
          <input type="text" class="form-control item-edit-name" value="${escapeHtml(item.name)}" style="min-width: 200px;">
        </td>
        <td>
          <select class="form-control item-edit-cat" style="min-width: 140px;">
            ${categories.map(c => `<option value="${c.id}" ${c.id === item.category ? 'selected' : ''}>${c.name}</option>`).join("")}
          </select>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:4px;">
            <span>€</span>
            <input type="number" step="0.25" min="0" class="form-control item-edit-price price-input-mini" value="${item.price}">
          </div>
        </td>
        <td>
          <input type="text" class="form-control item-edit-tag" value="${escapeHtml(item.tag || '')}" placeholder="bijv. Vega, Populair" style="width: 120px;">
        </td>
        <td>
          <div style="display:flex; gap:8px;">
            <button class="btn-admin btn-save-row" data-id="${item.id}" title="Opslaan">
              ✓ Opslaan
            </button>
            <button class="btn-admin btn-admin-danger btn-delete-row" data-id="${item.id}" title="Verwijderen">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // Attach listeners
    tableBody.querySelectorAll(".btn-save-row").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const row = tableBody.querySelector(`tr[data-id="${id}"]`);
        if (!row) return;

        const newName = row.querySelector(".item-edit-name").value.trim();
        const newCat = row.querySelector(".item-edit-cat").value;
        const newPrice = parseFloat(row.querySelector(".item-edit-price").value) || 0;
        const newTag = row.querySelector(".item-edit-tag").value.trim();

        if (!newName) {
          alert("Gerecht naam mag niet leeg zijn!");
          return;
        }

        const allItems = MenuStore.getItems();
        const target = allItems.find(i => i.id === id);
        if (target) {
          target.name = newName;
          target.category = newCat;
          target.price = newPrice;
          target.tag = newTag;
          MenuStore.saveItems(allItems);
          showAdminToast(`Gerecht "${newName}" opgeslagen!`);
        }
      });
    });

    tableBody.querySelectorAll(".btn-delete-row").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const allItems = MenuStore.getItems();
        const target = allItems.find(i => i.id === id);
        if (!target) return;

        if (confirm(`Weet u zeker dat u "${target.name}" wilt verwijderen?`)) {
          const updated = allItems.filter(i => i.id !== id);
          MenuStore.saveItems(updated);
          showAdminToast(`"${target.name}" verwijderd.`);
          renderAdminItemsTable();
        }
      });
    });
  }

  // Filter input listeners
  const adminSearchInput = document.getElementById("adminSearchItemInput");
  if (adminSearchInput) {
    adminSearchInput.addEventListener("input", renderAdminItemsTable);
  }

  // ==========================================
  // ADD NEW ITEM
  // ==========================================
  function setupAddItemForm() {
    const btnAdd = document.getElementById("btnAddNewItem");
    const inputName = document.getElementById("newItemName");
    const inputCat = document.getElementById("newItemCategory");
    const inputPrice = document.getElementById("newItemPrice");
    const inputTag = document.getElementById("newItemTag");

    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        const name = inputName.value.trim();
        const category = inputCat.value;
        const price = parseFloat(inputPrice.value);
        const tag = inputTag.value.trim();

        if (!name) {
          alert("Vul alstublieft een naam in.");
          inputName.focus();
          return;
        }
        if (isNaN(price) || price < 0) {
          alert("Vul alstublieft een geldige prijs in.");
          inputPrice.focus();
          return;
        }

        const items = MenuStore.getItems();
        const newId = "dish_" + Date.now();
        items.push({ id: newId, name, category, price, tag });
        MenuStore.saveItems(items);

        // Reset form
        inputName.value = "";
        inputPrice.value = "";
        inputTag.value = "";

        showAdminToast(`Nieuw gerecht "${name}" toegevoegd!`);
        renderAdminItemsTable();
      });
    }
  }

  // ==========================================
  // BACKUP, RESTORE & FACTORY RESET
  // ==========================================
  function setupBackupRestore() {
    const btnExport = document.getElementById("btnExportBackup");
    const fileImport = document.getElementById("fileImportBackup");
    const btnResetFactory = document.getElementById("btnResetDefaults");
    const btnSaveNewPin = document.getElementById("btnSaveNewPin");
    const inputNewPin = document.getElementById("inputNewPin");

    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const json = MenuStore.exportJSON();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `habibi-doner-backup-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showAdminToast("Backup bestand gedownload!");
      });
    }

    if (fileImport) {
      fileImport.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const success = MenuStore.importJSON(event.target.result);
          if (success) {
            showAdminToast("Backup succesvol geïmporteerd!");
            setTimeout(() => location.reload(), 800);
          } else {
            alert("Fout bij het importeren van het backup bestand.");
          }
        };
        reader.readAsText(file);
      });
    }

    if (btnResetFactory) {
      btnResetFactory.addEventListener("click", () => {
        const conf = confirm("Let op: Dit herstelt alle gerechten en prijzen exact naar de originele menukaarten van het restaurant. Wilt u doorgaan?");
        if (conf) {
          MenuStore.resetToDefaults();
          showAdminToast("Menukaart hersteld naar origineel!");
          setTimeout(() => location.reload(), 800);
        }
      });
    }

    if (btnSaveNewPin && inputNewPin) {
      btnSaveNewPin.addEventListener("click", () => {
        const newPin = inputNewPin.value.trim();
        if (newPin.length < 4) {
          alert("Voer een pincode in van minimaal 4 tekens.");
          return;
        }
        localStorage.setItem("habibi_admin_pin", newPin);
        inputNewPin.value = "";
        showAdminToast("Nieuwe beheerder pincode ingesteld!");
      });
    }
  }

  // Helper toast
  function showAdminToast(msg) {
    let toast = document.getElementById("adminToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "adminToast";
      toast.className = "admin-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
});
