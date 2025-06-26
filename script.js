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
        const username = 'nether1203';
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        // Get repositories
        const bankRepo = repos.find(repo => repo.name === 'Minecraft-Bank');
        const facestoreRepo = repos.find(repo => repo.name === 'fakestore');
        const portfolioRepo = repos.find(repo => repo.name === 'Money-Rusher');

        // Process repositories
        const reposToShow = [bankRepo, facestoreRepo, portfolioRepo].filter(repo => repo !== undefined);

        if (reposToShow.length > 0) {
            await Promise.all(reposToShow.map(async (repo) => {
                try {
                    // Get README content if exists
                    let imageUrl = null;
                    try {
                        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents/README.md`);
                        
                        
                        if (readmeResponse.ok) {
                            const readmeData = await readmeResponse.json();
                            const readmeContent = atob(readmeData.content);
                            const imageRegex = /!\[.*?\]\((.*?)\)/;
                            const match = readmeContent.match(imageRegex);
                            imageUrl = match ? match[1] : null;
                            console.log(readmeContent);
                        }
                    } catch (e) {
                        console.log(`No README found for ${repo.name}`);
                    }

                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    projectCard.innerHTML = `
                        <div class="project-image">
                            <img src="${imageUrl || 'https://via.placeholder.com/300x200'}" alt="${repo.name} screenshot" loading="lazy">
                        </div>
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description provided'}</p>
                        <div class="project-details">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count} stars</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count} forks</span>
                            <a href="${repo.html_url}" target="_blank" class="project-link">View on GitHub</a>
                        </div>
                    `;
                    projectsContainer.appendChild(projectCard);
                } catch (error) {
                    console.error(`Error processing ${repo.name}:`, error);
                }
            }));
        } else {
            projectsContainer.innerHTML = '<p>No repositories found.</p>';
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        const projectsContainer = document.getElementById('projects-container');
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
    currentCount += 0.01;
    if (currentCount <= targetCount) {
        experienceCounter.textContent = currentCount.toFixed(1);
        requestAnimationFrame(updateCounter);
    }
}

// Start counter when element is in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(experienceCounter);


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