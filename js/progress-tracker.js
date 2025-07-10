// Progress Tracker for SIU-EM-Wizard
// Handles user progress tracking, statistics, and local storage

class ProgressTracker {
    constructor() {
        this.storageKey = 'siu-em-wizard-progress';
        this.sessionKey = 'siu-em-wizard-session';
        this.startTime = Date.now();
        this.currentSession = this.initializeSession();
        this.progress = this.loadProgress();
        this.setupAutoSave();
        this.setupTimeTracking();
    }

    // Initialize session data
    initializeSession() {
        return {
            startTime: Date.now(),
            timeSpent: 0,
            exercisesCompleted: 0,
            currentTopic: null,
            currentExercise: null
        };
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Migrate old data structure if needed
                return this.migrateProgressData(parsed);
            }
        } catch (error) {
            console.warn('Error loading progress:', error);
        }
        
        return this.getDefaultProgress();
    }

    // Get default progress structure
    getDefaultProgress() {
        return {
            version: '1.0',
            user: {
                name: null,
                level: 'beginner',
                preferences: {
                    difficulty: 'medium',
                    showHints: true,
                    autoAdvance: true
                }
            },
            statistics: {
                totalTimeSpent: 0, // in minutes
                sessionsCount: 0,
                exercisesCompleted: 0,
                correctAnswers: 0,
                totalAnswers: 0,
                averageScore: 0,
                streakCurrent: 0,
                streakBest: 0
            },
            topics: {
                'grundlagen': {
                    name: 'Grundlagen der Elektrotechnik & Mathematik',
                    totalExercises: 17,
                    completedExercises: 0,
                    exercises: {
                        'grundrechenarten': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'brueche': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'potenzen': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'gleichungen': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'ohmsches-gesetz': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'spezifischer-widerstand': { completed: 0, bestScore: 0, timeSpent: 0 },
                        'leistung-arbeit': { completed: 0, bestScore: 0, timeSpent: 0 }
                    },
                    progress: 0
                },
                'widerstandsschaltungen': {
                    name: 'Widerstandsschaltungen & Netzwerkberechnung',
                    totalExercises: 12,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'koordinaten-trigonometrie': {
                    name: 'Koordinatensysteme & Trigonometrie',
                    totalExercises: 10,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'feld-kondensatoren': {
                    name: 'Elektrisches Feld & Kondensatoren',
                    totalExercises: 8,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'magnetismus-induktivitaet': {
                    name: 'Magnetismus & Induktivitäten',
                    totalExercises: 6,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'zeitabhaengige-schaltungen': {
                    name: 'Zeitabhängige Schaltungen',
                    totalExercises: 8,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'wechselstrom': {
                    name: 'Wechselstromkreis',
                    totalExercises: 9,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                },
                'filter': {
                    name: 'Filter',
                    totalExercises: 7,
                    completedExercises: 0,
                    exercises: {},
                    progress: 0
                }
            },
            achievements: [],
            weakAreas: [],
            strengths: [],
            lastVisited: {
                topic: null,
                exercise: null,
                timestamp: null
            },
            examHistory: []
        };
    }

    // Migrate old progress data if structure changed
    migrateProgressData(data) {
        const defaultData = this.getDefaultProgress();
        
        // Merge with defaults to ensure all properties exist
        return {
            ...defaultData,
            ...data,
            statistics: { ...defaultData.statistics, ...data.statistics },
            topics: { ...defaultData.topics, ...data.topics },
            user: { ...defaultData.user, ...data.user }
        };
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    // Setup auto-save functionality
    setupAutoSave() {
        // Save every 30 seconds
        setInterval(() => {
            this.saveProgress();
        }, 30000);

        // Save when page is unloaded
        window.addEventListener('beforeunload', () => {
            this.updateTimeSpent();
            this.saveProgress();
        });

        // Save when page becomes hidden (mobile)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.updateTimeSpent();
                this.saveProgress();
            }
        });
    }

    // Setup time tracking
    setupTimeTracking() {
        // Update time every minute
        setInterval(() => {
            this.updateTimeSpent();
        }, 60000);
    }

    // Update time spent in current session
    updateTimeSpent() {
        const currentTime = Date.now();
        const sessionTime = Math.round((currentTime - this.startTime) / 1000 / 60); // minutes
        
        this.currentSession.timeSpent = sessionTime;
        this.progress.statistics.totalTimeSpent += sessionTime;
        
        // Reset start time for next interval
        this.startTime = currentTime;
    }

    // Mark exercise as completed
    markExerciseCompleted(topicName, exerciseName, score = null, timeSpent = 0) {
        if (!this.progress.topics[topicName]) {
            console.warn(`Topic ${topicName} not found`);
            return;
        }

        const topic = this.progress.topics[topicName];
        
        // Initialize exercise if not exists
        if (!topic.exercises[exerciseName]) {
            topic.exercises[exerciseName] = {
                completed: 0,
                bestScore: 0,
                timeSpent: 0
            };
        }

        const exercise = topic.exercises[exerciseName];
        
        // Update exercise data
        exercise.completed++;
        exercise.timeSpent += timeSpent;
        
        if (score !== null) {
            exercise.bestScore = Math.max(exercise.bestScore, score);
        }

        // Update topic progress
        this.updateTopicProgress(topicName);
        
        // Update statistics
        this.progress.statistics.exercisesCompleted++;
        this.currentSession.exercisesCompleted++;
        
        // Check for achievements
        this.checkAchievements(topicName, exerciseName, score);
        
        // Save progress
        this.saveProgress();
        
        // Fire custom event
        this.fireProgressEvent('exerciseCompleted', {
            topic: topicName,
            exercise: exerciseName,
            score: score
        });
    }

    // Update topic progress
    updateTopicProgress(topicName) {
        const topic = this.progress.topics[topicName];
        if (!topic) return;

        // Count completed exercises
        let completed = 0;
        Object.values(topic.exercises).forEach(exercise => {
            if (exercise.completed > 0) completed++;
        });

        topic.completedExercises = completed;
        topic.progress = Math.round((completed / topic.totalExercises) * 100);
    }

    // Record answer
    recordAnswer(topicName, exerciseName, isCorrect, difficulty = 'medium') {
        this.progress.statistics.totalAnswers++;
        
        if (isCorrect) {
            this.progress.statistics.correctAnswers++;
            this.progress.statistics.streakCurrent++;
            this.progress.statistics.streakBest = Math.max(
                this.progress.statistics.streakBest,
                this.progress.statistics.streakCurrent
            );
        } else {
            this.progress.statistics.streakCurrent = 0;
            // Add to weak areas if multiple wrong answers
            this.updateWeakAreas(topicName, exerciseName);
        }

        // Update average score
        this.progress.statistics.averageScore = Math.round(
            (this.progress.statistics.correctAnswers / this.progress.statistics.totalAnswers) * 100
        );

        this.saveProgress();
    }

    // Update weak areas
    updateWeakAreas(topicName, exerciseName) {
        const areaKey = `${topicName}-${exerciseName}`;
        const existing = this.progress.weakAreas.find(area => area.key === areaKey);
        
        if (existing) {
            existing.count++;
            existing.lastSeen = Date.now();
        } else {
            this.progress.weakAreas.push({
                key: areaKey,
                topic: topicName,
                exercise: exerciseName,
                count: 1,
                lastSeen: Date.now()
            });
        }

        // Keep only top 10 weak areas
        this.progress.weakAreas.sort((a, b) => b.count - a.count);
        this.progress.weakAreas = this.progress.weakAreas.slice(0, 10);
    }

    // Update last visited
    updateLastVisited(topicName, exerciseName = null) {
        this.progress.lastVisited = {
            topic: topicName,
            exercise: exerciseName,
            timestamp: Date.now()
        };

        this.currentSession.currentTopic = topicName;
        this.currentSession.currentExercise = exerciseName;
        
        this.saveProgress();
    }

    // Check for achievements
    checkAchievements(topicName, exerciseName, score) {
        const achievements = [];

        // First completion achievements
        if (this.progress.statistics.exercisesCompleted === 1) {
            achievements.push({
                id: 'first_exercise',
                name: 'Erste Schritte',
                description: 'Erste Übung abgeschlossen!',
                icon: '🎯',
                timestamp: Date.now()
            });
        }

        // Perfect score achievements
        if (score === 100) {
            achievements.push({
                id: 'perfect_score',
                name: 'Perfekt!',
                description: '100% in einer Übung erreicht!',
                icon: '⭐',
                timestamp: Date.now()
            });
        }

        // Streak achievements
        if (this.progress.statistics.streakCurrent === 10) {
            achievements.push({
                id: 'streak_10',
                name: 'Auf der Siegerstraße',
                description: '10 richtige Antworten in Folge!',
                icon: '🔥',
                timestamp: Date.now()
            });
        }

        // Topic completion achievements
        const topic = this.progress.topics[topicName];
        if (topic && topic.progress === 100) {
            achievements.push({
                id: `topic_${topicName}`,
                name: `${topic.name} Meister`,
                description: `Alle Übungen in ${topic.name} abgeschlossen!`,
                icon: '🏆',
                timestamp: Date.now()
            });
        }

        // Add new achievements
        achievements.forEach(achievement => {
            if (!this.progress.achievements.find(a => a.id === achievement.id)) {
                this.progress.achievements.push(achievement);
                this.showAchievementNotification(achievement);
            }
        });
    }

    // Show achievement notification
    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <h4>Erfolg freigeschaltet!</h4>
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #E31E24, #ff4757);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(227, 30, 36, 0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.5s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    // Get topic progress
    getTopicProgress(topicName) {
        return this.progress.topics[topicName] || null;
    }

    // Get overall progress
    getOverallProgress() {
        const topics = Object.values(this.progress.topics);
        const totalExercises = topics.reduce((sum, topic) => sum + topic.totalExercises, 0);
        const completedExercises = topics.reduce((sum, topic) => sum + topic.completedExercises, 0);
        
        return {
            percentage: Math.round((completedExercises / totalExercises) * 100),
            completed: completedExercises,
            total: totalExercises
        };
    }

    // Get statistics
    getStatistics() {
        return {
            ...this.progress.statistics,
            currentSession: this.currentSession
        };
    }

    // Get weak areas
    getWeakAreas() {
        return this.progress.weakAreas.slice(0, 5); // Top 5
    }

    // Get achievements
    getAchievements() {
        return this.progress.achievements.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Reset progress
    resetProgress() {
        if (confirm('Möchten Sie wirklich den gesamten Fortschritt zurücksetzen?')) {
            this.progress = this.getDefaultProgress();
            this.saveProgress();
            window.location.reload();
        }
    }

    // Export progress data
    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `siu-em-wizard-progress-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import progress data
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.progress = this.migrateProgressData(importedData);
                this.saveProgress();
                alert('Fortschritt erfolgreich importiert!');
                window.location.reload();
            } catch (error) {
                alert('Fehler beim Importieren der Daten: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Fire custom progress events
    fireProgressEvent(eventType, data) {
        const event = new CustomEvent('emWizardProgress', {
            detail: {
                type: eventType,
                data: data,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }

    // Update UI elements with progress
    updateProgressUI() {
        // Update progress bars on main page
        Object.keys(this.progress.topics).forEach(topicName => {
            const topicCard = document.querySelector(`[data-topic="${topicName}"]`);
            if (topicCard) {
                const topic = this.progress.topics[topicName];
                const progressBar = topicCard.querySelector('.progress-fill');
                const progressText = topicCard.querySelector('.progress-text');
                
                if (progressBar) {
                    progressBar.style.width = `${topic.progress}%`;
                }
                if (progressText) {
                    progressText.textContent = `${topic.completedExercises}/${topic.totalExercises}`;
                }
            }
        });

        // Update overall statistics
        const stats = this.getStatistics();
        const overallProgress = this.getOverallProgress();
        
        const statElements = document.querySelectorAll('.progress-stat h3');
        if (statElements.length >= 2) {
            statElements[0].textContent = stats.exercisesCompleted;
            statElements[1].textContent = `${overallProgress.percentage}%`;
        }
    }
}

// Create CSS for achievement notifications
const achievementCSS = `
.achievement-notification .achievement-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.achievement-notification .achievement-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.achievement-notification .achievement-text h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.achievement-notification .achievement-text h3 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    font-weight: bold;
}

.achievement-notification .achievement-text p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
}
`;

// Add CSS to document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = achievementCSS;
    document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTracker;
} else {
    window.ProgressTracker = ProgressTracker;
}

// Create global instance
if (typeof window !== 'undefined') {
    window.progressTracker = new ProgressTracker();
}