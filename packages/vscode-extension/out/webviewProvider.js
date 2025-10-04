"use strict";
/**
 * Webview Provider for Baseline Dashboard
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselineWebviewProvider = void 0;
const vscode = __importStar(require("vscode"));
const core_1 = require("@baseline-buddy/core");
class BaselineWebviewProvider {
    constructor(context) {
        this.context = context;
        this.detector = new core_1.BaselineDetector();
    }
    showDashboard() {
        const panel = vscode.window.createWebviewPanel('baseline-buddy-dashboard', 'Baseline Dashboard', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getWebviewContent();
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'getFeatures':
                    const features = this.detector.getBaselineFeatures();
                    panel.webview.postMessage({
                        command: 'features',
                        data: features
                    });
                    break;
                case 'getFeatureInfo':
                    const feature = this.detector.getBaselineStatus(message.featureId);
                    panel.webview.postMessage({
                        command: 'featureInfo',
                        data: feature
                    });
                    break;
            }
        }, undefined, this.context.subscriptions);
    }
    getWebviewContent() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baseline Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #333;
            margin: 0 0 10px 0;
        }
        .header p {
            color: #666;
            margin: 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .stat-card .number {
            font-size: 2em;
            font-weight: bold;
            color: #2563eb;
        }
        .features {
            margin-top: 30px;
        }
        .feature-item {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ddd;
        }
        .feature-item.widely {
            border-left-color: #10b981;
        }
        .feature-item.newly {
            border-left-color: #3b82f6;
        }
        .feature-item.limited {
            border-left-color: #ef4444;
        }
        .feature-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .feature-title {
            font-weight: bold;
            color: #333;
        }
        .feature-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-widely {
            background: #10b981;
            color: white;
        }
        .status-newly {
            background: #3b82f6;
            color: white;
        }
        .status-limited {
            background: #ef4444;
            color: white;
        }
        .feature-details {
            color: #666;
            font-size: 0.9em;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 Baseline Dashboard</h1>
            <p>Explore web features and their Baseline status</p>
        </div>
        
        <div class="loading" id="loading">
            Loading features...
        </div>
        
        <div id="content" style="display: none;">
            <div class="stats" id="stats">
                <!-- Stats will be populated here -->
            </div>
            
            <div class="features" id="features">
                <!-- Features will be populated here -->
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        // Request features data
        vscode.postMessage({ command: 'getFeatures' });
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'features':
                    displayFeatures(message.data);
                    break;
                case 'featureInfo':
                    displayFeatureInfo(message.data);
                    break;
            }
        });
        
        function displayFeatures(features) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            
            // Calculate stats
            const stats = {
                total: features.length,
                widely: features.filter(f => f.baseline.baseline === 'widely').length,
                newly: features.filter(f => f.baseline.baseline === 'newly').length,
                limited: features.filter(f => f.baseline.baseline === false).length
            };
            
            // Display stats
            const statsContainer = document.getElementById('stats');
            statsContainer.innerHTML = \`
                <div class="stat-card">
                    <h3>Total Features</h3>
                    <div class="number">\${stats.total}</div>
                </div>
                <div class="stat-card">
                    <h3>Widely Available</h3>
                    <div class="number">\${stats.widely}</div>
                </div>
                <div class="stat-card">
                    <h3>Newly Available</h3>
                    <div class="number">\${stats.newly}</div>
                </div>
                <div class="stat-card">
                    <h3>Limited Support</h3>
                    <div class="number">\${stats.limited}</div>
                </div>
            \`;
            
            // Display features
            const featuresContainer = document.getElementById('features');
            featuresContainer.innerHTML = features.slice(0, 20).map(feature => {
                const status = feature.baseline.baseline;
                const statusClass = status === 'widely' ? 'widely' : 
                                  status === 'newly' ? 'newly' : 'limited';
                const statusText = status === 'widely' ? 'Widely Available' :
                                 status === 'newly' ? 'Newly Available' : 'Limited Support';
                
                return \`
                    <div class="feature-item \${statusClass}">
                        <div class="feature-header">
                            <div class="feature-title">\${feature.name}</div>
                            <div class="feature-status status-\${statusClass}">\${statusText}</div>
                        </div>
                        <div class="feature-details">
                            <strong>Group:</strong> \${feature.group}<br>
                            <strong>Description:</strong> \${feature.description}
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function displayFeatureInfo(feature) {
            // Handle individual feature info
            console.log('Feature info:', feature);
        }
    </script>
</body>
</html>
        `;
    }
}
exports.BaselineWebviewProvider = BaselineWebviewProvider;
//# sourceMappingURL=webviewProvider.js.map