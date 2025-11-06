filepath = r"d:\internship (Vive coding platform)\Elaric Ai\app\lib\runtime\enhanced-message-parser.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The file is missing one closing brace - the class needs to be closed
# Add it at the very end
if not content.endswith('\n'):
    content += '\n'

# Check current brace count
open_count = content.count('{')
close_count = content.count('}')
print(f"Before: Open={open_count}, Close={close_count}, Diff={open_count-close_count}")

# The issue is likely in a regex or string literal
# Let me just check the actual structure
lines = content.split('\n')
print(f"\nLast 3 lines:")
for i, line in enumerate(lines[-3:], len(lines)-2):
    print(f"{i}: {repr(line)}")

print("\nThis file should end with the class closing brace.")
print("The class starts at line 11, so it needs a closing brace at the end.")
