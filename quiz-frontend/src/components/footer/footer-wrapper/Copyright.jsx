function Copyright({ owner = "Natnael Berhane", since }) {
  const year = new Date().getFullYear();
  const label = since && since < year ? `${since}–${year}` : `${year}`;
  return (
    <div className="app-footer__copyright" aria-label="Copyright">
      © {label} {owner}
    </div>
  );
}

export default Copyright;
