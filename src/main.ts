// main.ts
import './style.css';

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-menu-open');
  });
  
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-menu-open');
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Subtle fade-in animation for sections
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      observer.unobserve(el);
    }
  });
}, observerOptions);

// Apply initial state and observe
document.querySelectorAll('.value-card, .service-category, .job-support-text, .quote-form-container').forEach(el => {
  if (el instanceof HTMLElement) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(el);
  }
});

// Handle Quote Form Submission
const quoteForm = document.getElementById('quote-form') as HTMLFormElement | null;
const formSuccess = document.getElementById('form-success');

if (quoteForm && formSuccess) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = quoteForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const formData = new FormData(quoteForm);
    
    // Check if the user forgot to change the placeholder access key
    if (formData.get('access_key') === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      alert("Please update the Web3Forms Access Key in index.html to actually send emails.");
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        formSuccess.style.display = 'block';
        quoteForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      } else {
        alert("Something went wrong while submitting the form. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  });
}
