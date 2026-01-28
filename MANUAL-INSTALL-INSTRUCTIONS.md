# Manual Installation Instructions

Due to PowerShell 6+ not being available, please follow these manual steps:

## Option 1: Using Command Prompt (cmd.exe)

1. Open Command Prompt (cmd.exe)
2. Navigate to the project:
   ```
   cd C:\Projects\Sidur
   ```
3. Run the installation:
   ```
   npm uninstall react-scripts cross-env
   npm install
   ```

## Option 2: Using the Batch Script

1. Open File Explorer
2. Navigate to `C:\Projects\Sidur`
3. Double-click `migrate-to-vite.bat`
4. Follow the prompts

## Option 3: Using the Node.js Script

1. Open Command Prompt
2. Navigate to the project:
   ```
   cd C:\Projects\Sidur
   ```
3. Run:
   ```
   node install-vite.js
   ```

## Option 4: Using VS Code Terminal

If you have VS Code:
1. Open the project in VS Code
2. Open Terminal (Ctrl + `)
3. Run:
   ```
   npm uninstall react-scripts cross-env
   npm install
   ```

## Expected Output

The installation should:
1. Remove `react-scripts` and `cross-env`
2. Install Vite, Vitest, and related packages
3. Complete without errors

## Common Issues

### If you see "ERESOLVE" warnings:
These are usually safe to ignore. npm will resolve dependencies.

### If you see peer dependency warnings:
These are normal with React 18. The packages will still work.

### If installation fails:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

## After Installation

Once installation completes successfully:

1. **Delete old files:**
   - Delete `public\index.html`
   - Delete `src\react-app-env.d.ts`

2. **Test the setup:**
   ```
   npm start
   ```

3. **Check for environment variables:**
   ```
   search-env-vars.bat
   ```

4. **Run tests:**
   ```
   npm test
   ```

## PowerShell 6+ Installation (Optional)

If you want to use PowerShell 6+ in the future, you can install it:
https://aka.ms/powershell

This is optional and not required for the migration to work.
