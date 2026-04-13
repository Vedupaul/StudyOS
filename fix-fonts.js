const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

function fixFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // simple word boundary replacement for tailwind classes
    content = content.replace(/\bfont-black\b/g, 'font-semibold');
    content = content.replace(/\bitalic\b/g, '');
    content = content.replace(/\buppercase\b/g, '');
    
    // clean up double spaces inside className
    content = content.replace(/className="([^"]*)"/g, (match, p1) => {
        let newClasses = p1.replace(/\s+/g, ' ').trim();
        return `className="${newClasses}"`;
    });
    // clean up double spaces inside className template literals as well
    content = content.replace(/className=\{`([^`]*)`\}/g, (match, p1) => {
        let newClasses = p1.replace(/\s+/g, ' ').trim();
        return `className={\`${newClasses}\`}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', filePath);
    }
}

// Ensure the paths are relative to the current working directory which is the project root
walk(path.join(process.cwd(), 'src', 'app'), fixFile);
walk(path.join(process.cwd(), 'src', 'components'), fixFile);
console.log('Finished updating typography classes!');
