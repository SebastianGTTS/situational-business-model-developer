rm -f src/environments/app.version.ts
echo "// Automatically generated file
export const version = '$1';" >> src/environments/app.version.ts
