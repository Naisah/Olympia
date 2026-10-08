const fs = require('fs');
const path = require('path');
const dir = 'src/pages/services';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // 1. Replace import
    content = content.replace("import { useAuth } from '../../hooks/useAuth';", "import api from '../../utils/api';");
    
    // 2. Remove const { user, api } = useAuth();
    content = content.replace(/const \{ user, api \} = useAuth\(\);\r?\n?/, "");
    
    // 3. Remove the !user ? block completely
    const regex1 = /\{!user \? \([\s\S]*?\) : \(/;
    content = content.replace(regex1, "");
    
    // 4. Find the matching closing `)}` which appears just before `<Modal` or `</div>` after the form
    const regex2 = /<\/form>\s*\)\}/;
    content = content.replace(regex2, "</form>");
    
    fs.writeFileSync(path.join(dir, file), content);
    console.log('Updated ' + file);
  }
});
