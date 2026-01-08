import { useState } from 'react';
import { RelationshipEngine } from '../relationshipEngine';

interface PersonFormProps {
  engine: RelationshipEngine;
  onPersonAdded: () => void;
}

export function PersonForm({ engine, onPersonAdded }: PersonFormProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const person = {
        id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        notes: notes.trim() || undefined,
      };

      engine.addPerson(person);
      setName('');
      setNotes('');
      onPersonAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add person');
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
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter person's name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Age, vibes, lore, whatever..."
        />
      </div>
      <button type="submit" className="button">
        Add Person
      </button>
    </form>
  );
}
