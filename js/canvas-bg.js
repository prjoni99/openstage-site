/**
 * Hero Background — floating gradient orbs on canvas.
 * Respects prefers-reduced-motion.
 */
(function () {
    'use strict';

    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;
    var animId;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var orbs = [];
    var orbCount = 5;

    var orbColors = [
        { r: 168, g: 85,  b: 247 },  // purple
        { r: 236, g: 72,  b: 153 },  // pink
        { r: 6,   g: 182, b: 212 },  // cyan
        { r: 147, g: 51,  b: 234 },  // deep purple
        { r: 99,  g: 102, b: 241 }   // indigo
    ];

    function resize() {
        w = canvas.parentElement.clientWidth;
        h = canvas.parentElement.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initOrbs() {
        orbs = [];
        var maxR = Math.min(w, h) * 0.4;
        for (var i = 0; i < orbCount; i++) {
            var color = orbColors[i % orbColors.length];
            orbs.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: maxR * 0.5 + Math.random() * maxR * 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: color.r,
                g: color.g,
                b: color.b,
                alpha: 0.08 + Math.random() * 0.06,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);

        for (var i = 0; i < orbs.length; i++) {
            var orb = orbs[i];

            if (!reducedMotion) {
                orb.x += orb.vx;
                orb.y += orb.vy;

                // gentle oscillation
                var osc = Math.sin(t * 0.0003 + orb.phase) * 0.15;
                orb.x += osc;
                orb.y += Math.cos(t * 0.00025 + orb.phase) * 0.1;

                // wrap around edges with buffer
                if (orb.x < -orb.radius) orb.x = w + orb.radius;
                if (orb.x > w + orb.radius) orb.x = -orb.radius;
                if (orb.y < -orb.radius) orb.y = h + orb.radius;
                if (orb.y > h + orb.radius) orb.y = -orb.radius;
            }

            var grad = ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            grad.addColorStop(0, 'rgba(' + orb.r + ',' + orb.g + ',' + orb.b + ',' + orb.alpha + ')');
            grad.addColorStop(1, 'rgba(' + orb.r + ',' + orb.g + ',' + orb.b + ',0)');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
    }

    function loop(t) {
        draw(t);
        animId = requestAnimationFrame(loop);
    }

    // Init
    resize();
    initOrbs();

    if (reducedMotion) {
        draw(0);
    } else {
        loop(0);
    }

    // Resize handling
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            resize();
            initOrbs();
            if (reducedMotion) draw(0);
        }, 150);
    });

    // Pause when off-screen
    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            if (!animId && !reducedMotion) loop(0);
        } else {
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }
    }, { threshold: 0 });

    observer.observe(canvas.parentElement);
})();
