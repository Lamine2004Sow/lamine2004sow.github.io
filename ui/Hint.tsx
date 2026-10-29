export function Hint() {
  return (
    <div className="hint" aria-hidden="true">
      <span className="keyonly">
        <kbd>←</kbd> <kbd>→</kbd> marcher · <kbd>MAJ</kbd> courir · <kbd>ESPACE</kbd> sauter · clic sur une plateforme ou sur moi
      </span>
      <span className="touchonly">Touche une plateforme pour y aller</span>
    </div>
  );
}
