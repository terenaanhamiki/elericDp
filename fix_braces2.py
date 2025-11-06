import os
import re

routes_dir = r"d:\internship (Vive coding platform)\Elaric Ai\app\routes"

for filename in os.listdir(routes_dir):
    if filename.endswith('.ts'):
        filepath = os.path.join(routes_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Count opening and closing braces
        open_braces = content.count('{')
        close_braces = content.count('}')
        
        if open_braces > close_braces:
            # Missing closing braces
            missing = open_braces - close_braces
            content = content.rstrip() + '\n' + ('}\n' * missing)
            print(f"Added {missing} closing brace(s) to: {filename}")
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Done!")
