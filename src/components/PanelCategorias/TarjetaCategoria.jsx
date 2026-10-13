import "./TarjetaCategorias.css";

export default function TarjetaCategorias({ title, icon }) {
  return (
    <div className="category-card">
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path
          d={icon}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="category-title">{title}</h3>
    </div>
  );
}
