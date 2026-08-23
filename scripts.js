document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initNavbar();
    setActiveNavLink();
    initStatsCounter();
    initSmoothScroll();
    initContactForm();
    initBackToTop();
    initMissionPointsAnimation();
    setCopyrightYear();
    initCodeTypewriter();
    initAiChat();
});

function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
        duration: 700,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });
}

function initNavbar() {
    const navbar = document.querySelector('.custom-navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        navbar.classList.toggle('navbar-scrolled', currentScroll > 40);

        const collapse = navbar.querySelector('.navbar-collapse');
        const menuOpen = collapse && collapse.classList.contains('show');

        if (currentScroll > lastScroll && currentScroll > 320 && !menuOpen) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }, { passive: true });

    document.querySelectorAll('#navbarNav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (collapse && collapse.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });
}

function setActiveNavLink() {
    const currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || '').toLowerCase();

    document.querySelectorAll('.custom-navbar .nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

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
            obj.textContent = Math.floor(easedProgress * (end - start) + start).toLocaleString();

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
                statsSection.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
                    animateValue(stat, 0, target, 2200);
                });
            }
        });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateForm(form)) {
            await handleFormSubmission(form);
        }
    });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });
}

function validateForm(form) {
    let isValid = true;

    form.querySelectorAll('input, textarea').forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.name) {
        case 'name':
            isValid = value.length >= 2 && value.length <= 50;
            errorMessage = 'Name must be between 2 and 50 characters';
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
        case 'subject':
            isValid = value.length >= 3;
            errorMessage = 'Subject must be at least 3 characters';
            break;
        case 'message':
            isValid = value.length >= 10 && value.length <= 500;
            errorMessage = 'Message must be between 10 and 500 characters';
            break;
        default:
            isValid = value.length > 0;
            errorMessage = 'This field is required';
    }

    toggleInputError(input, isValid, errorMessage);
    return isValid;
}

function toggleInputError(input, isValid, errorMessage) {
    input.classList.toggle('is-invalid', !isValid);

    const errorElement = input.parentNode.querySelector('.invalid-feedback');

    if (!isValid) {
        if (!errorElement) {
            const error = document.createElement('div');
            error.className = 'invalid-feedback';
            error.textContent = errorMessage;
            input.parentNode.appendChild(error);
        } else {
            errorElement.textContent = errorMessage;
        }
    } else if (errorElement) {
        errorElement.remove();
    }
}

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

        setTimeout(() => {
            submitButton.innerHTML = originalText;
        }, 2000);

    } catch (error) {
        console.error('Form submission error:', error);
        showFormErrors(['An error occurred. Please try again later.']);
    } finally {
        submitButton.disabled = false;
    }
}

function showFormErrors(errors) {
    showAlert(errors.join('<br>'), 'alert-danger', 'fa-exclamation-circle');
}

function showSuccessMessage(message) {
    showAlert(message, 'alert-success', 'fa-check-circle');
}

