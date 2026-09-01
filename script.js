/* =========================================================
   MIS XV AÑOS - STEFANI MICHEL
   LÓGICA INTERACTIVA & EXPERIENCIA MULTIMEDIA
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    setupEnvelope();
    setupAudio();
});

/* =========================================================
   1. APERTURA DE SOBRE DE LUJO
   ========================================================= */

function setupEnvelope() {
    const envelope = document.getElementById('envelope-box');
    const sealBtn = document.getElementById('wax-seal-btn');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const musicController = document.getElementById('music-controller');

    function openEnvelopeAction() {
        if (envelope.classList.contains('open')) return;
        
        envelope.classList.add('open');
        playChimeSound();
        createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2);

        // Iniciar música automáticamente al interactuar
        toggleAudio(true);

        setTimeout(() => {
            envelopeScreen.classList.add('opened');
            mainContent.classList.remove('hidden');
            musicController.classList.remove('hidden');
            
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 100);
        }, 1500);
    }

    if (sealBtn) sealBtn.addEventListener('click', openEnvelopeAction);
    if (envelope) envelope.addEventListener('click', openEnvelopeAction);
}

/* =========================================================
   2. CUENTA REGRESIVA INTELIGENTE
   ========================================================= */

function initCountdown() {
    // Calculamos el próximo 12 de septiembre (a las 20:00 / 8:00 PM)
    const now = new Date();
    let currentYear = now.getFullYear();
    let targetDate = new Date(currentYear, 8, 12, 20, 0, 0); // Mes 8 = Septiembre

    // Si la fecha ya pasó este año, apunta al siguiente año
    if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(currentYear + 1, 8, 12, 20, 0, 0);
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const difference = targetDate.getTime() - currentTime;

        if (difference <= 0) {
            document.getElementById('cd-days').textContent = '00';
            document.getElementById('cd-hours').textContent = '00';
            document.getElementById('cd-minutes').textContent = '00';
            document.getElementById('cd-seconds').textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* =========================================================
   3. PARTÍCULAS DORADAS FLOTANTES (CANVAS)
   ========================================================= */

let sparklesList = [];

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = window.innerWidth < 600 ? 35 : 70;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.2 + 0.6,
            speedY: Math.random() * 0.4 + 0.15,
            speedX: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.7 + 0.3,
            fadeSpeed: Math.random() * 0.015 + 0.005,
            fadeDirection: Math.random() > 0.5 ? 1 : -1,
            color: Math.random() > 0.3 ? '#f9e076' : '#d4af37'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar partículas base
        particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;

            p.alpha += p.fadeSpeed * p.fadeDirection;
            if (p.alpha > 0.9) { p.alpha = 0.9; p.fadeDirection = -1; }
            if (p.alpha < 0.2) { p.alpha = 0.2; p.fadeDirection = 1; }

            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#d4af37';
            ctx.fill();
        });

        // Dibujar destellos especiales (burst)
        for (let i = sparklesList.length - 1; i >= 0; i--) {
            const sp = sparklesList[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.08; // gravedad
            sp.alpha -= 0.02;

            if (sp.alpha <= 0) {
                sparklesList.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = sp.alpha;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#fff';
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    animate();
}

function createSparkleBurst(x, y) {
    for (let i = 0; i < 65; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        sparklesList.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5,
            size: Math.random() * 3.5 + 1.5,
            alpha: 1,
            color: ['#ffffff', '#fff7c2', '#ffd700', '#d4af37', '#7efcd6', '#a7f3d0'][Math.floor(Math.random() * 6)]
        });
    }
}

/* =========================================================
   4. SISTEMA DE AUDIO (VALS AMBIENTAL SINTETIZADO / MP3)
   ========================================================= */

let audioCtx = null;
let isPlaying = false;
let synthInterval = null;
let customAudio = null;

function setupAudio() {
    const musicBtn = document.getElementById('music-btn');
    if (!musicBtn) return;

    // Probar primero en raíz 'musica.mp3' y con fallback a 'assets/musica.mp3'
    customAudio = new Audio('musica.mp3');
    customAudio.loop = true;
    customAudio.volume = 0.6;
    customAudio.addEventListener('error', () => {
        if (customAudio && customAudio.src && !customAudio.src.includes('assets/')) {
            customAudio.src = 'assets/musica.mp3';
        }
    });

    musicBtn.addEventListener('click', () => {
        toggleAudio();
    });
}

