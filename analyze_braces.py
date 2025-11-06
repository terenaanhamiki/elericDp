import os

app_dir = r"d:\internship (Vive coding platform)\Elaric Ai\app"
issues = []

for root, dirs, files in os.walk(app_dir):
    for filename in files:
        if filename.endswith('.ts') or filename.endswith('.tsx'):
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                open_braces = content.count('{')
                close_braces = content.count('}')
                diff = open_braces - close_braces
                
                if diff != 0:
                    rel_path = os.path.relpath(filepath, app_dir)
                    issues.append({
                        'file': rel_path,
                        'open': open_braces,
                        'close': close_braces,
                        'diff': diff
                    })
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

print("FILES WITH BRACE MISMATCHES:")
print("=" * 80)
for issue in sorted(issues, key=lambda x: abs(x['diff']), reverse=True):
    status = "MISSING" if issue['diff'] > 0 else "EXTRA"
    print(f"{issue['file']}")
    print(f"  Open: {issue['open']}, Close: {issue['close']}, Diff: {issue['diff']} ({status} {abs(issue['diff'])} closing brace(s))")
    print()

print(f"\nTotal files with issues: {len(issues)}")
