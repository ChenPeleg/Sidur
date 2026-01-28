const { execSync } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('Installing Vite Dependencies');
console.log('========================================\n');

try {
  console.log('Step 1: Uninstalling react-scripts and cross-env...');
  try {
    execSync('npm uninstall react-scripts cross-env', {
      cwd: path.join(__dirname),
      stdio: 'inherit'
    });
  } catch (e) {
    console.log('Note: Some packages may not have been installed previously.');
  }

  console.log('\nStep 2: Installing all dependencies...');
  execSync('npm install', {
    cwd: path.join(__dirname),
    stdio: 'inherit'
  });

  console.log('\n========================================');
  console.log('Installation Complete!');
  console.log('========================================\n');
  console.log('Next steps:');
  console.log('1. Run: npm start');
  console.log('2. Run: npm test');
  console.log('3. Run: npm run build\n');

} catch (error) {
  console.error('\n========================================');
  console.error('Installation Failed!');
  console.error('========================================');
  console.error(error.message);
  process.exit(1);
}
