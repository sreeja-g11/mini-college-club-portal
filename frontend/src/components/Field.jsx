/** Label + input wrapper that shows the field's error message. */
export default function Field({ label, error, hint, children, htmlFor }) {
  return (
    <div className={error ? "field has-error" : "field"}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <small className="field-error">{error}</small> : hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}
