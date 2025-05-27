document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 1000);
    });

    const navLinks = document.querySelectorAll('.navbar a');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = (getComputedStyle(navbar).position === 'relative' || window.innerWidth <= 768) ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal-text');
    const soulsCounter = document.getElementById('souls-collected');
    const levelCounter = document.getElementById('traveler-level');
    let souls = 0;
    let level = 1;
    let revealedSectionsForSouls = new Set();
    const sections = document.querySelectorAll('.content-section, .parallax-section, footer'); // Добавил footer в sections для точного определения последней активной

    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const navbarHeight = (getComputedStyle(navbar).position === 'relative' || window.innerWidth <= 768) ? navbar.offsetHeight : 0;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add('visible');
                const parentSection = el.closest('.content-section, .parallax-section');
                if (parentSection && parentSection.id && !revealedSectionsForSouls.has(parentSection.id)) {
                    revealedSectionsForSouls.add(parentSection.id);
                    souls += 10;
                    soulsCounter.textContent = souls;
                    if (souls > 0 && souls % 50 === 0) {
                        level++;
                        levelCounter.textContent = level;
                    }
                }
            }
        });

        let currentSectionId = '';
        let minDistanceToTop = Infinity;

        sections.forEach(section => {
            const sectionRect = section.getBoundingClientRect();
            // Секция считается активной, если ее верхняя часть (или она сама, если короче навбара) ближе всего к верху видимой области (с учетом навбара)
            // и при этом она хотя бы частично видна.
            
            const distanceToViewportTop = Math.abs(sectionRect.top - navbarHeight);

            if (sectionRect.top < windowHeight && sectionRect.bottom > navbarHeight) { // Секция частично видна
                 if (sectionRect.top <= navbarHeight + 50) { // Если верх секции выше или немного ниже навбара
                    if (distanceToViewportTop < minDistanceToTop) {
                        minDistanceToTop = distanceToViewportTop;
                        currentSectionId = section.getAttribute('id');
                    }
                 }
            }
        });
        
        // Особый случай для футера или очень короткой последней секции
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
            const lastContentSection = document.querySelector('.main-content > section:last-of-type');
            if (lastContentSection) {
                currentSectionId = lastContentSection.id;
            }
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        if (!currentSectionId && navLinks.length > 0) {
             const homeLink = document.querySelector('.navbar a[href="#home"]');
             if (homeLink && !homeLink.classList.contains('active')) {
                navLinks.forEach(l => l.classList.remove('active'));
                homeLink.classList.add('active');
             }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const themeSwitcher = document.getElementById('themeSwitcher');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    let currentTheme = localStorage.getItem('theme');
    if (currentTheme === null) {
        currentTheme = prefersDarkScheme.matches ? "dark" : "light";
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    themeSwitcher.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeSwitcher.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            theme = 'light';
            themeSwitcher.textContent = '🌙';
        } else {
            theme = 'dark';
            themeSwitcher.textContent = '☀️';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    const easterEggTrigger = document.getElementById('easterEggTrigger');
    const easterEggMessage = document.getElementById('easterEggMessage');
    if(easterEggTrigger && easterEggMessage) {
        easterEggTrigger.addEventListener('click', () => {
            const isVisible = easterEggMessage.style.display === 'block';
            easterEggMessage.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                 souls += 50;
                 soulsCounter.textContent = souls;
                  if (souls > 0 && souls % 50 === 0) {
                    level++;
                    levelCounter.textContent = level;
                  }
            }
        });
    }

    const interactiveDemos = document.querySelectorAll('.interactive-background-demo'); // Изменено на querySelectorAll
    interactiveDemos.forEach(interactiveDemo => { // Цикл для каждого такого блока
        if (interactiveDemo) {
            interactiveDemo.addEventListener('mousemove', (e) => {
                const rect = interactiveDemo.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                let color1 = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();
                let color2 = getComputedStyle(document.documentElement).getPropertyValue('--secondary-bg-color').trim();
                interactiveDemo.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, ${color1} 0%, ${color2} 100%)`;
            });
            interactiveDemo.addEventListener('mouseleave', () => {
                let color1 = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();
                let color2 = getComputedStyle(document.documentElement).getPropertyValue('--secondary-bg-color').trim();
                interactiveDemo.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
            });
        }
    });
    
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});