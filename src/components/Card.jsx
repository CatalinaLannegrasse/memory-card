export default function Card({ card, onClick }) {
  return (
    <div className="card" onClick={() => onClick(card.id)}>
      <div className="card-image-container">
        <img src={card.image} alt={card.name} />
      </div>
      <p className="card-name">{card.name}</p>
    </div>
  );
}