const fs = require('fs');
let content = fs.readFileSync('src/pages/Documents.jsx', 'utf8');
content = content.replace("import { useAuth } from '../hooks/useAuth';", "");
content = content.replace(/const \{ user, api \} = useAuth\(\);\r?\n?/, '');
fs.writeFileSync('src/pages/Documents.jsx', content);
console.log('Updated Documents.jsx');
