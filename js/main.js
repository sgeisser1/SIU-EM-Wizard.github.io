// SIU-EM-Wizard Main JavaScript
// Handles navigation, UI interactions, and core functionality

class EMWizard {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
        this.loadUserProgress();
        this.updateProgressDisplay();
    }

    initializeApp() {
        // Initialize MathJax for LaTeX rendering
        if (window.MathJax) {
            MathJax.typesetPromise();
        }

        // Set up navigation
        this.setupNavigation();
        
        // Initialize progress tracking
        this.progressTracker = window.progressTracker || new ProgressTracker();
        
        // Initialize math solver
        this.mathSolver = window.mathSolver || new MathSolver();
        
        console.log('SIU-EM-Wizard initialized successfully');
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active navigation based on scroll position
        this.updateActiveNavigation();
    }

    setupEventListeners() {
        // Handle window events
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle quick access cards
        this.setupQuickAccessCards();
        
        // Listen for progress events
        window.addEventListener('emWizardProgress', (event) => {
            this.handleProgressEvent(event.detail);
        });
    }

    setupQuickAccessCards() {
        const cards = document.querySelectorAll('.quick-card');
        cards.forEach(card => {
            card.addEventListener('click', function() {
                const icon = this.querySelector('.card-icon').textContent;
                switch (icon) {
                    case '🎲':
                        openRandomExercise();
                        break;
                    case '📖':
                        continueLastTopic();
                        break;
                    case '🎯':
                        showWeakAreas();
                        break;
                    case '📝':
                        openPracticeExam();
                        break;
                }
            });
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    loadUserProgress() {
        // Progress is loaded automatically by ProgressTracker
        this.userProgress = this.progressTracker.progress;
    }

    saveUserProgress() {
        this.progressTracker.saveProgress();
    }

    updateProgressDisplay() {
        // Update progress indicators on the main page
        this.updateTopicProgressBars();
        this.updateOverallStats();
    }

    updateTopicProgressBars() {
        const topics = [
            'grundlagen', 'widerstandsschaltungen', 'koordinaten-trigonometrie',
            'feld-kondensatoren', 'magnetismus-induktivitaet', 'zeitabhaengige-schaltungen',
            'wechselstrom', 'filter'
        ];

        topics.forEach(topic => {
            const topicCard = document.querySelector(`[data-topic="${topic}"]`);
            if (topicCard) {
                const progressBar = topicCard.querySelector('.progress-fill');
                const progressText = topicCard.querySelector('.progress-text');
                
                const topicData = this.progressTracker.getTopicProgress(topic);
                if (topicData) {
                    const percentage = topicData.progress;
                    
                    if (progressBar) {
                        progressBar.style.width = `${percentage}%`;
                    }
                    if (progressText) {
                        progressText.textContent = `${topicData.completedExercises}/${topicData.totalExercises}`;
                    }
                }
            }
        });
    }

    updateOverallStats() {
        const statsElements = document.querySelectorAll('.progress-stat h3');
        const stats = this.progressTracker.getStatistics();
        const overallProgress = this.progressTracker.getOverallProgress();
        
        if (statsElements.length >= 2) {
            statsElements[0].textContent = stats.exercisesCompleted;
            statsElements[1].textContent = `${overallProgress.percentage}%`;
        }
    }

    handleProgressEvent(eventData) {
        // Handle progress events and update UI accordingly
        switch (eventData.type) {
            case 'exerciseCompleted':
                this.updateProgressDisplay();
                break;
            case 'achievementUnlocked':
                // Achievement notification is handled by ProgressTracker
                break;
        }
    }

    // Public methods for exercises
    markExerciseCompleted(topicName, exerciseName, score = null) {
        this.progressTracker.markExerciseCompleted(topicName, exerciseName, score);
        this.updateProgressDisplay();
    }

    recordAnswer(topicName, exerciseName, isCorrect, difficulty = 'medium') {
        this.progressTracker.recordAnswer(topicName, exerciseName, isCorrect, difficulty);
    }

    updateLastTopic(url) {
        // Extract topic and exercise from URL
        const urlParts = url.split('/');
        if (urlParts.length >= 2) {
            const fileName = urlParts[urlParts.length - 1];
            const topicName = urlParts[urlParts.length - 2];
            const exerciseName = fileName.replace('.html', '');
            
            this.progressTracker.updateLastVisited(topicName, exerciseName);
        }
    }
}

// Global functions for UI interactions
function startLearning() {
    const exercisesSection = document.getElementById('exercises');
    if (exercisesSection) {
        exercisesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showProgress() {
    const progressSection = document.getElementById('progress');
    if (progressSection) {
        progressSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openRandomExercise() {
    const topics = [
        'grundlagen', 'widerstandsschaltungen', 'koordinaten-trigonometrie',
        'feld-kondensatoren', 'magnetismus-induktivitaet', 'zeitabhaengige-schaltungen',
        'wechselstrom', 'filter'
    ];
    
    const subtopics = {
        'grundlagen': ['grundrechenarten', 'brueche', 'potenzen', 'gleichungen', 'ohmsches-gesetz', 'spezifischer-widerstand', 'leistung-arbeit'],
        'widerstandsschaltungen': ['serie-parallel', 'gemischte-schaltungen', 'spannungsteiler', 'brueckenschaltungen', 'kirchhoff'],
        'koordinaten-trigonometrie': ['koordinatensysteme', 'trigonometrie', 'winkelberechnungen', 'pythagoras'],
        'feld-kondensatoren': ['elektrisches-feld', 'kondensatoren', 'kapazitaet'],
        'magnetismus-induktivitaet': ['magnetfeld', 'induktionsgesetz', 'induktivitaeten'],
        'zeitabhaengige-schaltungen': ['exponentialfunktionen', 'rc-schaltungen', 'lade-entlade'],
        'wechselstrom': ['wirk-blindwiderstand', 'reaktive-elemente', 'leistung'],
        'filter': ['hoch-tiefpass', 'bode-diagramm', 'grenzfrequenz']
    };
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomSubtopic = subtopics[randomTopic][Math.floor(Math.random() * subtopics[randomTopic].length)];
    
    window.location.href = `exercises/${randomTopic}/${randomSubtopic}.html`;
}

function continueLastTopic() {
    if (window.emWizard && window.emWizard.progressTracker) {
        const lastVisited = window.emWizard.progressTracker.progress.lastVisited;
        if (lastVisited.topic && lastVisited.exercise) {
            window.location.href = `exercises/${lastVisited.topic}/${lastVisited.exercise}.html`;
            return;
        }
    }
    
    // Fallback to basics if no last topic
    window.location.href = 'exercises/grundlagen/grundrechenarten.html';
}

function showWeakAreas() {
    if (window.emWizard && window.emWizard.progressTracker) {
        const weakAreas = window.emWizard.progressTracker.getWeakAreas();
        if (weakAreas.length > 0) {
            const weakest = weakAreas[0];
            window.location.href = `exercises/${weakest.topic}/${weakest.exercise}.html`;
            return;
        }
    }
    
    // Show success message if no weak areas
    showNotification('Großartig! Sie haben keine erkennbaren Schwächen. Weiter so!', 'success');
}

function openPracticeExam() {
    // Placeholder for practice exams
    showNotification('Musterprüfungen kommen bald!', 'info');
}

function startTopic(topicName) {
    const topicUrls = {
        'grundlagen': 'exercises/grundlagen/grundrechenarten.html',
        'widerstandsschaltungen': 'exercises/widerstandsschaltungen/serie-parallel.html',
        'koordinaten-trigonometrie': 'exercises/koordinaten-trigonometrie/koordinatensysteme.html',
        'feld-kondensatoren': 'exercises/feld-kondensatoren/elektrisches-feld.html',
        'magnetismus-induktivitaet': 'exercises/magnetismus-induktivitaet/magnetfeld.html',
        'zeitabhaengige-schaltungen': 'exercises/zeitabhaengige-schaltungen/exponentialfunktionen.html',
        'wechselstrom': 'exercises/wechselstrom/wirk-blindwiderstand.html',
        'filter': 'exercises/filter/hoch-tiefpass.html'
    };
    
    const url = topicUrls[topicName];
    if (url) {
        window.location.href = url;
    }
}

function viewTheory(topicName) {
    window.location.href = `theory/${topicName}.html`;
}

function startExam(examNumber) {
    window.location.href = `practice-exams/muster-pruefung-${examNumber}.html`;
}

function viewSolution(examNumber) {
    window.location.href = `practice-exams/solutions/muster-loesung-${examNumber}.html`;
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatMath(expression) {
    // Helper function to format mathematical expressions for MathJax
    return `\\(${expression}\\)`;
}

function formatDisplayMath(expression) {
    // Helper function to format display mathematical expressions for MathJax
    return `\\[${expression}\\]`;
}

// Mathematical helper functions for exercises
function validateAnswer(userAnswer, correctAnswer, tolerance = 0.001) {
    if (typeof userAnswer !== 'number' || typeof correctAnswer !== 'number') {
        return userAnswer === correctAnswer;
    }
    return Math.abs(userAnswer - correctAnswer) <= tolerance;
}

function formatNumber(number, decimals = 3) {
    if (typeof number !== 'number' || isNaN(number)) {
        return number;
    }
    
    // Remove trailing zeros
    let formatted = number.toFixed(decimals);
    formatted = formatted.replace(/\.?0+$/, '');
    return formatted;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for other scripts to load
    setTimeout(() => {
        window.emWizard = new EMWizard();
        
        // Show welcome message for first-time users
        if (!localStorage.getItem('em-wizard-visited')) {
            setTimeout(() => {
                showNotification('Willkommen beim SIU-EM-Wizard! Viel Erfolg beim Lernen!', 'success');
                localStorage.setItem('em-wizard-visited', 'true');
            }, 1000);
        }
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMWizard };
}