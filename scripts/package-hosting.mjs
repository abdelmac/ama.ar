import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

// ZIP standard (UTF-8, Deflate), sans outil système ni dépendance supplémentaire.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(projectRoot, 'out');
await Promise.all(['index.html', '.htaccess', 'fr/index.html', 'ar/index.html', 'de/index.html', 'en/index.html']
  .map((filename) => access(path.join(root, filename))));
const files = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Lien symbolique interdit dans l’export : ${filename}`);
    if (entry.isDirectory()) await walk(filename);
    else if (entry.isFile()) files.push(filename);
  }
}
await walk(root);
if (files.length > 65535) throw new Error('L’export dépasse la limite du format ZIP standard.');
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};
const localEntries = [];
const directoryEntries = [];
let offset = 0;
for (const filename of files) {
  const name = Buffer.from(path.relative(root, filename).split(path.sep).join('/'));
  const data = await readFile(filename);
  const compressed = deflateRawSync(data, { level: 6 });
  if (name.length > 65535 || data.length > 0xffffffff || compressed.length + offset > 0xffffffff) {
    throw new Error('L’export dépasse la limite du format ZIP standard.');
  }
  const checksum = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x800, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(33, 12); // 1er janvier 1980 : archive reproductible.
  local.writeUInt32LE(checksum, 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  local.copy(central, 6, 4, 30);
  central.writeUInt32LE(offset, 42);
  localEntries.push(local, name, compressed);
  directoryEntries.push(central, name);
  offset += local.length + name.length + compressed.length;
}
const directory = Buffer.concat(directoryEntries);
if (offset + directory.length > 0xffffffff) throw new Error('Archive ZIP trop volumineuse.');
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
const destination = path.join(projectRoot, 'dist', 'amareine-namecheap.zip');
await mkdir(path.dirname(destination), { recursive: true });
const archive = Buffer.concat([...localEntries, directory, end]);
await writeFile(destination, archive);
console.log(`${destination}\n${files.length} fichiers — ${(archive.length / 1024 / 1024).toFixed(1)} Mo. Téléversez et extrayez le contenu dans le document root du domaine.`);
