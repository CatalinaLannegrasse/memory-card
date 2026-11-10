import Card from './Card';

export default function CardGrid({ cards, onCardClick }) {
  return (
    <main className="card-grid">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </main>
  );
}