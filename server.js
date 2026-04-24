const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Builds a tree from an array of "X->Y" relationship strings.
 * Rules:
 *  - First parent wins (if Y already has a parent, ignore subsequent ones).
 *  - Detects cycles; for cyclic groups the lexicographically smallest node
 *    is treated as the root.
 */
function buildTree(data) {
  const parent = {};   // child -> parent
  const children = {}; // parent -> [children]
  const nodes = new Set();

  for (const rel of data) {
    const match = rel.match(/^([A-Za-z0-9]+)->([A-Za-z0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid format: "${rel}". Expected "X->Y".`);
    }
    const [, p, c] = match;
    nodes.add(p);
    nodes.add(c);
    if (!children[p]) children[p] = [];
    // First parent wins
    if (parent[c] === undefined) {
      parent[c] = p;
      children[p].push(c);
    }
  }

  // Detect cycles using DFS
  const color = {}; // 0=white, 1=gray, 2=black
  const cycleNodes = new Set();

  function dfs(node) {
    color[node] = 1;
    for (const child of (children[node] || [])) {
      if (color[child] === 1) {
        cycleNodes.add(child);
        cycleNodes.add(node);
      } else if (!color[child]) {
        dfs(child);
        if (cycleNodes.has(child)) cycleNodes.add(node);
      }
    }
    color[node] = 2;
  }

  for (const node of nodes) {
    if (!color[node]) dfs(node);
  }

  // Roots: nodes with no parent, or the lex-smallest node in a cyclic group
  const roots = [];
  for (const node of nodes) {
    if (parent[node] === undefined) {
      roots.push(node);
    }
  }
  if (cycleNodes.size > 0) {
    const cycleRoot = [...cycleNodes].sort()[0];
    if (!roots.includes(cycleRoot)) roots.push(cycleRoot);
  }

  // BFS to calculate depth of each node from its root
  const depth = {};
  const queue = [];
  for (const root of roots) {
    depth[root] = 0;
    queue.push(root);
  }
  while (queue.length) {
    const node = queue.shift();
    for (const child of (children[node] || [])) {
      if (depth[child] === undefined) {
        depth[child] = depth[node] + 1;
        queue.push(child);
      }
    }
  }

  const maxDepth = Object.values(depth).reduce((a, b) => Math.max(a, b), 0);

  return {
    roots: roots.sort(),
    maxDepth,
    depth,
    children,
    cycleNodes: [...cycleNodes].sort(),
  };
}

// POST /bfhl
app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ success: false, error: '"data" must be an array of strings.' });
  }

  try {
    const result = buildTree(data);
    return res.json({
      success: true,
      roots: result.roots,
      maxDepth: result.maxDepth,
      cycleNodes: result.cycleNodes,
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
