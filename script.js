// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link, .nav-button');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize slider
    initializeSlider();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize contact form
    initializeContactForm();
});

// Image Slider Functionality
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoplayTimer;

    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Auto-play functionality
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 8000); // 8 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Pause autoplay on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
        
        // Start autoplay initially
        startAutoplay();
    }
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.about-card, .certification-card, .service-card, .news-card, .org-position, .outcome-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Track form submission
            trackEvent('contact_form_submitted', {
                subject: formData.get('asunto')
            });
        });
    }
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const asunto = formData.get('asunto');
    const mensaje = formData.get('mensaje');
    
    if (!nombre || nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!asunto) {
        errors.push('Por favor selecciona un asunto');
    }
    
    if (!mensaje || mensaje.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                padding: 16px 20px;
                z-index: 1001;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                border-left: 4px solid var(--professional-green);
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i:first-child {
                color: var(--professional-green);
                font-size: 18px;
            }
            
            .notification-error .notification-content i:first-child {
                color: #ef4444;
            }
            
            .notification-info .notification-content i:first-child {
                color: #3b82f6;
            }
            
            .notification-content span {
                flex: 1;
                color: var(--gray-700);
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }
            
            .notification-close:hover {
                background: var(--gray-100);
                color: var(--gray-600);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Active navigation highlighting
window.addEventListener('scroll', debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, 100));

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        }
    }
}, 250));

// Performance optimization: debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (if any real images are added)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, parameters = {}) {
    // This would integrate with Google Analytics, Adobe Analytics, etc.
    console.log('Event tracked:', eventName, parameters);
    
    // Example: gtag('event', eventName, parameters);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('primary_button_click', {
            button_text: e.target.textContent.trim(),
            section: findParentSection(e.target)
        });
    }
    
    if (e.target.matches('.nav-link')) {
        trackEvent('navigation_click', {
            link_text: e.target.textContent.trim(),
            link_href: e.target.getAttribute('href')
        });
    }
    
    if (e.target.matches('.news-link')) {
        trackEvent('news_article_click', {
            article_title: e.target.closest('.news-card').querySelector('h3').textContent.trim()
        });
    }
});

// Helper function to find parent section
function findParentSection(element) {
    const section = element.closest('section');
    return section ? section.getAttribute('id') : 'unknown';
}

// Error handling for failed resources
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Could implement fallback image here
    } else if (e.target.tagName === 'SCRIPT') {
        console.warn('Script failed to load:', e.target.src);
    }
});

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive operations when page is hidden
        console.log('Page hidden - pausing operations');
    } else {
        // Resume operations when page becomes visible
        console.log('Page visible - resuming operations');
    }
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        }
    }
});

// Focus management for better accessibility
document.addEventListener('focusin', (e) => {
    // Add focus styles for keyboard navigation
    if (e.target.matches('.nav-link, .btn, button, input, select, textarea')) {
        e.target.style.outline = '2px solid var(--professional-green)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    // Remove custom focus styles
    if (e.target.matches('.nav-link, .btn, button, input, select, textarea')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

// Smooth reveal animations for cards
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
        }, 20);
    });
}

// Initialize counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Console log for successful load
console.log('CECYS@NFE San Felipe del Progreso website loaded successfully!');
console.log('All interactive features initialized:');
console.log('- Image slider with navigation');
console.log('- Smooth scrolling navigation');
console.log('- Contact form validation');
console.log('- Mobile responsive menu');
console.log('- Scroll animations');
console.log('- Event tracking');

// Video functionality
function playVideo() {
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (videoThumbnail && videoPlayer) {
        videoThumbnail.style.display = 'none';
        videoPlayer.style.display = 'block';
        
        // Track video play event
        trackEvent('video_played', {
            video_title: 'Video Institucional CECYS@NFE'
        });
    }
}

function closeVideo() {
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    const iframe = videoPlayer.querySelector('iframe');
    
    if (videoThumbnail && videoPlayer) {
        videoPlayer.style.display = 'none';
        videoThumbnail.style.display = 'block';
        
        // Stop video by reloading iframe
        if (iframe) {
            const src = iframe.src;
            iframe.src = '';
            iframe.src = src.replace('autoplay=1', 'autoplay=0');
        }
        
        // Track video close event
        trackEvent('video_closed', {
            video_title: 'Video Institucional CECYS@NFE'
        });
    }
}

// Close video with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer && videoPlayer.style.display !== 'none') {
            closeVideo();
        }
    }
});

// Expose utility functions globally for potential use
window.CECYSNFE = {
    showNotification,
    trackEvent,
    validateForm,
    isValidEmail,
    playVideo,
    closeVideo
};