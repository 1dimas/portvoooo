import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const outputDir = path.join(rootDir, 'src', 'data');
const outputFile = path.join(outputDir, 'cosmosTree.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate an ID for the node
function generateId(filePath) {
    // Relative path from root src
    return path.relative(srcDir, filePath).replace(/\\/g, '/');
}

function processDirectory(dirPath, parentGalaxyIndex = 0) {
    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    const id = generateId(dirPath) || 'root';

    // Base attributes for a "Planet" (Folder)
    const node = {
        id,
        name: name === 'src' ? 'Root Solar System' : name,
        type: 'folder',
        path: id,
        children: [],
        satelliteFiles: [],
        // Planet attributes
        radius: 1, // Will be scaled based on children count later
        orbitRadius: Math.random() * 50 + 20, // Distance from parent folder/star if applicable
        orbitAngle: Math.random() * Math.PI * 2, // Random starting angle
        orbitSpeed: (Math.random() * 0.05 + 0.01) * (Math.random() > 0.5 ? 1 : -1) // Random speed and direction
    };

    const items = fs.readdirSync(dirPath);
    let totalSizeKb = 0;
    let fileCount = 0;

    for (const item of items) {
        // Skip obvious builds/node_modules if processing root, but we are just processing src anyway
        if (['.DS_Store'].includes(item)) continue;

        const itemPath = path.join(dirPath, item);
        const itemStats = fs.statSync(itemPath);

        if (itemStats.isDirectory()) {
            const childNode = processDirectory(itemPath, parentGalaxyIndex + 1);
            node.children.push(childNode);
            totalSizeKb += childNode.totalSizeKb;
        } else {
            const ext = path.extname(item).toLowerCase();
            const sizeKb = Number((itemStats.size / 1024).toFixed(2));
            totalSizeKb += sizeKb;
            fileCount++;

            // Satellite attributes for Files
            node.satelliteFiles.push({
                id: generateId(itemPath),
                name: item,
                path: generateId(itemPath),
                type: 'file',
                extension: ext || 'unknown',
                sizeKb,
                // Orbit parameters relative to the Planet (Folder)
                orbitRadius: (Math.random() * 3 + 2) + (fileCount * 0.2), // The more files, the further they orbit
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: (10 / (sizeKb + 10)) * (Math.random() > 0.5 ? 1 : -1) // Heavier files orbit slower
            });
        }
    }

    // Update Planet radius based on its contents
    node.totalSizeKb = Number(totalSizeKb.toFixed(2));
    // Scale planet base radius by root(file count)
    // Add rings if a folder contains many files
    node.radius = Math.max(1, Math.min(10, Math.sqrt(node.satelliteFiles.length + node.children.length) * 0.5));
    node.hasRings = node.satelliteFiles.length > 5;

    return node;
}

console.log('Generating Cosmos Data Tree...');
try {
    const cosmosTree = processDirectory(srcDir);
    fs.writeFileSync(outputFile, JSON.stringify(cosmosTree, null, 2), 'utf-8');
    console.log(`Success! Cosmos tree saved to ${outputFile}`);
    console.log(`Generated ${cosmosTree.children.length} primary planetary systems in Root.`);
} catch (error) {
    console.error('Error generating cosmos tree:', error);
    process.exit(1);
}
