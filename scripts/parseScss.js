import { promises as fsPromises } from 'fs';
import path from 'path';
import url from 'url';

const { readFile, writeFile } = fsPromises;

const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
const scssPath = path.join(currentDir, '..', 'src', 'routes', 'styles.scss');
const tsPath = path.join(currentDir, '..', 'src', 'lib', 'palette.ts');

const camelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

async function convertScssToTs(scssFilePath, tsFilePath) {
    let scssContent = await readFile(scssFilePath, 'utf8');

    scssContent = scssContent.replace(/\r\n/g, '\n');

    const rootRegex = /:root\s*{\s*@include\s*([\w-]+)/;
    const rootMatch = scssContent.match(rootRegex);

    if (!rootMatch) throw new Error('Mixin in :root not found');
    const mixinName = rootMatch[1];

    const mixinRegex = new RegExp(`@mixin\\s+${mixinName}\\s*\\{((?:[^{}]*|\\{(?:[^{}]*|\\{[^{}]*\\})*\\})*)\\}`, 'm');
    const mixinMatch = scssContent.match(mixinRegex);

    if (!mixinMatch) throw new Error(`Mixin ${mixinName} not found`);
    const mixinContent = mixinMatch[1];

    const scssVars = {};
    const cssVars = {};
    const lines = mixinContent.split('\n');

    lines.forEach(line => {
        let match = line.match(/\$([\w-]+):\s*(.+?);/);

        if (match) {
            const name = match[1].replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            scssVars[name] = match[2].trim();
        }

        match = line.match(/(--[\w-]+):\s*(.+?);/);

        if (match) {
            cssVars[match[1]] = match[2].trim().replace(/(\$[\w-]+)/g, (match, varName) => {
                varName = varName.replace(/-\w/g, m => m[1].toUpperCase());
                return scssVars[varName] || match;
            });
        }
    });

    const isHsl = (color) => color.startsWith('hsl(') || color.startsWith('hsla(');

    let tsContent = 'import { darken, lighten } from \'./utils\';\n\n';
    for (const [varName, value] of Object.entries(scssVars)) {
        tsContent += `const ${varName} = "${value}";\n`;
    }

    tsContent += '\nconst colors = {\n';
    for (const [varName] of Object.entries(scssVars)) {
        tsContent += `    ${varName},\n`;
    }

    const removeSymbols = (str) => str.replace(/[#${}%]/g, '');

    for (const [varName, value] of Object.entries(cssVars)) {
        if (value.includes('darken(') || value.includes('lighten(')) {
            let color = removeSymbols(value);
            tsContent += `    "${varName}": ${camelCase(color)},\n`;
        } else if (!isHsl(value)) {
            let color = removeSymbols(value);
            tsContent += `    "${varName}": ${camelCase(color)},\n`;
        }
        else {
            let color = removeSymbols(value);
            tsContent += `    "${varName}": "${color}",\n`;
        }
    }

    tsContent += '};\n\nexport { colors };';

    await writeFile(tsFilePath, tsContent);
}

convertScssToTs(scssPath, tsPath);
