import "./nav.css";

function Nav() {
  const isProd = import.meta.env.PROD;

  const assets = {
    projects_link: isProd
      ? "/.netlify/functions/getAssets?asset=projects_link"
      : import.meta.env.VITE_CLOUDINARY_PROJECTS_LINK,
  };

  return (
    <nav className="nav">
      <button
        className="nav__btn"
        onClick={() =>
          window.open(assets.projects_link, "_blank", "noreferrer")
        }
        aria-label="Projects"
        title="Projects"
      >
        📁 Visit Other Projects
      </button>
    </nav>
  );
}

export default Nav;
