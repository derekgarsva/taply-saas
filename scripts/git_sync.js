const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const configPath = path.join(process.env.USERPROFILE, '.gemini', 'config', 'mcp_config.json');
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = cfg.mcpServers?.github?.env?.GITHUB_PERSONAL_ACCESS_TOKEN;

if (!token) {
  console.error('No token found');
  process.exit(1);
}

const remoteUrl = `https://x-access-token:${token}@github.com/derekgarsva/taply-saas.git`;

try {
  console.log('Fetching remote...');
  execSync(`git fetch "${remoteUrl}" main`, { stdio: 'inherit' });

  console.log('Merging remote changes...');
  execSync('git merge --no-edit --allow-unrelated-histories -X ours FETCH_HEAD', { stdio: 'inherit' });

  console.log('Adding all updated source and components...');
  execSync('git add package.json package-lock.json tailwind.config.ts src/ public/', { stdio: 'inherit' });

  try {
    execSync('git diff --cached --quiet');
  } catch (e) {
    const commitMsg = process.argv[2] || "chore: sync changes";
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
  }

  console.log('Pushing to GitHub...');
  execSync(`git push "${remoteUrl}" main`, { stdio: 'inherit' });

  console.log('Sync complete successfully!');
} catch (err) {
  console.error('Sync failed:', err.message);
  process.exit(1);
}
