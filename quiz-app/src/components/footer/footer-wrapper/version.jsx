function Version() {
  const version = __APP_VERSION__; // Injected by Vite

  return <div className="app-footer__version">v{version}</div>;
}
export default Version;
