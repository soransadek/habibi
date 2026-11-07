/**
 * Habibi DONER - Chicken Grill
 * Centralized Menu Data & LocalStorage State Management
 */

const DEFAULT_RESTAURANT_INFO = {
  name: "Habibi DONER - Chicken Grill",
  slogan: "Good Food Good Mood",
  phone: "06 4498 3884",
  phoneFormatted: "06 4498 3884",
  whatsapp: "31644983884",
  address: "Adres ter plaatse",
  services: ["Afhalen", "Ter plaatse eten"],
  halal: "100% Halal Gecertificeerd",
  allergenWarning: "Heeft u een allergie of dieetwens? Vraag altijd ons keukenpersoneel naar de ingrediënten en allergenen in onze gerechten!",
  openingHours: [
    { day: "Maandag", hours: "11:00 - 23:00" },
    { day: "Dinsdag", hours: "11:00 - 23:00" },
    { day: "Woensdag", hours: "11:00 - 23:00" },
    { day: "Donderdag", hours: "11:00 - 23:00" },
    { day: "Vrijdag", hours: "11:00 - 00:00" },
    { day: "Zaterdag", hours: "11:00 - 00:00" },
    { day: "Zondag", hours: "12:00 - 23:00" }
  ]
};

const DEFAULT_CATEGORIES = [
  { id: "broodjes", name: "Broodjes", subtitle: "Geserveerd met salade en saus naar keuze.", image: "assets/images/dish-broodje.jpg" },
  { id: "durum", name: "Libanees Brood / Durum", subtitle: "Geserveerd met salade en saus naar keuze.", image: "assets/images/dish-durum.jpg" },
  { id: "kapsalon", name: "Kapsalon met Friet / Rijst", subtitle: "Geserveerd met friet, saus, salade en gesmolten kaas. Keuze uit vlees of falafel.", image: "assets/images/dish-kapsalon.jpg" },
  { id: "kip", name: "Gegerilde Kip", subtitle: "Geserveerd met salade, saus naar keuze en friet of rijst.", image: "assets/images/dish-gegrilde-kip.jpg" },
  { id: "schotels", name: "Schotels", subtitle: "Geserveerd met salade, saus naar keuze en friet of rijst.", image: "assets/images/dish-gegrilde-kip.jpg" },
  { id: "box", name: "Box & Bakjes", subtitle: "Geserveerd met friet, saus en salade (met uitzondering van bakjes).", image: "assets/images/dish-kapsalon.jpg" },
  { id: "pizza", name: "Turkse Pizza", subtitle: "Geserveerd met salade en saus naar keuze.", image: "assets/images/dish-turkse-pizza.jpg" },
  { id: "soep", name: "Soep", subtitle: "Huisgemaakte verse soepen met vers brood.", image: "assets/images/dish-soep.jpg" },
  { id: "extra", name: "Extra & Sauzen", subtitle: "Sauzen en lekkere bijgerechten.", image: "" },
  { id: "dranken", name: "Dranken", subtitle: "Koude en verfrissende dranken.", image: "" }
];

