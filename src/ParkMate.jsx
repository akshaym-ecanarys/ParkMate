import { useState, useRef, useEffect } from "react";
import { MapPin, Clock, Car, Star, Plus, IndianRupee, Home, Search, X, Check, ArrowLeft, Shield, Zap, TrendingUp, MessageCircle, Send, ChevronRight, Bookmark, Bell, Users, BarChart3, Calendar, LogOut } from "lucide-react";

const SPACES = [
  { id: 1, owner: "Ramesh K.", ownerInitials: "RK", area: "Koramangala", address: "3rd Block, Near Forum Mall", price: 40, rating: 4.8, reviews: 34, type: "Covered", size: "4-Wheeler", available: true, distance: "0.3 km", amenities: ["CCTV", "24/7 Access", "Covered"], timings: "6 AM – 11 PM", img: "coral" },
  { id: 2, owner: "Priya S.", ownerInitials: "PS", area: "Indiranagar", address: "100 Feet Road, Near CMH Rd", price: 35, rating: 4.6, reviews: 21, type: "Open", size: "2/4-Wheeler", available: true, distance: "0.7 km", amenities: ["CCTV", "24/7 Access"], timings: "All day", img: "teal" },
  { id: 3, owner: "Anil M.", ownerInitials: "AM", area: "HSR Layout", address: "Sector 1, Near Agara Lake", price: 25, rating: 4.9, reviews: 57, type: "Covered", size: "2-Wheeler", available: true, distance: "1.1 km", amenities: ["Covered", "Guard"], timings: "7 AM – 10 PM", img: "blue" },
  { id: 4, owner: "Sunita R.", ownerInitials: "SR", area: "Whitefield", address: "Near EPIP Zone, Hope Farm", price: 50, rating: 4.7, reviews: 18, type: "Covered", size: "4-Wheeler", available: false, distance: "2.3 km", amenities: ["CCTV", "Covered", "Guard", "EV Charging"], timings: "All day", img: "purple" },
  { id: 5, owner: "Kiran B.", ownerInitials: "KB", area: "JP Nagar", address: "Phase 6, Near Jayadeva", price: 30, rating: 4.5, reviews: 12, type: "Open", size: "2/4-Wheeler", available: true, distance: "1.8 km", amenities: ["CCTV"], timings: "8 AM – 9 PM", img: "green" },
  { id: 6, owner: "Deepa N.", ownerInitials: "DN", area: "Bellandur", address: "Near Ecospace Tech Park", price: 45, rating: 4.7, reviews: 29, type: "Covered", size: "4-Wheeler", available: true, distance: "0.9 km", amenities: ["CCTV", "24/7 Access", "Covered", "EV Charging"], timings: "All day", img: "amber" },
];

const COLOR_MAP = { coral: "#f0997b", teal: "#5DCAA5", blue: "#85B7EB", purple: "#AFA9EC", green: "#97C459", amber: "#FAC775" };

const HOST_EARNINGS = [
  { month: "Nov", amount: 2400 }, { month: "Dec", amount: 3100 }, { month: "Jan", amount: 2800 },
  { month: "Feb", amount: 4200 }, { month: "Mar", amount: 3700 }, { month: "Apr", amount: 4890 },
];

const MY_BOOKINGS = [
  { id: "BK001", space: "Koramangala, 3rd Block", owner: "Ramesh K.", date: "Today, 2 PM – 5 PM", price: 120, status: "active" },
  { id: "BK002", space: "Indiranagar, 100 Feet Rd", owner: "Priya S.", date: "Apr 18, 10 AM – 1 PM", price: 105, status: "completed" },
  { id: "BK003", space: "HSR Layout, Sector 1", owner: "Anil M.", date: "Apr 15, 9 AM – 6 PM", price: 225, status: "completed" },
];

const AREA_FILTERS = ["All", "Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "JP Nagar", "Bellandur"];

function Avatar({ initials, color = "#FAC775", size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "33", border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 600, color: color, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, icon }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(250,199,117,0.13)", border: "1px solid rgba(250,199,117,0.3)", borderRadius: 20, fontSize: 11, color: "#FAC775", fontWeight: 500 }}>
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
      {label}
    </span>
  );
}

