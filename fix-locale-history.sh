#!/usr/bin/env bash
# fix-locale-history.sh
# Automated cleanup to ensure locale common.json files are UTF-8 (no BOM),
# reindex them to drop historical binary commits, and push a clean branch.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Step 1: Verify and convert locale files to UTF-8 without BOM
locale_files=$(find frontend/public/locales -type f -name 'common.json' | sort)

if [[ -z "$locale_files" ]]; then
  echo "No locale files found under frontend/public/locales."
  exit 1
fi

for file in $locale_files; do
  echo "Checking $file"

  # Detect BOM
  bom_hex=$(xxd -p -l 3 "$file")
  has_bom=false
  if [[ "$bom_hex" == "efbbbf" || "$bom_hex" == "fffe" || "$bom_hex" == "feff" ]]; then
    has_bom=true
  fi

  # Detect null bytes
  if LC_ALL=C grep -q $'\0' "$file"; then
    echo "Null bytes detected in $file. Converting to UTF-8."
    iconv -f utf-16 -t utf-8 "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    has_bom=false
  fi

  # Convert if not UTF-8
  encoding=$(file -b --mime-encoding "$file")
  if [[ "$encoding" != "utf-8" ]]; then
    echo "Non-UTF-8 encoding ($encoding) detected in $file. Converting to UTF-8."
    iconv -f utf-16 -t utf-8 "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    has_bom=false
  fi

  # Strip UTF-8 BOM if present
  if $has_bom; then
    echo "Removing BOM from $file."
    tail -c +4 "$file" > "$file.nobom"
    mv "$file.nobom" "$file"
  fi
done

echo "Locale encoding verification completed."

# Step 2: Reset index and rebuild clean history on new branch
git checkout main
git pull
git checkout -b fix-locale-history-clean

git rm -r --cached frontend/public/locales
git add frontend/public/locales
git commit -m "Re-index locale JSON files as UTF-8 and remove historical binary commits"

# Step 3: Force push cleaned branch
git push origin fix-locale-history-clean --force-with-lease

# Step 4: Post-run confirmation
echo "Current locale encodings:"
for file in $locale_files; do
  printf "%-70s %s\n" "$file" "$(file -b --mime-encoding "$file")"
done

echo "Staged diff stats (should show text files, not binary):"
git diff --cached --numstat || true
