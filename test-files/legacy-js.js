// Legacy JavaScript with old practices
function initializeApp() {
    // Old function declarations
    setupEventListeners();
    loadData();
    initializeComponents();
}

function setupEventListeners() {
    // Old event handling
    var buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            handleButtonClick(this);
        };
    }
}

function loadData() {
    // Old XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/data', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            processData(data);
        }
    };
    xhr.send();
}

function processData(data) {
    // Old array iteration
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        console.log(item);
    }
}

function handleButtonClick(button) {
    // Old property access
    var action = button.getAttribute('data-action');
    var target = button.getAttribute('data-target');
    
    // Old switch statement
    switch (action) {
        case 'modal':
            openModal(target);
            break;
        case 'form':
            submitForm(target);
            break;
        case 'navigation':
            navigateTo(target);
            break;
        default:
            console.log('Unknown action: ' + action);
    }
}

function openModal(modalId) {
    // Old DOM manipulation
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function submitForm(formId) {
    // Old form handling
    var form = document.getElementById(formId);
    if (!form) return;
    
    var formData = new FormData(form);
    var data = {};
    
    // Old form data processing
    for (var pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    
    // Old AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                showNotification('Form submitted successfully!');
            } else {
                showNotification('Error submitting form', 'error');
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function navigateTo(url) {
    // Old navigation
    window.location.href = url;
}

function showNotification(message, type) {
    // Old DOM manipulation
    var notification = document.createElement('div');
    notification.className = 'notification';
    if (type) {
        notification.className += ' notification--' + type;
    }
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Old timeout
    setTimeout(function() {
        notification.parentNode.removeChild(notification);
    }, 3000);
}

// Old object creation
var utilities = {
    debounce: function(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    },
    
    throttle: function(func, limit) {
        var inThrottle;
        return function() {
            var context = this;
            var args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }
};

// Old array methods
function groupBy(array, key) {
    var groups = {};
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        var group = item[key];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
    }
    return groups;
}

// Old callback-based async
function loadMultipleResources(callback) {
    var urls = ['/api/users', '/api/posts', '/api/comments'];
    var results = {};
    var completed = 0;
    
    urls.forEach(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                results[url] = JSON.parse(xhr.responseText);
                completed++;
                if (completed === urls.length) {
                    callback(results);
                }
            }
        };
        xhr.send();
    });
}

// Old property access with fallbacks
function processUserData(user) {
    var name = 'Anonymous';
    if (user && user.profile && user.profile.name) {
        name = user.profile.name;
    }
    
    var email = 'No email provided';
    if (user && user.contact && user.contact.email) {
        email = user.contact.email;
    }
    
    var preferences = {};
    if (user && user.settings && user.settings.preferences) {
        preferences = user.settings.preferences;
    }
    
    return {
        name: name,
        email: email,
        preferences: preferences
    };
}

// Old initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
