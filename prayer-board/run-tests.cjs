const { execSync } = require('child_process');
const fs = require('fs');
try {
    const result = execSync('npx vitest run --reporter json', { encoding: 'utf-8' });
    fs.writeFileSync('clean_test_results.json', result);
} catch (e) {
    fs.writeFileSync('clean_test_results.json', e.stdout);
}
