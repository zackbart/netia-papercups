(function() {
    'use strict';
    
    // Custom Netia AI Widget
    function NetiaWidget(config) {
        this.config = config || {};
        this.isOpen = false;
        this.isLoaded = false;
        this.iframe = null;
        this.toggleButton = null;
        this.container = null;
        
        this.init();
    }
    
    NetiaWidget.prototype.init = function() {
        console.log('🚀 Initializing Netia AI Widget...');
        
        // Create the widget container
        this.createContainer();
        
        // Create the toggle button
        this.createToggleButton();
        
        // Create the iframe
        this.createIframe();
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.isLoaded = true;
        console.log('✅ Netia AI Widget initialized successfully');
    };
    
    NetiaWidget.prototype.createContainer = function() {
        this.container = document.createElement('div');
        this.container.id = 'netia-widget-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(this.container);
    };
    
    NetiaWidget.prototype.createToggleButton = function() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'netia-widget-toggle';
        this.toggleButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
            </svg>
        `;
        this.toggleButton.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: ${this.config.primaryColor || '#1890ff'};
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        this.toggleButton.addEventListener('click', () => this.toggle());
        this.container.appendChild(this.toggleButton);
    };
    
    NetiaWidget.prototype.createIframe = function() {
        this.iframe = document.createElement('iframe');
        this.iframe.id = 'netia-widget-iframe';
        this.iframe.style.cssText = `
            width: 400px;
            height: 600px;
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            background: white;
        `;
        
        // Build the iframe URL
        const params = new URLSearchParams({
            token: this.config.token,
            inbox: this.config.inbox,
            title: this.config.title || 'Netia AI Assistant',
            subtitle: this.config.subtitle || 'How can I help you today?',
            primaryColor: this.config.primaryColor || '#1890ff',
            baseUrl: this.config.baseUrl || 'https://app.netia.ai'
        });
        
        this.iframe.src = `${this.config.baseUrl || 'https://app.netia.ai'}/widget.html?${params.toString()}`;
        this.container.appendChild(this.iframe);
    };
    
    NetiaWidget.prototype.setupEventListeners = function() {
        // Listen for messages from the iframe
        window.addEventListener('message', (event) => {
            if (event.origin !== (this.config.baseUrl || 'https://app.netia.ai')) {
                return;
            }
            
            if (event.data.type === 'widget-close') {
                this.close();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    };
    
    NetiaWidget.prototype.toggle = function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    };
    
    NetiaWidget.prototype.open = function() {
        this.isOpen = true;
        this.iframe.style.display = 'block';
        this.toggleButton.style.transform = 'rotate(180deg)';
        this.toggleButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
            </svg>
        `;
    };
    
    NetiaWidget.prototype.close = function() {
        this.isOpen = false;
        this.iframe.style.display = 'none';
        this.toggleButton.style.transform = 'rotate(0deg)';
        this.toggleButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
            </svg>
        `;
    };
    
    // Initialize the widget when the page loads
    function initWidget() {
        if (window.NetiaWidgetConfig) {
            window.netiaWidget = new NetiaWidget(window.NetiaWidgetConfig);
        } else {
            console.error('NetiaWidgetConfig not found. Please configure the widget.');
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
    
    // Expose the widget globally
    window.NetiaWidget = NetiaWidget;
    
})();
