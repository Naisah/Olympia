import os
import glob

dir_path = r"c:\Users\Naisah\Downloads\temp-react-main\frontend\src\pages\services\*.jsx"
files = glob.glob(dir_path)

broken_link = "https://maps.app.goo.gl/oXqW2tGrtHk4Hj768"
new_link = "https://www.google.com/maps/search/?api=1&query=Olympia+Health+Center,+Makati"

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if broken_link in content:
        content = content.replace(broken_link, new_link)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(filepath)}")
