import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION FIREBASE — Remplacez ces valeurs par celles de votre projet
// ═══════════════════════════════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCTDRZhgcs1ep1pnGtJFA6tanDFewm6YS0",
  authDomain:        "pocket-museum-eaa1f.firebaseapp.com",
  projectId:         "pocket-museum-eaa1f",
  storageBucket:     "pocket-museum-eaa1f.firebasestorage.app",
  messagingSenderId: "223199682483",
  appId:             "1:223199682483:web:6ff99a2ced9ec06450b5c6",
  measurementId:     "G-SJZGKRXW5Q",
};
// ═══════════════════════════════════════════════════════════════════════════

// Identifiant unique de l'appareil (stocké localement)
const getDeviceId = () => {
  let id = localStorage.getItem("pm-device-id");
  if (!id) { id = "user-" + Math.random().toString(36).slice(2, 10); localStorage.setItem("pm-device-id", id); }
  return id;
};

const LANG_KEY = "pocket-museum-lang";

const TRANSLATIONS = {
  fr: {
    // Metals & conditions
    metals: ["Or", "Argent", "Bronze", "Cuivre", "Fer", "Nickel", "Plomb", "Étain", "Tungstène", "Inconnu"],
    conditions: ["Excellent", "Bon", "Moyen", "Mauvais", "Fragmenté"],
    // Splash
    appLine1: "Pocket", appLine2: "MUSEUM",
    // Header
    registreLabel: "Registre de", appTitle: "Détection de Métaux",
    // Home stats
    totalFinds: "Total trouvailles", rareFinds: "Trouvailles rares",
    chooseCollection: "Choisir la collection",
    noFinds: "Aucune trouvaille", oneFind: "1 trouvaille", manyFinds: "trouvailles",
    // Folder view
    searchPlaceholder: "Rechercher...", allMetals: "Tous les métaux",
    addBtn: "+ Ajouter", noFindsFolder: "Aucune trouvaille dans ce dossier",
    noFindsHint: 'Cliquez sur "+ Ajouter" pour enregistrer votre première trouvaille',
    // Add/Edit form
    newPiece: "Nouvelle pièce", editFiche: "✏️ Modifier la fiche",
    photos: "Photos", recto: "Recto", verso: "Verso",
    name: "Nom / Description", namePlaceholder: "ex: 1 cent 1967, 25 cents Élisabeth II...",
    metal: "Métal", year: "Année", yearPlaceholder: "ex: 1952",
    condition: "État", date: "Date de découverte",
    depth: "Profondeur (cm)", depthPlaceholder: "ex: 15",
    weight: "Poids (g)", weightPlaceholder: "ex: 8.5",
    sonicIndex: "Indice sonore", sonicIndexPlaceholder: "ex: 12",
    sonicIndexLabel: "Indice sonore",
    location: "Lieu de découverte", locationPlaceholder: "ex: Forêt de Fontainebleau, champ nord...",
    notes: "Notes", notesPlaceholder: "Observations, contexte, particularités...",
    rareLabel: "⭐ Trouvaille rare", rareDesc: "Pièce exceptionnelle, peu commune ou de grande valeur",
    cancel: "Annuler", save: "Sauvegarder", register: "Enregistrer",
    // Detail view
    edit: "✏️ Modifier", delete: "Supprimer",
    metalLabel: "Métal", yearLabel: "Année", conditionLabel: "État",
    depthLabel: "Profondeur", weightLabel: "Poids", locationLabel: "Lieu",
    notesLabel: "Notes", rareBadge: "⭐ Trouvaille rare",
    // Map
    mapBtn: "Carte", mapTitle: "Carte des trouvailles",
    mapPoints: "point localisé", mapPointsPlural: "points localisés",
    geocoding: "Géocodage", noLocation: "Aucune trouvaille avec un lieu enregistré",
    noLocationHint: "Ajoutez un lieu lors de l'enregistrement d'une trouvaille",
    locating: "Localisation des trouvailles...",
    confirmLocation: "✓ Confirmer ce lieu", chooseLocation: "📍 Choisir un emplacement",
    clickMap: "Cliquez sur la carte pour choisir un lieu",
    searchingAddress: "Recherche de l'adresse...", locationSelected: "Emplacement sélectionné",
    addressNotFound: "Adresse introuvable sur la carte", connectionError: "Erreur de connexion",
    loadingMap: "Chargement de la carte...", closeBtn: "Fermer",
    openFiche: "→ Voir la fiche",
    // Countries
    countryCA: "Canadien", countryUS: "Américain", countryBJ: "Bijoux", countryINT: "International",
    foldersByValue: "Dossiers par valeur", elements: "éléments", oneElement: "1 élément", noElements: "Aucun élément",
    // Folders
    folders: { "1c":"1 cent","5c":"5 cents","10c":"10 cents","25c":"25 cents","50c":"50 cents","1d":"1 dollar","2d":"2 dollars","autre":"Autres","bague":"Bagues","pendentif":"Pendentifs","boucle":"Boucles d'oreilles","int-autre":"Autres" },
    // Back labels
    home: "Accueil",
  },
  en: {
    metals: ["Gold", "Silver", "Bronze", "Copper", "Iron", "Nickel", "Lead", "Tin", "Tungsten", "Unknown"],
    conditions: ["Excellent", "Good", "Fair", "Poor", "Fragmented"],
    appLine1: "Pocket", appLine2: "MUSEUM",
    registreLabel: "Registry of", appTitle: "Metal Detection",
    totalFinds: "Total finds", rareFinds: "Rare finds",
    chooseCollection: "Choose collection",
    noFinds: "No finds", oneFind: "1 find", manyFinds: "finds",
    searchPlaceholder: "Search...", allMetals: "All metals",
    addBtn: "+ Add", noFindsFolder: "No finds in this folder",
    noFindsHint: 'Click "+ Add" to register your first find',
    newPiece: "New item", editFiche: "✏️ Edit item",
    photos: "Photos", recto: "Front", verso: "Back",
    name: "Name / Description", namePlaceholder: "e.g. 1 cent 1967, Quarter Elizabeth II...",
    metal: "Metal", year: "Year", yearPlaceholder: "e.g. 1952",
    condition: "Condition", date: "Discovery date",
    depth: "Depth (cm)", depthPlaceholder: "e.g. 15",
    weight: "Weight (g)", weightPlaceholder: "e.g. 8.5",
    sonicIndex: "Sonic index", sonicIndexPlaceholder: "e.g. 12",
    sonicIndexLabel: "Sonic index",
    location: "Location", locationPlaceholder: "e.g. Central Park, north field...",
    notes: "Notes", notesPlaceholder: "Observations, context, details...",
    rareLabel: "⭐ Rare find", rareDesc: "Exceptional, uncommon or high-value item",
    cancel: "Cancel", save: "Save", register: "Register",
    edit: "✏️ Edit", delete: "Delete",
    metalLabel: "Metal", yearLabel: "Year", conditionLabel: "Condition",
    depthLabel: "Depth", weightLabel: "Weight", locationLabel: "Location",
    notesLabel: "Notes", rareBadge: "⭐ Rare find",
    mapBtn: "Map", mapTitle: "Finds map",
    mapPoints: "located point", mapPointsPlural: "located points",
    geocoding: "Geocoding", noLocation: "No finds with a registered location",
    noLocationHint: "Add a location when registering a find",
    locating: "Locating finds...",
    confirmLocation: "✓ Confirm location", chooseLocation: "📍 Choose a location",
    clickMap: "Click on the map to choose a location",
    searchingAddress: "Looking up address...", locationSelected: "Location selected",
    addressNotFound: "Address not found on map", connectionError: "Connection error",
    loadingMap: "Loading map...", closeBtn: "Close",
    openFiche: "→ View details",
    countryCA: "Canadian", countryUS: "American", countryBJ: "Jewelry", countryINT: "International",
    foldersByValue: "Folders by value", elements: "items", oneElement: "1 item", noElements: "No items",
    folders: { "1c":"1 cent","5c":"5 cents","10c":"10 cents","25c":"25 cents","50c":"50 cents","1d":"1 dollar","2d":"2 dollars","autre":"Other","bague":"Rings","pendentif":"Pendants","boucle":"Earrings","int-autre":"Other" },
    home: "Home",
  },
};


const METAL_TYPES = ["Or", "Argent", "Bronze", "Cuivre", "Fer", "Nickel", "Plomb", "Étain", "Tungstène", "Inconnu"];
const CONDITIONS = ["Excellent", "Bon", "Moyen", "Mauvais", "Fragmenté"];

const COUNTRIES = [
  {
    id: "ca",
    label: "Canadien",
    color: "#C8102E",
    accent: "#FF2D4E",
    shadow: "#C8102E55",
    flag: (size = 80) => <FlagCA size={size} />,
  },
  {
    id: "us",
    label: "Américain",
    color: "#3C3B6E",
    accent: "#5B5AAA",
    shadow: "#3C3B6E55",
    flag: (size = 80) => (
      <svg width={size} height={size * 0.525} viewBox="0 0 190 100" xmlns="http://www.w3.org/2000/svg">
        {/* Stripes */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={i} x="0" y={i*(100/13)} width="190" height={100/13}
            fill={i % 2 === 0 ? "#B22234" : "white"}/>
        ))}
        {/* Canton */}
        <rect x="0" y="0" width="76" height={100*7/13} fill="#3C3B6E"/>
        {/* Stars (simplified 5×4 + 4×5 = 50) */}
        {Array.from({length: 50}).map((_, i) => {
          const row = Math.floor(i / 6) % 2 === 0
            ? { col: i % 6, rowIdx: Math.floor(i / 6) }
            : { col: i % 5, rowIdx: Math.floor(i / 5) };
          const col = Math.floor(i % 11);
          const r = Math.floor(i / 11);
          const x = 6 + col * 6.5 + (r % 2) * 3.25;
          const y = 5 + r * 5.6;
          return x < 75 ? <polygon key={i}
            points={`${x},${y-2} ${x+0.8},${y-0.4} ${x+2},${y-0.4} ${x+1.2},${y+0.8} ${x+1.6},${y+2} ${x},${y+1.2} ${x-1.6},${y+2} ${x-1.2},${y+0.8} ${x-2},${y-0.4} ${x-0.8},${y-0.4}`}
            fill="white"/> : null;
        })}
      </svg>
    ),
  },
  {
    id: "bj",
    label: "Bijoux",
    color: "#B8860B",
    accent: "#FFD700",
    shadow: "#B8860B55",
    flag: (size = 80) => (
      <svg width={size} height={size * 0.5} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        {/* Fond sombre */}
        <rect width="200" height="100" fill="#1A1408"/>
        {/* Diamant central */}
        <polygon points="100,18 120,42 100,58 80,42" fill="#FFD700" stroke="#FFF8DC" strokeWidth="1"/>
        <polygon points="100,18 120,42 100,32" fill="#FFE55C"/>
        <polygon points="100,32 120,42 100,58" fill="#B8860B"/>
        <polygon points="80,42 100,32 100,58" fill="#DAA520"/>
        <polygon points="100,18 80,42 100,32" fill="#FFC200"/>
        {/* Petites gemmes */}
        <polygon points="52,30 60,40 52,48 44,40" fill="#E8D98A" opacity="0.85"/>
        <polygon points="148,30 156,40 148,48 140,40" fill="#E8D98A" opacity="0.85"/>
        {/* Brillance — étoiles */}
        <line x1="100" y1="8"  x2="100" y2="14" stroke="#FFD700" strokeWidth="1.5"/>
        <line x1="126" y1="14" x2="122" y2="19" stroke="#FFD700" strokeWidth="1.5"/>
        <line x1="74"  y1="14" x2="78"  y2="19" stroke="#FFD700" strokeWidth="1.5"/>
        {/* Collier */}
        <path d="M60,70 Q100,85 140,70" fill="none" stroke="#FFD700" strokeWidth="2"/>
        <circle cx="60"  cy="70" r="3" fill="#FFD700"/>
        <circle cx="100" cy="85" r="3" fill="#FFD700"/>
        <circle cx="140" cy="70" r="3" fill="#FFD700"/>
        <circle cx="80"  cy="79" r="2" fill="#FFD700" opacity="0.8"/>
        <circle cx="120" cy="79" r="2" fill="#FFD700" opacity="0.8"/>
      </svg>
    ),
  },
  {
    id: "int",
    label: "International",
    color: "#2E6B9E",
    accent: "#5BA3D9",
    shadow: "#2E6B9E55",
    flag: (size = 80) => (
      <svg width={size} height={size * 0.5} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="100" fill="#0D1F35"/>
        {/* Globe */}
        <circle cx="100" cy="50" r="36" fill="none" stroke="#2E6B9E" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="100" cy="50" r="36" fill="#0D2A45"/>
        {/* Latitude lines */}
        {[-20, 0, 20].map((dy, i) => (
          <ellipse key={i} cx="100" cy={50 + dy} rx={Math.sqrt(36*36 - dy*dy)} ry="7"
            fill="none" stroke="#3A7BB5" strokeWidth="0.8" opacity="0.6"/>
        ))}
        {/* Longitude lines */}
        {[-24, 0, 24].map((dx, i) => (
          <ellipse key={i} cx={100 + dx * 0.3} cy="50" rx="8" ry="36"
            fill="none" stroke="#3A7BB5" strokeWidth="0.8" opacity="0.6"/>
        ))}
        {/* Equator */}
        <line x1="64" y1="50" x2="136" y2="50" stroke="#5BA3D9" strokeWidth="1" opacity="0.8"/>
        {/* Continents simplified */}
        <ellipse cx="88" cy="42" rx="10" ry="7" fill="#2E6B9E" opacity="0.8"/>
        <ellipse cx="110" cy="46" rx="8" ry="5" fill="#2E6B9E" opacity="0.7"/>
        <ellipse cx="94" cy="58" rx="7" ry="5" fill="#2E6B9E" opacity="0.6"/>
        <ellipse cx="115" cy="36" rx="5" ry="4" fill="#2E6B9E" opacity="0.6"/>
        {/* Glow */}
        <circle cx="100" cy="50" r="36" fill="none" stroke="#5BA3D9" strokeWidth="2" opacity="0.3"/>
        {/* Stars around */}
        {[0,45,90,135,180,225,270,315].map((a, i) => {
          const rad = a * Math.PI / 180;
          const x = 100 + Math.cos(rad) * 46;
          const y = 50 + Math.sin(rad) * 40;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#5BA3D9" opacity="0.7"/>;
        })}
      </svg>
    ),
  },
];

