import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GiHotMeal, GiChickenLeg, GiNoodles, GiChefToque, GiCampfire } from "react-icons/gi";
import { BiSearch, BiX } from "react-icons/bi";
import { BsChevronDown, BsTelephone } from "react-icons/bs";
import { IoLeaf } from "react-icons/io5";
import { FaEgg, FaDrumstickBite, FaMapMarkerAlt, FaUsers, FaClock, FaIceCream, FaUserShield } from "react-icons/fa";
import { TbSoup, TbSalad } from "react-icons/tb";
import { PiCookingPotBold } from "react-icons/pi";
import { RiDrinks2Line } from "react-icons/ri";
import { LuUtensilsCrossed, LuWheat } from "react-icons/lu";
import { supabase } from "./supabaseClient";

import { Link } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Seeder from './components/admin/Seeder';

import logoImg from './assets/LOGO1.jpg';

const IS_QR = typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("qr") === "1";

const PORT = typeof window !== "undefined" ? window.location.port : "";

const CATS_BASE = [
  { id: "beverages", label: "Beverages", Icon: RiDrinks2Line, accent: "#38bdf8", glow: "56,189,248" },
  { id: "soups", label: "Soups", Icon: TbSoup, accent: "#fb923c", glow: "251,146,60" },
  { id: "starters", label: "Starters", Icon: TbSalad, accent: "#f87171", glow: "248,113,113" },
  { id: "tandoori", label: "Tandoori", Icon: GiCampfire, accent: "#f97316", glow: "249,115,22" },
  { id: "breads", label: "Breads", Icon: LuWheat, accent: "#fbbf24", glow: "251,191,36" },
  { id: "vegcurry", label: "Veg Curry", Icon: PiCookingPotBold, accent: "#4ade80", glow: "74,222,128" },
  { id: "nonveg", label: "Non-Veg Curry", Icon: GiChickenLeg, accent: "#fca5a5", glow: "252,165,165" },
  { id: "biryani", label: "Biryani", Icon: GiHotMeal, accent: "#fcd34d", glow: "252,211,77" },
  { id: "noodles", label: "Noodles", Icon: GiNoodles, accent: "#c4b5fd", glow: "196,181,253" },
  { id: "desserts", label: "Desserts", Icon: FaIceCream, accent: "#f9a8d4", glow: "249,168,212" },
];

const TC = { veg: "#22c55e", nonveg: "#ef4444", egg: "#f59e0b" };
const TIcon = { veg: IoLeaf, nonveg: FaDrumstickBite, egg: FaEgg };
const TLABEL = { veg: "Veg", nonveg: "Non-Veg", egg: "Egg" };
const NAV_BG = "#ffffff";

function buildCats(dbItems) {
  return CATS_BASE.map(cat => {
    // Only include items that are not explicitly disabled (is_available !== false)
    const catItems = dbItems.filter(item => item.categoryId === cat.id && item.is_available !== false);
    const map = new Map();
    catItems.forEach(item => {
      const key = item.sectionSub || "__none__";
      if (!map.has(key)) map.set(key, { sub: item.sectionSub || null, type: item.type, items: [] });
      map.get(key).items.push({ n: item.n, p: item.p });
    });
    return { ...cat, sections: Array.from(map.values()) };
  });
}

function applyFilter(sections, filter) {
  if (filter === "all") return sections;
  return sections.filter(s =>
    filter === "veg" ? s.type === "veg" : s.type === "nonveg" || s.type === "egg"
  );
}

function Dot({ type, size = 14 }) {
  const c = TC[type] || "#888";
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0, display: "block" }}>
      <rect x=".6" y=".6" width="12.8" height="12.8" rx="2.5" fill="none" stroke={c} strokeWidth="1.4" />
      {type === "nonveg"
        ? <polygon points="7,2.5 12.5,11.5 1.5,11.5" fill={c} />
        : <circle cx="7" cy="7" r="3.8" fill={c} />}
    </svg>
  );
}