const DEFAULT_MENU_ITEMS = [
  // BROODJES
  { id: "b1", category: "broodjes", name: "Broodje kip doner", price: 7.00, tag: "Populair" },
  { id: "b2", category: "broodjes", name: "Broodje yaprak doner", price: 9.50, tag: "Rundvlees" },
  { id: "b3", category: "broodjes", name: "Broodje falafel", price: 6.00, tag: "Vega" },
  { id: "b4", category: "broodjes", name: "Broodje kaas", price: 3.50, tag: "Vega" },
  { id: "b5", category: "broodjes", name: "Broodje gegerilde kip", price: 7.50, tag: "Specialiteit" },
  { id: "b6", category: "broodjes", name: "Broodje mix", price: 9.50, tag: "Kip & Rund" },

  // LIBANEES BROOD / DURUM
  { id: "d1", category: "durum", name: "Libanees brood kip doner", price: 8.00 },
  { id: "d2", category: "durum", name: "Libanees brood kip doner kaas", price: 9.00 },
  { id: "d3", category: "durum", name: "Libanees brood yaprak doner", price: 11.50 },
  { id: "d4", category: "durum", name: "Libanees brood yaprak doner kaas", price: 13.00 },
  { id: "d5", category: "durum", name: "Libanees brood falafel", price: 7.50, tag: "Vega" },
  { id: "d6", category: "durum", name: "Libanees brood gegerilde kip", price: 10.00 },
  { id: "d7", category: "durum", name: "Libanees brood mix", price: 13.00 },
  { id: "d8", category: "durum", name: "Durum kip doner", price: 8.00, tag: "Favoriet" },
  { id: "d9", category: "durum", name: "Durum kip doner kaas", price: 9.00 },
  { id: "d10", category: "durum", name: "Durum yaprak doner", price: 11.50 },
  { id: "d11", category: "durum", name: "Durum yaprak doner kaas", price: 13.00 },
  { id: "d12", category: "durum", name: "Durum falafel", price: 7.50, tag: "Vega" },
  { id: "d13", category: "durum", name: "Durum gegerilde kip", price: 10.00 },
  { id: "d14", category: "durum", name: "Durum mix", price: 13.00 },

  // KAPSALON MET FRIET / RIJST
  { id: "k1", category: "kapsalon", name: "Kapsalon kip doner klein", price: 8.00 },
  { id: "k2", category: "kapsalon", name: "Kapsalon kip doner medium", price: 9.00 },
  { id: "k3", category: "kapsalon", name: "Kapsalon kip doner groot", price: 11.50, tag: "Aanrader" },
  { id: "k4", category: "kapsalon", name: "Kapsalon yaprak doner klein", price: 9.50 },
  { id: "k5", category: "kapsalon", name: "Kapsalon yaprak doner medium", price: 12.50 },
  { id: "k6", category: "kapsalon", name: "Kapsalon yaprak doner groot", price: 14.00 },
  { id: "k7", category: "kapsalon", name: "Kapsalon falafel medium", price: 13.00, tag: "Vega" },
  { id: "k8", category: "kapsalon", name: "Kapsalon mix klein", price: 9.00 },
  { id: "k9", category: "kapsalon", name: "Kapsalon mix medium", price: 12.50 },
  { id: "k10", category: "kapsalon", name: "Kapsalon mix groot", price: 14.00, tag: "Groot" },

  // GEGERILDE KIP
  { id: "gk1", category: "kip", name: "Hele kip", price: 15.00, tag: "Klassieker" },
  { id: "gk2", category: "kip", name: "Halve kip", price: 7.50 },
  { id: "gk3", category: "kip", name: "Hele kip met rijst, friet, salade en saus", price: 20.00, tag: "Compleet Menu" },
  { id: "gk4", category: "kip", name: "Halve kip met rijst, friet, salade en saus", price: 12.50, tag: "Menu" },

  // SCHOTELS
  { id: "s1", category: "schotels", name: "Schotel kip doner", price: 14.00 },
  { id: "s2", category: "schotels", name: "Schotel yaprak doner", price: 17.00 },
  { id: "s3", category: "schotels", name: "Schotel falafel", price: 11.00, tag: "Vega" },
  { id: "s4", category: "schotels", name: "Schotel mix", price: 20.00, tag: "Rijkelijk gevuld" },

  // BOX & BAKJES
  { id: "box1", category: "box", name: "Box kip doner klein", price: 8.00 },
  { id: "box2", category: "box", name: "Box kip doner groot", price: 10.00 },
  { id: "box3", category: "box", name: "Box yaprak doner klein", price: 10.00 },
  { id: "box4", category: "box", name: "Box yaprak doner groot", price: 12.00 },
  { id: "box5", category: "box", name: "Box mix klein", price: 10.00 },
  { id: "box6", category: "box", name: "Box mix groot", price: 12.00 },
  { id: "box7", category: "box", name: "Bakje kip doner groot", price: 12.00 },
  { id: "box8", category: "box", name: "Bakje yaprak doner groot", price: 15.00 },
  { id: "box9", category: "box", name: "Bakje kip doner klein", price: 6.00 },
  { id: "box10", category: "box", name: "Bakje yaprak doner klein", price: 7.50 },

  // TURKSE PIZZA
  { id: "tp1", category: "pizza", name: "Turkse pizza", price: 4.00 },
  { id: "tp2", category: "pizza", name: "Turkse pizza kaas", price: 5.00 },
  { id: "tp3", category: "pizza", name: "Turkse pizza kip doner", price: 8.50, tag: "Populair" },
  { id: "tp4", category: "pizza", name: "Turkse pizza kip doner kaas", price: 9.50 },
  { id: "tp5", category: "pizza", name: "Turkse pizza yaprak doner", price: 11.50 },
  { id: "tp6", category: "pizza", name: "Turkse pizza yaprak doner kaas", price: 13.50 },
  { id: "tp7", category: "pizza", name: "Turkse pizza mix", price: 11.50 },

  // SOEP
  { id: "sp1", category: "soep", name: "Linzensoep", price: 5.00, tag: "Huisgemaakt" },
  { id: "sp2", category: "soep", name: "Witte bonensoep met rundvlees", price: 5.00 },
  { id: "sp3", category: "soep", name: "Kikkererwten soep met rund gehaktballetjes", price: 5.00 },
  { id: "sp4", category: "soep", name: "Goulashsoep met rundvlees", price: 5.00 },

  // EXTRA & SAUZEN
  { id: "ex1", category: "extra", name: "Knoflooksaus", price: 1.00 },
  { id: "ex2", category: "extra", name: "Sambal", price: 1.00 },
  { id: "ex3", category: "extra", name: "Mayonaise", price: 0.75 },
  { id: "ex4", category: "extra", name: "Curry", price: 0.75 },
  { id: "ex5", category: "extra", name: "Ketchup", price: 0.75 },
  { id: "ex6", category: "extra", name: "Habibi saus", price: 1.50, tag: "Huisgemaakt" },
  { id: "ex7", category: "extra", name: "Chili saus", price: 1.00 },
  { id: "ex8", category: "extra", name: "Tzatziki", price: 1.50 },
  { id: "ex9", category: "extra", name: "Extra kip doner", price: 3.00 },
  { id: "ex10", category: "extra", name: "Extra yaprak doner", price: 4.00 },
  { id: "ex11", category: "extra", name: "Rijst", price: 3.50 },
  { id: "ex12", category: "extra", name: "Friet klein", price: 3.00 },
  { id: "ex13", category: "extra", name: "Friet groot", price: 6.00 },
  { id: "ex14", category: "extra", name: "Extra kaas", price: 1.00 },

  // DRANKEN
  { id: "dr1", category: "dranken", name: "Red Bull", price: 3.00 },
  { id: "dr2", category: "dranken", name: "Coca-Cola", price: 2.50 },
  { id: "dr3", category: "dranken", name: "Coca-Cola Zero Sugar", price: 2.50 },
  { id: "dr4", category: "dranken", name: "Pepsi", price: 2.50 },
  { id: "dr5", category: "dranken", name: "Fanta", price: 2.50 },
  { id: "dr6", category: "dranken", name: "Fanta Cassis", price: 2.50 },
  { id: "dr7", category: "dranken", name: "Sprite", price: 2.50 },
  { id: "dr8", category: "dranken", name: "Spa Rood", price: 2.00 },
  { id: "dr9", category: "dranken", name: "Spa Blauw", price: 2.00 },
  { id: "dr10", category: "dranken", name: "Capri-Sun", price: 1.50 },
  { id: "dr11", category: "dranken", name: "AA Drink", price: 2.50 },
  { id: "dr12", category: "dranken", name: "Lipton Original", price: 2.50 },
  { id: "dr13", category: "dranken", name: "Lipton Peach", price: 2.50 },
  { id: "dr14", category: "dranken", name: "Lipton Green", price: 2.50 },
  { id: "dr15", category: "dranken", name: "Fernandes Pineapple", price: 2.50 },
  { id: "dr16", category: "dranken", name: "Fernandes Red Grape", price: 2.50 },
  { id: "dr17", category: "dranken", name: "Fernandes Green Punch", price: 2.50 },
  { id: "dr18", category: "dranken", name: "Fernandes Cherry Bouquet", price: 2.50 },
  { id: "dr19", category: "dranken", name: "Chocomel", price: 2.50 },
  { id: "dr20", category: "dranken", name: "Fristi", price: 2.50 },
  { id: "dr21", category: "dranken", name: "Ayran", price: 1.50, tag: "Traditioneel" },
  { id: "dr22", category: "dranken", name: "Doganay Salgam", price: 2.50, tag: "Traditioneel" }
];