const FOLDERS_COINS = [
  { id: "1c",    label: "1 cent",    color: "#B87333", glow: "#B8733344" },
  { id: "5c",    label: "5 cents",   color: "#9EA8A0", glow: "#9EA8A044" },
  { id: "10c",   label: "10 cents",  color: "#9EA8A0", glow: "#9EA8A044" },
  { id: "25c",   label: "25 cents",  color: "#C0C0C0", glow: "#C0C0C044" },
  { id: "50c",   label: "50 cents",  color: "#C0C0C0", glow: "#C0C0C044" },
  { id: "1d",    label: "1 dollar",  color: "#F5C842", glow: "#F5C84244" },
  { id: "2d",    label: "2 dollars", color: "#F5C842", glow: "#F5C84244" },
  { id: "autre", label: "Autres",    color: "#8B7D5A", glow: "#8B7D5A44" },
];

const FOLDERS_BIJOUX = [
  { id: "bague",    label: "Bagues",           color: "#FFD700", glow: "#FFD70044", icon: "💍" },
  { id: "pendentif",label: "Pendentifs",        color: "#DAA520", glow: "#DAA52044", icon: "📿" },
  { id: "boucle",   label: "Boucles d'oreilles",color: "#B8860B", glow: "#B8860B44", icon: "✨" },
  { id: "autre",    label: "Autres",            color: "#8B7D5A", glow: "#8B7D5A44", icon: "🔮" },
];

const getFolders = (countryId) => countryId === "bj" ? FOLDERS_BIJOUX : FOLDERS_COINS;
// Keep FOLDERS as alias for backward compat in defaultForm
const FOLDERS = FOLDERS_COINS;

