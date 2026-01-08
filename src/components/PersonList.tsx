import { RelationshipEngine } from '../relationshipEngine';

interface PersonListProps {
  engine: RelationshipEngine;
  selectedPersonId: string | null;
  onPersonSelect: (personId: string) => void;
}

export function PersonList({ engine, selectedPersonId, onPersonSelect }: PersonListProps) {
  const people = engine.getAllPeople();

  if (people.length === 0) {
    return (
      <div className="empty-state">
        <p>No people yet. Create your first person above!</p>
      </div>
    );
  }

  return (
    <ul className="person-list">
      {people.map((person) => (
        <li
          key={person.id}
          className={`person-item ${selectedPersonId === person.id ? 'selected' : ''}`}
          onClick={() => onPersonSelect(person.id)}
        >
          <h3>{person.name}</h3>
          {person.notes && <div className="notes">{person.notes}</div>}
        </li>
      ))}
    </ul>
  );
}
