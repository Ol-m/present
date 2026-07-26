// Регистрируем плагин ScrollTrigger
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // 1. INITIAL STATES & SETUP
    // ============================================================
    gsap.set("#nav", { opacity: 0, y: -20 });
    gsap.set(".small-team .word > span", { y: "105%" });
    gsap.set(".big-results .letter", { y: 80, opacity: 0 });
    gsap.set("#subline", { opacity: 0, y: 20 });
    gsap.set(".t-card", { opacity: 0 });
    gsap.set(".stats-inner", { opacity: 0 });

    // Стартовый угол поворота для карточек (падают сверху)
    document.querySelectorAll(".card").forEach((card) => {
        const rot = parseFloat(card.dataset.rot) || 0;
        card.dataset.restRot = rot;
        gsap.set(card, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
    });


    // ============================================================
    // 2. INTRO TIMELINE (Появление элементов)
    // ============================================================
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
        .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
        .to(
            ".small-team .word > span",
            {
                y: "0%",
                duration: 0.9,
                stagger: 0.08,
                ease: "power3.out"
            },
            0.3
        )
        .to(
            ".big-results .letter",
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.05,
                ease: "back.out(1.6)"
            },
            0.55
        )
        .to(
            ".card",
            {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
                duration: 1.1,
                stagger: { each: 0.08, from: "center" },
                ease: "back.out(1.4)"
            },
            0.8
        )
        .to("#subline", { opacity: 1, y: 0, duration: 0.8 }, 1.6);


    // ============================================================
    // 3. CONTINUOUS FLOAT & PARALLAX ON CARDS
    // ============================================================
    document.querySelectorAll(".card").forEach((card, i) => {
        const rot = parseFloat(card.dataset.restRot) || 0;
        gsap.to(card, {
            y: `+=${8 + (i % 3) * 5}`,
            rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
            duration: 3 + (i % 4) * 0.5,
            delay: 1.8 + i * 0.1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    });

    const hero = document.querySelector(".hero");
    let mx = 0, my = 0, tx = 0, ty = 0;

    if (hero) {
        hero.addEventListener("mousemove", (e) => {
            const r = hero.getBoundingClientRect();
            mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
            my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        });
        hero.addEventListener("mouseleave", () => {
            mx = 0;
            my = 0;
        });
    }

    function parallax() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        document.querySelectorAll(".card").forEach((card) => {
            const d = parseFloat(card.dataset.depth) || 8;
            card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
        });
        requestAnimationFrame(parallax);
    }
    parallax();


    // ============================================================
    // 4. CARD HOVER 3D LIFT
    // ============================================================
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
                rotateX: -py * 16,
                rotateY: px * 16,
                scale: 1.12,
                zIndex: 20,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 700,
                overwrite: "auto"
            });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                zIndex: card.style.zIndex || "",
                duration: 0.8,
                ease: "elastic.out(1, 0.6)",
                overwrite: "auto"
            });
        });
        card.addEventListener("click", () => {
            gsap.fromTo(
                card,
                { scale: 1.15 },
                {
                    scale: 1.05,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                }
            );
        });
    });


    // ============================================================
    // 5. SCROLL EFFECTS (HERO & CARDS FAN OUT)
    // ============================================================
    if (window.ScrollTrigger) {
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            onUpdate: (self) => {
                const p = self.progress;
                gsap.set(".big-results", { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
                gsap.set(".small-team", { y: -60 * p, opacity: 1 - p * 1.5 });

                const moves = [
                    { x: -260, y: -40, rot: -25 },
                    { x: -200, y: 20, rot: -18 },
                    { x: -120, y: 80, rot: -10 },
                    { x: -40, y: 120, rot: -4 },
                    { x: 40, y: 120, rot: 4 },
                    { x: 120, y: 80, rot: 12 },
                    { x: 200, y: 20, rot: 22 },
                    { x: 260, y: -40, rot: 28 }
                ];
                document.querySelectorAll(".card").forEach((card, i) => {
                    const m = moves[i];
                    if (!m) return;
                    const rest = parseFloat(card.dataset.restRot) || 0;
                    gsap.set(card, {
                        x: m.x * p,
                        y: m.y * p,
                        rotation: rest + m.rot * p
                    });
                });
                gsap.set("#subline", { opacity: 1 - p * 2 });
            }
        });

        // Team Grid Reveal
        gsap.from(".eyebrow, .team-head h2, .team-head p", {
            opacity: 0,
            y: 30,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".team-head", start: "top 80%" }
        });

        gsap.to(".t-card", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".team-grid", start: "top 80%" }
        });

        gsap.from(".t-card", {
            y: 80,
            scale: 0.9,
            rotation: (i) => (i % 2 === 0 ? -3 : 3),
            duration: 1,
            stagger: 0.08,
            ease: "back.out(1.3)",
            scrollTrigger: { trigger: ".team-grid", start: "top 80%" }
        });

        gsap.to(".stats-inner", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: ".stats", start: "top 80%" }
        });

        gsap.from(".stats-inner", {
            y: 60,
            scale: 0.97,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: ".stats", start: "top 80%" }
        });

        // Анимация счётчиков
        ScrollTrigger.create({
            trigger: ".stats",
            start: "top 75%",
            onEnter: () => {
                document.querySelectorAll(".stat-block .num").forEach((el) => {
                    const target = parseFloat(el.dataset.count);
                    const span = el.querySelector("span");
                    if (!span) return;
                    gsap.to(
                        { v: 0 },
                        {
                            v: target,
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: function () {
                                span.textContent = Math.floor(this.targets()[0].v).toLocaleString();
                            }
                        }
                    );
                });
            },
            once: true
        });
    }


    // ============================================================
    // 6. TYPEWRITER EFFECT & GRAND CELEBRATION (ПО СКРОЛЛУ)
    // ============================================================
    const fullText = "May every day bring you joy, so that you don’t feel sad in your Jewish camp Happy birthday 🎂🎉💖";
    const typewriterWrap = document.querySelector(".typewriter-wrap");
    const typewriterEl = document.getElementById("typewriter-text");
    let charIndex = 0;
    let hasStartedTyping = false;

    function typeWriter() {
        if (typewriterEl && charIndex <= fullText.length) {
            typewriterEl.textContent = fullText.slice(0, charIndex);
            charIndex++;
            setTimeout(typeWriter, 55);
        } else if (typewriterEl) {
            setTimeout(startGrandCelebration, 300);
        }
    }

    function startGrandCelebration() {
        const celebrationBlock = document.getElementById("grandCelebration");
        if (celebrationBlock) {
            celebrationBlock.classList.add("active");
        }
    }

    if (typewriterWrap) {
        const typewriterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasStartedTyping) {
                    hasStartedTyping = true;
                    typeWriter();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        typewriterObserver.observe(typewriterWrap);
    }


    // ============================================================
    // 7. EMOJI HOVER CHANGER
    // ============================================================
    document.querySelectorAll('.js-emoji-link').forEach(link => {
        const emojis = link.dataset.emojis ? link.dataset.emojis.split(',') : [];
        let currentIndex = 0;

        if (emojis.length > 0) {
            link.addEventListener('mouseenter', () => {
                currentIndex = (currentIndex + 1) % emojis.length;
                const newEmoji = emojis[currentIndex];
                link.textContent = link.textContent.replace(/^[\p{Emoji}\s]+/u, `${newEmoji} `);
            });
        }
    });


    // ============================================================
    // 8. UNLOCK BUTTON ON SCROLL & INTERACTION
    // ============================================================
    const wishSection = document.getElementById("wish-section") || document.querySelector(".wish-section");
    const selectBtn = document.getElementById("select-btn") || document.querySelector(".select-btn");

    if (wishSection && selectBtn) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    selectBtn.removeAttribute("disabled");
                    selectBtn.classList.add("unlocked");
                    selectBtn.innerText = "Открыть поздравление ✨";

                    if (window.gsap) {
                        gsap.fromTo(selectBtn,
                            { scale: 0.8, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
                        );
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(wishSection);

        selectBtn.addEventListener("click", () => {
            if (!selectBtn.classList.contains("unlocked")) return;

            selectBtn.innerText = "Выбрано! ✨";

            if (window.gsap) {
                gsap.to(selectBtn, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
            }
        });
    }


    // ============================================================
    // 9. UI INTERACTION (HOVER & CLICK FEEDBACK)
    // ============================================================
    document.querySelectorAll(".nav-cta, .arrow-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
            gsap.fromTo(
                btn,
                { scale: 1 },
                {
                    scale: 0.93,
                    duration: 0.12,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                }
            );
        });
    });

    const bigResultsWrap = document.querySelector(".big-results-wrap");
    if (bigResultsWrap) {
        bigResultsWrap.addEventListener("mouseenter", () => {
            gsap.to(".big-results .letter", {
                y: -8,
                duration: 0.5,
                stagger: 0.03,
                ease: "back.out(1.6)"
            });
        });
        bigResultsWrap.addEventListener("mouseleave", () => {
            gsap.to(".big-results .letter", {
                y: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: "elastic.out(1, 0.6)"
            });
        });
    }


    // ============================================================
    // 10. QUICK CONFETTI (Быстрое падение 2 секунды)
    // ============================================================
    function initQuickConfetti() {
        const canvas = document.getElementById("confettiCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const colors = ["#ff7d52", "#ff416c", "#8a2387", "#eecda3", "#00f2fe"];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.8) - canvas.height * 0.8,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                spin: Math.random() * 4 - 2,
                opacity: 1
            });
        }

        let animationFrameId;
        let isFadingOut = false;

        setTimeout(() => {
            isFadingOut = true;
        }, 2000);

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let visibleParticles = 0;

            particles.forEach((p) => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.spin;

                if (isFadingOut) {
                    p.opacity -= 0.015;
                }

                if (p.opacity > 0) {
                    visibleParticles++;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (visibleParticles > 0) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrameId);
            }
        }

        render();
    }

    initQuickConfetti();
});

