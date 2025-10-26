export default function Loading() {
  return (
    <div className="page-loading" aria-busy="true" aria-live="polite">
      <span className="spinner" aria-label="Chargement" />
    </div>
  );
}
