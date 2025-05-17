$(document).ready(function() {
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
});

// Fetch projects from GitHub
async function fetchProjects() {
    try {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) {
            throw new Error('Projects container not found');
        }
        projectsContainer.innerHTML = '';

        // Список репозиторіїв
        const repos = [
            { name: 'Minecraft-Bank', url: 'https://github.com/nether1203/Minecraft-Bank' },
            { name: 'fakestore', url: 'https://github.com/nether1203/fakestore' },
            { name: 'Portfolio', url: 'https://github.com/nether1203/Portfolio' }
        ];

        // Функція для отримання зображення з репозиторію
        async function getRepoImage(repo) {
            try {
                // Отримуємо список файлів з репозиторію
                const filesResponse = await fetch(`https://api.github.com/repos/nether1203/${repo.name}/contents`);
                if (!filesResponse.ok) return null;
                
                const files = await filesResponse.json();
                
                // Шукаємо зображення в директорії screenshots
                const imageFile = files.find(file => 
                    file.type === 'file' && 
                    (file.name.toLowerCase().endsWith('.png') || 
                     file.name.toLowerCase().endsWith('.jpg') || 
                     file.name.toLowerCase().endsWith('.jpeg')) &&
                    (file.name.toLowerCase().includes('screenshot') || 
                     file.name.toLowerCase().includes('demo') || 
                     file.name.toLowerCase().includes('preview'))
                );

                if (imageFile) {
                    // Повертаємо URL до зображення
                    return `https://raw.githubusercontent.com/nether1203/${repo.name}/main/screenshots/${imageFile.name}`;
                }

                // Якщо не знайдено зображення в screenshots, шукаємо в корені
                const anyImage = files.find(file => 
                    file.type === 'file' && 
                    (file.name.toLowerCase().endsWith('.png') || 
                     file.name.toLowerCase().endsWith('.jpg') || 
                     file.name.toLowerCase().endsWith('.jpeg'))
                );

                if (anyImage) {
                    return `https://raw.githubusercontent.com/nether1203/${repo.name}/main/${anyImage.name}`;
                }

                return null;
            } catch (error) {
                console.error(`Error fetching images for ${repo.name}:`, error);
                return null;
            }
        }

        // Отримуємо зображення для кожного репозиторію
        const projects = await Promise.all(repos.map(async (repo) => {
            const imageUrl = await getRepoImage(repo);
            return {
                name: repo.name,
                description: repo.name === 'Minecraft-Bank' ? 'Банк для Minecraft сервера' :
                              repo.name === 'fakestore' ? 'Портфоліо з фейковим магазином' :
                              'Мій персональний портфоліо',
                imageUrl: imageUrl || 'https://placehold.co/300x200/2ecc71/ffffff?text=No%20Image',
                stars: 5,
                forks: 3,
                url: repo.url
            };
        }));

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.name} screenshot" loading="lazy">
                </div>
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-details">
                    <span><i class="fas fa-star"></i> ${project.stars} stars</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks} forks</span>
                    <a href="${project.url}" target="_blank" class="project-link">View on GitHub</a>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}


// Call fetchProjects when the page loads
window.addEventListener('load', fetchProjects);

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    themeToggle.innerHTML = body.classList.contains('dark-theme') 
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        document.querySelector('.navbar').classList.add('active');
    } else if (currentScroll < lastScroll && currentScroll < 100) {
        document.querySelector('.navbar').classList.remove('active');
    }
    
    lastScroll = currentScroll;
});

// Experience counter animation
const experienceCounter = document.querySelector('.experience-counter');
let currentCount = 0;
let targetCount = parseFloat(experienceCounter.getAttribute('data-target'));

function updateCounter() {
    const steps = 100; // 100 кроків за 1 секунду
    const increment = targetCount / steps;
    currentCount += increment;
    
    if (currentCount <= targetCount) {
        experienceCounter.textContent = currentCount.toFixed(1);
        setTimeout(updateCounter, 10); // 10 мс = 100 кроків за 1 секунду
    } else {
        experienceCounter.textContent = targetCount.toFixed(1);
    }
}

// Start counter when element is in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateCounter();
            updateSkillCounters();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.querySelector('.experience-counter'));

// Update skill counters when cards are hovered
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', updateSkillCounters);
});

function updateSkillCounters() {
    const skillYears = document.querySelectorAll('.skill-years');
    skillYears.forEach(year => {
        const target = parseFloat(year.dataset.target);
        let current = 0;
        const steps = 100; // 100 кроків за 1 секунду
        const increment = target / steps;
        
        const update = () => {
            if (current < target) {
                current += increment;
                year.textContent = current.toFixed(1);
                setTimeout(update, 10); // 10 мс = 100 кроків за 1 секунду
            } else {
                year.textContent = target.toFixed(1);
            }
        };
        
        update();
    });
}