function SpaceCard({ space, onClick }) {
  const accent = COLOR_MAP[space.img];
  return (
    <div onClick={onClick} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = accent + "55"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}>
      <div style={{ height: 100, background: `linear-gradient(135deg, ${accent}22, ${accent}44)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Car size={40} color={accent} strokeWidth={1.5} />
        {!space.available && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#ef4444", letterSpacing: 2 }}>BOOKED</div>}
        <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "2px 8px", fontSize: 11, color: "#9ca3af" }}>{space.distance}</span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{space.area}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{space.address}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FAC775" }}>₹{space.price}</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>/hr</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <Star size={11} fill="#FAC775" color="#FAC775" />
          <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500 }}>{space.rating}</span>
          <span style={{ fontSize: 11, color: "#64748b" }}>({space.reviews})</span>
          <span style={{ marginLeft: "auto", fontSize: 11, background: "rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: 6, color: "#94a3b8" }}>{space.type}</span>
        </div>
      </div>
    </div>
  );
}

function HomeView({ setView }) {
  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ textAlign: "center", padding: "50px 24px 40px", background: "radial-gradient(ellipse at 50% 0%, rgba(250,199,117,0.12) 0%, transparent 70%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(250,199,117,0.1)", border: "1px solid rgba(250,199,117,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#FAC775", marginBottom: 20 }}>
          <Zap size={12} /> Now live in Bengaluru
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: "#f8fafc", lineHeight: 1.15, margin: "0 0 14px", fontFamily: "'Georgia', serif" }}>
          Park Smarter.<br /><span style={{ color: "#FAC775" }}>Earn from Home.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Book a private parking spot in someone's home — or earn money renting out your driveway.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setView("browse")} style={{ padding: "13px 28px", background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            Find Parking Near Me
          </button>
          <button onClick={() => setView("host-list")} style={{ padding: "13px 28px", background: "transparent", color: "#FAC775", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1.5px solid #FAC775", cursor: "pointer" }}>
            List Your Space →
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, margin: "0 20px 32px", background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
        {[["3,200+", "Active Spots"], ["₹35", "Avg/Hour"], ["4.8★", "Avg Rating"]].map(([val, lbl]) => (
          <div key={lbl} style={{ padding: "20px 16px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FAC775", fontFamily: "monospace" }}>{val}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px", marginBottom: 28 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#64748b", marginBottom: 14 }}>How It Works</div>
        {[
          { icon: <Search size={18} color="#FAC775" />, title: "Find a spot", desc: "Search by area, price, or vehicle type — see spots near you on the map." },
          { icon: <Calendar size={18} color="#5DCAA5" />, title: "Book instantly", desc: "Select time slot and pay securely. Get directions straight to the spot." },
          { icon: <IndianRupee size={18} color="#AFA9EC" />, title: "Park & go", desc: "Arrive, park stress-free, and pay only for the time you use." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: "0 20px", padding: 20, background: "linear-gradient(135deg, rgba(250,199,117,0.08), rgba(250,199,117,0.03))", borderRadius: 16, border: "1px solid rgba(250,199,117,0.2)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#FAC775", marginBottom: 6 }}>🏠 Are you a homeowner?</div>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14, lineHeight: 1.5 }}>Earn ₹3,000–₹15,000/month by renting your unused driveway or garage. Zero effort, instant payouts.</p>
        <button onClick={() => setView("host-dashboard")} style={{ width: "100%", padding: "11px", background: "#FAC775", color: "#1a1506", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          View Host Dashboard
        </button>
      </div>
    </div>
  );
}

function BrowseView({ setView, setSelectedSpace }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = SPACES.filter(s => {
    const matchArea = filter === "All" || s.area === filter;
    const matchType = typeFilter === "All" || s.size === typeFilter || (typeFilter === "Covered" && s.type === "Covered");
    const matchSearch = !search || s.area.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
    return matchArea && matchType && matchSearch;
  });

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search area or landmark..." style={{ width: "100%", padding: "11px 12px 11px 38px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {AREA_FILTERS.map(a => (
            <button key={a} onClick={() => setFilter(a)} style={{ padding: "6px 14px", borderRadius: 20, border: filter === a ? "1.5px solid #FAC775" : "1px solid rgba(255,255,255,0.12)", background: filter === a ? "rgba(250,199,117,0.15)" : "transparent", color: filter === a ? "#FAC775" : "#94a3b8", fontSize: 12, fontWeight: filter === a ? 600 : 400, whiteSpace: "nowrap", cursor: "pointer" }}>
              {a}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4, paddingBottom: 4 }}>
          {["All", "2-Wheeler", "4-Wheeler", "Covered"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: "5px 12px", borderRadius: 8, border: typeFilter === t ? "1px solid #5DCAA5" : "1px solid rgba(255,255,255,0.1)", background: typeFilter === t ? "rgba(93,202,165,0.12)" : "transparent", color: typeFilter === t ? "#5DCAA5" : "#64748b", fontSize: 11, cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", fontSize: 12, color: "#64748b", marginBottom: 4 }}>
        {filtered.length} spots found {filter !== "All" ? `in ${filter}` : "near you"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
        {filtered.map(space => (
          <SpaceCard key={space.id} space={space} onClick={() => { setSelectedSpace(space); setView("space-detail"); }} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#64748b" }}>
            <Car size={32} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
            <div>No spots found</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpaceDetailView({ space, setView }) {
  const [hours, setHours] = useState(2);
  const [date, setDate] = useState("Today");
  const [startTime, setStartTime] = useState("02:00 PM");
  const [booked, setBooked] = useState(false);
  const accent = COLOR_MAP[space.img];
  const total = hours * space.price;
  const platformFee = Math.round(total * 0.1);

  if (booked) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: 24, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(93,202,165,0.15)", border: "2px solid #5DCAA5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Check size={32} color="#5DCAA5" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Booking Confirmed!</div>
      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>{space.area} · {space.address}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>A confirmation has been sent to you. The owner has been notified.</div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", width: "100%", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Booking ID</span>
          <span style={{ color: "#FAC775", fontSize: 13, fontFamily: "monospace" }}>BK{Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>{date} · {startTime}</span>
          <span style={{ color: "#e2e8f0", fontSize: 13 }}>{hours}h</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Total Paid</span>
          <span style={{ color: "#5DCAA5", fontSize: 14, fontWeight: 700 }}>₹{total + platformFee}</span>
        </div>
      </div>
      <button onClick={() => setView("browse")} style={{ width: "100%", padding: 13, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>Back to Browse</button>
    </div>
  );

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ height: 160, background: `linear-gradient(135deg, ${accent}22, ${accent}44)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Car size={60} color={accent} strokeWidth={1.2} />
        <button onClick={() => setView("browse")} style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#fff", display: "flex" }}>
          <ArrowLeft size={18} />
        </button>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>{space.area}</h2>
            <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={12} />{space.address}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FAC775" }}>₹{space.price}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>per hour</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {space.amenities.map(a => <Badge key={a} label={a} />)}
          <Badge label={space.type} />
          <Badge label={space.size} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 6 }}>
          <Avatar initials={space.ownerInitials} color={accent} size={38} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{space.owner}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Space Owner · Verified</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={12} fill="#FAC775" color="#FAC775" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#FAC775" }}>{space.rating}</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>({space.reviews})</span>
          </div>
        </div>

        <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>AVAILABILITY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13 }}>
            <Clock size={13} color="#FAC775" /> {space.timings}
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 12 }}>Book This Spot</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5 }}>DATE</label>
            <select value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 13 }}>
              <option>Today</option><option>Tomorrow</option><option>Apr 22</option><option>Apr 23</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5 }}>START TIME</label>
            <select value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 13 }}>
              {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "#64748b", display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>DURATION</span><span style={{ color: "#FAC775", fontWeight: 600 }}>{hours} hour{hours > 1 ? "s" : ""}</span>
          </label>
          <input type="range" min={1} max={8} value={hours} onChange={e => setHours(+e.target.value)} style={{ width: "100%", accentColor: "#FAC775" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginTop: 3 }}>
            <span>1h</span><span>8h</span>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>₹{space.price} × {hours}h</span>
            <span style={{ color: "#e2e8f0", fontSize: 13 }}>₹{total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>Platform fee (10%)</span>
            <span style={{ color: "#e2e8f0", fontSize: 13 }}>₹{platformFee}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>Total</span>
            <span style={{ color: "#FAC775", fontSize: 16, fontWeight: 800 }}>₹{total + platformFee}</span>
          </div>
        </div>

        {!space.available ? (
          <button disabled style={{ width: "100%", padding: 14, background: "rgba(239,68,68,0.15)", color: "#ef4444", borderRadius: 12, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", cursor: "not-allowed", fontSize: 14 }}>
            Currently Booked
          </button>
        ) : (
          <button onClick={() => setBooked(true)} style={{ width: "100%", padding: 14, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 800, border: "none", cursor: "pointer", fontSize: 15 }}>
            Confirm Booking — ₹{total + platformFee}
          </button>
        )}
      </div>
    </div>
  );
}

function HostListView({ setView }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ area: "", address: "", type: "Covered", size: "4-Wheeler", price: 35, timings: "All day", amenities: [] });
  const [submitted, setSubmitted] = useState(false);
  const amenityOpts = ["CCTV", "24/7 Access", "Covered", "Guard", "EV Charging"];

  const toggle = (a) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: 24, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(250,199,117,0.15)", border: "2px solid #FAC775", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Check size={32} color="#FAC775" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Space Listed!</div>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>Your spot is now live. Start earning from day one.</p>
      <button onClick={() => setView("host-dashboard")} style={{ width: "100%", padding: 13, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>View My Dashboard</button>
    </div>
  );

  return (
    <div style={{ padding: "16px 18px 80px" }}>
      <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>List Your Space</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Takes 2 minutes. Start earning today.</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {["Location", "Details", "Pricing"].map((s, i) => (
          <div key={s} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: step > i ? "#FAC775" : step === i + 1 ? "rgba(250,199,117,0.3)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > i ? "#1a1506" : step === i + 1 ? "#FAC775" : "#475569" }}>
              {step > i + 1 ? <Check size={12} color="#1a1506" /> : i + 1}
            </div>
            <span style={{ fontSize: 11, color: step === i + 1 ? "#FAC775" : "#475569" }}>{s}</span>
            {i < 2 && <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>AREA / LOCALITY</label>
            <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="e.g. Koramangala, HSR Layout..." style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>FULL ADDRESS / LANDMARK</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="House no., street, near landmark..." rows={3} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14, boxSizing: "border-box", resize: "none" }} />
          </div>
          <button onClick={() => setStep(2)} style={{ padding: 13, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 8 }}>PARKING TYPE</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["Covered", "Open"].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "10px", borderRadius: 10, border: form.type === t ? "2px solid #FAC775" : "1px solid rgba(255,255,255,0.12)", background: form.type === t ? "rgba(250,199,117,0.1)" : "transparent", color: form.type === t ? "#FAC775" : "#94a3b8", fontWeight: 500, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 8 }}>SUITABLE FOR</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["2-Wheeler", "4-Wheeler", "2/4-Wheeler"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, size: s }))} style={{ padding: "8px 14px", borderRadius: 8, border: form.size === s ? "1.5px solid #FAC775" : "1px solid rgba(255,255,255,0.12)", background: form.size === s ? "rgba(250,199,117,0.1)" : "transparent", color: form.size === s ? "#FAC775" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 8 }}>AMENITIES</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {amenityOpts.map(a => (
                <button key={a} onClick={() => toggle(a)} style={{ padding: "7px 12px", borderRadius: 8, border: form.amenities.includes(a) ? "1.5px solid #5DCAA5" : "1px solid rgba(255,255,255,0.12)", background: form.amenities.includes(a) ? "rgba(93,202,165,0.12)" : "transparent", color: form.amenities.includes(a) ? "#5DCAA5" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                  {form.amenities.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 8 }}>AVAILABILITY</label>
            <select value={form.timings} onChange={e => setForm(f => ({ ...f, timings: e.target.value }))} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14 }}>
              <option>All day</option><option>6 AM – 11 PM</option><option>8 AM – 9 PM</option><option>7 AM – 10 PM</option><option>Weekends only</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, background: "transparent", color: "#94a3b8", borderRadius: 12, fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>Continue →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#64748b", display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>YOUR PRICE PER HOUR</span><span style={{ color: "#FAC775", fontWeight: 700, fontSize: 16 }}>₹{form.price}/hr</span>
            </label>
            <input type="range" min={15} max={150} step={5} value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} style={{ width: "100%", accentColor: "#FAC775" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginTop: 3 }}><span>₹15</span><span>₹150</span></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>ESTIMATED MONTHLY EARNINGS</div>
            {[["8 hrs/day", form.price * 8 * 30], ["4 hrs/day", form.price * 4 * 30], ["Weekends", form.price * 6 * 8]].map(([label, earn]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{label}</span>
                <span style={{ color: "#5DCAA5", fontSize: 13, fontWeight: 600 }}>₹{earn.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 14px", background: "rgba(250,199,117,0.06)", borderRadius: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            ParkMate takes a <strong style={{ color: "#FAC775" }}>15% commission</strong> per booking. You receive the rest instantly after each booking ends.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, background: "transparent", color: "#94a3b8", borderRadius: 12, fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>← Back</button>
            <button onClick={() => setSubmitted(true)} style={{ flex: 2, padding: 13, background: "#FAC775", color: "#1a1506", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>List My Space 🚀</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HostDashboard({ setView }) {
  const max = Math.max(...HOST_EARNINGS.map(e => e.amount));
  return (
    <div style={{ padding: "16px 18px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Welcome back</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Host Dashboard</h2>
        </div>
        <Avatar initials="YO" color="#FAC775" size={40} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[["₹4,890", "This Month", "#FAC775"], ["28", "Bookings", "#5DCAA5"], ["4.9★", "Your Rating", "#AFA9EC"], ["₹28,140", "Total Earned", "#F0997B"]].map(([val, label, color]) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "monospace" }}>{val}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 16 }}>EARNINGS — LAST 6 MONTHS</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {HOST_EARNINGS.map((e, i) => (
            <div key={e.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", background: i === HOST_EARNINGS.length - 1 ? "#FAC775" : "rgba(250,199,117,0.3)", borderRadius: "4px 4px 0 0", height: `${(e.amount / max) * 75}px`, transition: "height 0.5s" }} />
              <div style={{ fontSize: 9, color: "#475569" }}>{e.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>MY ACTIVE LISTING</div>
          <button onClick={() => setView("host-list")} style={{ fontSize: 11, color: "#FAC775", background: "none", border: "none", cursor: "pointer" }}>+ Add New</button>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 44, height: 44, background: "rgba(250,199,117,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={22} color="#FAC775" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Koramangala, 3rd Block</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Covered · 4-Wheeler · ₹40/hr</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5DCAA5", marginRight: 5 }} />
            <span style={{ fontSize: 11, color: "#5DCAA5" }}>Live</span>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>UPCOMING BOOKINGS</div>
        {[{ name: "Arjun M.", time: "Today 2:00 – 5:00 PM", earn: "₹102" }, { name: "Sneha P.", time: "Tomorrow 9:00 – 11:00 AM", earn: "₹68" }].map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: i < 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <Avatar initials={b.name.split(" ").map(n => n[0]).join("")} color="#AFA9EC" size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{b.time}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#5DCAA5" }}>{b.earn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyBookingsView() {
  return (
    <div style={{ padding: "16px 18px 80px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 16 }}>My Bookings</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MY_BOOKINGS.map((b, i) => (
          <div key={b.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${b.status === "active" ? "rgba(93,202,165,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontFamily: "monospace", color: "#64748b" }}>{b.id}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: b.status === "active" ? "rgba(93,202,165,0.15)" : "rgba(255,255,255,0.06)", color: b.status === "active" ? "#5DCAA5" : "#64748b", fontWeight: 500 }}>
                {b.status === "active" ? "● Active" : "Completed"}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 3 }}>{b.space}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Hosted by {b.owner} · {b.date}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#FAC775" }}>₹{b.price}</span>
              {b.status === "active" && <button style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(93,202,165,0.15)", border: "1px solid rgba(93,202,165,0.3)", color: "#5DCAA5", fontSize: 12, cursor: "pointer" }}>Get Directions</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ParkMate() {
  const [view, setView] = useState("home");
  const [selectedSpace, setSelectedSpace] = useState(null);

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "browse", label: "Find", icon: <Search size={20} /> },
    { id: "my-bookings", label: "Bookings", icon: <Bookmark size={20} /> },
    { id: "host-dashboard", label: "Host", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", maxWidth: 430, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(15,17,23,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(view === "space-detail" || view === "host-list") ? (
            <button onClick={() => setView(view === "space-detail" ? "browse" : "home")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 28, height: 28, background: "#FAC775", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Car size={16} color="#1a1506" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#FAC775", letterSpacing: -0.5 }}>ParkMate</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
            <Bell size={16} />
          </button>
          <Avatar initials="YO" size={32} color="#AFA9EC" />
        </div>
      </div>

      <div style={{ paddingBottom: 70 }}>
        {view === "home" && <HomeView setView={setView} />}
        {view === "browse" && <BrowseView setView={setView} setSelectedSpace={setSelectedSpace} />}
        {view === "space-detail" && selectedSpace && <SpaceDetailView space={selectedSpace} setView={setView} />}
        {view === "host-list" && <HostListView setView={setView} />}
        {view === "host-dashboard" && <HostDashboard setView={setView} />}
        {view === "my-bookings" && <MyBookingsView />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(15,17,23,0.98)", borderTop: "1px solid rgba(255,255,255,0.09)", display: "flex", backdropFilter: "blur(10px)", zIndex: 200 }}>
        {navItems.map(item => {
          const active = view === item.id || (item.id === "browse" && view === "space-detail");
          return (
            <button key={item.id} onClick={() => setView(item.id)} style={{ flex: 1, padding: "10px 4px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: active ? "#FAC775" : "#475569", transition: "color 0.2s" }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FAC775", position: "absolute", bottom: 6 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
