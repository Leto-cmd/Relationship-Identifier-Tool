import { Person, Relationship, RelationshipLabel, RelationshipType } from './types';

export class RelationshipEngine {
  private people: Map<string, Person> = new Map();
  private relationships: Map<string, Relationship> = new Map();

  addPerson(person: Person): void {
    if (this.people.has(person.id)) {
      throw new Error(`Person with ID ${person.id} already exists`);
    }
    this.people.set(person.id, person);
  }

  getPerson(id: string): Person | undefined {
    return this.people.get(id);
  }

  getAllPeople(): Person[] {
    return Array.from(this.people.values());
  }

  addRelationship(relationship: Relationship): void {
    // Validate people exist
    if (!this.people.has(relationship.personA) || !this.people.has(relationship.personB)) {
      throw new Error('Both people must exist before creating a relationship');
    }

    // Check for duplicates
    const existing = Array.from(this.relationships.values()).find(
      (rel) =>
        (rel.personA === relationship.personA && rel.personB === relationship.personB) ||
        (rel.personA === relationship.personB && rel.personB === relationship.personA)
    );

    if (existing && existing.type === relationship.type) {
      throw new Error('This relationship already exists');
    }

    this.relationships.set(relationship.id, relationship);
  }

  getRelationships(): Relationship[] {
    return Array.from(this.relationships.values());
  }

  // Get all relationships for a person (direct and inferred)
  getPersonRelationships(personId: string): RelationshipLabel[] {
    const labels: RelationshipLabel[] = [];

    // Direct relationships
    for (const rel of this.relationships.values()) {
      if (rel.personA === personId) {
        labels.push(this.createDirectLabel(rel, personId, rel.personB));
      } else if (rel.personB === personId) {
        labels.push(this.createDirectLabel(rel, personId, rel.personA));
      }
    }

    // Inferred relationships
    const inferred = this.inferRelationships(personId);
    labels.push(...inferred);

    return labels;
  }

  private createDirectLabel(
    rel: Relationship,
    fromPerson: string,
    toPerson: string
  ): RelationshipLabel {
    if (rel.type === 'spouse') {
      return {
        fromPerson,
        toPerson,
        label: 'spouse',
        isDirect: true,
      };
    }

    // Child relationship
    if (rel.type === 'child') {
      if (rel.direction === 'A->B' && rel.personA === fromPerson) {
        return {
          fromPerson,
          toPerson,
          label: 'child',
          isDirect: true,
        };
      } else if (rel.direction === 'B->A' && rel.personB === fromPerson) {
        return {
          fromPerson,
          toPerson,
          label: 'child',
          isDirect: true,
        };
      } else {
        return {
          fromPerson,
          toPerson,
          label: 'parent',
          isDirect: true,
        };
      }
    }

    throw new Error('Unknown relationship type');
  }

  private inferRelationships(personId: string): RelationshipLabel[] {
    const inferred: RelationshipLabel[] = [];

    // Find siblings (people who share at least one parent)
    const parents = this.getParents(personId);
    if (parents.length > 0) {
      const siblings = this.findSiblings(personId, parents);
      for (const sibling of siblings) {
        inferred.push({
          fromPerson: personId,
          toPerson: sibling,
          label: 'sibling',
          isDirect: false,
        });
      }
    }

    // Find step-parents (spouse of a parent)
    for (const parent of parents) {
      const parentSpouses = this.getSpouses(parent);
      for (const spouse of parentSpouses) {
        if (spouse !== this.getOtherParent(personId, parent)) {
          inferred.push({
            fromPerson: personId,
            toPerson: spouse,
            label: 'step-parent',
            isDirect: false,
          });
        }
      }
    }

    // Find step-siblings (children of step-parents)
    for (const parent of parents) {
      const parentSpouses = this.getSpouses(parent);
      for (const spouse of parentSpouses) {
        if (spouse !== this.getOtherParent(personId, parent)) {
          const stepSiblings = this.getChildren(spouse);
          for (const stepSibling of stepSiblings) {
            if (stepSibling !== personId && !this.areSiblings(personId, stepSibling)) {
              inferred.push({
                fromPerson: personId,
                toPerson: stepSibling,
                label: 'step-sibling',
                isDirect: false,
              });
            }
          }
        }
      }
    }

    return inferred;
  }

  private getParents(personId: string): string[] {
    const parents: string[] = [];
    for (const rel of this.relationships.values()) {
      if (rel.type === 'child') {
        if (rel.direction === 'A->B' && rel.personB === personId) {
          parents.push(rel.personA);
        } else if (rel.direction === 'B->A' && rel.personA === personId) {
          parents.push(rel.personB);
        }
      }
    }
    return parents;
  }

  private getChildren(personId: string): string[] {
    const children: string[] = [];
    for (const rel of this.relationships.values()) {
      if (rel.type === 'child') {
        if (rel.direction === 'A->B' && rel.personA === personId) {
          children.push(rel.personB);
        } else if (rel.direction === 'B->A' && rel.personB === personId) {
          children.push(rel.personA);
        }
      }
    }
    return children;
  }

  private getSpouses(personId: string): string[] {
    const spouses: string[] = [];
    for (const rel of this.relationships.values()) {
      if (rel.type === 'spouse') {
        if (rel.personA === personId) {
          spouses.push(rel.personB);
        } else if (rel.personB === personId) {
          spouses.push(rel.personA);
        }
      }
    }
    return spouses;
  }

  private getOtherParent(childId: string, oneParentId: string): string | null {
    const parents = this.getParents(childId);
    const other = parents.find((p) => p !== oneParentId);
    return other || null;
  }

  private findSiblings(personId: string, parents: string[]): string[] {
    const siblings = new Set<string>();
    for (const parent of parents) {
      const children = this.getChildren(parent);
      for (const child of children) {
        if (child !== personId) {
          siblings.add(child);
        }
      }
    }
    return Array.from(siblings);
  }

  private areSiblings(personA: string, personB: string): boolean {
    const parentsA = this.getParents(personA);
    const parentsB = this.getParents(personB);
    return parentsA.some((p) => parentsB.includes(p));
  }

  // Generate readable relationship description
  generateRelationshipDescription(fromPersonId: string, toPersonId: string): string {
    const fromPerson = this.people.get(fromPersonId);
    const toPerson = this.people.get(toPersonId);
    if (!fromPerson || !toPerson) {
      return 'Unknown relationship';
    }

    const relationships = this.getPersonRelationships(fromPersonId);
    const rel = relationships.find((r) => r.toPerson === toPersonId);
    if (!rel) {
      return `${fromPerson.name} has no known relationship to ${toPerson.name}`;
    }

    const label = rel.label;
    const fromName = fromPerson.name;
    const toName = toPerson.name;

    switch (label) {
      case 'spouse':
        return `${fromName} is ${toName}'s spouse`;
      case 'parent':
        return `${fromName} is ${toName}'s parent`;
      case 'child':
        return `${fromName} is ${toName}'s child`;
      case 'sibling':
        return `${fromName} is ${toName}'s sibling`;
      case 'step-parent':
        return `${fromName} is ${toName}'s step-parent`;
      case 'step-sibling':
        return `${fromName} is ${toName}'s step-sibling`;
      default:
        return `${fromName} is related to ${toName} (${label})`;
    }
  }

  // Clear all data (useful for testing/reset)
  clear(): void {
    this.people.clear();
    this.relationships.clear();
  }
}
