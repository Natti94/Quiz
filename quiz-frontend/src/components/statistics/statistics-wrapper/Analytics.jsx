import { useTranslation } from "../../../lib";
function Analytics() {
  // `t` is intentionally unused for now; prefix with underscore to satisfy
  // ESLint's allowed-unused-vars pattern (variables starting with _).
  const { t: _t } = useTranslation();

  return <div>Analytics Component</div>;
}

export default Analytics;
