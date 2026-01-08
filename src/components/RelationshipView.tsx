import { RelationshipEngine } from '../relationshipEngine';

interface RelationshipViewProps {
  engine: RelationshipEngine;
  personId: string;
}

export function RelationshipView({ engine, personId }: RelationshipViewProps) {
  const person = engine.getPerson(personId);
  const relationships = engine.getPersonRelationships(personId);

  if (!person) {
    return (
      <div className="card">
        <p>Person not found</p>
      </div>
    );
  }

  const directRelationships = relationships.filter((r) => r.isDirect);
  const inferredRelationships = relationships.filter((r) => !r.isDirect);

  return (
    <div className="card">
      <h2>Relationships: {person.name}</h2>
      {person.notes && (
        <p style={{ marginBottom: '20px', color: '#666', fontStyle: 'italic' }}>
          {person.notes}
        </p>
      )}

      {relationships.length === 0 ? (
        <div className="empty-state">
          <p>No relationships found for {person.name}</p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Create relationships above to see them here
          </p>
        </div>
      ) : (
        <>
          {directRelationships.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#333' }}>
                Direct Relationships
              </h3>
              <ul className="relationship-list">
                {directRelationships.map((rel) => {
                  const otherPerson = engine.getPerson(rel.toPerson);
                  const description = engine.generateRelationshipDescription(
                    rel.fromPerson,
                    rel.toPerson
                  );
                  return (
                    <li key={rel.toPerson} className="relationship-item direct">
                      <h3>{otherPerson?.name || 'Unknown'}</h3>
                      <div className="description">{description}</div>
                      <span className="badge direct">Direct</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {inferredRelationships.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#333' }}>
                Inferred Relationships
              </h3>
              <ul className="relationship-list">
                {inferredRelationships.map((rel) => {
                  const otherPerson = engine.getPerson(rel.toPerson);
                  const description = engine.generateRelationshipDescription(
                    rel.fromPerson,
                    rel.toPerson
                  );
                  return (
                    <li key={rel.toPerson} className="relationship-item inferred">
                      <h3>{otherPerson?.name || 'Unknown'}</h3>
                      <div className="description">{description}</div>
                      <span className="badge inferred">Inferred</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
