import { useState } from 'react';
import { RelationshipEngine } from './relationshipEngine';
import { Person, Relationship } from './types';
import { PersonForm } from './components/PersonForm';
import { RelationshipForm } from './components/RelationshipForm';
import { PersonList } from './components/PersonList';
import { RelationshipView } from './components/RelationshipView';
import './App.css';

function App() {
  const [engine] = useState(() => new RelationshipEngine());
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePersonAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleRelationshipAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Relationship Namer</h1>
        <p className="subtitle">Build family trees with automatic relationship inference</p>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <section className="card">
            <h2>Create Person</h2>
            <PersonForm engine={engine} onPersonAdded={handlePersonAdded} />
          </section>

          <section className="card">
            <h2>Create Relationship</h2>
            <RelationshipForm
              engine={engine}
              onRelationshipAdded={handleRelationshipAdded}
              key={refreshKey}
            />
          </section>

          <section className="card">
            <h2>All People</h2>
            <PersonList
              engine={engine}
              selectedPersonId={selectedPersonId}
              onPersonSelect={setSelectedPersonId}
              key={refreshKey}
            />
          </section>
        </div>

        <div className="right-panel">
          {selectedPersonId ? (
            <RelationshipView
              engine={engine}
              personId={selectedPersonId}
              key={refreshKey}
            />
          ) : (
            <div className="card placeholder">
              <p>Select a person to view their relationships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
