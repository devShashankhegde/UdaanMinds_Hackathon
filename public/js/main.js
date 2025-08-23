// Form validation utilities
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = field.parentNode.querySelector('.error-message');
  
  field.classList.add('error');
  
  if (errorDiv) {
    errorDiv.textContent = message;
  } else {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = field.parentNode.querySelector('.error-message');
  
  field.classList.remove('error');
  
  if (errorDiv) {
    errorDiv.remove();
  }
}

function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  `;
  
  const form = document.querySelector('form');
  if (form) {
    form.insertBefore(successDiv, form.firstChild);
    setTimeout(() => successDiv.remove(), 5000);
  }
}

function showAlert(message, type = 'error') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const bgColor = type === 'error' ? '#f8d7da' : '#d4edda';
  const textColor = type === 'error' ? '#721c24' : '#155724';
  const borderColor = type === 'error' ? '#f5c6cb' : '#c3e6cb';
  
  alertDiv.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    border: 1px solid ${borderColor};
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  `;
  
  const container = document.querySelector('.form-container') || document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
  }
}

// API helper functions
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Registration form validation
function validateRegistrationForm() {
  let isValid = true;
  
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  
  // Clear previous errors
  ['username', 'email', 'password', 'confirmPassword', 'fullName', 'phone'].forEach(clearError);
  
  // Username validation
  if (!username.value.trim() || username.value.length < 3) {
    showError('username', 'Username must be at least 3 characters long');
    isValid = false;
  }
  
  // Email validation
  if (!email.value.trim() || !validateEmail(email.value)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Password validation
  if (!password.value || password.value.length < 6) {
    showError('password', 'Password must be at least 6 characters long');
    isValid = false;
  }
  
  // Confirm password validation
  if (password.value !== confirmPassword.value) {
    showError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  // Full name validation
  if (!fullName.value.trim()) {
    showError('fullName', 'Full name is required');
    isValid = false;
  }
  
  // Phone validation (optional but if provided, must be valid)
  if (phone.value.trim() && !validatePhone(phone.value)) {
    showError('phone', 'Please enter a valid 10-digit phone number');
    isValid = false;
  }
  
  return isValid;
}

// Login form validation
function validateLoginForm() {
  let isValid = true;
  
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  
  // Clear previous errors
  ['email', 'password'].forEach(clearError);
  
  // Email validation
  if (!email.value.trim() || !validateEmail(email.value)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Password validation
  if (!password.value.trim()) {
    showError('password', 'Password is required');
    isValid = false;
  }
  
  return isValid;
}

// Question form validation
function validateQuestionForm() {
  let isValid = true;
  
  const title = document.getElementById('title');
  const content = document.getElementById('content');
  const category = document.getElementById('category');
  
  // Clear previous errors
  ['title', 'content', 'category'].forEach(clearError);
  
  // Title validation
  if (!title.value.trim() || title.value.length < 10) {
    showError('title', 'Title must be at least 10 characters long');
    isValid = false;
  }
  
  // Content validation
  if (!content.value.trim() || content.value.length < 20) {
    showError('content', 'Content must be at least 20 characters long');
    isValid = false;
  }
  
  // Category validation
  if (!category.value) {
    showError('category', 'Please select a category');
    isValid = false;
  }
  
  return isValid;
}

// Handle form submissions
function handleFormSubmit(formId, validationFn, endpoint, successCallback) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validationFn()) {
      return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Handle nested profile data for registration
    if (formId === 'registerForm') {
      data.profile = {
        fullName: data.fullName,
        phone: data.phone || '',
        location: data.location || '',
        farmSize: data.farmSize || '',
        cropTypes: data.cropTypes ? data.cropTypes.split(',').map(s => s.trim()) : []
      };
      delete data.fullName;
      delete data.phone;
      delete data.location;
      delete data.farmSize;
      delete data.cropTypes;
      delete data.confirmPassword;
    }
    
    try {
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Please wait...';
      submitButton.disabled = true;
      
      const result = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (successCallback) {
        successCallback(result);
      } else {
        showSuccess('Operation completed successfully!');
        form.reset();
      }
      
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
    } catch (error) {
      showAlert(error.message);
      
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.textContent = submitButton.dataset.originalText || 'Submit';
      submitButton.disabled = false;
    }
  });
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Store original button text
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(btn => {
    btn.dataset.originalText = btn.textContent;
  });
  
  // Initialize form handlers
  handleFormSubmit('registerForm', validateRegistrationForm, '/auth/register', (result) => {
    showSuccess('Registration successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/community';
    }, 2000);
  });
  
  handleFormSubmit('loginForm', validateLoginForm, '/auth/login', (result) => {
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/community';
    }, 2000);
  });
  
  handleFormSubmit('questionForm', validateQuestionForm, '/community/questions', (result) => {
    showSuccess('Question posted successfully!');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  });
  
  // Load dynamic content
  loadQuestions();
  loadMarketPrices();
  loadListings();
});