// Helper methods to get and set data from localStorage
const STORAGE_KEYS = {
  INFO: "habibi_restaurant_info",
  CATEGORIES: "habibi_menu_categories",
  ITEMS: "habibi_menu_items",
  PROMO: "habibi_promo_banner",
  AUTH: "habibi_admin_auth"
};

const DEFAULT_PROMO_BANNER = {
  active: true,
  badge: "🔥 ACTIE VAN DE WEEK",
  title: "Hele Gegrilde Kip Menu met Rijst, Friet & Frisdrank!",
  description: "Geniet van onze heerlijke, malse kip vers van de grill geserveerd met rijst, friet, salade en saus naar keuze. 100% Halal!",
  priceOld: "€ 22,50",
  pricePromo: "€ 18,50",
  ctaText: "Profiteer Nu van deze Actie",
  style: "gold", // "gold", "fire", "dark"
  validUntil: "Geldig bij afhalen & ter plaatse eten"
};

const MenuStore = {
  getRestaurantInfo() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INFO);
      return stored ? JSON.parse(stored) : DEFAULT_RESTAURANT_INFO;
    } catch (e) {
      return DEFAULT_RESTAURANT_INFO;
    }
  },

  saveRestaurantInfo(info) {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(info));
  },

  getPromoBanner() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROMO);
      return stored ? JSON.parse(stored) : DEFAULT_PROMO_BANNER;
    } catch (e) {
      return DEFAULT_PROMO_BANNER;
    }
  },

  savePromoBanner(promo) {
    localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(promo));
  },

  getCategories() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return stored ? JSON.parse(stored) : DEFAULT_MENU_ITEMS;
    } catch (e) {
      return DEFAULT_MENU_ITEMS;
    }
  },

  saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  formatPrice(price) {
    const num = Number(price) || 0;
    return `€ ${num.toFixed(2).replace('.', ',')}`;
  },

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.INFO);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.PROMO);
  },

  exportJSON() {
    const data = {
      restaurantInfo: this.getRestaurantInfo(),
      promoBanner: this.getPromoBanner(),
      categories: this.getCategories(),
      items: this.getItems(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.restaurantInfo) this.saveRestaurantInfo(parsed.restaurantInfo);
      if (parsed.promoBanner) this.savePromoBanner(parsed.promoBanner);
      if (parsed.categories) this.saveCategories(parsed.categories);
      if (parsed.items) this.saveItems(parsed.items);
      return true;
    } catch (err) {
      console.error("Invalid JSON import", err);
      return false;
    }
  }
};
