const fs = require('fs');
const path = require('path');
const dir = 'src/pages/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  let p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf-8');
  
  // Replace opening div with fragment
  c = c.replace('<div className="bg-gray-50 font-sans text-customBlack min-h-screen flex flex-col">', '<>');
  
  let lines = c.split(/\r?\n/);
  let lastDiv = -1;
  for(let i=lines.length-1; i>=0; i--) {
    if(lines[i].trim() === '</div>') {
      lastDiv = i;
      break;
    }
  }
  
  if(lastDiv !== -1) {
    lines[lastDiv] = lines[lastDiv].replace('</div>', '</>');
  }
  
  fs.writeFileSync(p, lines.join('\n'), 'utf-8');
  console.log('Fixed ' + f);
});
