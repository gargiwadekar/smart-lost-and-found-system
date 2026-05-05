import "../styles/pages.css";


const AboutUs = () => {
  return (
    <div className="page about-page">
      <h1 className="page-title">💙 About FindItNow</h1>

      <p className="about-text">
        FindItNow is a smart lost and found platform designed to help people
        recover their belongings with ease, safety, and trust.
      </p>

      <div className="about-cards">
        <div className="about-card">
          <span>🌍</span>
          <h3>Our Mission</h3>
          <p>
            To reduce loss-related stress by creating a reliable and intelligent
            lost & found ecosystem.
          </p>
        </div>

        <div className="about-card">
          <span>🔐</span>
          <h3>Secure & Trusted</h3>
          <p>
            We ensure safe communication and verified reporting to protect both
            item owners and finders.
          </p>
        </div>

        <div className="about-card">
          <span>⚡</span>
          <h3>Fast & Smart</h3>
          <p>
            Our smart matching system speeds up the process of finding lost
            items.
          </p>
        </div>
      </div>

      <div className="about-footer">
        <p>
          ✨ Together, we believe every lost item deserves to find its way home.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
