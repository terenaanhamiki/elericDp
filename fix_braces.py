import os
import re

routes_dir = r"d:\internship (Vive coding platform)\Elaric Ai\app\routes"

for filename in os.listdir(routes_dir):
    if filename.endswith('.ts'):
        filepath = os.path.join(routes_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file ends with }}\n or }}\r\n
        if re.search(r'}\s*\n}\s*$', content):
            # Remove the last closing brace
            content = re.sub(r'(}\s*\n)}\s*$', r'\1', content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filename}")

print("Done!")
