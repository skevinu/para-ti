document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const invitationCard = document.getElementById('invitation-card');
    const confettiContainer = document.getElementById('confetti-container');
    const lyricsCard = document.getElementById('lyrics-card'); // Tarjeta de letra
    const lyricsLine = document.getElementById('lyrics-line'); // Línea de texto
    const fireworksContainer = document.getElementById('fireworks-container'); // Contenedor de fuegos artificiales
    const clickSound = new Audio('Cine Contigo.mp3');

    let isOpened = false;
    let currentLyricIndex = -1;
    let lyricChangeCount = 0; // Contador para los efectos
    const moods = ['intro', 'verse', 'special', 'chorus', 'bridge', 'outro', 'romantic', 'passionate']; // Ciclo de moods
    let moodIndex = 0;

    // --- MEJORA: Letra con "moods" para cambiar colores ---
    const lyrics = [
        { time: 0.74, text: "Mira, tengo dos boletos porque quiero escaparnos,", mood: 'intro' },
        { time: 3.72, text: "que se apague el mundo un rato y solo quedarnos," },
        { time: 7.43, text: "no es por la película ni por matar el tiempo,", mood: 'verse' },
        { time: 12.63, text: "es por verte de perfil cuando sonríes lento,", mood: 'special' },
        { time: 16.35, text: "sé que contigo todo sabe diferente,", mood: 'verse' },
        { time: 20.06, text: "hasta lo más sencillo se vuelve suficiente." },
        { time: 24.52, text: "No tengo que ensayar la forma en que te lo digo,", mood: 'intro' },
        { time: 28.24, text: "porque contigo yo siempre he sido yo mismo," },
        { time: 32.69, text: "y resulta que es viernes, que hay función otra vez,", mood: 'special' },
        { time: 37.15, text: "y resulta que contigo todo se me ve bien," },
        { time: 40.87, text: "y resulta que tu risa en una sala oscura", mood: 'verse' },
        { time: 46.07, text: "me cura cualquier semana dura." },
        { time: 49.04, text: "Así que ven al cine conmigo,", mood: 'chorus' },
        { time: 53.5, text: "este viernes cuando caiga el sol," },
        { time: 57.21, text: "no prometo que la peli sea perfecta," },
        { time: 61.67, text: "pero sí que el plan será mejor contigo y yo,", mood: 'special' },
        { time: 66.87, text: "palomitas con hielo loco entre risas," },
        { time: 70.59, text: "tu cabeza recostada aquí cerquita," },
        { time: 75.05, text: "no es sorpresa, esto ya es nuestro ritual," },
        { time: 78.76, text: "pero contigo todo siempre se siente especial.", mood: 'chorus' },
        { time: 85.45, text: "Podemos fingir que seguimos la trama", mood: 'verse' },
        { time: 89.16, text: "mientras tu mano se busca con la mía en calma," },
        { time: 92.88, text: "yo hago que miro la pantalla normal" },
        { time: 96.6, text: "pero mi atención siempre termina en ti al final,", mood: 'special' },
        { time: 101.05, text: "y sí, puede ser simple, puede ser repetido," },
        { time: 105.51, text: "pero contigo hasta lo mismo suena distinto." },
        { time: 109.97, text: "Así que ven al cine conmigo,", mood: 'chorus' },
        { time: 114.43, text: "que contigo cualquier peli es mejor," },
        { time: 118.14, text: "no importa si es drama, si es risa o acción," },
        { time: 122.6, text: "si tu risa suena al lado mío en la función,", mood: 'special' },
        { time: 127.8, text: "palomitas con hielo loco compartido," },
        { time: 130.77, text: "tu hombro siendo mi mejor escondido," },
        { time: 135.23, text: "no es casualidad, es elección," },
        { time: 138.21, text: "tú eres mi plan favorito, sin discusión.", mood: 'chorus' },
        { time: 144.15, text: "Y si apagan las luces y el tiempo se frena,", mood: 'bridge' },
        { time: 147.12, text: "y el mundo afuera por un rato no suena," },
        { time: 151.58, text: "dame la mano como ya sabes hacer," },
        { time: 155.3, text: "que contigo siempre elijo quedarme otra vez." },
        { time: 160.5, text: "Viernes por la tarde, sala tres,", mood: 'outro' },
        { time: 164.21, text: "tú, yo, y esa paz que solo tú me das," },
        { time: 168.67, text: "no importa la peli, no importa el final," },
        { time: 173.13, text: "si al salir seguimos juntos un rato más," },
        { time: 180.56, text: "porque mi parte favorita del plan" },
        { time: 185.02, text: "no empieza en la pantalla…" },
        { time: 187.25, text: "empieza cuando tú llegas.", mood: 'special' },
        { time: 192.0, text: "" } // Limpiar al final
    ];

    // Reemplazar los placeholders de iconos con los iconos de Lucide
    lucide.createIcons();

    // 1. Manejar el clic en el sobre
    envelope.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        // CORRECCIÓN: Activar el primer cambio de color inmediatamente
        updateTheme('intro');

        clickSound.play(); // Reproducir el sonido

        // Añade la clase para la animación de caída
        envelope.classList.add('fall');

        // Muestra la tarjeta después de un momento
        setTimeout(() => {
            invitationCard.classList.remove('hidden');
            invitationCard.classList.add('scale-in');
        }, 300);

        // Muestra la tarjeta de la letra un poco después
        setTimeout(() => {
            lyricsCard.classList.remove('hidden');
            lyricsCard.classList.add('show');
        }, 1000);

        // Muestra el confeti un poco después
        /* CORRECCIÓN: Se elimina la llamada inicial al confeti de aquí */

        // --- NUEVO: Lanzar fuegos artificiales constantemente ---
        setInterval(createFireworks, 1500); // Lanza fuegos artificiales cada 1.5 segundos
    });

    // --- SINCRONIZADOR DE LETRA MEJORADO ---
    clickSound.addEventListener('timeupdate', () => {
        const currentTime = clickSound.currentTime;
        
        // Busca la última línea cuyo tiempo ya pasó
        let newLyricIndex = -1;
        for (let i = 0; i < lyrics.length; i++) {
            if (lyrics[i].time <= currentTime) {
                newLyricIndex = i;
            } else {
                break; // Optimización: si ya pasamos el tiempo, no seguir buscando
            }
        }

        if (newLyricIndex !== currentLyricIndex) {
            currentLyricIndex = newLyricIndex;
            const currentLine = lyrics[currentLyricIndex];
            
            if (currentLine) {
                // --- NUEVO: Lógica para cambiar colores en CADA cambio de letra ---
                updateTheme(moods[moodIndex % moods.length]);
                moodIndex++;

                lyricsLine.style.opacity = 0;
                setTimeout(() => {
                    lyricsLine.innerText = currentLine.text;
                    lyricsLine.style.opacity = 1;

                    // --- NUEVO: Activar la animación de pulso ---
                    lyricsLine.classList.add('lyric-active');

                }, 150); // Pequeña transición de fundido
            }
        }
    });

    // --- NUEVO: Limpiar la clase de animación cuando termine ---
    lyricsLine.addEventListener('animationend', () => {
        lyricsLine.classList.remove('lyric-active');
    });

    // --- NUEVO: Función para actualizar los colores del tema ---
    function updateTheme(mood) {
        const root = document.documentElement;
        
        // CORRECCIÓN: Llamar al confeti cada vez que el tema cambia
        createConfetti();

        // CORRECCIÓN: El switch estaba incompleto.
        switch (mood) {
            case 'chorus':
                root.style.setProperty('--glow-color', 'rgba(233, 69, 96, 0.4)');
                root.style.setProperty('--accent-color', '#e94560');
                break;
            case 'bridge':
                root.style.setProperty('--glow-color', 'rgba(15, 52, 96, 0.5)');
                root.style.setProperty('--accent-color', '#a2d2ff');
                break;
            case 'outro':
                root.style.setProperty('--glow-color', 'rgba(198, 172, 143, 0.4)');
                root.style.setProperty('--accent-color', '#c6ac8f');
                break;
            case 'special': // NUEVO mood para momentos especiales
                root.style.setProperty('--glow-color', 'rgba(251, 191, 36, 0.4)');
                root.style.setProperty('--accent-color', '#fbbf24');
                break;
            case 'romantic': // NUEVO mood
                root.style.setProperty('--glow-color', 'rgba(219, 112, 147, 0.4)');
                root.style.setProperty('--accent-color', '#db7093');
                break;
            case 'passionate': // NUEVO mood
                root.style.setProperty('--glow-color', 'rgba(139, 0, 0, 0.4)');
                root.style.setProperty('--accent-color', '#dc143c');
                break;
            default: // intro y verse
                root.style.setProperty('--glow-color', 'rgba(65, 90, 119, 0.3)');
                root.style.setProperty('--accent-color', '#778da9');
                break;
        }
    }

    // --- CORRECCIÓN: Función para crear fuegos artificiales ---
    function createFireworks() {
        // CAMBIO: Lanzar un grupo de fuegos artificiales a la vez
        const fireworksCount = Math.floor(Math.random() * 3) + 1; // Entre 1 y 3 fuegos artificiales
        for (let j = 0; j < fireworksCount; j++) {
            const x = Math.random() * 100; // Posición horizontal aleatoria en toda la pantalla
            const shooter = document.createElement('div');
            shooter.classList.add('firework-particle');
            shooter.style.left = `${x}%`;
            shooter.style.bottom = 0;

            fireworksContainer.appendChild(shooter);

            // Guardar la posición final antes de que el shooter desaparezca
            const finalX = shooter.offsetLeft;
            const finalY = window.innerHeight * (Math.random() * 0.4 + 0.1); // Explota en la mitad superior

            setTimeout(() => {
                shooter.remove();
                
                for (let i = 0; i < 50; i++) { // CAMBIO: Más partículas por explosión
                    const particle = document.createElement('div');
                    particle.classList.add('explosion-particle');
                    particle.style.left = `${finalX}px`;
                    particle.style.top = `${finalY}px`;

                    const angle = Math.random() * 360;
                    const distance = Math.random() * 150 + 50; // CAMBIO: Explosión más grande
                    particle.style.setProperty('--x', `${Math.cos(angle * Math.PI / 180) * distance}px`);
                    particle.style.setProperty('--y', `${Math.sin(angle * Math.PI / 180) * distance}px`);

                    fireworksContainer.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }
            }, 1200);
        }
    }

    // 2. Función para crear el confeti
    function createConfetti() {
        const CONFETTI_COUNT = 50;
        const CONFETTI_EMOJIS = ['🍿', '🎥', '🎟️', '🎬', '⭐'];

        // CORRECCIÓN: Limpiar confeti anterior para evitar sobrecarga
        confettiContainer.innerHTML = '';

        for (let i = 0; i < CONFETTI_COUNT; i++) {
            const confettiPiece = document.createElement('span');
            confettiPiece.classList.add('confetti-piece');
            confettiPiece.innerText = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];

            // Posición y animación aleatoria
            confettiPiece.style.left = `${Math.random() * 100}vw`;
            confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
            confettiPiece.style.fontSize = `${Math.random() * 10 + 10}px`;

            confettiContainer.appendChild(confettiPiece);
        }
    }
});