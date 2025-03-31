// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

// Main initialization function
function initializeAll() {
    initAOS();
    initNavbar();
    initLogoAnimation();
    initTeamImageEffects()
    initStatsCounter();
    initSmoothScroll();
    initContactForm();
    initMobileMenu();
    initBackToTop();
    initTeamHover();
    initTimelineAnimation();
    initTestimonials()
    initParallaxEffect();
    initVisionCardEffects();
    initMissionPointsAnimation();
    initScrollReveal();
    initImageLazyLoad();
    initServiceCards()
}

// AOS Animation initialization
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        delay: 50,
        disable: 'mobile'
    });
}

// Enhanced navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.custom-navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScroll = currentScroll;
    });
    }
    // New Logo Animation
function initLogoAnimation() {
    const logo = document.querySelector('.navbar-brand img');
    if (!logo) return;

    logo.addEventListener('mouseover', () => {
        logo.style.transform = 'scale(1.1) rotate(10deg)';
    });

    logo.addEventListener('mouseout', () => {
        logo.style.transform = 'scale(1) rotate(0)';
    });
}
// Enhanced Team Image Effects
function initTeamImageEffects() {
    const teamImages = document.querySelectorAll('.team-image');
    
    teamImages.forEach(image => {
        image.addEventListener('mouseover', () => {
            image.style.transform = 'scale(1.05)';
            image.style.borderColor = 'var(--secondary-color)';
        });

        image.addEventListener('mouseout', () => {
            image.style.transform = 'scale(1)';
            image.style.borderColor = 'var(--accent-color)';
        });
    });
}

    // Highlight active nav item
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });


// Enhanced stats counter with animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(easedProgress * (end - start) + start);
            
            obj.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateValue(stat, 0, target, 2500);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
}


// Enhanced smooth scroll functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Vision cards effects
function initVisionCardEffects() {
    const visionCards = document.querySelectorAll('.vision-card');
    
    visionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.borderColor = 'var(--secondary-color)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--card-border)';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
    });
}

// Enhanced Mission Points Animation
function initMissionPointsAnimation() {
    const points = document.querySelectorAll('.mission-points li');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                }, index * 200);
            }
        });
    }, { threshold: 0.5 });

    points.forEach(point => {
        point.style.transform = 'translateX(-20px)';
        point.style.opacity = '0';
        point.style.transition = 'all 0.5s ease-out';
        observer.observe(point);
    });
}

// Enhanced scroll reveal
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    
    const scrollReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    elements.forEach(element => {
        scrollReveal.observe(element);
    });
}

// Image lazy loading
function initImageLazyLoad() {
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

// Mobile menu initialization
function initMobileMenu() {
    const mobileToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (mobileToggle && navbarCollapse) {
        mobileToggle.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarCollapse.contains(e.target) && !mobileToggle.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Team hover effects
function initTeamHover() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const socialLinks = card.querySelector('.team-social');
        if (!socialLinks) return;

        card.addEventListener('mouseenter', () => {
            socialLinks.style.bottom = '0';
            socialLinks.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            socialLinks.style.bottom = '-50px';
            socialLinks.style.opacity = '0';
        });
    });
}
// Hero Parallax Effect
function initHeroParallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

// Timeline animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => observer.observe(item));
}
// Service Cards Interaction
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.service-icon').style.transform = 'scale(1.1) rotate(5deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.service-icon').style.transform = 'scale(1) rotate(0)';
        });
    });
}
// Testimonials Slider
function initTestimonials() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-item');
    const totalSlides = slides.length;
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
            slide.style.opacity = index === currentSlide ? '1' : '0';
        });
    }
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);

    updateSlider();
}
// Image Lightbox
function initLightbox() {
    const images = document.querySelectorAll('.lightbox-image');
    
    images.forEach(image => {
        image.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            lightbox.addEventListener('click', function(e) {
                if (e.target === this || e.target.className === 'lightbox-close') {
                    this.remove();
                    document.body.style.overflow = '';
                }
            });
        });
    });
}
// Map Interaction
function initMapInteraction() {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (!mapWrapper) return;

    const iframe = mapWrapper.querySelector('iframe');
    
    mapWrapper.addEventListener('mouseenter', () => {
        iframe.style.filter = 'grayscale(0) contrast(1)';
        mapWrapper.style.transform = 'scale(1.02)';
    });

    mapWrapper.addEventListener('mouseleave', () => {
        iframe.style.filter = 'grayscale(0.2) contrast(1.2)';
        mapWrapper.style.transform = 'scale(1)';
    });
}
// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAll);

// Parallax effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Contact form initialization and validation
function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateForm(form)) {
            await handleFormSubmission(form);
        }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => validateInput(input));
    });
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Input validation
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch(input.name) {
        case 'name':
            isValid = value.length >= 2 && value.length <= 50;
            errorMessage = 'Name must be between 2 and 50 characters';
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
        case 'message':
            isValid = value.length >= 10 && value.length <= 500;
            errorMessage = 'Message must be between 10 and 500 characters';
            break;
    }

    toggleInputError(input, isValid, errorMessage);
    return isValid;
}

// Toggle input error states
function toggleInputError(input, isValid, errorMessage) {
    const errorElement = input.nextElementSibling;
    
    if (!isValid) {
        input.classList.add('is-invalid');
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            const error = document.createElement('div');
            error.className = 'invalid-feedback';
            error.textContent = errorMessage;
            input.parentNode.insertBefore(error, input.nextSibling);
        }
    } else {
        input.classList.remove('is-invalid');
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }
    }
}

// Form submission handler
async function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        
        const response = await fetch('your-api-endpoint', {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        showSuccessMessage('Thank you! Your message has been sent successfully.');
        form.reset();
        
        submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Sent!';
        submitButton.classList.add('btn-success');
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.classList.remove('btn-success');
        }, 2000);

    } catch (error) {
        console.error('Form submission error:', error);
        showFormErrors(['An error occurred. Please try again later.']);
    } finally {
        submitButton.disabled = false;
    }
}

// Show form errors
function showFormErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3 fade show';
    errorDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-exclamation-circle me-2"></i>
            <div>${errors.join('<br>')}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    const form = document.querySelector('#contact-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3 fade show';
    successDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    const form = document.querySelector('#contact-form');
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}