export default function Loading() {
  return (
    <div className="public-loading" aria-busy="true" aria-live="polite">
      <span className="spinner" aria-label="Loading" />
    </div>
  );
}
