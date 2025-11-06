import os

app_dir = r"d:\internship (Vive coding platform)\Elaric Ai\app"

for root, dirs, files in os.walk(app_dir):
    for filename in files:
        if filename.endswith('.ts') or filename.endswith('.tsx'):
            filepath = os.path.join(root, filename)
            try:
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
                    rel_path = os.path.relpath(filepath, app_dir)
                    print(f"Added {missing} closing brace(s) to: {rel_path}")
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print("Done!")