function toggleAudio(forcePlay = false) {
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');

    if (forcePlay) {
        isPlaying = false; // Forzamos arranque
    }

    if (!isPlaying) {
        // Intentar reproducir audio si existe
        if (customAudio) {
            customAudio.play().then(() => {
                isPlaying = true;
                updateAudioUI(true);
            }).catch(() => {
                // Si no hay archivo mp3, arrancar sintetizador waltz
                startSynthesizedWaltz();
                isPlaying = true;
                updateAudioUI(true);
            });
        } else {
            startSynthesizedWaltz();
            isPlaying = true;
            updateAudioUI(true);
        }
    } else {
        // Pausar
        if (customAudio) customAudio.pause();
        stopSynthesizedWaltz();
        isPlaying = false;
        updateAudioUI(false);
    }
}

function updateAudioUI(playing) {
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    if (!musicBtn) return;

    if (playing) {
        musicBtn.classList.remove('paused');
        musicIcon.className = 'fas fa-volume-up';
    } else {
        musicBtn.classList.add('paused');
        musicIcon.className = 'fas fa-volume-mute';
    }
}

// Sintetizador acústico estilo arpa/vals de XV años con Web Audio API
function startSynthesizedWaltz() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Notas de un vals clásico suave (Frecuencias)
    const melodyNotes = [
        523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
        587.33, 698.46, 880.00, 1174.66, // D5, F5, A5, D6
        493.88, 659.25, 783.99, 987.77,  // B4, E5, G5, B5
        523.25, 659.25, 783.99, 1046.50  // C5, E5, G5, C6
    ];

    let noteIndex = 0;

    synthInterval = setInterval(() => {
        if (!isPlaying || !audioCtx) return;
        playSynthesizedPluck(melodyNotes[noteIndex % melodyNotes.length]);
        noteIndex++;
    }, 450);
}

function stopSynthesizedWaltz() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

function playSynthesizedPluck(freq) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
    } catch(e) {}
}

function playChimeSound() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const chimes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimes.forEach((freq, idx) => {
        setTimeout(() => {
            playSynthesizedPluck(freq * 1.5);
        }, idx * 100);
    });
}

/* =========================================================
   5. AGENDAR EN CALENDARIO (GOOGLE CALENDAR / .ICS)
   ========================================================= */

function addToCalendar(eventType) {
    const currentYear = new Date().getFullYear();
    let title = "";
    let details = "";
    let location = "";
    let startDate = "";
    let endDate = "";

    if (eventType === 'misa') {
        title = "Santa Misa de Acción de Gracias - XV Años Stefani Michel";
        details = "Misa de Acción de Gracias por los 15 Años de Stefani Michel. Padres: Manuel Bonilla y Jhoana Luna.";
        location = "Iglesia Santa Rosa de Lima";
        // 6 de Septiembre a las 8:30 PM (20:30)
        startDate = `${currentYear}0906T203000`;
        endDate = `${currentYear}0906T220000`;
    } else {
        title = "Mis XV Años - Gran Fiesta Stefani Michel";
        details = "Celebración de los 15 Años de Stefani Michel. Recepción en casa de sus abuelos. ¡Lluvia de Sobres!";
        location = "Casa de mis Abuelos, Calle 7 Barrio Bolivariano";
        // 12 de Septiembre 8:00 PM (20:00) a 03:00 AM día siguiente
        startDate = `${currentYear}0912T200000`;
        endDate = `${currentYear}0913T030000`;
    }

    // URL para Google Calendar
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    window.open(googleCalUrl, '_blank');
}

/* =========================================================
   6. COMPARTIR INVITACIÓN & COPIAR ENLACE
   ========================================================= */

function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: '¡Mis XV Años! - Stefani Michel',
            text: 'Te invito cordialmente a celebrar mis 15 años el 12 de Septiembre. ¡Acompáñame!',
            url: window.location.href
        }).catch(() => {});
    } else {
        copyInvitationLink();
    }
}

function copyInvitationLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('✨ ¡Enlace de la invitación copiado al portapapeles! Ya puedes enviarlo por WhatsApp a tus invitados.');
    }).catch(() => {
        prompt('Copia este enlace para compartir:', url);
    });
}
