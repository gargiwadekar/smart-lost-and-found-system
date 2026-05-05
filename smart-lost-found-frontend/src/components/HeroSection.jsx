import "./HeroSection.css";
import peopleImg from "../assets/thinking-people.png";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="image-container">
          <img src={peopleImg} alt="Thinking people" />

          {/* Floating Emojis */}
<span className="float key">🔑</span>
<span className="float bag">🎒</span>
<span className="float laptop">💻</span>
<span className="float phone">📱</span>
<span className="float question">❓</span>
        </div>
      </div>

      <div className="hero-right">
        <span className="badge">Smart Lost & Found System</span>

        <h1>
          Lost Something?<br />
          Found Something?
        </h1>

        <p>
          Every lost item carries a story.<br />
          Let’s help it reach its owner again.
        </p>

        <div className="features">
          <div>🔍 Easy Search</div>
          <div>📦 Quick Reports</div>
          <div>🔔 Instant Alerts</div>
        </div>
      </div>
    </section>
  );
}
