# Relationship Identifier Tool

A visual graph-based system for mapping family relationships. Create nodes (people), connect them with parent-child or spouse relationships, and the system automatically infers all other relationships (siblings, cousins, aunts/uncles, step-relationships, in-laws, etc.).

**by Leto-cmd**

## Features

### Core Features

- **Visual Node-Based Graph**: Drag-and-drop interface with SVG rendering
- **Primitive Relationships Only**: Store only parent-child and spouse relationships
- **Automatic Relationship Inference**: 
  - Direct ancestors/descendants (parent, grandparent, great-grandparent, etc.)
  - Siblings (full and half)
  - Step-relationships (step-parent, step-child, step-sibling)
  - In-law relationships (parent-in-law, sibling-in-law, cousin-in-law, etc.)
  - Aunt/uncle and niece/nephew relationships
  - Cousin relationships with removals (first cousin once removed, etc.)
- **Point-of-View System**: Relationships shown from the first selected person's perspective
- **Incest Detection**: Configurable threshold for flagging incestuous spouse relationships
- **Multiple Relationships**: Support for multiple relationships between the same two people
- **Comprehensive Explanations**: Every relationship includes a human-readable explanation

## Getting Started

### Standalone Version (No Installation Required)

Simply open `standalone.html` in your web browser. No build step or dependencies needed!

### Development Version (Optional)

If you want to work with the React/TypeScript source:

```bash
npm install
npm run dev
```

## How to Use

1. **Add Node Mode**: Click anywhere on the canvas to create a new person
2. **Select Nodes Mode**: Click nodes to select them (up to 2). The first selected is your point of view
3. **Pan Canvas Mode**: Drag to move around the canvas
4. **Drag Nodes**: Click and drag nodes to reposition them
5. **Create Relationships**: Select two nodes and use the form to add parent-child or spouse relationships
6. **View Relationships**: Select two nodes to see all relationships between them (direct, inferred, and in-law)

## Relationship Types

- **Direct**: Parent-child and spouse relationships you explicitly create
- **Inferred**: Automatically calculated relationships (siblings, cousins, step-relationships, etc.)
- **In-Law**: Relationships through marriage (shown separately when applicable)

## Technical Details

- **Standalone**: Pure HTML/CSS/JavaScript - no build required
- **Visual Rendering**: SVG-based graph with interactive nodes
- **Relationship Engine**: Comprehensive ancestor mapping and NCA (Nearest Common Ancestor) algorithm
- **Inference Logic**: Handles complex genealogical relationships including multiple "greats" and cousin removals

## License

This project is created by Leto-cmd.
