export type RelationshipType = 'spouse' | 'child';

export interface Person {
  id: string;
  name: string;
  notes?: string;
}

export interface Relationship {
  id: string;
  personA: string; // Person ID
  personB: string; // Person ID
  type: RelationshipType;
  direction: 'A->B' | 'B->A' | 'mutual'; // For spouse it's mutual, for child it's directional
}

export interface RelationshipLabel {
  fromPerson: string;
  toPerson: string;
  label: string; // e.g., "father", "spouse", "sibling"
  isDirect: boolean; // true for direct relationships, false for inferred
}
