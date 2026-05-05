import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>Smart Lost & Found</h3>
          <p>
            A secure way to report, search, match, and recover lost belongings.
          </p>
        </div>

        <div>
          <h4>Social Links</h4>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
        </div>

        <div>
          <h4>Features</h4>
          <a href="/how-to-use">How It Works</a>
          <a href="/dashboard/lost">Report Lost Item</a>
          <a href="/dashboard/found">Add Found Item</a>
        </div>

        <div>
          <h4>Categories</h4>
          <span>Electronics</span>
          <span>Documents</span>
          <span>Accessories</span>
          <span>Bags</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Smart Lost & Found System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