/* ════════════════════════════════════════════════
   QR PRINT PAGE
════════════════════════════════════════════════ */
function QRPrintPage() {
  const menuURL = window.location.origin + window.location.pathname;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(menuURL)}&bgcolor=FFFAF4&color=1C0800&margin=10&qzone=1`;
  return (
    <div style={{ minHeight: "100vh", background: "#fffaf4", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');@media print{.noprint{display:none!important}}`}</style>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 30px 28px", maxWidth: 340, width: "100%", textAlign: "center", border: "1px solid #f0e0c8", boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ width: 54, height: 54, margin: "0 auto 12px", borderRadius: "50%", background: "#fff", border: "1.5px solid rgba(180,83,9,.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(180,83,9,.1), 0 10px 30px rgba(0,0,0,.15)", overflow: "hidden" }}>
          <img src={logoImg} alt="Athithi Delight" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, color: "#1c0800", lineHeight: 1 }}>Athithi</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontStyle: "italic", color: "#9a6840", marginBottom: 6 }}>Delight</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#c2570a44,transparent)", marginBottom: 18 }} />
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#c2570a", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>📱 Scan to View Menu</p>
        <div style={{ display: "inline-block", padding: 10, background: "#fffaf4", borderRadius: 12, border: "2px solid #e8c89a", marginBottom: 10 }}>
          <img src={qrSrc} width={180} height={180} alt="QR" style={{ display: "block", borderRadius: 6 }} />
        </div>
        <p style={{ fontSize: 10, color: "#b09070", fontFamily: "'DM Sans',sans-serif", marginBottom: 14, wordBreak: "break-all" }}>{menuURL}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 12 }}>
          {["99489 44441", "99489 44442"].map(n => <div key={n} style={{ fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#5a3010" }}>📞 {n}</div>)}
        </div>
        <div style={{ fontSize: 11, color: "#c0a080", fontFamily: "'DM Sans',sans-serif" }}>A/C Multi Cuisine · Siddipet · 11AM–10:30PM</div>
        <button className="noprint" onClick={() => window.print()} style={{ marginTop: 18, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b45309,#d97706)", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>🖨 Print QR Card</button>
        <a href={menuURL} style={{ display: "block", marginTop: 10, fontSize: 12, color: "#a07050", fontFamily: "'DM Sans',sans-serif", textDecoration: "none" }}>← View Menu</a>
      </div>
    </div>
  );
}



/* ════════════════════════════════════════════════
   MENU APP
════════════════════════════════════════════════ */
function MenuApp() {
  const [CATS, setCATS] = useState(CATS_BASE.map(c => ({ ...c, sections: [] })));
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navRef = useRef(null);
  const thumbsRef = useRef(null);
  const skipSpy = useRef(false);
  const curActive = useRef(CATS_BASE[0].id);

  useEffect(() => {
    async function fetchItems() {
      try {
        console.log("App.jsx: Fetching from items table...");
        const { data, error, status, statusText } = await supabase.from("items").select("*").order("id");
        console.log("App.jsx: Supabase response -> status:", status, "statusText:", statusText);
        console.log("App.jsx: Error:", error);
        console.log("App.jsx: Data:", data);

        if (error) {
          setLoadError(error.message);
          setLoading(false);
          return;
        }
        if (!data || data.length === 0) {
          setLoadError("Table returned 0 rows. Check RLS policy or data.");
          setLoading(false);
          return;
        }
        setTotalItems(data.length);
        setCATS(buildCats(data));
        setLoading(false);
      } catch (err) {
        console.error("App.jsx: Unexpected error:", err);
        setLoadError("Unexpected error: " + err.message);
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const setActiveDom = useCallback((id, scrollNav = false) => {
    if (curActive.current === id) return;
    curActive.current = id;
    navRef.current?.querySelectorAll("[data-navid]").forEach(el =>
      el.classList.toggle("nv-on", el.dataset.navid === id)
    );
    thumbsRef.current?.querySelectorAll("[data-tid]").forEach(el =>
      el.classList.toggle("tb-on", el.dataset.tid === id)
    );
    if (scrollNav) {
      navRef.current?.querySelector(`[data-navid="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      thumbsRef.current?.querySelector(`[data-tid="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  useEffect(() => {
    if (search) return;
    let rafId = null;
    const io = new IntersectionObserver(entries => {
      if (skipSpy.current) return;
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => setActiveDom(e.target.id, true));
        }
      });
    }, { rootMargin: "-250px 0px -50% 0px", threshold: 0 });
    CATS.forEach(c => { const el = document.getElementById(c.id); if (el) io.observe(el); });
    return () => { io.disconnect(); if (rafId) cancelAnimationFrame(rafId); };
  }, [search, setActiveDom, CATS]);

  const jumpTo = useCallback((id) => {
    setActiveDom(id, false);
    skipSpy.current = true;
    setSearch("");
    setCollapsed(p => (!p[id] ? p : { ...p, [id]: false }));
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 250, behavior: "instant" });
      requestAnimationFrame(() => { skipSpy.current = false; });
    });
  }, [setActiveDom]);

  useEffect(() => { setCollapsed({}); }, [filter]);

  const hits = search.trim()
    ? CATS.flatMap(cat => cat.sections.flatMap(sec =>
      sec.items.filter(it => it.n.toLowerCase().includes(search.toLowerCase())).map(it => ({ it, sec, cat }))
    )) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1f2937", fontFamily: "'DM Sans',sans-serif" }}>

      {/* ══ TOP-RIGHT ADMIN BUTTON ══ */}
      <Link to="/admin-login" style={{
        position: "absolute", top: 16, right: 16, zIndex: 999,
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px",
        background: "linear-gradient(135deg,#1c0a00,#3d1a00)",
        border: "1px solid rgba(180,83,9,.4)",
        borderRadius: 50,
        color: "#d97706",
        textDecoration: "none",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "'DM Sans',sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        backdropFilter: "blur(8px)",
      }}>
        <FaUserShield size={14} /> Admin
      </Link>

      {/* ══ HERO ══ */}
      <header style={{ background: "linear-gradient(170deg,#ffffff 0%,#f8fafc 55%,#f1f5f9 100%)", padding: "38px 20px 30px", textAlign: "center", borderBottom: "1px solid rgba(180,83,9,.12)", position: "relative", overflow: "hidden", transform: "translateZ(0)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 45% at 50% 0%,rgba(180,83,9,.09),transparent)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 0 0 4px rgba(180,83,9,.1), 0 10px 30px rgba(0,0,0,.15)", border: "1.5px solid rgba(180,83,9,.2)", overflow: "hidden" }}>
            <img src={logoImg} alt="Athithi Delight Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(48px,12vw,68px)", fontWeight: 700, lineHeight: .88, color: "#1c1917", margin: 0 }}>Athithi</h1>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(18px,5vw,26px)", fontStyle: "italic", fontWeight: 600, color: "#78716c", letterSpacing: ".14em", margin: "5px 0 16px" }}>Delight</h2>
          <p style={{ fontSize: 10, letterSpacing: ".55em", textTransform: "uppercase", color: "#78350f", marginBottom: 5, fontWeight: 700 }}>✦ A true taste of tradition in every bite ✦</p>
          <div style={{ display: "flex", alignItems: "center", gap: 9, maxWidth: 180, margin: "0 auto 12px" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(180,83,9,.25))" }} />
            <span style={{ color: "#78350f", fontSize: 21 }}>✦ Menu ✦</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(180,83,9,.25),transparent)" }} />
          </div>
          <p style={{ color: "#3c2210", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, marginBottom: 13 }}>A/C Multi Cuisine Family Restaurant</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5, marginBottom: 16 }}>
            {[[FaClock, "11AM – 10:30PM"], [FaUsers, "50+ Seats"], [BsTelephone, "99489 44441"], [FaMapMarkerAlt, "Siddipet"]].map(([Ic, t], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", background: "rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.07)", borderRadius: 99, fontSize: 12, color: "#8a6840" }}>
                <Ic size={11} color="#b45309" />{t}
              </div>
            ))}
          </div>
          <div className="statsBar" style={{ display: "inline-flex", background: "rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.07)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            {[{ n: CATS_BASE.length, l: "Categories" }, { n: totalItems, l: "Dishes", s: "+" }, { n: 50, l: "Seats", s: "+" }].map(({ n, l, s = "" }, i) => (
              <div key={i} className="statsBarItem" style={{ padding: "10px 18px", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(0,0,0,.06)" : "none" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 500, color: "#d97706", lineHeight: 1 }}>{n}{s}</div>
                <div className="statsBarLabel" style={{ fontSize: 10, color: "#3a200e", letterSpacing: "1em", textTransform: "uppercase", marginTop: 3, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
            {[["veg", IoLeaf, "Pure Veg", "#22c55e"], ["nonveg", FaDrumstickBite, "Non-Veg", "#ef4444"], ["egg", FaEgg, "Contains Egg", "#f59e0b"]].map(([t, Ic, l, c]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5a3820" }}>
                <Dot type={t} /><Ic size={11} color={c} />{l}
              </div>
            ))}
          </div>
          {loading && (
            <div style={{ marginTop: 14, padding: "8px 16px", background: "rgba(217,119,6,.08)", border: "1px solid rgba(217,119,6,.2)", borderRadius: 8, fontSize: 12, color: "#b45309", fontWeight: 600 }}>
              ⏳ Loading menu from database…
            </div>
          )}
          {loadError && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, fontSize: 12, color: "#dc2626", fontWeight: 500, textAlign: "left" }}>
              <strong>⚠️ Could not load menu data</strong><br />
              <span style={{ fontSize: 11, opacity: 0.8 }}>{loadError}</span>
            </div>
          )}
        </div>
      </header>

      {/* ══ STICKY NAV BLOCK ══ */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: NAV_BG, borderBottom: "1px solid rgba(0,0,0,.07)", transform: "translateZ(0)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "5px 12px 4px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          {[
            { v: "all", l: "All Items", Ic: LuUtensilsCrossed, c: "#b45309", bg: "linear-gradient(135deg,#d97706,#b45309)" },
            { v: "veg", l: "Veg Only", Ic: IoLeaf, c: "#16a34a", bg: "linear-gradient(135deg,#22c55e,#16a34a)" },
            { v: "nonveg", l: "Non-Veg", Ic: FaDrumstickBite, c: "#dc2626", bg: "linear-gradient(135deg,#ef4444,#dc2626)" },
          ].map(({ v, l, Ic, c, bg }) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 15px",
              borderRadius: 99, border: filter === v ? "none" : "1px solid #e5e7eb", cursor: "pointer", fontSize: 12, fontWeight: 700,
              background: filter === v ? bg : "#f3f4f6",
              color: filter === v ? "#fff" : "#4b5563",
              boxShadow: filter === v ? `0 2px 10px ${c}40` : "none",
            }}>
              <Ic size={13} color={filter === v ? "#fff" : c} />{l}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ width: "80%", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1.5px solid rgba(180,83,9,.3)", borderRadius: 13, overflow: "hidden" }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#d97706,#b45309)", flexShrink: 0 }}>
                <BiSearch size={21} color="#fff" />
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search dishes…  e.g. Biryani, Paneer 65"
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#111827", fontSize: 15, padding: "0 13px", height: 48, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ width: 44, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <BiX size={21} color="#9ca3af" />
                </button>
              )}
            </div>
            {search && <p style={{ fontSize: 12, color: "rgba(217,119,6,.7)", marginTop: 6, paddingLeft: 4, fontWeight: 600 }}>{hits.length} {hits.length === 1 ? "dish" : "dishes"} found</p>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div ref={navRef} style={{ display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch", flex: 1, scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: 4 }}>
            {CATS.map((cat, i) => (
              <button key={cat.id} data-navid={cat.id} onClick={() => jumpTo(cat.id)} className={i === 0 ? "nv-on" : ""}
                style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}>
                <cat.Icon size={17} className="nv-ic" />
                <span className="nv-lb" style={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        {!search && (
          <div style={{ padding: "6px 8px 5px" }}>
            <div ref={thumbsRef} style={{ display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch", gap: 5, scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {CATS.map((cat, i) => (
                <button key={cat.id} data-tid={cat.id} onClick={() => jumpTo(cat.id)} className={i === 0 ? "tb-on" : ""}
                  style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 4px", width: 62, borderRadius: 12, border: "none", cursor: "pointer" }}>
                  <div className="tb-wr" style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
                    <cat.Icon size={19} className="tb-ic" style={{ color: cat.accent }} />
                  </div>
                  <span className="tb-lb" style={{ fontSize: 9, fontWeight: 700, textAlign: "center", lineHeight: 1.2, color: "#4b5563" }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ CONTENT ══ */}
      <main style={{ width: "100%", maxWidth: 900, margin: "0 auto", padding: "18px 13px 100px", boxSizing: "border-box", contain: "layout style", transform: "translateZ(0)" }}>
        {loading && (
          <div style={{ padding: "20px 0" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: 64, borderRadius: 15, background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", marginBottom: 12, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
            ))}
            <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
          </div>
        )}
        {!loading && (search.trim() ? (
          hits.length === 0
            ? <div style={{ textAlign: "center", padding: "70px 0" }}>
              <BiSearch size={44} color="#d1d5db" style={{ margin: "0 auto 14px", display: "block" }} />
              <p style={{ color: "#6b7280", fontSize: 16, fontWeight: 500 }}>No dishes for <em style={{ color: "#d97706" }}>"{search}"</em></p>
            </div>
            : <div style={{ borderRadius: 13, overflow: "hidden", border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
              {hits.map(({ it, sec, cat }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < hits.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <Dot type={sec.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, color: "#1f2937", fontWeight: 600 }}>{it.n}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <cat.Icon size={11} color={cat.accent} />
                      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{cat.label}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,.09)", border: "1px solid rgba(217,119,6,.18)", borderRadius: 99, padding: "3px 13px", flexShrink: 0 }}>{it.p}</span>
                </div>
              ))}
            </div>
        ) : (
          CATS.map(cat => {
            const vis = applyFilter(cat.sections, filter);
            if (!vis.length) return null;
            const isOpen = !collapsed[cat.id];
            return (
              <section key={cat.id} id={cat.id} style={{ marginBottom: 28, scrollMarginTop: 250 }}>
                <div onClick={() => setCollapsed(p => ({ ...p, [cat.id]: !p[cat.id] }))}
                  style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", marginBottom: 12, borderRadius: 15, cursor: "pointer", background: `linear-gradient(130deg,rgba(${cat.glow},.12),rgba(${cat.glow},.04) 60%,#fff)`, border: `1px solid rgba(${cat.glow},.3)`, position: "relative", overflow: "hidden", transform: "translateZ(0)", boxShadow: "0 4px 12px rgba(0,0,0,.04)" }}>
                  <div style={{ position: "absolute", top: -14, right: -14, width: 62, height: 62, borderRadius: "50%", background: `radial-gradient(circle,rgba(${cat.glow},.18),transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg,${cat.accent},#fff)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px rgba(${cat.glow},.4)` }}>
                    <cat.Icon size={23} color="#fff" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.2))" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 700, color: "#1f2937", margin: 0, lineHeight: 1.1 }}>{cat.label}</h2>
                    <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                      {cat.sections.filter(s => s.sub).slice(0, 4).map((s, i) => {
                        const sc = TC[s.type] || "#888";
                        return <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${sc}1a`, color: sc, fontWeight: 700, border: `1px solid ${sc}40` }}>{s.sub}</span>;
                      })}
                    </div>
                  </div>
                  <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: "50%", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s", border: "1px solid #e5e7eb" }}>
                    <BsChevronDown size={14} color="#6b7280" />
                  </div>
                </div>
                {isOpen && vis.map((sec, si) => (
                  <div key={si} style={{ marginBottom: 12 }}>
                    {sec.sub && (
                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 3px 9px" }}>
                        {(() => { const Ic = TIcon[sec.type] || IoLeaf; const c = TC[sec.type] || "#888"; return <Ic size={12} color={c} />; })()}
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#9ca3af" }}>{sec.sub}</span>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${TC[sec.type] || "#888"}1a`, color: TC[sec.type] || "#888", border: `1px solid ${TC[sec.type] || "#888"}40`, fontWeight: 700 }}>{TLABEL[sec.type]}</span>
                        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${TC[sec.type] || "#888"}30,transparent)` }} />
                      </div>
                    )}
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.03)" }}>
                      {sec.items.map((item, ii) => (
                        <div key={ii} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderBottom: ii < sec.items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <Dot type={sec.type} />
                          <span style={{ flex: 1, minWidth: 0, fontSize: 16, color: "#374151", lineHeight: 1.45, fontWeight: 600, overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "normal" }}>{item.n}</span>
                          <span style={{ flexShrink: 0, fontSize: 16, fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,.09)", border: "1px solid rgba(217,119,6,.18)", borderRadius: 99, padding: "3px 13px" }}>{item.p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            );
          })
        ))}
      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "linear-gradient(180deg,#130801 0%,#0b0704 100%)", transform: "translateZ(0)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 1, background: "linear-gradient(90deg,transparent,rgba(180,83,9,.5),transparent)" }} />
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "36px 20px 44px", textAlign: "center", position: "relative" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", overflow: "hidden", border: "1px solid rgba(180,83,9,.25)", boxShadow: "0 0 0 2px rgba(180,83,9,.08)" }}>
            <img src={logoImg} alt="Athithi Delight Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28, fontWeight: 700, color: "#f5e8d0", lineHeight: 1 }}>
            Athithi <em style={{ color: "#d97706", fontStyle: "italic" }}>Delight Hotel</em>
          </div>
          <p style={{ fontSize: 11, color: "rgba(180,83,9,.45)", letterSpacing: ".35em", textTransform: "uppercase", fontWeight: 700, marginTop: 4, marginBottom: 20 }}>A/C Multi Cuisine · Siddipet</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {[["99489 44441", true], ["99489 44442", false]].map(([n, p]) => (
              <a key={n} href={`tel:${n.replace(/ /g, "")}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: p ? "linear-gradient(135deg,rgba(180,83,9,.2),rgba(180,83,9,.08))" : "rgba(255,255,255,.04)", border: p ? "1px solid rgba(180,83,9,.3)" : "1px solid rgba(255,255,255,.08)", borderRadius: 12, color: p ? "#f0a832" : "#7a5535", textDecoration: "none", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                <BsTelephone size={13} color={p ? "#d97706" : "#5a3820"} />{n}
              </a>
            ))}
          </div>
          <p style={{ color: "#5a3820", fontSize: 12, lineHeight: 1.9, marginBottom: 18 }}>~30 min prep time · Outside food not permitted · GST applicable</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <a href="?qr=1" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(180,83,9,.4)", textDecoration: "none", letterSpacing: ".08em", fontWeight: 600, textTransform: "uppercase" }}>
              🖨 &nbsp;Print QR Menu Card
            </a>
            <Link to="/admin-login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(180,83,9,.4)", textDecoration: "none", letterSpacing: ".08em", fontWeight: 600, textTransform: "uppercase" }}>
              <FaUserShield size={11} color="rgba(180,83,9,.4)" /> Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════ */

// Simple PrivateRoute wrapper for Admin
function PrivateRoute({ children }) {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  return isAuth ? children : <Navigate to="/admin-login" />;
}

export default function App() {
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  };

  const catCss = CATS_BASE.map(c => {
    const rgb = hexToRgb(c.accent);
    return `
    [data-navid="${c.id}"].nv-on .nv-ic { color:${c.accent}!important; }
    [data-navid="${c.id}"].nv-on .nv-lb { color:${c.accent}!important; }
    [data-navid="${c.id}"].nv-on        { border-bottom:2.5px solid ${c.accent}!important; background: rgba(${rgb},.12)!important; border-radius: 12px; }
    [data-tid="${c.id}"].tb-on          { background:rgba(${c.glow},.15)!important; border:2px solid rgba(${c.glow},.42)!important; outline:none!important; }
    [data-tid="${c.id}"].tb-on .tb-wr   { background:linear-gradient(135deg,${c.accent}cc,${c.accent}55)!important; }
    [data-tid="${c.id}"].tb-on .tb-ic   { color:#fff!important; }
    [data-tid="${c.id}"].tb-on .tb-lb   { color:${c.accent}!important; }
  `;
  }).join("\n");

  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#ffffff; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-track { background:#f3f4f6; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:3px; }
        input::placeholder { color:#9ca3af; font-style:italic; }
        button { font-family:'DM Sans',sans-serif; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        [data-navid] { border-bottom:2.5px solid transparent; }
        [data-navid] .nv-ic { color:#9ca3af; }
        [data-navid] .nv-lb { color:#6b7280; font-size:10px; }
        [data-tid] { background:#f9fafb; border:1px solid #e5e7eb; }
        [data-tid] .tb-wr { background:#f3f4f6; }
        [data-tid] .tb-lb { color:#6b7280; }
        @media (max-width: 480px) {
          main { padding: 18px 10px 100px; }
          [data-navid] { padding: 5px 7px !important; }
          [data-navid] .nv-lb { font-size: 9px !important; }
          [data-tid] { width: 52px !important; padding: 4px 2px !important; }
          [data-tid] .tb-wr { width: 30px !important; height: 30px !important; }
          [data-tid] .tb-lb { font-size: 8px !important; }
          .statsBar { width: 100% !important; display: flex !important; flex-wrap: wrap !important; justify-content: center !important; gap: 6px; }
          .statsBarItem { flex: 1 1 calc(33.333% - 12px) !important; min-width: 100px; border-right: none !important; padding: 8px 12px !important; }
          .statsBarItem:not(:last-child) { border-right: 1px solid rgba(0,0,0,.06) !important; }
          .statsBarLabel { font-size: 9px !important; letter-spacing: 0.15em !important; line-height: 1.2 !important; white-space: normal !important; word-break: break-word !important; }
        }
        ${catCss}
      `}</style>
      <Routes>
        <Route path="/" element={IS_QR ? <QRPrintPage /> : <MenuApp />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/seed" element={<Seeder />} />

        {/* Legacy redirect logic */}
        <Route path="/login" element={<Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}