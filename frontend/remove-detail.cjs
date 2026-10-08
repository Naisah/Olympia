const fs = require('fs');
let content = fs.readFileSync('src/pages/ServiceDetail.jsx', 'utf8');
content = content.replace("import { useAuth } from '../hooks/useAuth';", "import api from '../utils/api';");
content = content.replace(/const \{ user, api \} = useAuth\(\);\r?\n?/, '');
content = content.replace(/\{!user \? \([\s\S]*?\) : \(/, '');
content = content.replace(/<\/form>\s*\)\}/, '</form>');
fs.writeFileSync('src/pages/ServiceDetail.jsx', content);
console.log('Updated ServiceDetail.jsx');
