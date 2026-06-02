/* ============================================
   Portfolio - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Typing Effect
    // ==========================================
    const typingElement = document.getElementById('typingText');
    const roles = [
        'I\'m a Frontend Developer...',
        'I\'m a Creative Thinker...',
        'I Build Modern Websites...'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400; // Pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    // ==========================================
    // Sidebar Active State on Scroll
    // ==========================================
    const sections = document.querySelectorAll('.section');
    const navIcons = document.querySelectorAll('.nav-icon');

    function updateActiveNav() {
        let currentSection = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navIcons.forEach(icon => {
            icon.classList.remove('active');
            if (icon.getAttribute('href') === `#${currentSection}`) {
                icon.classList.add('active');
            }
        });
    }

    // ==========================================
    // Scroll to Top Button
    // ==========================================
    const scrollTopBtn = document.getElementById('scrollTop');

    function toggleScrollTop() {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // Scroll Animations (Intersection Observer)
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Skill items animation
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                const itemIndex = Array.from(skillItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, itemIndex * 150);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => skillObserver.observe(item));

    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardIndex = Array.from(projectCards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, cardIndex * 150);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => cardObserver.observe(card));

    // ==========================================
    // Smooth Scroll for Nav Links
    // ==========================================
    navIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = icon.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // Contact Form Handler
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const subjectVal = document.getElementById('subject').value;
        const messageVal = document.getElementById('message').value;
        const honeypotVal = document.getElementById('honeypot').value;

        // Animate the button
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // If honeypot is filled, it's a bot submission. Ignore and pretend it succeeded.
        if (honeypotVal) {
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1000);
            return;
        }

        // Send request to FormSubmit AJAX endpoint
        fetch("https://formsubmit.co/ajax/engyha08@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                _subject: `New Portfolio Message: ${subjectVal}`,
                message: messageVal
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';

            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            submitBtn.innerHTML = '<span>Error! Try Again</span><i class="fas fa-exclamation-triangle"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';

            // Reset after 4 seconds to allow retry
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
        });
    });

    // ==========================================
    // Parallax-like subtle effects
    // ==========================================
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                toggleScrollTop();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ==========================================
    // Add hover ripple effect to buttons
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.15);
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                animation: ripple-effect 0.6s ease-out forwards;
                pointer-events: none;
            `;
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Initial check
    updateActiveNav();
    toggleScrollTop();
});
