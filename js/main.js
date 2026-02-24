/**
 * OpenStage Landing Page — interactions, scroll animations, typing effect.
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Scroll Observer (fade-up) =====
    var fadeEls = document.querySelectorAll('.fade-up');
    if (fadeEls.length && 'IntersectionObserver' in window) {
        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeEls.forEach(function (el) {
            if (reducedMotion) {
                el.classList.add('visible');
            } else {
                fadeObserver.observe(el);
            }
        });
    }

    // ===== Nav Scroll =====
    var nav = document.getElementById('nav');
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var y = window.pageYOffset;
        if (y > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = y;
    }, { passive: true });

    // ===== Hamburger =====
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Typing Effect =====
    var typedEls = document.querySelectorAll('.typed-text');
    if (typedEls.length && !reducedMotion) {
        var currentLine = 0;
        var currentChar = 0;
        var cursor = document.querySelector('.terminal-cursor');

        function typeLine() {
            if (currentLine >= typedEls.length) {
                // Reset and loop after pause
                setTimeout(function () {
                    typedEls.forEach(function (el) { el.textContent = ''; });
                    currentLine = 0;
                    currentChar = 0;
                    if (cursor) cursor.style.display = 'inline-block';
                    typeLine();
                }, 3000);
                return;
            }

            var el = typedEls[currentLine];
            var text = el.getAttribute('data-text') || '';

            // Move cursor next to current line
            if (cursor && el.parentNode) {
                el.parentNode.appendChild(cursor);
            }

            if (currentChar < text.length) {
                el.textContent += text[currentChar];
                currentChar++;
                setTimeout(typeLine, 30 + Math.random() * 40);
            } else {
                // Line done, move to next
                if (cursor && el.parentNode) {
                    // Remove cursor from this line
                }
                currentLine++;
                currentChar = 0;
                setTimeout(typeLine, 400);
            }
        }

        // Start typing when hero is visible
        var heroObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                setTimeout(typeLine, 800);
                heroObserver.disconnect();
            }
        }, { threshold: 0.3 });

        heroObserver.observe(document.getElementById('hero'));
    } else {
        // Reduced motion: show all text immediately
        typedEls.forEach(function (el) {
            el.textContent = el.getAttribute('data-text') || '';
        });
        var cursorEl = document.querySelector('.terminal-cursor');
        if (cursorEl) cursorEl.style.display = 'none';
    }

    // ===== Floating Music Notes =====
    var notesContainer = document.getElementById('hero-notes');
    if (notesContainer && !reducedMotion) {
        var noteChars = ['\u266A', '\u266B', '\u266C', '\u2669'];
        for (var i = 0; i < 12; i++) {
            var note = document.createElement('span');
            note.className = 'floating-note';
            note.textContent = noteChars[i % noteChars.length];
            note.style.left = (5 + Math.random() * 90) + '%';
            note.style.animationDelay = (Math.random() * 14) + 's';
            note.style.animationDuration = (12 + Math.random() * 6) + 's';
            note.style.fontSize = (1.2 + Math.random() * 1) + 'rem';
            notesContainer.appendChild(note);
        }
    }

    // ===== GitHub Stars =====
    var starsEl = document.getElementById('github-stars');
    if (starsEl) {
        fetch('https://api.github.com/repos/prjoni99/openstage')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.stargazers_count !== undefined) {
                    var count = data.stargazers_count;
                    starsEl.textContent = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
                }
            })
            .catch(function () { /* keep dash */ });
    }

    // ===== Theme Carousel =====
    var carousel = document.getElementById('theme-carousel');
    if (carousel) {
        var themes = [
            { name: 'Neon Night',      bg: 'linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0d0020 100%)', accent: '#ff00ff' },
            { name: 'Retro Karaoke',   bg: 'linear-gradient(180deg, #001040 0%, #002080 50%, #001050 100%)', accent: '#ffdd00' },
            { name: 'Concert Stage',   bg: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.08) 0%, #050505 70%)', accent: '#ffffff' },
            { name: 'Vaporwave',       bg: 'linear-gradient(180deg, #ff6ec7 0%, #7873f5 30%, #4adede 60%, #667eea 100%)', accent: '#ff6ec7' },
            { name: 'Starfield',       bg: 'linear-gradient(180deg, #000011 0%, #060622 40%, #0a0a33 100%)', accent: '#8090ff' },
            { name: 'Ocean',           bg: 'linear-gradient(180deg, #001828 0%, #003050 30%, #004070 60%, #002040 100%)', accent: '#00ccff' },
            { name: 'Fire',            bg: 'linear-gradient(180deg, #1a0800 0%, #331000 30%, #441500 60%, #220a00 100%)', accent: '#ff6600' },
            { name: 'Disco',           bg: 'linear-gradient(135deg, #1a0033 0%, #0d001a 50%, #001a1a 100%)', accent: '#ff00ff' },
            { name: 'Purple Haze',     bg: 'linear-gradient(135deg, #0a0015 0%, #1a0830 30%, #12081f 100%)', accent: '#a855f7' }
        ];

        themes.forEach(function (theme) {
            var card = document.createElement('div');
            card.className = 'theme-card';
            card.style.background = theme.bg;
            card.innerHTML = '<span class="theme-card-name">' + theme.name + '</span>';
            carousel.appendChild(card);
        });

        // Auto-scroll carousel
        if (!reducedMotion) {
            var scrollDir = 1;
            var scrollSpeed = 0.5;
            var isHovering = false;

            carousel.addEventListener('mouseenter', function () { isHovering = true; });
            carousel.addEventListener('mouseleave', function () { isHovering = false; });

            function autoScroll() {
                if (!isHovering) {
                    carousel.scrollLeft += scrollSpeed * scrollDir;
                    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2) {
                        scrollDir = -1;
                    } else if (carousel.scrollLeft <= 0) {
                        scrollDir = 1;
                    }
                }
                requestAnimationFrame(autoScroll);
            }
            autoScroll();
        }
    }

    // ===== Stepper Line Animation =====
    var stepperLine = document.getElementById('stepper-line');
    var steps = document.querySelectorAll('.step');
    if (stepperLine && steps.length) {
        var stepObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Calculate progress
                    var visibleCount = document.querySelectorAll('.step.visible').length;
                    var progress = (visibleCount / steps.length) * 100;
                    stepperLine.style.height = progress + '%';
                }
            });
        }, { threshold: 0.5 });

        steps.forEach(function (step) { stepObserver.observe(step); });
    }

    // ===== Copy Button =====
    var copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var text = 'git clone https://github.com/prjoni99/openstage.git\ncd openstage\ndocker compose up';
            navigator.clipboard.writeText(text).then(function () {
                copyBtn.classList.add('copied');
                setTimeout(function () { copyBtn.classList.remove('copied'); }, 2000);
            });
        });
    }

})();
