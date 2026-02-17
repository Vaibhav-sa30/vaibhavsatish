/* ===== CONTACT FORM HANDLING ===== */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.statusElement = document.getElementById('form-status');
        this.submitButton = null;
        this.originalButtonText = '';
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('.contact__form-button');
        this.originalButtonText = this.submitButton.textContent;
        
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupRealTimeValidation();
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('.contact__form-input');
        
        inputs.forEach(input => {
            // Add validation on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Clear validation on focus
            input.addEventListener('focus', () => {
                this.clearFieldValidation(input);
            });
        });
    }
    
    setupRealTimeValidation() {
        const emailInput = this.form.querySelector('#contact-email');
        const nameInput = this.form.querySelector('#contact-name');
        const messageInput = this.form.querySelector('#contact-message');
        
        // Email validation
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.value.length > 0) {
                    this.validateEmail(emailInput);
                }
            });
        }
        
        // Name validation
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (nameInput.value.length > 0) {
                    this.validateName(nameInput);
                }
            });
        }
        
        // Message character count
        if (messageInput) {
            this.addCharacterCounter(messageInput);
        }
    }
    
    validateField(input) {
        const fieldType = input.type;
        const fieldId = input.id;
        
        switch (fieldType) {
            case 'email':
                return this.validateEmail(input);
            case 'text':
                if (fieldId === 'contact-name') {
                    return this.validateName(input);
                } else {
                    return this.validateRequired(input);
                }
            case 'textarea':
                return this.validateMessage(input);
            default:
                return this.validateRequired(input);
        }
    }
    
    validateRequired(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        this.setFieldValidation(input, isValid, isValid ? '' : 'This field is required');
        return isValid;
    }
    
    validateName(input) {
        const value = input.value.trim();
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        const isValid = nameRegex.test(value);
        
        let message = '';
        if (!isValid) {
            if (value.length === 0) {
                message = 'Name is required';
            } else if (value.length < 2) {
                message = 'Name must be at least 2 characters';
            } else if (value.length > 50) {
                message = 'Name must be less than 50 characters';
            } else {
                message = 'Name can only contain letters and spaces';
            }
        }
        
        this.setFieldValidation(input, isValid, message);
        return isValid;
    }
    
    validateEmail(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        
        let message = '';
        if (!isValid) {
            if (value.length === 0) {
                message = 'Email is required';
            } else {
                message = 'Please enter a valid email address';
            }
        }
        
        this.setFieldValidation(input, isValid, message);
        return isValid;
    }
    
    validateMessage(input) {
        const value = input.value.trim();
        const minLength = 10;
        const maxLength = 1000;
        const isValid = value.length >= minLength && value.length <= maxLength;
        
        let message = '';
        if (!isValid) {
            if (value.length === 0) {
                message = 'Message is required';
            } else if (value.length < minLength) {
                message = `Message must be at least ${minLength} characters`;
            } else if (value.length > maxLength) {
                message = `Message must be less than ${maxLength} characters`;
            }
        }
        
        this.setFieldValidation(input, isValid, message);
        return isValid;
    }
    
    setFieldValidation(input, isValid, message) {
        const formGroup = input.closest('.contact__form-group');
        const existingError = formGroup.querySelector('.contact__form-error');
        
        // Remove existing error
        if (existingError) {
            existingError.remove();
        }
        
        // Update input styling
        input.classList.toggle('contact__form-input--valid', isValid);
        input.classList.toggle('contact__form-input--invalid', !isValid);
        
        // Add error message if invalid
        if (!isValid && message) {
            const errorElement = document.createElement('span');
            errorElement.className = 'contact__form-error';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        }
    }
    
    clearFieldValidation(input) {
        const formGroup = input.closest('.contact__form-group');
        const existingError = formGroup.querySelector('.contact__form-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.remove('contact__form-input--valid', 'contact__form-input--invalid');
    }
    
    addCharacterCounter(textarea) {
        const formGroup = textarea.closest('.contact__form-group');
        const counter = document.createElement('div');
        counter.className = 'contact__form-counter';
        counter.textContent = `0 / 1000 characters`;
        formGroup.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length} / 1000 characters`;
            counter.classList.toggle('contact__form-counter--warning', length > 800);
            counter.classList.toggle('contact__form-counter--error', length > 1000);
        });
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = this.form.querySelectorAll('.contact__form-input');
            let isFormValid = true;
            
            inputs.forEach(input => {
                const isFieldValid = this.validateField(input);
                if (!isFieldValid) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                this.showStatus('Please correct the errors above', 'error');
                return;
            }
            
            // Submit form
            await this.submitForm();
        });
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(data);
            
            // Show success message
            this.showStatus('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            this.clearAllValidations();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async simulateFormSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, we'll just log the data
        console.log('Form submitted with data:', data);
        
        // In a real implementation, you would send this to your backend:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
        */
        
        // For now, randomly succeed or fail for demo
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true };
        } else {
            throw new Error('Simulated network error');
        }
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Sending...';
            this.submitButton.classList.add('contact__form-button--loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.originalButtonText;
            this.submitButton.classList.remove('contact__form-button--loading');
        }
    }
    
    showStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = `contact__form-status ${type}`;
        this.statusElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.statusElement.style.display = 'none';
        }, 5000);
    }
    
    clearAllValidations() {
        const inputs = this.form.querySelectorAll('.contact__form-input');
        inputs.forEach(input => {
            this.clearFieldValidation(input);
        });
        
        // Reset character counter
        const counter = this.form.querySelector('.contact__form-counter');
        if (counter) {
            counter.textContent = '0 / 1000 characters';
            counter.classList.remove('contact__form-counter--warning', 'contact__form-counter--error');
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});