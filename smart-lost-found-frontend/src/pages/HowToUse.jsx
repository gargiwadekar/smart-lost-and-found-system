import "../styles/pages.css";


const HowToUse = () => {
  return (
    <div className="page howto-page">
      <h1 className="page-title">🚀 How FindItNow Works</h1>
      <p className="page-subtitle">
        A smarter, faster way to reunite people with their lost belongings.
      </p>

      <div className="steps-container">
        <div className="step-card">
          <span className="step-icon">📌</span>
          <h3>Report Lost Item</h3>
          <p>
            Lost something valuable? Add item name, location, date and a short
            description so others can recognize it.
          </p>
        </div>

        <div className="step-card">
          <span className="step-icon">🎒</span>
          <h3>Report Found Item</h3>
          <p>
            Found an item? Upload details and help the real owner recover it
            safely and quickly.
          </p>
        </div>

        <div className="step-card">
          <span className="step-icon">🤖</span>
          <h3>Smart Matching</h3>
          <p>
            Our system intelligently matches lost and found reports and notifies
            users instantly.
          </p>
        </div>

        <div className="step-card">
          <span className="step-icon">🤝</span>
          <h3>Get It Back</h3>
          <p>
            Connect securely with verified users and recover your item with
            confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
