// Modern JavaScript with Baseline features
class ModernWebApp {
    constructor() {
        this.init();
    }

    async init() {
        // Modern async/await
        try {
            await this.loadData();
            this.setupEventListeners();
            this.initializeComponents();
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    async loadData() {
        // Modern fetch API with error handling
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    setupEventListeners() {
        // Modern event delegation
        document.addEventListener('click', (event) => {
            if (event.target.matches('.button')) {
                this.handleButtonClick(event.target);
            }
        });

        // Modern intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }

    initializeComponents() {
        // Modern modules and dynamic imports
        this.loadComponent('navigation');
        this.loadComponent('modal');
        this.loadComponent('form');
    }

    async loadComponent(componentName) {
        try {
            const module = await import(`./components/${componentName}.js`);
            const component = new module.default();
            component.init();
        } catch (error) {
            console.warn(`Component ${componentName} not available:`, error);
        }
    }

    handleButtonClick(button) {
        // Modern destructuring
        const { dataset, textContent } = button;
        const { action, target } = dataset;

        // Modern switch with fallthrough
        switch (action) {
            case 'modal':
                this.openModal(target);
                break;
            case 'form':
                this.submitForm(target);
                break;
            case 'navigation':
                this.navigateTo(target);
                break;
            default:
                console.log(`Unknown action: ${action}`);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && modal.showModal) {
            modal.showModal();
        }
    }

    async submitForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Form submitted successfully!');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            this.showNotification('Error submitting form', 'error');
        }
    }

    navigateTo(url) {
        // Modern history API
        history.pushState({}, '', url);
        this.updateContent(url);
    }

    async updateContent(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            document.querySelector('main').innerHTML = html;
        } catch (error) {
            console.error('Navigation failed:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Modern template literals
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Modern module export
export default ModernWebApp;

// Modern arrow functions and array methods
const utilities = {
    debounce: (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Modern array methods
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }
};

// Modern async/await with Promise.all
async function loadMultipleResources() {
    const urls = ['/api/users', '/api/posts', '/api/comments'];
    
    try {
        const [users, posts, comments] = await Promise.all(
            urls.map(url => fetch(url).then(response => response.json()))
        );
        
        return { users, posts, comments };
    } catch (error) {
        console.error('Failed to load resources:', error);
        return null;
    }
}

// Modern optional chaining and nullish coalescing
function processUserData(user) {
    const name = user?.profile?.name ?? 'Anonymous';
    const email = user?.contact?.email ?? 'No email provided';
    const preferences = user?.settings?.preferences ?? {};
    
    return { name, email, preferences };
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new ModernWebApp();
});
