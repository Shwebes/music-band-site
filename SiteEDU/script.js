const tracks = [
    {
        title: "Sad Day",
        artist: "Dead Heads",
        file: "audio/track1.mp3",
        cover: "images/album-cover-1.jpg"
    },
    {
        title: "Good Day",
        artist: "Dead Heads",
        file: "audio/track2.mp3",
        cover: "images/album-cover-2.jpg"
    },
    {
        title: "IDK day",
        artist: "Dead Heads",
        file: "audio/track3.mp3",
        cover: "images/album-cover-3.jpg"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

document.addEventListener('DOMContentLoaded', function() {
    const concerts = [
        { date: '2024-05-15', city: 'Москва', venue: 'Главный Клуб', ticketLink: '#' },
        { date: '2024-06-01', city: 'Санкт-Петербург', venue: 'Арена', ticketLink: '#' },
        { date: '2024-06-15', city: 'Казань', venue: 'Music Hall', ticketLink: '#' }
    ];

    const merchItems = [
        { name: 'Футболка', price: 1500, image: 'images/tshirt.jpg' },
        { name: 'Худи', price: 3000, image: 'images/hoodie.jpg' },
        { name: 'Кепка', price: 1000, image: 'images/cap.jpg' }
    ];

    const concertCalendar = document.querySelector('.concert-calendar');
    concerts.forEach(concert => {
        const date = new Date(concert.date);
        const concertElement = document.createElement('div');
        concertElement.className = 'concert-item';
        concertElement.innerHTML = `
            <div class="concert-date">${date.toLocaleDateString('ru-RU')}</div>
            <div class="concert-info">
                <h3>${concert.city}</h3>
                <p>${concert.venue}</p>
            </div>
            <a href="${concert.ticketLink}" class="ticket-button">Купить билет</a>
        `;
        concertCalendar.appendChild(concertElement);
    });

    const merchGrid = document.querySelector('.merch-grid');
    merchItems.forEach(item => {
        const merchElement = document.createElement('div');
        merchElement.className = 'merch-item';
        merchElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">${item.price} ₽</p>
            <button onclick="addToCart('${item.name}', ${item.price})">В корзину</button>
        `;
        merchGrid.appendChild(merchElement);
    });

    const playlistContainer = document.querySelector('.playlist-tracks');
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress');
    const progressArea = document.querySelector('.progress-bar');
    const volumeSlider = document.querySelector('.volume-slider');
    
    // Загрузка плейлиста
    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'playlist-track';
        trackElement.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <span class="track-duration">0:00</span>
        `;
        trackElement.addEventListener('click', () => loadTrack(index));
        playlistContainer.appendChild(trackElement);
    });

    // Загрузка первого трека
    loadTrack(0);

    // Обработчики событий
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevTrack);
    nextBtn.addEventListener('click', playNextTrack);
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    progressArea.addEventListener('click', (e) => {
        const progressWidth = progressArea.clientWidth;
        const clickedOffset = e.offsetX;
        audio.currentTime = (clickedOffset / progressWidth) * audio.duration;
    });

    // Обновление прогресса
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        document.querySelector('.current').textContent = formatTime(audio.currentTime);
        document.querySelector('.duration').textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', playNextTrack);
});

let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();
    showNotification(`${name} добавлен в корзину`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].file;
    document.querySelector('.track-title').textContent = tracks[index].title;
    document.querySelector('.track-artist').textContent = tracks[index].artist;
    document.querySelector('.album-cover').src = tracks[index].cover;
    
    // Обновление активного трека в плейлисте
    document.querySelectorAll('.playlist-track').forEach((track, idx) => {
        track.classList.toggle('active', idx === index);
    });
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        document.querySelector('.play-pause i').classList.replace('fa-pause', 'fa-play');
    } else {
        audio.play();
        isPlaying = true;
        document.querySelector('.play-pause i').classList.replace('fa-play', 'fa-pause');
    }
}

function playPrevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 