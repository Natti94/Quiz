import Version from "./footer-wrapper/version";
import Copyright from "./footer-wrapper/copyright";
import "./footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer" role="contentinfo" aria-label="Sidfot">
      <div className="app-footer__inner">
        <Copyright owner="Natnael Berhane" since={year} />
        <Version />
      </div>
    </footer>
  );
}

export default Footer;
