import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/fileTree.json');

// We want to skip huge/unnecessary folders
const IGNORED_DIRS = ['node_modules', '.git', '.next'];

let fileCount = 0;

// Helper to get file size in KB
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return parseFloat((stats.size / 1024).toFixed(2));
    } catch {
        return 0.1;
    }
}

// 1. Recursive parsing of the directory
function parseDirectory(dirPath, relativePath = '') {
    const nodes = [];
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        if (IGNORED_DIRS.includes(item)) continue;

        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const children = parseDirectory(fullPath, itemRelativePath);
            nodes.push({
                id: `dir_${itemRelativePath}`,
                name: item,
                path: itemRelativePath,
                type: 'folder',
                sizeKb: 0,
                children
            });
        } else {
            fileCount++;
            nodes.push({
                id: `file_${itemRelativePath}`,
                name: item,
                path: itemRelativePath,
                type: 'file',
                extension: path.extname(item).toLowerCase(),
                sizeKb: getFileSize(fullPath)
            });
        }
    }

    return nodes;
}

// 2. Map coordinates (Galaxy Spiral Distribution)
// This flattens the tree into an array of strictly FILES (stars)
// but groups them by their parent folder (solar system)
function generateGalaxyCoordinates(tree) {
    const flatFiles = [];
    let globalIndex = 0;

    // Golden angle for spiral distribution
    const PHI = (1 + Math.sqrt(5)) / 2;

    function traverseAndPosition(nodes, depth = 0, parentTheta = 0, parentR = 0) {
        // Sort folders first, then files
        nodes.sort((a, b) => a.type === 'folder' ? -1 : 1);

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.type === 'file') {
                globalIndex++;

                // --- Math logic for Galaxy Spiral ---

                // The greater the globalIndex, the further out in the spiral
                // We use Fibonacci phyllotaxis (sunflower seed) pattern on a 3D sphere/disc
                // to make it look organic.

                const radius = Math.sqrt(globalIndex) * 2; // Spread outwards
                const theta = globalIndex * (Math.PI * 2) / (PHI * PHI); // Golden angle rotation

                // Z-axis (thickness of the galaxy core vs edges)
                // Closer to center = thicker, edges = flatter
                const thickness = Math.max(0.1, 15 - radius * 0.2);
                const zPerturbation = (Math.random() - 0.5) * thickness;

                // Add minor specific grouping based on folder (depth)
                const clusterOffset = depth * 0.5;

                node.x = Math.cos(theta) * radius + (Math.random() - 0.5) * clusterOffset;
                node.y = Math.sin(theta) * radius + (Math.random() - 0.5) * clusterOffset;
                node.z = zPerturbation;

                node.galaxyIndex = globalIndex;

                // We don't need 'children' prop in the flat array
                const { children, ...flatNode } = node;
                flatFiles.push(flatNode);
            } else if (node.type === 'folder' && node.children) {
                // Determine a sub-cluster center based on parent
                traverseAndPosition(node.children, depth + 1, parentTheta + 0.5, parentR + 5);
            }
        }
    }

    traverseAndPosition(tree);

    // Normalize coordinates so the center of mass is 0,0,0
    let sumX = 0, sumY = 0, sumZ = 0;
    for (const f of flatFiles) {
        sumX += f.x;
        sumY += f.y;
        sumZ += f.z;
    }
    const cw = sumX / flatFiles.length;
    const cy = sumY / flatFiles.length;
    const cz = sumZ / flatFiles.length;

    for (const f of flatFiles) {
        f.x -= cw;
        f.y -= cy;
        f.z -= cz;
    }

    return flatFiles;
}

async function run() {
    console.log(`[Galaxy Builder] Scanning ${SRC_DIR}...`);

    const tree = parseDirectory(SRC_DIR);
    console.log(`[Galaxy Builder] Found ${fileCount} files.`);

    console.log(`[Galaxy Builder] Calculating cosmic coordinates...`);
    const flatGalaxy = generateGalaxyCoordinates(tree);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(flatGalaxy, null, 2));
    console.log(`[Galaxy Builder] Success! Saved to ${OUTPUT_FILE}`);
}

run();
