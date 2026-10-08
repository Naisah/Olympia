import os
import re

dir_path = r"c:\Users\Naisah\Downloads\temp-react-main\frontend\src\pages\services"
files = ["AnimalCare.jsx", "CoveredCourt.jsx", "MaternalCare.jsx", "MedicalConsult.jsx", "MentalHealth.jsx", "PhilHealth.jsx", "Vaccination.jsx"]

for filename in files:
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the broken import
    content = content.replace("import React\nimport { useNavigate } from 'react-router-dom';, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';")
    
    # Also check if it was just `import React, { useState } from 'react';`
    content = content.replace("import React\nimport { useNavigate } from 'react-router-dom';, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Fixed imports.")
