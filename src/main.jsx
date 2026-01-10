import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Check for basic browser support
if (!document.getElementById('root')) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#002E5D;color:white;font-size:1.5rem;">Root element not found</div>';
} else {
    try {
        const root = createRoot(document.getElementById('root'));
        root.render(
            <StrictMode>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </StrictMode>
        );
    } catch (error) {
        console.error('Failed to render app:', error);
        document.getElementById('root').innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#002E5D;color:white;padding:20px;text-align:center">
                <h1 style="font-size:2rem;margin-bottom:1rem">Browser Not Supported</h1>
                <p style="font-size:1rem;margin-bottom:1rem">Your browser may not support modern web features required by this app.</p>
                <p style="font-size:0.875rem;color:#ffffff80">Error: ${error.message}</p>
            </div>
        `;
    }
}
