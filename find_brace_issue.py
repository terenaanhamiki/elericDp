import os

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    brace_count = 0
    max_depth = 0
    
    for i, line in enumerate(lines, 1):
        for char in line:
            if char == '{':
                brace_count += 1
                max_depth = max(max_depth, brace_count)
            elif char == '}':
                brace_count -= 1
        
        # Print lines where brace count changes significantly
        if i > len(lines) - 20:
            print(f"Line {i}: brace_count={brace_count}, content: {line[:80]}")
    
    print(f"\nFinal brace count: {brace_count}")
    print(f"Max depth: {max_depth}")
    print(f"Total open: {content.count('{')}")
    print(f"Total close: {content.count('}')}")

files_to_check = [
    r"d:\internship (Vive coding platform)\Elaric Ai\app\lib\.server\llm\select-context.ts",
    r"d:\internship (Vive coding platform)\Elaric Ai\app\lib\runtime\enhanced-message-parser.ts"
]

for filepath in files_to_check:
    print("=" * 80)
    print(f"Analyzing: {os.path.basename(filepath)}")
    print("=" * 80)
    analyze_file(filepath)
    print("\n")
