import { useState } from 'react';
import { RelationshipEngine } from '../relationshipEngine';
import { RelationshipType } from '../types';

interface RelationshipFormProps {
  engine: RelationshipEngine;
  onRelationshipAdded: () => void;
}

export function RelationshipForm({ engine, onRelationshipAdded }: RelationshipFormProps) {
  const [personAId, setPersonAId] = useState('');
  const [personBId, setPersonBId] = useState('');
  const [type, setType] = useState<RelationshipType>('spouse');
  const [direction, setDirection] = useState<'A->B' | 'B->A'>('A->B');
  const [error, setError] = useState<string | null>(null);

  const people = engine.getAllPeople();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!personAId || !personBId) {
      setError('Please select both people');
      return;
    }

    if (personAId === personBId) {
      setError('A person cannot have a relationship with themselves');
      return;
    }

    try {
      const relationship = {
        id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        personA: personAId,
        personB: personBId,
        type,
        direction: type === 'spouse' ? 'mutual' : direction,
      };

      engine.addRelationship(relationship);
      setPersonAId('');
      setPersonBId('');
      setDirection('A->B');
      onRelationshipAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: 'red', marginBottom: '12px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="personA">Person A</label>
        <select
          id="personA"
          value={personAId}
          onChange={(e) => setPersonAId(e.target.value)}
          required
        >
          <option value="">Select person...</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="personB">Person B</label>
        <select
          id="personB"
          value={personBId}
          onChange={(e) => setPersonBId(e.target.value)}
          required
        >
          <option value="">Select person...</option>
          {people
            .filter((person) => person.id !== personAId)
            .map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="type">Relationship Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as RelationshipType)}
          required
        >
          <option value="spouse">Spouse</option>
          <option value="child">Child</option>
        </select>
      </div>
      {type === 'child' && (
        <div className="form-group">
          <label htmlFor="direction">Direction</label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'A->B' | 'B->A')}
            required
          >
            <option value="A->B">Person A is parent of Person B</option>
            <option value="B->A">Person B is parent of Person A</option>
          </select>
        </div>
      )}
      <button type="submit" className="button" disabled={people.length < 2}>
        Add Relationship
      </button>
      {people.length < 2 && (
        <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
          Need at least 2 people to create a relationship
        </p>
      )}
    </form>
  );
}
