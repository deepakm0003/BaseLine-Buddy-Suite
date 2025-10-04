
1) Install VSCE (if not already)
npm i -g vsce
2) Build and package
cd "packages/vscode-extension"
npm install
npm run build
npx vsce package
3) Install the generated VSIX
code --install-extension baseline-buddy-1.0.0.vsix
4) Reload window
code --force --reuse-window .


Optional: Build/package yourself, then install
npm i -g vsce
cd "packages/vscode-extension"
npm install
npm run build
npx vsce package
code --install-extension baseline-buddy-1.0.0.vsix
CLI: Scan the examples files from terminal (for quick demo output)
1) Build CLI once
cd "packages/cli-tool"
npm install
npm run build
2) Run scan on the examples folder
node ".\\dist\\cli.js" "C:\\Users\\deepa\\OneDrive\\Desktop\\Baseline Hackathon\\examples\\basic-usage\\src"
Tip: If you want a global command later, you can npm link (optional):
cd "packages/cli-tool"
npm link
baseline-lint "C:\\Users\\deepa\\OneDrive\\Desktop\\Baseline Hackathon\\examples\\basic-usage\\src"


Verify the VSIX exists
powershell
dir ".\baseline-buddy-share\*.vsix"
Install the prebuilt VSIX
powershell
code --install-extension ".\baseline-buddy-share\baseline-buddy-1.0.0.vsix"
If that still errors, try full absolute path (copy-paste this one):
powershell
code --install-extension "C:\Users\deepa\OneDrive\Desktop\Baseline Hackathon\packages\vscode-extension\baseline-buddy-share\baseline-buddy-1.0.0.vsix"
Confirm install
powershell
code --list-extensions | findstr baseline