const defaultForm = {
  name: "", metal: "Inconnu", year: "", condition: "Bon",
  depth: "", location: "", date: new Date().toISOString().split("T")[0],
  notes: "", weight: "", sonicIndex: "", photo: null, photo2: null,
  folder: "autre", country: "ca", rare: false,
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

const metalColors = {
  "Or": "#F5C842", "Argent": "#C0C0C0", "Bronze": "#CD7F32",
  "Cuivre": "#B87333", "Fer": "#8B8B8B", "Nickel": "#9EA8A0",
  "Plomb": "#808080", "Étain": "#A8A9AD", "Tungstène": "#5A6672", "Inconnu": "#666677",
};

// ── Canadian flag — photo réelle ────────────────────────────────────────────
const FLAG_CA_B64 = "data:image/webp;base64,UklGRp4HAABXRUJQVlA4IJIHAABwLgCdASoVAbQAPp1OpEulpKQipRaZaLATiU3cLUoXhDP8Br5ngP6N+xn5M9MtwD4NyjfoB/f/cP2lP0B7An6vf6PqXeZL9lv1A9qr9qveh+wn63fAB+w/XB+g90qf7e/sz7VWq5sN/1NkX7hHYjKp4MaU1m79seBEOzKE6zwFCpAZkYs8gubATXbijK19PREWpOAxqhKzuuDvpdHMlBC4IURicmWLfCqt/U8Hse2j9/HwyHynU6ki2LLDc//Bqvt9hacZtb0yDBt7MKh1Z5CCfs8q5+dNF5JgchIReFBsMF97haWkNBapnVsdGgu3SUjmOrx0oI7fHc1rYaC1vWU86SuULb9AFz92ssWSl2VrL1M7pDPPKCDnK9aE+q/FVDuKnC4EFcn8IKZs1Iy/J59p8nBkw2p5I/UsMku06e2cbmlOpf/hUpjC4TUH3IKMB4Hx6a0ls2U/8QCTEwMNSIW/o74aKqQhb6W6ZtddGeAxT5qzu+kBcJxRla+nEAD++ZKf5iAKgjav+5h9iHEXi13mnyZ/e19sLvfAzA5iUv7X8Gp31XyglCXXFR8KXLNJZwfZOXAqfAAC+q2rhmob0LLe8r7dyh0DT8J7gTR5O6vZafJjHzMRhec8/b6DGO5n7eQFe2z5V+b65Yf7aJn2Ueo7grgmFhI5/a56cqsQQCewMUkQiffxLVNwqigKvT/EsSfuwCyy9IEwP27k5BP2htEcVV3CuOF6YUHCakNo/YIm2lFREu8xBfqQNeaSFvvfTNUFpUYcA1avj3Bs02eY45fD43qEvvNIcQ/vXbRQLHrh246Dr105Wgn+14Mfd4oRQuFG26sPv77g6feqCZTOACw7TG4XzG584Sp3cZwVY7snDG6gXyODUqz5QdTZuWihYsdC0vhig04JqZ6qcLp6vAjGq2chA0fvksQDzqfmF5m9cP65ScXVA6M6h6gkdjAhLLHQ1nduS6bFVxYQKth2fzZ44EBhYQzQyC6dB45kPz8AQS3Mkxpwo9UvN+142I2YzVwrCyqkrM5QmxoAMwIm+U9j2pExf6UKBMP+p+karMwDky4XTC8PSGLyjZg390hvOICDYBcDpTX5VAmZr/vCd0RGlCaMMaxvDtzcvIWnqiEYwuQPt7ii8/zQMvdz6EqN2VM6+thnQ+Vn5yPI99LyfmHDoD0eem5cllfLCnlKHXMUiOvLdFvhZt9GfdkL+a18LawfQ1H/FFs5qo2vhk7U223LHblu/gIfDmaxsJ44/jsQXm/PavDMdH0skRhwe/txTZL3rEPEZ6V/z+oUOxsRbjYdZsdVUTg4hagereZKvcRWrL6fAYjvkExl4fU6QcZ77jt1PH2SNCW7q8sS2osuff/DxlrVejhCxDz5L7qsQYojyYMzk2BdWfOXyw3dEvpLFs0R1un8LEqBLnhyh/aC1++F1MDnLnU0R5FO1YpXXG2PYKVvTWm6c1XV/z9dL3ZonziNlDwGRBlr4yqo5t4ltY7UfmIqC0FsWPg3jdz4Qm0aZZQ+xM8BW+QkPbxiVdZn/CPAwAJcFTXWiMHFebNy74kPsMS2kAIKuBT805kuffoQSHcg/j6If+ZCQwzngKfvtx2Z62pym9qftuuRPaECk/cERvDwbwV0AsbWnJVWGZgoERzhAZfekW2txmNHx81D8H4O2veXay5Il9YvfxZItHLsLnIipTDW9z4p/dd0g7pJdX4PVsRIRpODn6aPkL6ERQPrSCQewkOcvanfzg2q3rPHen9t/srbjgKrOShlFQ5HspAuijmAv+tyup9iXaVzEg3FUGZMdNg2Nh4NUNykgBwj0DZmaCHJRCsUWdDaAFl1VPzHduBFRtFYbRo1V+fr07jfRfpPanRg46jL5C4SZlzHYSZzE7MSScFFY9lpwgAFqm0LvYK0SsqNY4gj3NSMqSQXTs2wS1lpuwuMnKUqYoMEJLm1ic9+PgQIgSLMLaCeD1DJ6ytD6PJBBv9dyiR8jy3AuyMEDFR0jcvGGy6lGCnxUlm1kEHnD1H5EhwvI3I71OpKuX2O+0QM+rn4k3BJbrEq1H1xtbVQjbjQgkRZEIWeiMT+rDAlTEafx39W0yXsvbOeZ9EvmtvCszJHcH79TNvO/nG79jKlT3GIJvIyzwS+QxJ5bCgMPVdM/a+6vjKqKwmB8WihAFmRdTfOYZjfD286iKVFswgS00oM9TgnH5lXslIr9nwt5BuWlaRb2bMmAaV/QKZp2QO3mn1xrJQYekBuMlqrTmtONQ4fDlMxHGYWA+1gd3ZG/mlIPr3tLDGckwdu6mD2GSOw4s+JNGK7gxdFJLEsYhLqaLuSy4Esdbr99CDBu+DS39OLsaddZviq7ooouo496sCbVx0WdsS77LnTVP21XgfxB8gVsMTxilyoV/BXOnWT6x0KkwXkuPMRgcUcCSGnPHP4keAgr+ErBZek8yw6DFYfK2GNpKP/Fm4hxlBeFoKD4+E7GuQGI4Die5LkeXquUa4ZNLhJpYz5NFS9ie9CR0hhn2+rYHeLXW9yCz/4Y58Od81nDdntLfsIEUtq9nVZ2o1xS3gBpJmqIiKlSazSxquizS3bMtoALHe4AAA=";
function FlagCA({ size = 72 }) {
  const h = Math.round(size * 0.5);
  return (
    <img
      src={FLAG_CA_B64}
      width={size}
      height={h}
      alt="Drapeau canadien"
      style={{ objectFit: "cover", borderRadius: 2, display: "block" }}
    />
  );
}

// ── US flag SVG ─────────────────────────────────────────────────────────────
function FlagUS({ size = 72 }) {
  const stripes = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  const starRows = [];
  for (let r = 0; r < 9; r++) {
    const cols = r % 2 === 0 ? 6 : 5;
    const offsetX = r % 2 === 0 ? 0 : 3.2;
    for (let c = 0; c < cols; c++) {
      starRows.push({ x: 4.5 + offsetX + c * 6.4, y: 3.5 + r * 4.5 });
    }
  }
  return (
    <svg width={size} height={Math.round(size * 0.526)} viewBox="0 0 190 100" xmlns="http://www.w3.org/2000/svg">
      {stripes.map(i => (
        <rect key={i} x="0" y={i * (100/13)} width="190" height={100/13 + 0.5}
          fill={i % 2 === 0 ? "#B22234" : "white"}/>
      ))}
      <rect x="0" y="0" width="76" height={100*7/13} fill="#3C3B6E"/>
      {starRows.filter(s => s.x < 74 && s.y < 54).map((s, i) => (
        <polygon key={i}
          points={`${s.x},${s.y-2.2} ${s.x+0.7},${s.y-0.5} ${s.x+2.2},${s.y-0.5} ${s.x+1.1},${s.y+0.7} ${s.x+1.5},${s.y+2} ${s.x},${s.y+1.1} ${s.x-1.5},${s.y+2} ${s.x-1.1},${s.y+0.7} ${s.x-2.2},${s.y-0.5} ${s.x-0.7},${s.y-0.5}`}
          fill="white"/>
      ))}
    </svg>
  );
}

// ── Photo uploader ──────────────────────────────────────────────────────────
function PhotoUploader({ value, onChange, label = "Photo" }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        let { width, height } = img;
        if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        onChange(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };

  if (value) return (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(139,125,90,0.3)" }}>
      <img src={value} alt="Trouvaille" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
      <button onClick={() => onChange(null)} style={{ position: "absolute", top: 8, right: 8,
        background: "rgba(13,13,15,0.85)", border: "1px solid rgba(139,125,90,0.4)", borderRadius: 6,
        color: "#C06050", padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
      <button onClick={() => inputRef.current.click()} style={{ position: "absolute", top: 8, left: 8,
        background: "rgba(13,13,15,0.85)", border: "1px solid rgba(139,125,90,0.4)", borderRadius: 6,
        color: "#8B7D5A", padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>↺</button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => processFile(e.target.files[0])} />
    </div>
  );

  return (
    <div onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)} onDrop={handleDrop}
      style={{ border: `2px dashed ${dragging ? "#C4A96B" : "rgba(139,125,90,0.25)"}`,
        borderRadius: 10, padding: "22px 12px", textAlign: "center", cursor: "pointer",
        background: dragging ? "rgba(196,169,107,0.06)" : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
      <div style={{ fontSize: 12, color: "#8B7D5A", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: "#6B6050" }}>Cliquer ou glisser</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => processFile(e.target.files[0])} />
    </div>
  );
}

// ── Shared background ───────────────────────────────────────────────────────
function Bg() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { max-width: 100vw; overflow-x: hidden; }
        input, select, textarea, button { max-width: 100%; }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 10%, #1A1408 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #080D1A 0%, transparent 60%)" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.012'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
    </>
  );
}

// ── Shared header ───────────────────────────────────────────────────────────
function Header({ backLabel, onBack, onMap, onToggleLang, lang }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Ligne de boutons au-dessus du titre */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14, minHeight: 44, gap: 8 }}>

        {/* Gauche : bouton retour */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", minWidth: 0 }}>
          {onBack ? (
            <button onClick={onBack} style={{
              background: "rgba(139,125,90,0.1)", border: "1px solid rgba(139,125,90,0.45)", borderRadius: 8,
              color: "#C8B87A", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5, padding: "10px 12px", minHeight: 44,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)", transition: "all 0.2s",
              maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(139,125,90,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(139,125,90,0.1)"}>
              ← {backLabel}
            </button>
          ) : <div />}
        </div>

        {/* Droite : langue + carte */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {onToggleLang && (
            <button onClick={onToggleLang} style={{
              background: "rgba(139,125,90,0.1)", border: "1px solid rgba(139,125,90,0.35)",
              borderRadius: 20, padding: "10px 14px", cursor: "pointer", minHeight: 44,
              color: "#C8B87A", fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: "0.05em",
              transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(139,125,90,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(139,125,90,0.1)"}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
          )}
          {onMap && (
            <button onClick={onMap} style={{
              background: "rgba(139,125,90,0.1)", border: "1px solid rgba(139,125,90,0.45)", borderRadius: 8,
              color: "#C8B87A", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", minHeight: 44,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(139,125,90,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(139,125,90,0.1)"}>
              🗺️ {lang === "fr" ? "Carte" : "Map"}
            </button>
          )}
        </div>
      </div>

      {/* Titre centré en dessous */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#8B7D5A", textTransform: "uppercase", marginBottom: 5 }}>
          {lang === "fr" ? "Registre de" : "Registry of"}
        </div>
        <h1 style={{ fontSize: "clamp(1.2rem, 4.5vw, 2.8rem)", fontWeight: 400, color: "#E8D98A",
          letterSpacing: "0.05em", margin: 0, textShadow: "0 0 40px rgba(232,217,138,0.3)" }}>
          {lang === "fr" ? "Détection de Métaux" : "Metal Detection"}
        </h1>
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #8B7D5A, transparent)", margin: "8px auto 0" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════



// ── Sélecteur de lieu via carte ───────────────────────────────────────────────
// ── Translation helpers ───────────────────────────────────────────────────────
const FR_METALS = ["Or", "Argent", "Bronze", "Cuivre", "Fer", "Nickel", "Plomb", "Étain", "Tungstène", "Inconnu"];
const EN_METALS = ["Gold", "Silver", "Bronze", "Copper", "Iron", "Nickel", "Lead", "Tin", "Tungsten", "Unknown"];
const FR_CONDITIONS = ["Excellent", "Bon", "Moyen", "Mauvais", "Fragmenté"];
const EN_CONDITIONS = ["Excellent", "Good", "Fair", "Poor", "Fragmented"];

function translateMetal(metal, lang) {
  if (lang === "en") {
    const idx = FR_METALS.indexOf(metal);
    return idx >= 0 ? EN_METALS[idx] : metal;
  }
  return metal;
}
function translateCondition(cond, lang) {
  if (lang === "en") {
    const idx = FR_CONDITIONS.indexOf(cond);
    return idx >= 0 ? EN_CONDITIONS[idx] : cond;
  }
  return cond;
}

function MapPicker({ onSelect, onClose, initialLocation, t }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const [address, setAddress] = React.useState("");
  const [coords, setCoords] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [leafletReady, setLeafletReady] = React.useState(false);

  // Load Leaflet dynamically
  React.useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Init map once Leaflet is ready
  React.useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current).setView([46.5, -72.5], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    // Custom gold marker
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#E8D98A;border:3px solid #8B7D5A;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      // Reverse geocode
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(addr);
      } catch {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
      setLoading(false);
    });

    // GPS locate
    map.locate({ setView: true, maxZoom: 14 });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [leafletReady]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(13,13,15,0.92)", backdropFilter: "blur(6px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px) 0",
    }}>
      <div style={{
        width: "100%", maxWidth: 640, background: "#1A1812",
        border: "1px solid rgba(139,125,90,0.4)", borderRadius: 14,
        overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
        maxHeight: "100dvh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(139,125,90,0.2)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#E8D98A", fontFamily: "Georgia, serif", fontSize: 16 }}>
            📍 Choisir un emplacement
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none",
            color: "#8B7D5A", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* Map */}
        <div ref={mapRef} style={{ width: "100%", height: "calc(100dvh - 180px)", minHeight: 260 }}>
          {!leafletReady && (
            <div style={{ height: "calc(100dvh - 180px)", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#8B7D5A", fontFamily: "Georgia, serif" }}>Chargement de la carte...</div>
          )}
        </div>

        {/* Address bar */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(139,125,90,0.2)",
          background: "rgba(255,255,255,0.02)" }}>
          <div style={{ color: "#8B7D5A", fontSize: 11, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 6 }}>
            {loading ? (t ? t.searchingAddress : "Recherche...") : coords ? (t ? t.locationSelected : "Sélectionné") : (t ? t.clickMap : "Cliquez sur la carte")}
          </div>
          {address && (
            <div style={{ color: "#C8B87A", fontSize: 13, fontFamily: "Georgia, serif",
              marginBottom: 10, lineHeight: 1.4 }}>{address}</div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={() => coords && onSelect(address || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)}
              disabled={!coords}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, cursor: coords ? "pointer" : "not-allowed",
                background: coords ? "rgba(232,217,138,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${coords ? "rgba(232,217,138,0.5)" : "rgba(139,125,90,0.2)"}`,
                color: coords ? "#E8D98A" : "#4A4035",
                fontFamily: "Georgia, serif", fontSize: 14, transition: "all 0.2s",
              }}>
              ✓ Confirmer ce lieu
            </button>
            <button onClick={onClose} style={{
              padding: "10px 16px", borderRadius: 8, cursor: "pointer",
              background: "transparent", border: "1px solid rgba(139,125,90,0.25)",
              color: "#8B7D5A", fontFamily: "Georgia, serif", fontSize: 14,
            }}>{t.cancel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Visualiseur de lieu (lecture seule) ──────────────────────────────────────
function MapViewer({ location, onClose, t }) {
  const mapRef = React.useRef(null);
  const [leafletReady, setLeafletReady] = React.useState(!!window.L);
  const [status, setStatus] = React.useState("Recherche de l'adresse...");

  React.useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  React.useEffect(() => {
    if (!leafletReady || !mapRef.current) return;
    const L = window.L;

    // Try to geocode the address
    const isCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(location.trim());
    
    const initMap = (lat, lng) => {
      const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;background:#E8D98A;border:3px solid #8B7D5A;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(0,0,0,0.6)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup(`<b style="font-family:Georgia,serif;color:#333">${location}</b>`)
        .openPopup();
      setStatus(null);
      return () => map.remove();
    };

    if (isCoords) {
      const [lat, lng] = location.split(",").map(Number);
      return initMap(lat, lng);
    } else {
      // Geocode via Nominatim
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`)
        .then(r => r.json())
        .then(data => {
          if (data && data[0]) {
            initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
          } else {
            setStatus((t ? t.addressNotFound : "Adresse introuvable"));
          }
        })
        .catch(() => setStatus((t ? t.connectionError : "Erreur de connexion")));
    }
  }, [leafletReady, location]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(13,13,15,0.92)", backdropFilter: "blur(6px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px) 0",
    }}>
      <div style={{
        width: "100%", maxWidth: 640, background: "#1A1812",
        border: "1px solid rgba(139,125,90,0.4)", borderRadius: 14,
        overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
        maxHeight: "100dvh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(139,125,90,0.2)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#E8D98A", fontFamily: "Georgia, serif", fontSize: 15, flex: 1, marginRight: 12 }}>
            📍 {location}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none",
            color: "#8B7D5A", fontSize: 22, cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        {/* Map */}
        <div style={{ position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "calc(100dvh - 160px)", minHeight: 280 }} />
          {status && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", color: "#8B7D5A", fontFamily: "Georgia, serif", fontSize: 14,
              background: "#0D0D0F" }}>
              {status}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(139,125,90,0.2)",
          display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "12px 22px", minHeight: 44, borderRadius: 8, cursor: "pointer",
            background: "rgba(139,125,90,0.12)", border: "1px solid rgba(139,125,90,0.4)",
            color: "#C8B87A", fontFamily: "Georgia, serif", fontSize: 14,
          }}>{t ? t.closeBtn : "Fermer"}</button>
        </div>
      </div>
    </div>
  );
}


// ── Carte globale de toutes les trouvailles ───────────────────────────────────
function MapAllFinds({ finds, onClose, onSelectFind, t }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const [leafletReady, setLeafletReady] = React.useState(!!window.L);
  const [geocoded, setGeocoded] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Geocode all finds with locations
  React.useEffect(() => {
    const withLocation = finds.filter(f => f.location && f.location.trim());
    setTotal(withLocation.length);
    if (withLocation.length === 0) return;

    const results = [];
    const processNext = async (index) => {
      if (index >= withLocation.length) {
        setGeocoded(results);
        return;
      }
      const f = withLocation[index];
      const loc = f.location.trim();
      const isCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(loc);
      try {
        if (isCoords) {
          const [lat, lng] = loc.split(",").map(Number);
          results.push({ find: f, lat, lng });
        } else {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc)}&format=json&limit=1`);
          const data = await res.json();
          if (data && data[0]) {
            results.push({ find: f, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          }
        }
      } catch(e) {}
      setProgress(index + 1);
      // Rate limit Nominatim: 1 req/sec
      setTimeout(() => processNext(index + 1), isCoords ? 0 : 1100);
    };
    processNext(0);
  }, [finds]);

  // Init/update map when geocoded points are ready
  React.useEffect(() => {
    if (!leafletReady || !mapRef.current || geocoded.length === 0) return;
    const L = window.L;

    // Remove old map
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    const map = L.map(mapRef.current).setView([46.5, -72.5], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    const METAL_COLORS_HEX = {
      "Or": "#FFD700", "Argent": "#C0C0C0", "Bronze": "#CD7F32",
      "Cuivre": "#B87333", "Fer": "#808080", "Nickel": "#9EA8A0",
      "Plomb": "#708090", "Étain": "#8B9EA0", "Inconnu": "#8B7D5A",
    };

    const bounds = [];
    geocoded.forEach(({ find, lat, lng }) => {
      const color = METAL_COLORS_HEX[find.metal] || "#E8D98A";
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:22px;height:22px;
          background:${color};
          border:2px solid rgba(0,0,0,0.5);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.6);
          cursor:pointer;
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Mini popup avec bouton "Voir la fiche"
      const openFicheLabel = t ? t.openFiche : "→ Voir la fiche";
      const popupContent = document.createElement("div");
      popupContent.style.cssText = "font-family:Georgia,serif;min-width:170px;";
      popupContent.innerHTML = `
        ${find.photo ? `<img src="${find.photo}" style="width:100%;border-radius:6px 6px 0 0;max-height:90px;object-fit:cover;display:block;margin:-10px -10px 10px -10px;width:calc(100% + 20px)"/>` : ""}
        <div style="font-weight:bold;font-size:14px;color:#222;margin-bottom:4px">${find.name}</div>
        <div style="font-size:12px;color:#666;margin-bottom:2px">⚙ ${translateMetal(find.metal, t ? (t === TRANSLATIONS.en ? "en" : "fr") : "fr")}${find.year ? " · " + find.year : ""}</div>
        <div style="font-size:11px;color:#888;margin-bottom:10px">📍 ${find.location}</div>
        <button id="open-find-${find.id}" style="
          width:100%;padding:7px 0;border-radius:6px;cursor:pointer;
          background:#2A2515;border:1px solid #C8B87A;
          color:#E8D98A;font-family:Georgia,serif;font-size:13px;
        ">${openFicheLabel}</button>
      `;
      const popup = L.popup({ maxWidth: 220, className: "find-popup" }).setContent(popupContent);
      marker.bindPopup(popup);

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`open-find-${find.id}`);
          if (btn) btn.addEventListener("click", () => { onSelectFind(find); });
        }, 50);
      });

      bounds.push([lat, lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    mapInstanceRef.current = map;
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [leafletReady, geocoded]);

  const withLocation = finds.filter(f => f.location && f.location.trim());

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(13,13,15,0.95)", backdropFilter: "blur(6px)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(139,125,90,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#1A1812", flexShrink: 0 }}>
        <div>
          <div style={{ color: "#E8D98A", fontFamily: "Georgia, serif", fontSize: 17 }}>🗺️ {t ? t.mapTitle : "Carte des trouvailles"}</div>
          <div style={{ color: "#6B6050", fontSize: 12, marginTop: 2 }}>
            {geocoded.length} point{geocoded.length !== 1 ? "s" : ""} localisé{geocoded.length !== 1 ? "s" : ""}
            {progress < total ? ` · ${t ? t.geocoding : "Géocodage"} ${progress}/${total}...` : ""}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(139,125,90,0.12)",
          border: "1px solid rgba(139,125,90,0.4)", borderRadius: 8,
          color: "#C8B87A", fontSize: 14, cursor: "pointer",
          padding: "11px 18px", minHeight: 44, fontFamily: "Georgia, serif" }}>{t ? t.closeBtn : "Fermer"}</button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {withLocation.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "#6B6050", fontFamily: "Georgia, serif", background: "#0D0D0F", gap: 12 }}>
            <div style={{ fontSize: 40 }}>📍</div>
            <div style={{ fontSize: 16, color: "#8B7D5A" }}>Aucune trouvaille avec un lieu enregistré</div>
            <div style={{ fontSize: 13 }}>Ajoutez un lieu lors de l'enregistrement d'une trouvaille</div>
          </div>
        )}
        {withLocation.length > 0 && geocoded.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "#8B7D5A", fontFamily: "Georgia, serif", background: "#0D0D0F", gap: 12 }}>
            <div style={{ fontSize: 14 }}>Localisation des trouvailles... {progress}/{total}</div>
            <div style={{ width: 200, height: 4, background: "#1A1812", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${total > 0 ? (progress/total)*100 : 0}%`, height: "100%",
                background: "#E8D98A", transition: "width 0.3s", borderRadius: 4 }} />
            </div>
          </div>
        )}
      </div>

      {/* Légende */}
      <div style={{ padding: "10px 18px", background: "#1A1812",
        borderTop: "1px solid rgba(139,125,90,0.2)", flexShrink: 0,
        display: "flex", gap: 12, flexWrap: "wrap" }}>
        {FR_METALS.map((m, mi) => {
          const colors = { "Or":"#FFD700","Argent":"#C0C0C0","Bronze":"#CD7F32","Cuivre":"#B87333",
            "Fer":"#808080","Nickel":"#9EA8A0","Plomb":"#708090","Étain":"#8B9EA0","Tungstène":"#5A6672","Inconnu":"#8B7D5A" };
          const count = finds.filter(f => f.metal === m && f.location).length;
          if (count === 0) return null;
          const displayName = t && t === TRANSLATIONS.en ? EN_METALS[mi] : m;
          return (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%",
                background: colors[m], border: "1px solid rgba(0,0,0,0.3)" }} />
              <span style={{ fontSize: 11, color: "#8B7D5A", fontFamily: "Georgia, serif" }}>{displayName} ({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Écran d'intro avec vidéo ──────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [phase, setPhase] = React.useState(0);
  const lastTap = React.useRef(null);

  const handleTap = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 350) {
      onDone();
    }
    lastTap.current = now;
  };

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 2600);
    const t3 = setTimeout(() => setPhase(3), 3400);
    const t4 = setTimeout(() => setPhase(4), 6800);
    const t5 = setTimeout(onDone, 7600);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, [onDone]);

  const size = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.72, 480);
  const cx = size / 2;
  const R  = size / 2 - 8;

  return (
    <div onTouchStart={handleTap} onClick={handleTap} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#06060A",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      overflow:"hidden",
      opacity: phase >= 4 ? 0 : 1,
      transition: phase >= 4 ? "opacity 1s ease" : "none",
    }}>
      <style>{`
        @keyframes vaultIn {
          from { opacity:0; transform:scale(0.80) translateY(28px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes wheelSpin {
          0%   { transform:rotate(0deg); }
          100% { transform:rotate(-320deg); }
        }
        @keyframes textReveal {
          0%   { opacity:0;   transform:scale(0.90); filter:brightness(0.1) blur(8px); }
          25%  { opacity:0.2; transform:scale(0.93); filter:brightness(0.3) blur(5px); }
          55%  { opacity:0.7; transform:scale(0.98); filter:brightness(0.7) blur(1px); }
          80%  { opacity:0.9; transform:scale(1.00); filter:brightness(0.95) blur(0); }
          100% { opacity:1;   transform:scale(1);    filter:brightness(1)    blur(0); }
        }
        @keyframes twinkle {
          0%,100% { opacity:0.1; } 50% { opacity:0.45; }
        }
        .vault-in { animation: vaultIn 0.95s cubic-bezier(.22,1,.36,1) forwards; }
      `}</style>

      {/* Étoiles fond */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        {Array.from({length:55}).map((_,i) => (
          <circle key={i}
            cx={`${(i*43+7)%100}%`} cy={`${(i*59+11)%100}%`}
            r={i%5===0?1.6:i%3===0?1:0.6} fill="#D4B870"
            style={{animation:`twinkle ${2+((i*7)%5)*0.35}s ease ${((i*3)%9)*0.2}s infinite`, opacity:0.1}}/>
        ))}
      </svg>

      {/* Lueur ambiante */}
      <div style={{
        position:"absolute",
        width:size*1.6, height:size*1.6, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(160,100,30,0.16) 0%, transparent 62%)",
        top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        opacity: phase >= 2 ? 1 : 0,
        transition:"opacity 2s ease",
        pointerEvents:"none",
      }}/>

      <div className="vault-in" style={{position:"relative", width:size, height:size}}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{overflow:"visible"}}>
          <defs>
            <radialGradient id="velvet" cx="50%" cy="40%" r="65%">
              <stop offset="0%"   stopColor="#3C2408"/>
              <stop offset="45%"  stopColor="#1A1004"/>
              <stop offset="100%" stopColor="#080602"/>
            </radialGradient>
            <radialGradient id="innerGlow" cx="50%" cy="48%" r="55%">
              <stop offset="0%"   stopColor="#FFB030" stopOpacity="0.30"/>
              <stop offset="55%"  stopColor="#C07018" stopOpacity="0.07"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            {/* Porte ultra sombre */}
            <radialGradient id="doorMetal" cx="28%" cy="22%" r="75%">
              <stop offset="0%"   stopColor="#282218"/>
              <stop offset="30%"  stopColor="#141210"/>
              <stop offset="65%"  stopColor="#0C0A08"/>
              <stop offset="100%" stopColor="#060504"/>
            </radialGradient>
            {/* Tranches épaisseur porte */}
            <linearGradient id="edgeTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#3A3020"/>
              <stop offset="100%" stopColor="#0C0A08"/>
            </linearGradient>
            <radialGradient id="wheelBg" cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#2A2818"/>
              <stop offset="60%"  stopColor="#100E08"/>
              <stop offset="100%" stopColor="#080604"/>
            </radialGradient>
            <radialGradient id="boltGrad" cx="30%" cy="25%" r="70%">
              <stop offset="0%"   stopColor="#504428"/>
              <stop offset="55%"  stopColor="#282010"/>
              <stop offset="100%" stopColor="#14100A"/>
            </radialGradient>
            <radialGradient id="rimGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#4A3E22"/>
              <stop offset="60%"  stopColor="#261E10"/>
              <stop offset="100%" stopColor="#120E08"/>
            </radialGradient>
            <clipPath id="vClip"><circle cx={cx} cy={cx} r={R}/></clipPath>
          </defs>

          {/* Ombre sol */}
          <ellipse cx={cx} cy={size-4} rx={R*0.68} ry={size*0.04} fill="rgba(0,0,0,0.7)"/>

          {/* Mur arrière */}
          <rect x={cx-R*1.05} y={cx-R*0.86} width={R*2.10} height={R*1.72}
            rx={size*0.04} fill="#0E0C0A" stroke="#201A0E" strokeWidth="3"/>

          {/* Puits circulaire encadré */}
          <circle cx={cx} cy={cx} r={R+8}  fill="#0A0806" stroke="#181408" strokeWidth="6"/>
          <circle cx={cx} cy={cx} r={R+3}  fill="none"   stroke="#2A2418" strokeWidth="3"/>

          {/* ═══ INTÉRIEUR ═══ */}
          <g clipPath="url(#vClip)">
            <circle cx={cx} cy={cx} r={R} fill="url(#velvet)"/>
            <circle cx={cx} cy={cx} r={R} fill="url(#innerGlow)"
              style={{opacity: phase>=2?1:0, transition:"opacity 2s ease 0.6s"}}/>
            {/* Vignette bords sombres */}
            {Array.from({length:10}).map((_,i) => {
              const a=(i/10)*Math.PI*2;
              return <line key={i}
                x1={cx+Math.cos(a)*R} y1={cx+Math.sin(a)*R}
                x2={cx+Math.cos(a)*R*0.45} y2={cx+Math.sin(a)*R*0.45}
                stroke="#060402" strokeWidth="14" opacity="0.22"/>;
            })}

            {/* TEXTE */}
            <g style={{
              opacity: phase>=3 ? 1 : 0,
              transform: phase>=3 ? "scale(1)" : "scale(0.86)",
              transformOrigin:`${cx}px ${cx}px`,
              transition:"opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1)",
              animation: phase>=3 ? "textReveal 1.3s cubic-bezier(.4,0,.2,1) forwards" : "none",
            }}>
              <text x={cx} y={cx-R*0.10} textAnchor="middle"
                fontFamily="Georgia,serif" fontSize={size*0.118} letterSpacing={size*0.016}
                fill="#E8D98A" style={{filter:"drop-shadow(0 0 16px #FFD700bb)"}}>
                POCKET
              </text>
              <line x1={cx-R*0.40} y1={cx+R*0.04} x2={cx+R*0.40} y2={cx+R*0.04}
                stroke="#C8A84B" strokeWidth="1.2" opacity="0.6"/>
              <text x={cx} y={cx+R*0.28} textAnchor="middle"
                fontFamily="Georgia,serif" fontSize={size*0.108} letterSpacing={size*0.013}
                fill="#FFD700" fontWeight="bold"
                style={{filter:"drop-shadow(0 0 22px #FFD700ee)"}}>
                MUSEUM
              </text>
              <text x={cx} y={cx+R*0.44} textAnchor="middle"
                fontFamily="Georgia,serif" fontSize={size*0.036} letterSpacing={size*0.013}
                fill="#B8922A" opacity="0.72">
                DÉTECTION DE MÉTAUX
              </text>

            </g>
          </g>

          {/* ═══ PORTE ÉPAISSE ET SOMBRE ═══ */}
          <g style={{
            transformOrigin:`${cx - R}px ${cx}px`,
            transform: phase>=2
              ? "perspective(900px) rotateY(-120deg)"
              : "perspective(900px) rotateY(0deg)",
            transition:"transform 2s cubic-bezier(.4,0,.1,1)",
          }}>
            {/* Épaisseur porte — couches décalées qui simulent ~20px d'acier */}
            {[18,15,12,9,6,3].map((off,i) => (
              <circle key={i}
                cx={cx - off*0.55} cy={cx + off*0.10}
                r={R - 0.5}
                fill="none"
                stroke={["#080706","#0E0C0A","#141210","#1A1816","#222018","#2A2620"][i]}
                strokeWidth={5}
                opacity={1 - i*0.08}/>
            ))}

            <clipPath id="dc3"><circle cx={cx} cy={cx} r={R}/></clipPath>
            <g clipPath="url(#dc3)">
              {/* Face porte — très sombre */}
              <circle cx={cx} cy={cx} r={R} fill="url(#doorMetal)"/>

              {/* Rainures circulaires profondes */}
              {[0.91, 0.80, 0.67, 0.52].map((f,i) => (
                <circle key={i} cx={cx} cy={cx} r={R*f}
                  fill="none"
                  stroke="#060504"
                  strokeWidth={i===0?5:i===1?4:3}
                  opacity="0.9"/>
              ))}
              {[0.86, 0.74, 0.60].map((f,i) => (
                <circle key={i} cx={cx} cy={cx} r={R*f}
                  fill="none" stroke="#302820" strokeWidth="1.5" opacity="0.35"/>
              ))}

              {/* ── Seulement 4 boulons massifs aux 4 coins ── */}
              {[45, 135, 225, 315].map((deg,i) => {
                const a = deg * Math.PI / 180;
                const br = R * 0.82;
                const bx = cx + Math.cos(a)*br;
                const by = cx + Math.sin(a)*br;
                return (
                  <g key={i}>
                    {/* Socle en creux */}
                    <circle cx={bx} cy={by} r={size*0.062} fill="#060504" stroke="#0E0C0A" strokeWidth="3"/>
                    {/* Corps boulon hexagonal simulé */}
                    <circle cx={bx} cy={by} r={size*0.054} fill="url(#boltGrad)"/>
                    {/* Anneau intérieur */}
                    <circle cx={bx} cy={by} r={size*0.036} fill="#0C0A08" stroke="#2A2418" strokeWidth="1.5"/>
                    {/* Rainure cruciforme épaisse */}
                    <line x1={bx-size*0.026} y1={by} x2={bx+size*0.026} y2={by}
                      stroke="#060504" strokeWidth="4" opacity="0.9"/>
                    <line x1={bx} y1={by-size*0.026} x2={bx} y2={by+size*0.026}
                      stroke="#060504" strokeWidth="4" opacity="0.9"/>
                    {/* Reflet subtil */}
                    <circle cx={bx-size*0.012} cy={by-size*0.012} r={size*0.012}
                      fill="white" opacity="0.06"/>
                  </g>
                );
              })}

              {/* ── Roue de combinaison ── */}
              <g style={{
                transformOrigin:`${cx}px ${cx}px`,
                animation: phase===1 ? "wheelSpin 1.6s cubic-bezier(.4,0,.2,1) forwards" : "none",
              }}>
                <circle cx={cx} cy={cx} r={R*0.43} fill="url(#wheelBg)" stroke="#0E0C08" strokeWidth="5"/>
                <circle cx={cx} cy={cx} r={R*0.43} fill="none" stroke="#3A3020" strokeWidth="2"/>
                <circle cx={cx} cy={cx} r={R*0.38} fill="none" stroke="#1A1810" strokeWidth="2" opacity="0.6"/>
                {/* Graduations */}
                {Array.from({length:60}).map((_,i) => {
                  const a=(i/60)*Math.PI*2;
                  const isMaj=i%10===0, isMed=i%5===0;
                  const r1=R*0.41;
                  const r2=isMaj?R*0.30:isMed?R*0.34:R*0.37;
                  return <line key={i}
                    x1={cx+Math.cos(a)*r1} y1={cx+Math.sin(a)*r1}
                    x2={cx+Math.cos(a)*r2} y2={cx+Math.sin(a)*r2}
                    stroke="#C8A84B"
                    strokeWidth={isMaj?2.5:isMed?1.5:0.7}
                    opacity={isMaj?0.85:isMed?0.55:0.25}/>;
                })}
                {[0,90,180,270].map((deg,i) => {
                  const labels=["12","3","6","9"];
                  const rad=((deg-90)*Math.PI)/180;
                  return <text key={i}
                    x={cx+Math.cos(rad)*R*0.24} y={cx+Math.sin(rad)*R*0.24+size*0.015}
                    textAnchor="middle" fontSize={size*0.034}
                    fill="#C8A84B" fontFamily="Georgia,serif" opacity="0.6">
                    {labels[i]}
                  </text>;
                })}
                {/* Centre roue */}
                <circle cx={cx} cy={cx} r={R*0.16} fill="#080604" stroke="#1A1810" strokeWidth="4"/>
                <circle cx={cx} cy={cx} r={R*0.11} fill="#141210" stroke="#3A3020" strokeWidth="1.5"/>
                {Array.from({length:8}).map((_,i) => {
                  const a=(i/8)*Math.PI*2;
                  const rr=i%2===0?R*0.06:R*0.10;
                  return <line key={i} x1={cx} y1={cx}
                    x2={cx+Math.cos(a)*rr} y2={cx+Math.sin(a)*rr}
                    stroke="#C8A84B" strokeWidth="1.5" opacity="0.5"/>;
                })}
                <circle cx={cx} cy={cx} r={R*0.05}  fill="#3A3020"/>
                <circle cx={cx} cy={cx} r={R*0.028} fill="#C8A84B" opacity="0.8"/>
                <circle cx={cx} cy={cx} r={R*0.012} fill="#0A0806"/>
              </g>

              {/* 3 verrous à gauche */}
              {[cx-R*0.24, cx+R*0.00, cx+R*0.24].map((vy,i) => (
                <g key={i}>
                  <rect x={cx-R*0.74} y={vy-R*0.090} width={R*0.24} height={R*0.18}
                    rx={R*0.045} fill="#060504" stroke="#0E0C0A" strokeWidth="3"/>
                  <rect x={cx-R*0.735} y={vy-R*0.082} width={R*0.228} height={R*0.164}
                    rx={R*0.040} fill="url(#boltGrad)"/>
                  <rect x={cx-R*0.70} y={vy-R*0.055} width={R*0.12} height={R*0.040}
                    rx={R*0.015} fill="white" opacity="0.05"/>
                  <rect x={cx-R*0.725} y={vy-R*0.072} width={R*0.19} height={R*0.144}
                    rx={R*0.034} fill="none" stroke="#1A1810" strokeWidth="1.5" opacity="0.6"/>
                  <circle cx={cx-R*0.630} cy={vy} r={size*0.020}
                    fill="#080604" stroke="#2A2418" strokeWidth="1.5"/>
                  <line x1={cx-R*0.645} y1={vy} x2={cx-R*0.615} y2={vy}
                    stroke="#5A4C28" strokeWidth="2" opacity="0.55"/>
                </g>
              ))}

              {/* Poignée levier droite */}
              <rect x={cx+R*0.58} y={cx-R*0.11} width={R*0.26} height={R*0.22}
                rx={R*0.11} fill="#060504" stroke="#0E0C0A" strokeWidth="3"/>
              <rect x={cx+R*0.585} y={cx-R*0.103} width={R*0.248} height={R*0.206}
                rx={R*0.103} fill="url(#boltGrad)"/>
              <rect x={cx+R*0.680} y={cx-R*0.30} width={R*0.065} height={R*0.37}
                rx={R*0.032} fill="#0A0806" stroke="#1A1810" strokeWidth="2.5"/>
              <circle cx={cx+R*0.712} cy={cx-R*0.32} r={R*0.072}
                fill="#060504" stroke="#0E0C0A" strokeWidth="3"/>
              <circle cx={cx+R*0.712} cy={cx-R*0.32} r={R*0.062}
                fill="url(#boltGrad)"/>
              <circle cx={cx+R*0.712} cy={cx-R*0.32} r={R*0.032}
                fill="#141210" opacity="0.8"/>

              {/* Plaque */}
              <rect x={cx-R*0.34} y={cx+R*0.66} width={R*0.68} height={R*0.20}
                rx={R*0.035} fill="#060504" stroke="#1A1810" strokeWidth="1.5" opacity="0.8"/>
              <text x={cx} y={cx+R*0.778}
                textAnchor="middle" fontSize={size*0.028}
                fontFamily="Georgia,serif" letterSpacing={size*0.008}
                fill="#5A4C28" opacity="0.65">POCKET MUSEUM</text>
              <text x={cx} y={cx+R*0.810}
                textAnchor="middle" fontSize={size*0.018}
                fontFamily="Georgia,serif" letterSpacing={size*0.005}
                fill="#3A3018" opacity="0.5">EST. MMXXIV</text>
            </g>

            {/* Cerclage porte */}
            <circle cx={cx} cy={cx} r={R}   fill="none" stroke="#1A1810" strokeWidth="5"/>
            <circle cx={cx} cy={cx} r={R-5} fill="none" stroke="#0E0C0A" strokeWidth="2" opacity="0.6"/>
          </g>

          {/* Cerclage fixe doré */}
          <circle cx={cx} cy={cx} r={R+3}  fill="none" stroke="url(#rimGrad)" strokeWidth="6"/>
          <circle cx={cx} cy={cx} r={R+7}  fill="none" stroke="#141008" strokeWidth="4" opacity="0.7"/>
          <circle cx={cx} cy={cx} r={R-1}  fill="none" stroke="#201A10" strokeWidth="2" opacity="0.4"/>

        </svg>
      </div>
    </div>
  );
}
// ── Hook responsive ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 480);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}


// ── Firebase loader ───────────────────────────────────────────────────────────
let _db = null;
const getDb = () => new Promise((resolve, reject) => {
  if (_db) return resolve(_db);
  if (window.__firebaseDb) return resolve((_db = window.__firebaseDb));

  const load = (url) => new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = url; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });

  Promise.all([
    load("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"),
    load("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"),
  ]).then(() => {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _db = firebase.firestore();
    window.__firebaseDb = _db;
    resolve(_db);
  }).catch(reject);
});

const DEVICE_ID = getDeviceId();

async function fbLoadFinds() {
  const db = await getDb();
  const snap = await db.collection("users").doc(DEVICE_ID).collection("finds").orderBy("createdAt", "desc").get();
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

async function fbSaveFind(find) {
  const db = await getDb();
  const { id, ...data } = find;
  data.createdAt = data.createdAt || Date.now();
  await db.collection("users").doc(DEVICE_ID).collection("finds").doc(id).set(data);
}

async function fbDeleteFind(id) {
  const db = await getDb();
  await db.collection("users").doc(DEVICE_ID).collection("finds").doc(id).delete();
}

export default function App() {
  const isMobile = useIsMobile();
  const [lang, setLang] = React.useState(() => { try { return localStorage.getItem(LANG_KEY) || "fr"; } catch { return "fr"; } });
  const t = TRANSLATIONS[lang];
  const toggleLang = () => { const nl = lang === "fr" ? "en" : "fr"; setLang(nl); try { localStorage.setItem(LANG_KEY, nl); } catch {} };
  const [showSplash, setShowSplash] = React.useState(true);
  const [showMap, setShowMap] = React.useState(false);
  const [showMapViewer, setShowMapViewer] = React.useState(false);
  const [showMapAll, setShowMapAll] = React.useState(false);
  const [finds, setFinds] = useState([]);
  const [view, setView] = useState("home");   // home | country | folder | add | detail
  const [activeCountry, setActiveCountry] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedFind, setSelectedFind] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState("");
  const [filterMetal, setFilterMetal] = useState("Tous");
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const [fbError, setFbError] = React.useState(false);

  // ── Swipe pour revenir en arrière ──
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (dx > 60 && dy < 80) {
        if (view === "detail") { setView("folder"); setSelectedFind(null); }
        else if (view === "folder") { setView("country"); }
        else if (view === "country") { setView("home"); }
        else if (view === "add") { setView("folder"); }
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [view]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fbLoadFinds();
        setFinds(data);
      } catch (e) {
        console.error("Firebase load error:", e);
        setFbError(true);
      }
      setLoaded(true);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    if (form.id) {
      // Mode édition
      const updated = { ...form };
      setFinds(prev => prev.map(f => f.id === form.id ? updated : f));
      setSelectedFind(updated);
      setView("detail");
      try { await fbSaveFind(updated); } catch (e) { console.error("Firebase save error:", e); }
    } else {
      // Mode ajout
      const newFind = { ...form, id: generateId(), createdAt: Date.now() };
      setFinds(prev => [newFind, ...prev]);
      setView("folder");
      try { await fbSaveFind(newFind); } catch (e) { console.error("Firebase save error:", e); }
    }
    setForm(defaultForm);
  };

  const handleEdit = (find) => {
    setForm({ ...find });
    setView("add");
  };

  const handleDelete = async (id) => {
    setFinds(prev => prev.filter(f => f.id !== id));
    setView("folder"); setSelectedFind(null);
    try { await fbDeleteFind(id); } catch (e) { console.error("Delete error:", e); }
  };

  // Finds for current country+folder
  const countryFinds = activeCountry ? finds.filter(f => f.country === activeCountry.id) : [];
  const folderFinds = activeFolder ? countryFinds.filter(f => f.folder === activeFolder.id) : [];
  const filtered = folderFinds.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.location || "").toLowerCase().includes(search.toLowerCase());
    return (filterMetal === "Tous" || f.metal === filterMetal) && matchSearch;
  });

  const totalFinds = finds.length;
  const totalRare = finds.filter(f => f.rare).length;

  // ── Fireworks ──────────────────────────────────────────────────────────────
  const [fireworks, setFireworks] = React.useState(false);
  const fireworksIdRef = React.useRef(0);
  const rareCheckboxRef = React.useRef(null);

  const launchFireworks = () => {
    setFireworks(true);
    setTimeout(() => setFireworks(false), 3500);
  };

  const FireworksCanvas = () => {
    const canvasRef = React.useRef(null);
    const animRef = React.useRef(null);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      const colors = ["#FFD700","#E8D98A","#FFF8DC","#FFE066","#C8B87A","#FFFACD","#FF9F43","#fff","#FFB347","#FFEAA7"];

      // Get starting position from button
      let startX = canvas.width / 2;
      let startY = canvas.height * 0.75;
      if (rareCheckboxRef.current) {
        const rect = rareCheckboxRef.current.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }

      const allParticles = [];

      const createBurst = (x, y, count = 70) => {
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const speed = 3 + Math.random() * 7;
          allParticles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 2.5 + Math.random() * 5,
            life: 1,
            decay: 0.012 + Math.random() * 0.010,
            shape: Math.random() > 0.45 ? "circle" : "star",
            trail: [],
          });
        }
      };

      // Initial burst from button
      createBurst(startX, startY, 80);

      // Schedule more bursts across the screen
      const burstPositions = [
        [0.2, 0.3],[0.8, 0.25],[0.5, 0.15],[0.15, 0.6],[0.85, 0.5],
        [0.4, 0.4],[0.65, 0.2],[0.35, 0.55],[0.75, 0.65],[0.5, 0.5],
      ];
      burstPositions.forEach(([fx, fy], idx) => {
        setTimeout(() => {
          if (!canvasRef.current) return;
          createBurst(fx * canvas.width, fy * canvas.height, 55);
        }, 200 + idx * 180);
      });

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = allParticles.length - 1; i >= 0; i--) {
          const p = allParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.09;
          p.vx *= 0.985;
          p.life -= p.decay;

          if (p.life <= 0) { allParticles.splice(i, 1); continue; }

          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;

          if (p.shape === "star") {
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
              const a = (Math.PI * 2 * j) / 5 - Math.PI / 2;
              const r = j % 2 === 0 ? p.size : p.size * 0.4;
              ctx[j === 0 ? "moveTo" : "lineTo"](p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        if (allParticles.length > 0) animRef.current = requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      };

      animRef.current = requestAnimationFrame(draw);
      return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, []);

    return (
      <canvas ref={canvasRef}
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh",
          pointerEvents: "none", zIndex: 0 }} />
    );
  };

  const Lightbox = () => lightbox ? (
    <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.93)", display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "zoom-out", backdropFilter: "blur(6px)" }}>
      <img src={lightbox} alt="" style={{ maxWidth: "92vw", maxHeight: "88vh",
        objectFit: "contain", borderRadius: 8, boxShadow: "0 0 80px rgba(0,0,0,0.8)" }} />
      <div style={{ position: "absolute", top: 20, right: 24, color: "#8B7D5A", fontSize: 28 }}>✕</div>
    </div>
  ) : null;

  // ══════════════════════════════════════════════════════════════════════════
  // HOME — stats globales
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "home") return (
    <div style={{ minHeight: "100dvh", background: "#0D0D0F", color: "#E8E4D9", overflowX: "clip", width: "100%", boxSizing: "border-box",
      fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {fbError && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
          background: "rgba(180,50,50,0.95)", color: "#fff", padding: "10px 16px",
          fontFamily: "Georgia, serif", fontSize: 13, textAlign: "center" }}>
          ⚠️ {lang === "fr"
            ? "Connexion Firebase impossible — vérifiez votre configuration FIREBASE_CONFIG dans le code."
            : "Firebase connection failed — please check your FIREBASE_CONFIG in the code."}
        </div>
      )}
      {showMapAll && <MapAllFinds finds={finds} t={t} onClose={() => setShowMapAll(false)} onSelectFind={(find) => {
        const country = COUNTRIES.find(c => c.id === find.country);
        const folder = [...FOLDERS_COINS, ...FOLDERS_BIJOUX].find(f => f.id === find.folder);
        setActiveCountry(country || COUNTRIES[0]);
        setActiveFolder(folder || FOLDERS_COINS[0]);
        setSelectedFind(find);
        setShowMapAll(false);
        setView("detail");
      }} />}
      {showMap && <MapPicker onSelect={addr => { setForm(p => ({ ...p, location: addr })); setShowMap(false); }} onClose={() => setShowMap(false)} t={t} />}
      <Bg />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "env(safe-area-inset-top, 16px) 12px 16px 12px" : "28px 24px" }}>
        <Header onMap={() => setShowMapAll(true)} onToggleLang={toggleLang} lang={lang} />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            { label: t.totalFinds, value: totalFinds, icon: "⚙" },
            { label: t.rareFinds, value: totalRare, icon: "⭐" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(139,125,90,0.2)", borderRadius: 10,
              padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 24, color: "#8B7D5A" }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 400, color: "#E8D98A", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#6B6050", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Country section label */}
        <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6B6050", textTransform: "uppercase", marginBottom: 16 }}>
          {t.chooseCollection}
        </div>

        {/* Country cards + Carte card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {COUNTRIES.map(country => {
            const count = finds.filter(f => f.country === country.id).length;
            return (
              <div key={country.id}
                onClick={() => { setActiveCountry(country); setView("country"); }}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${country.color}33`,
                  borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
                  position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = country.color + "77";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${country.shadow}`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = country.color + "33";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none"; }}>

                {/* Flag area */}
                <div style={{ background: `radial-gradient(ellipse at 50% 50%, ${country.color}22, transparent 70%)`,
                  padding: "32px 20px 24px", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 16 }}>

                  {/* Flag with frame */}
                  <div style={{ borderRadius: 10, overflow: "hidden",
                    boxShadow: `0 4px 24px ${country.shadow}, 0 0 0 2px ${country.color}44`,
                    lineHeight: 0 }}>
                    {country.flag(130)}
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, color: country.accent, fontWeight: 400,
                      letterSpacing: "0.04em", marginBottom: 5 }}>{t['country' + country.id.toUpperCase()] || country.label}</div>
                    <div style={{ fontSize: 13, color: "#6B6050" }}>
                      {count === 0 ? t.noFinds : count === 1 ? t.oneFind : `${count} ${t.manyFinds}`}
                    </div>
                  </div>
                </div>

                {/* Count badge */}
                {count > 0 && (
                  <div style={{ position: "absolute", top: 14, right: 14,
                    background: country.color, color: "white", borderRadius: 20,
                    minWidth: 28, height: 28, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 700, padding: "0 8px" }}>
                    {count}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // COUNTRY — dossiers par valeur pour un pays
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "country" && activeCountry) return (
    <div style={{ minHeight: "100dvh", background: "#0D0D0F", color: "#E8E4D9", overflowX: "clip", width: "100%", boxSizing: "border-box",
      fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
      <Bg />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "env(safe-area-inset-top, 16px) 12px 16px 12px" : "28px 24px" }}>
        <Header backLabel={t.home} onBack={() => setView("home")} onToggleLang={toggleLang} lang={lang} />

        {/* Country banner */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32,
          padding: "20px 24px", background: `radial-gradient(ellipse at 30% 50%, ${activeCountry.color}18, transparent 70%)`,
          border: `1px solid ${activeCountry.color}33`, borderRadius: 14 }}>
          <div style={{ borderRadius: 8, overflow: "hidden",
            boxShadow: `0 2px 16px ${activeCountry.shadow}, 0 0 0 1px ${activeCountry.color}44`, lineHeight: 0, flexShrink: 0 }}>
            {activeCountry.flag(80)}
          </div>
          <div>
            <div style={{ fontSize: 22, color: activeCountry.accent, fontWeight: 400, marginBottom: 4 }}>
              {activeCountry.id === 'bj' ? (t.countryBJ) : (lang === 'en' ? `${t['country' + activeCountry.id.toUpperCase()]} Coins` : `Pièces ${t['country' + activeCountry.id.toUpperCase()]}es`)}
            </div>
            <div style={{ fontSize: 13, color: "#6B6050" }}>
              {countryFinds.length === 0 ? "Aucune trouvaille enregistrée"
                : countryFinds.length === 1 ? "1 trouvaille enregistrée"
                : `${countryFinds.length} trouvailles enregistrées`}
            </div>
          </div>
        </div>

        {/* Folder grid */}
        <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6B6050",
          textTransform: "uppercase", marginBottom: 14 }}>{t.foldersByValue}</div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {getFolders(activeCountry?.id).map(folder => {
            const count = countryFinds.filter(f => f.folder === folder.id).length;
            const latest = countryFinds.filter(f => f.folder === folder.id && f.photo)[0];
            return (
              <div key={folder.id}
                onClick={() => { setActiveFolder(folder); setSearch(""); setFilterMetal("Tous"); setView("folder"); }}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${folder.color}33`,
                  borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
                  position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = folder.color + "77";
                  e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = folder.color + "33";
                  e.currentTarget.style.transform = "translateY(0)"; }}>

                <div style={{ height: 80, position: "relative",
                  background: latest
                    ? `url(${latest.photo}) center/cover no-repeat`
                    : `radial-gradient(circle at 40% 40%, ${folder.glow}, transparent 70%)` }}>
                  {latest && <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,15,0.45)" }} />}
                  <div style={{ position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 30, color: folder.color, textShadow: `0 0 20px ${folder.color}` }}>{folder.icon || "🪙"}</div>
                </div>

                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 15, color: folder.color, fontWeight: 400, marginBottom: 3 }}>{t.folders?.[folder.id] || folder.label}</div>
                  <div style={{ fontSize: 11, color: "#6B6050" }}>
                    {count === 0 ? t.noFinds : count === 1 ? t.oneFind : `${count} ${t.manyFinds}`}
                  </div>
                </div>

                {count > 0 && (
                  <div style={{ position: "absolute", top: 8, right: 8, background: folder.color,
                    color: "#0D0D0F", borderRadius: 20, width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700 }}>{count}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // FOLDER — liste des pièces
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "folder" && activeFolder) return (
    <div style={{ minHeight: "100dvh", background: "#0D0D0F", color: "#E8E4D9", overflowX: "clip", width: "100%", boxSizing: "border-box",
      fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
      <Bg /><Lightbox />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "env(safe-area-inset-top, 16px) 14px 16px 14px" : "28px 24px", overflowX: "hidden" }}>
        <Header backLabel={activeCountry ? (t["country" + activeCountry.id.toUpperCase()] || activeCountry.label) : ""} onBack={() => setView("country")} onToggleLang={toggleLang} lang={lang} />

        {/* Folder title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22,
          padding: "16px 20px", background: "rgba(255,255,255,0.03)",
          border: `1px solid ${activeFolder.color}44`, borderRadius: 12 }}>
          <div style={{ borderRadius: 6, overflow: "hidden", lineHeight: 0, flexShrink: 0,
            boxShadow: `0 0 0 1px ${activeCountry.color}44` }}>
            {activeCountry?.flag(40)}
          </div>
          <div style={{ fontSize: 30, color: activeFolder.color }}>{activeFolder.icon || "🪙"}</div>
          <div>
            <div style={{ fontSize: 18, color: activeFolder.color, fontWeight: 400 }}>
              {activeFolder.label} — <span style={{ color: activeCountry?.accent, fontSize: 15 }}>{activeCountry?.label}</span>
            </div>
            <div style={{ fontSize: 12, color: "#6B6050", marginTop: 2 }}>
              {folderFinds.length === 0 ? t.noElements : folderFinds.length === 1 ? t.oneElement : `${folderFinds.length} ${t.elements}`}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <input placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(139,125,90,0.3)", borderRadius: 6, color: "#E8E4D9",
              padding: "12px 14px", minHeight: 44, fontSize: 16, fontFamily: "inherit", outline: "none" }} />
          <select value={filterMetal} onChange={e => setFilterMetal(e.target.value)}
            style={{ background: "#1A1710", border: "1px solid rgba(139,125,90,0.3)",
              borderRadius: 6, color: "#E8E4D9", padding: "12px 14px", minHeight: 44, fontSize: 14, fontFamily: "inherit", outline: "none", colorScheme: "dark" }}>
            <option value="Tous" style={{ background: "#1A1710", color: "#E8E4D9" }}>{t.allMetals}</option>
            {FR_METALS.map((m, i) => <option key={m} value={m} style={{ background: "#1A1710", color: "#E8E4D9" }}>{t.metals[i]}</option>)}
          </select>
          <button onClick={() => { setForm({ ...defaultForm, folder: activeCountry.id === 'bj' ? 'bague' : activeFolder.id, country: activeCountry.id }); setView("add"); }}
            style={{ background: `linear-gradient(135deg, ${activeFolder.color}cc, ${activeFolder.color})`,
              border: "none", borderRadius: 6, color: "#0D0D0F", padding: "11px 18px", minHeight: 44, fontSize: 14,
              fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.addBtn}</button>
        </div>

        {/* List */}
        {!loaded ? (
          <div style={{ textAlign: "center", color: "#6B6050", padding: 60 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px",
            border: "1px dashed rgba(139,125,90,0.2)", borderRadius: 12, color: "#6B6050" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🪙</div>
            <div style={{ fontSize: 15, marginBottom: 6 }}>{t.noFindsFolder}</div>
            <div style={{ fontSize: 12 }}>{t.noFindsHint}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(find => (
              <div key={find.id} onClick={() => { setSelectedFind(find); setView("detail"); }}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,125,90,0.15)",
                  borderLeft: `3px solid ${metalColors[find.metal] || "#666"}`, borderRadius: 8,
                  cursor: "pointer", display: "flex", alignItems: "stretch",
                  overflow: "hidden", minHeight: 76, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                {find.photo ? (
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <img src={find.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ) : (
                  <div style={{ width: 80, flexShrink: 0, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 26,
                    background: `radial-gradient(circle, ${metalColors[find.metal]}18, transparent)` }}>🪙</div>
                )}
                <div style={{ flex: 1, padding: "13px 16px", minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: "#E8E4D9", marginBottom: 5 }}>{find.name}</div>
                  <div style={{ fontSize: 12, color: "#8B7D5A", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ color: metalColors[find.metal] || "#8B7D5A" }}>● {translateMetal(find.metal, lang)}</span>
                    {find.year && <span>📅 {find.year}</span>}
                    {find.location && <span>📍 {find.location}</span>}
                    {find.depth && <span>↓ {find.depth} cm</span>}
                  </div>
                </div>
                <div style={{ padding: "13px 16px", fontSize: 11, color: "#6B6050", flexShrink: 0, textAlign: "right" }}>
                  <div>{find.date}</div>
                  <div style={{ marginTop: 4, color: find.condition === "Excellent" ? "#7BC67E" : find.condition === "Bon" ? "#8B7D5A" : "#A06050" }}>
                    {translateCondition(find.condition, lang)}
                  </div>
                  {(find.photo || find.photo2) && <div style={{ marginTop: 4 }}>📷</div>}
                  {find.rare && <div style={{ marginTop: 4, color: "#E8D98A" }}>⭐ Rare</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ADD
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "add") return (
    <div style={{ minHeight: "100dvh", background: "#0D0D0F", color: "#E8E4D9", overflowX: "clip", width: "100%", boxSizing: "border-box",
      fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
      {fireworks && <FireworksCanvas />}
      {showMap && <MapPicker onSelect={addr => { setForm(p => ({ ...p, location: addr })); setShowMap(false); }} onClose={() => setShowMap(false)} t={t} />}
      <Bg />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "env(safe-area-inset-top, 16px) 14px 16px 14px" : "28px 24px", overflowX: "hidden" }}>
        <Header backLabel={activeFolder ? (t.folders?.[activeFolder.id] || activeFolder.label) : ""} onBack={() => setView("folder")} onToggleLang={toggleLang} lang={lang} />

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,125,90,0.2)", borderRadius: 12, padding: isMobile ? "14px 10px" : 28, boxSizing: "border-box", width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontWeight: 400, fontSize: 20, color: "#E8D98A" }}>
              {form.id ? t.editFiche : t.newPiece}
            </h2>
            <div style={{ fontSize: 13, color: "#6B6050" }}>
              {activeCountry?.label} · <span style={{ color: activeFolder?.color }}>{activeFolder?.label}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, width: "100%", boxSizing: "border-box" }}>

            {/* Photos */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Photos (recto / verso)</label>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                <PhotoUploader value={form.photo} onChange={photo => setForm(p => ({ ...p, photo }))} label="Recto" />
                <PhotoUploader value={form.photo2} onChange={photo2 => setForm(p => ({ ...p, photo2 }))} label="Verso" />
              </div>
            </div>

            {/* Country selector */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>{lang === "en" ? "Country" : "Pays"}</label>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>
                {COUNTRIES.map(c => (
                  <button key={c.id} onClick={() => setForm(p => ({ ...p, country: c.id }))}
                    style={{ background: form.country === c.id ? `${c.color}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.country === c.id ? c.color : "rgba(139,125,90,0.25)"}`,
                      borderRadius: 8, padding: "10px 8px", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s", width: "100%" }}>
                    <div style={{ borderRadius: 4, overflow: "hidden", lineHeight: 0, flexShrink: 0,
                      boxShadow: `0 0 0 1px ${c.color}44` }}>
                      {c.flag(36)}
                    </div>
                    <span style={{ fontSize: 13, color: form.country === c.id ? c.accent : "#8B7D5A", fontWeight: form.country === c.id ? 700 : 400 }}>
                      {t['country' + c.id.toUpperCase()] || c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Folder */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>{lang === "en" ? "Folder (value)" : "Dossier (valeur)"}</label>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
                {getFolders(form.country).map(f => (
                  <button key={f.id} onClick={() => setForm(p => ({ ...p, folder: f.id }))}
                    style={{ background: form.folder === f.id ? f.color : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.folder === f.id ? f.color : "rgba(139,125,90,0.25)"}`,
                      borderRadius: 6, color: form.folder === f.id ? "#0D0D0F" : "#8B7D5A",
                      padding: "8px 4px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                      fontWeight: form.folder === f.id ? 700 : 400, transition: "all 0.15s",
                      textAlign: "center", width: "100%" }}>
                    {t.folders?.[f.id] || f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>{t.name} *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={t.namePlaceholder} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t.metal}</label>
              <select value={form.metal} onChange={e => setForm(p => ({ ...p, metal: e.target.value }))} style={selectStyle}>
                {t.metals.map((m, i) => <option key={m} value={FR_METALS[i]} style={{ background: "#1A1710", color: "#E8E4D9" }}>{m}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t.year}</label>
              <input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                placeholder={t.yearPlaceholder} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t.condition}</label>
              <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))} style={selectStyle}>
                {t.conditions.map((c, i) => <option key={c} value={FR_CONDITIONS[i]} style={{ background: "#1A1710", color: "#E8E4D9" }}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t.date}</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t.depth}</label>
              <input type="number" value={form.depth} onChange={e => setForm(p => ({ ...p, depth: e.target.value }))}
                placeholder={t.depthPlaceholder} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t.weight}</label>
              <input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                placeholder={t.weightPlaceholder} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t.sonicIndex}</label>
              <input type="number" value={form.sonicIndex || ""} onChange={e => setForm(p => ({ ...p, sonicIndex: e.target.value }))}
                placeholder={t.sonicIndexPlaceholder} style={inputStyle} min="0" max="99" />
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>{t.location}</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder={t.locationPlaceholder} style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={() => setShowMap(true)} title="Choisir sur la carte"
                  style={{ padding: "0 14px", borderRadius: 8, cursor: "pointer", flexShrink: 0,
                    background: "rgba(139,125,90,0.12)", border: "1px solid rgba(139,125,90,0.4)",
                    color: "#C8B87A", fontSize: 20, transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(139,125,90,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(139,125,90,0.12)"}>
                  📍
                </button>
              </div>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>{t.notes}</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder={t.notesPlaceholder} rows={3}
                style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />
            </div>

            <div style={{ gridColumn: "1/-1", position: "relative" }}>
              <div
                onClick={() => {
                  const newRare = !form.rare;
                  setForm(p => ({ ...p, rare: newRare }));
                  if (newRare) launchFireworks();
                }}
                ref={rareCheckboxRef}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: form.rare ? "rgba(232,217,138,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${form.rare ? "rgba(232,217,138,0.5)" : "rgba(139,125,90,0.2)"}`,
                  borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {/* Custom checkbox */}
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${form.rare ? "#E8D98A" : "rgba(139,125,90,0.4)"}`,
                  background: form.rare ? "rgba(232,217,138,0.2)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {form.rare && <span style={{ color: "#E8D98A", fontSize: 14, lineHeight: 1 }}>✓</span>}
                </div>
                <div>
                  <div style={{ color: form.rare ? "#E8D98A" : "#C0B898", fontSize: 15, fontFamily: "Georgia, serif" }}>
                    {t.rareLabel}
                  </div>
                  <div style={{ color: "#6B6050", fontSize: 12, marginTop: 2 }}>
                    {t.rareDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
            <button onClick={() => setView("folder")} style={{ background: "transparent",
              border: "1px solid rgba(139,125,90,0.3)", borderRadius: 6, color: "#8B7D5A",
              padding: "10px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
            <button onClick={handleSubmit} disabled={!form.name.trim()} style={{
              background: form.name.trim() ? "linear-gradient(135deg, #8B7D5A, #C4A96B)" : "rgba(139,125,90,0.2)",
              border: "none", borderRadius: 6, color: form.name.trim() ? "#0D0D0F" : "#6B6050",
              padding: "10px 28px", fontSize: 14, fontWeight: 700,
              cursor: form.name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>{form.id ? t.save : t.register}</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // DETAIL
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "detail" && selectedFind) {
    const findCountry = COUNTRIES.find(c => c.id === selectedFind.country);
    const findFolder = [...FOLDERS_COINS, ...FOLDERS_BIJOUX].find(f => f.id === selectedFind.folder);
    return (
      <div style={{ minHeight: "100dvh", background: "#0D0D0F", color: "#E8E4D9", overflowX: "clip", width: "100%", boxSizing: "border-box",
        fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
        <Bg /><Lightbox />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "env(safe-area-inset-top, 16px) 14px 16px 14px" : "28px 24px", overflowX: "hidden" }}>
          <Header backLabel={activeFolder ? (t.folders?.[activeFolder.id] || activeFolder.label) : ""} onBack={() => setView("folder")} onToggleLang={toggleLang} lang={lang} />

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,125,90,0.2)",
            borderLeft: `4px solid ${metalColors[selectedFind.metal] || "#666"}`, borderRadius: 12, overflow: "hidden" }}>

            {/* Photos */}
            {(selectedFind.photo || selectedFind.photo2) ? (
              selectedFind.photo && selectedFind.photo2 ? (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                  <div style={{ position: "relative", cursor: "zoom-in" }} onClick={() => setLightbox(selectedFind.photo)}>
                    <img src={selectedFind.photo} alt="Recto" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(13,13,15,0.92) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 18, right: 8 }}>
                      <h2 style={{ margin: 0, fontWeight: 400, fontSize: 18, color: "#E8D98A", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{selectedFind.name}</h2>
                      <div style={{ fontSize: 11, color: "#A09070", marginTop: 2 }}>{selectedFind.date}</div>
                    </div>
                    <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.6)",
                      borderRadius: 4, padding: "3px 8px", fontSize: 10, color: "#8B7D5A" }}>RECTO · 🔍</div>
                  </div>
                  <div style={{ position: "relative", cursor: "zoom-in", borderLeft: "1px solid rgba(139,125,90,0.2)" }}
                    onClick={() => setLightbox(selectedFind.photo2)}>
                    <img src={selectedFind.photo2} alt="Verso" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)",
                      borderRadius: 4, padding: "3px 8px", fontSize: 10, color: "#8B7D5A" }}>VERSO · 🔍</div>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", cursor: "zoom-in" }} onClick={() => setLightbox(selectedFind.photo || selectedFind.photo2)}>
                  <img src={selectedFind.photo || selectedFind.photo2} alt={selectedFind.name}
                    style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(13,13,15,0.9) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 28, right: 28 }}>
                    <h2 style={{ margin: 0, fontWeight: 400, fontSize: 22, color: "#E8D98A", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{selectedFind.name}</h2>
                    <div style={{ fontSize: 12, color: "#A09070", marginTop: 4 }}>{selectedFind.date}</div>
                  </div>
                  <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.6)",
                    borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#8B7D5A" }}>🔍 Agrandir</div>
                </div>
              )
            ) : (
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div>
                    <h2 style={{ margin: 0, fontWeight: 400, fontSize: 22, color: "#E8D98A" }}>{selectedFind.name}</h2>
                    <div style={{ fontSize: 12, color: "#6B6050", marginTop: 5 }}>{selectedFind.date}</div>
                  </div>
                  <div style={{ fontSize: 36 }}>🪙</div>
                </div>
              </div>
            )}

            <div style={{ padding: 24 }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                {findCountry && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7,
                    background: `${findCountry.color}18`, border: `1px solid ${findCountry.color}44`,
                    borderRadius: 20, padding: "5px 12px" }}>
                    <div style={{ borderRadius: 3, overflow: "hidden", lineHeight: 0 }}>
                      {findCountry.flag(24)}
                    </div>
                    <span style={{ fontSize: 12, color: findCountry.accent }}>{t["country" + findCountry.id.toUpperCase()] || findCountry.label}</span>
                  </div>
                )}
                {findFolder && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                    background: `${findFolder.color}18`, border: `1px solid ${findFolder.color}44`,
                    borderRadius: 20, padding: "5px 12px" }}>
                    <span style={{ fontSize: 12, color: findFolder.color }}>🪙 {t.folders?.[findFolder.id] || findFolder.label}</span>
                  </div>
                )}
                {selectedFind.rare && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(232,217,138,0.12)", border: "1px solid rgba(232,217,138,0.5)",
                    borderRadius: 20, padding: "5px 14px" }}>
                    <span style={{ fontSize: 12, color: "#E8D98A", letterSpacing: "0.05em" }}>{t.rareBadge}</span>
                  </div>
                )}
              </div>

              {showMapViewer && selectedFind.location && selectedFind.location !== "—" && (
                <MapViewer location={selectedFind.location} onClose={() => setShowMapViewer(false)} t={t} />
              )}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[
                  { label: t.metalLabel, value: translateMetal(selectedFind.metal, lang), color: metalColors[selectedFind.metal] },
                  { label: t.yearLabel, value: selectedFind.year || "—" },
                  { label: t.conditionLabel, value: translateCondition(selectedFind.condition, lang) },
                  { label: t.depthLabel, value: selectedFind.depth ? `${selectedFind.depth} cm` : "—" },
                  { label: t.weightLabel, value: selectedFind.weight ? `${selectedFind.weight} g` : "—" },
                  { label: t.sonicIndexLabel, value: selectedFind.sonicIndex || "—" },
                  { label: t.locationLabel, value: selectedFind.location || "—", isLocation: true },
                ].map(item => (
                  <div key={item.label}
                    onClick={item.isLocation && selectedFind.location ? () => setShowMapViewer(true) : undefined}
                    style={{ background: "rgba(255,255,255,0.03)",
                      border: item.isLocation && selectedFind.location
                        ? "1px solid rgba(232,217,138,0.25)"
                        : "1px solid rgba(139,125,90,0.1)",
                      borderRadius: 8, padding: "11px 14px",
                      cursor: item.isLocation && selectedFind.location ? "pointer" : "default",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={item.isLocation && selectedFind.location ? e => {
                      e.currentTarget.style.background = "rgba(232,217,138,0.07)";
                      e.currentTarget.style.borderColor = "rgba(232,217,138,0.45)";
                    } : undefined}
                    onMouseLeave={item.isLocation && selectedFind.location ? e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(232,217,138,0.25)";
                    } : undefined}
                  >
                    <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#6B6050", textTransform: "uppercase", marginBottom: 5 }}>
                      {item.label}{item.isLocation && selectedFind.location ? " 🗺️" : ""}
                    </div>
                    <div style={{ fontSize: 14, color: item.isLocation && selectedFind.location ? "#C8B87A" : (item.color || "#E8E4D9") }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {selectedFind.notes && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,125,90,0.1)",
                  borderRadius: 8, padding: 14, marginBottom: 18 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#6B6050", textTransform: "uppercase", marginBottom: 6 }}>{t.notesLabel}</div>
                  <div style={{ fontSize: 13, color: "#C0B898", lineHeight: 1.6 }}>{selectedFind.notes}</div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => handleEdit(selectedFind)} style={{
                  background: "rgba(139,125,90,0.12)", border: "1px solid rgba(139,125,90,0.4)",
                  borderRadius: 6, color: "#C8B87A", padding: "11px 20px", minHeight: 44,
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.edit}</button>
                <button onClick={() => handleDelete(selectedFind.id)} style={{
                  background: "rgba(160,60,50,0.15)", border: "1px solid rgba(160,60,50,0.3)",
                  borderRadius: 6, color: "#C06050", padding: "11px 20px", minHeight: 44,
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.delete}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const labelStyle = {
  display: "block", fontSize: 11, letterSpacing: "0.15em",
  color: "#6B6050", textTransform: "uppercase", marginBottom: 6,
};

const inputStyle = {
  width: "100%", maxWidth: "100%", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(139,125,90,0.25)", borderRadius: 6,
  color: "#E8E4D9", padding: "12px 10px", minHeight: 44, fontSize: 16,
  fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", display: "block",
};

const selectStyle = {
  ...inputStyle,
  background: "#1A1710",
  color: "#E8E4D9",
  colorScheme: "dark",
};