// Load questions for community page
async function loadQuestions() {
  const questionsContainer = document.getElementById('questionsContainer');
  if (!questionsContainer) return;
  
  try {
    const data = await apiRequest('/community/questions');
    
    if (data.questions && data.questions.length > 0) {
      questionsContainer.innerHTML = data.questions.map(question => `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${question.title}</h5>
            <p class="card-text">${question.content.substring(0, 200)}...</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                By ${question.author.profile.fullName} • ${question.answers.length} answers • ${question.views} views
              </small>
              <span class="badge bg-primary">${question.category}</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      questionsContainer.innerHTML = '<p class="text-center">No questions found. Be the first to ask!</p>';
    }
  } catch (error) {
    console.error('Error loading questions:', error);
    questionsContainer.innerHTML = '<p class="text-center text-danger">Error loading questions</p>';
  }
}

// Load market prices
async function loadMarketPrices() {
  const pricesContainer = document.getElementById('pricesContainer');
  if (!pricesContainer) return;
  
  try {
    const data = await apiRequest('/market-prices');
    
    if (data.prices && data.prices.length > 0) {
      pricesContainer.innerHTML = data.prices.map(price => `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${price.crop}</h5>
            <p class="card-text">
              <strong>Market:</strong> ${price.market}<br>
              <strong>Location:</strong> ${price.district}, ${price.state}<br>
              <strong>Price:</strong> ₹${price.price.min} - ₹${price.price.max} ${price.price.unit}<br>
              <strong>Modal Price:</strong> ₹${price.price.modal}
            </p>
            <small class="text-muted">Updated: ${new Date(price.date).toLocaleDateString()}</small>
          </div>
        </div>
      `).join('');
    } else {
      pricesContainer.innerHTML = '<p class="text-center">No price data available</p>';
    }
  } catch (error) {
    console.error('Error loading prices:', error);
    pricesContainer.innerHTML = '<p class="text-center text-danger">Error loading price data</p>';
  }
}

// Load listings
async function loadListings() {
  const listingsContainer = document.getElementById('listingsContainer');
  if (!listingsContainer) return;
  
  try {
    const data = await apiRequest('/listings');
    
    if (data.listings && data.listings.length > 0) {
      listingsContainer.innerHTML = data.listings.map(listing => `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description.substring(0, 150)}...</p>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>₹${listing.price.amount} ${listing.price.unit}</strong>
                ${listing.price.negotiable ? '<small class="text-muted">(Negotiable)</small>' : ''}
              </div>
              <span class="badge bg-secondary">${listing.category}</span>
            </div>
            <small class="text-muted mt-2 d-block">
              ${listing.location.district}, ${listing.location.state} • 
              By ${listing.seller.profile.fullName}
            </small>
          </div>
        </div>
      `).join('');
    } else {
      listingsContainer.innerHTML = '<p class="text-center">No listings available</p>';
    }
  } catch (error) {
    console.error('Error loading listings:', error);
    listingsContainer.innerHTML = '<p class="text-center text-danger">Error loading listings</p>';
  }
}