function showAlert(message, alertClass, iconClass) {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} mt-3`;
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${iconClass} me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    form.insertBefore(alertDiv, form.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 6000);
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 300);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initCodeTypewriter() {
    const body = document.getElementById('codeBody');
    if (!body) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CODE_LINES = [
        [['tok-k', 'import'], ['tok-p', ' { '], ['tok-f', 'TelemetryClient'], ['tok-p', ' } '], ['tok-k', 'from '], ['tok-s', "'@martian/core'"], ['tok-p', ';']],
        [],
        [['tok-k', 'const '], ['plain', 'client = '], ['tok-k', 'new '], ['tok-f', 'TelemetryClient'], ['tok-p', '({']],
        [['plain', '  siteId: '], ['tok-s', "'solar-plant-07'"], ['tok-p', ',']],
        [['tok-p', '});']],
        [],
        [['tok-c', '// Stream telemetry & predict failures']],
        [['plain', 'client'], ['tok-p', '.'], ['tok-f', 'onAlert'], ['tok-p', '('], ['tok-k', 'async '], ['tok-p', '(event) => {']],
        [['plain', '  const risk = '], ['tok-k', 'await '], ['tok-f', 'predict'], ['tok-p', '(event.metrics);']],
        [['tok-k', '  if '], ['tok-p', '(risk.score > '], ['tok-n', '0.85'], ['tok-p', ') {']],
        [['tok-k', '    await '], ['tok-f', 'dispatch'], ['tok-p', '(risk.assetId);']],
        [['tok-p', '  }']],
        [['tok-p', '});']],
        [],
        [['tok-k', 'await '], ['plain', 'client'], ['tok-p', '.'], ['tok-f', 'connect'], ['tok-p', '();']]
    ];

    const CHAR_DELAY = 22;
    const LINE_DELAY = 90;
    const RESTART_DELAY = 5000;
    const caret = document.createElement('span');
    caret.className = 'code-caret';

    function renderInstant() {
        body.innerHTML = '';
        CODE_LINES.forEach(tokens => {
            const line = document.createElement('div');
            line.className = 'code-line';
            tokens.forEach(([cls, text]) => {
                const span = document.createElement('span');
                if (cls !== 'plain') span.className = cls;
                span.textContent = text;
                line.appendChild(span);
            });
            body.appendChild(line);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeLoop() {
        while (true) {
            body.innerHTML = '';
            body.appendChild(caret);
            await sleep(700);

            for (const tokens of CODE_LINES) {
                const line = document.createElement('div');
                line.className = 'code-line';
                body.appendChild(line);

                if (!tokens.length) {
                    line.innerHTML = '&nbsp;';
                    await sleep(LINE_DELAY + 120);
                    continue;
                }

                for (const [cls, text] of tokens) {
                    const span = document.createElement('span');
                    if (cls !== 'plain') span.className = cls;
                    line.appendChild(span);
                    for (const ch of text) {
                        span.textContent += ch;
                        await sleep(CHAR_DELAY);
                    }
                }
                await sleep(LINE_DELAY);
            }
            await sleep(RESTART_DELAY);
        }
    }

    if (reduceMotion) {
        renderInstant();
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !body.dataset.started) {
                body.dataset.started = 'true';
                observer.disconnect();
                typeLoop();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(body);
}

function initAiChat() {
    const win = document.getElementById('aiChatWindow');
    const chatBody = document.getElementById('aiChatBody');
    const toggle = document.getElementById('chatToggle');
    const popup = document.getElementById('aiChatPopup');
    if (!win || !chatBody || !toggle || !popup) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const whatsappUrl = win.getAttribute('data-whatsapp') || '#';
    const emailUrl = win.getAttribute('data-email') || '#';

    const CONVO = [
        { from: 'bot', text: "Hi! I'm Marti, the Martian Ventures assistant." },
        { from: 'bot', text: 'Looking to build software or automate your operations?' },
        { from: 'user', text: 'Yes — we run a solar plant and need real-time monitoring.' },
        { from: 'bot', text: 'Perfect fit. Our SCADA platform delivers live telemetry, yield analytics and predictive alerts.' },
        { from: 'bot', text: 'How would you like to reach our engineering team?', actions: true }
    ];

    let runId = 0;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isOpen() {
        return win.classList.contains('open');
    }

    function scrollToEnd() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addMessage(from, text) {
        const msg = document.createElement('div');
        msg.className = `msg ${from === 'bot' ? 'msg-bot' : 'msg-user'}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        scrollToEnd();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'msg msg-bot typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(t);
        scrollToEnd();
        return t;
    }

    function addActions() {
        const wrap = document.createElement('div');
        wrap.className = 'msg msg-bot msg-actions';
        wrap.innerHTML = `
            <div class="chat-actions">
                <a class="chat-cta chat-cta-wa" href="${whatsappUrl}" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>WhatsApp
                </a>
                <a class="chat-cta chat-cta-mail" href="${emailUrl}">
                    <i class="fas fa-envelope"></i>Email
                </a>
            </div>`;
        chatBody.appendChild(wrap);
        scrollToEnd();
    }

    async function play(id) {
        chatBody.innerHTML = '';

        for (const step of CONVO) {
            if (id !== runId || !isOpen()) return;

            if (!reduceMotion) {
                if (step.from === 'bot') {
                    const typing = showTyping();
                    await sleep(950);
                    typing.remove();
                } else {
                    await sleep(600);
                }
                if (id !== runId || !isOpen()) return;
            }

            addMessage(step.from, step.text);

            if (step.actions) {
                await sleep(reduceMotion ? 0 : 450);
                if (id !== runId) return;
                addActions();
            }
        }
    }

    function openChat() {
        win.classList.add('open');
        toggle.classList.add('seen');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close chat');
        popup.setAttribute('aria-hidden', 'false');

        const teaser = document.getElementById('chatTeaser');
        if (teaser) teaser.classList.remove('show');

        runId += 1;
        play(runId);
    }

    function closeChat() {
        win.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open chat');
        popup.setAttribute('aria-hidden', 'true');
        runId += 1;
    }

    toggle.addEventListener('click', () => {
        if (isOpen()) closeChat(); else openChat();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen()) closeChat();
    });

    const replayBtn = win.querySelector('.chat-replay');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            runId += 1;
            play(runId);
        });
    }

    const teaser = document.getElementById('chatTeaser');
    if (teaser) {
        teaser.querySelector('.teaser-close').addEventListener('click', () => teaser.remove());

        if (reduceMotion) {
            teaser.remove();
        } else {
            setTimeout(() => {
                if (!isOpen()) teaser.classList.add('show');
            }, 4000);
            setTimeout(() => teaser.remove(), 24000);
        }
    }
}

function setCopyrightYear() {
    const el = document.getElementById('copyrightYear');
    if (el) el.textContent = new Date().getFullYear();
}

function initMissionPointsAnimation() {
    const points = document.querySelectorAll('.mission-points li');
    if (!points.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                }, index * 150);
            }
        });
    }, { threshold: 0.5 });

    points.forEach(point => {
        point.style.transform = 'translateX(-16px)';
        point.style.opacity = '0';
        point.style.transition = 'all 0.5s ease-out';
        observer.observe(point);
    });
}
