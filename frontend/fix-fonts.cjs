const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'assets', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace all font-size: Xpx; with font-size: Yrem; (where Y = X / 16)
cssContent = cssContent.replace(/font-size:\s*([\d\.]+)px;?/gi, (match, p1) => {
    const px = parseFloat(p1);
    const rem = (px / 16).toFixed(4);
    // Remove trailing zeros
    const cleanRem = rem.replace(/\.?0+$/, '');
    return `font-size: ${cleanRem}rem;`;
});

fs.writeFileSync(cssPath, cssContent);
console.log('Successfully updated style.css font sizes to rem!');
