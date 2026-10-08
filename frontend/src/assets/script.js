/* global L */

document.addEventListener('DOMContentLoaded', () => {

    
    const navbarHTML = `
        <nav id="navbar">
            <ul>
                <li><a href="../homepage/index.html" class="nav-link">Home</a></li>
                <li><a href="../aboutpage/about.html" class="nav-link">About Us</a></li>
                <li><a href="../news&articles/news&articles.html" class="nav-link">News & Articles</a></li>
                <li><a href="../facility_services/facility_services.html" class="nav-link">Services</a></li>
                <li><a href="../gallery/gallery.html" class="nav-link">Gallery</a></li>
                <li><a href="../contact/contact.html" class="nav-link">Contact Us</a></li>
                <li><a href="../business/business.html" class="nav-link">Businesses</a></li>
            </ul>
        </nav>
    `;

    const navbarContainer = document.getElementById('navbar-placeholder');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
    }
    
    
    const currentPath = window.location.pathname;
    document.querySelectorAll('#navbar a.nav-link').forEach(link => {
        if (link.href && currentPath.includes(new URL(link.href).pathname.split('/').pop())) {
            
            document.querySelectorAll('#navbar a.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });


    const footerHTML = `
        <footer>
            <div class="footer-content">
                <div class="footer-left">
                    <div class="footer-title">BARANGAY OLYMPIA</div>
                    <p>Fortuna Street, Olympia, Makati City</p>
                    <p style="margin: 15px 0;">Serving the community with integrity, safety, and<br>excellence in public service.</p>
                    <p style="color: var(--accent-yellow);">Olympia, Makati City, Philippines</p>
                </div>
                <div class="footer-right">
                    <p>Telephone: (02) 8897-5830</p>
                    <p>Mobile: 0975-511-7613</p>
                    <p>Email: barangayolympiamakati@gmail.com</p>
                    <p style="margin-top: 15px;">Office Hours:</p>
                    <p style="color: var(--accent-yellow);">Monday - Friday | 8:00 AM - 5:00 PM</p>
                    <a href="../admin/login.html" style="color: var(--accent-yellow); font-size: 0.9em; text-decoration: none; margin-top: 10px; display: block;">Admin Login</a>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Barangay Olympia, Makati City. All Rights Reserved.</p>
            </div>
        </footer>
    `;

    const footerContainer = document.getElementById('footer-placeholder');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }

    
    const mapContainer = document.getElementById('map-api-container');
    
    
    if (mapContainer) {
        const olympiaCoordinates = [14.5714, 121.0181];
        const zoomLevel = 15;
        const map = L.map('map-api-container').setView(olympiaCoordinates, zoomLevel);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(olympiaCoordinates)
            .addTo(map)
            .bindPopup('<b>Barangay Olympia</b><br>Makati City, Philippines.')
            .openPopup();
    }

    
    window.toggleTab = function(selectedTab) {
        const btnDocuments = document.getElementById('btn-documents');
        const btnFacility = document.getElementById('btn-facility');

        if (btnDocuments && btnFacility) {
            if (selectedTab === 'documents') {
                btnDocuments.classList.add('active');
                btnFacility.classList.remove('active');
            } else if (selectedTab === 'facility') {
                btnFacility.classList.add('active');
                btnDocuments.classList.remove('active');
            }
        }
    }

    
    const sidebarHTML = `
        <button class="sidebar-toggle-btn" id="sidebar-toggle">☰</button>
        <aside id="sidebar">
            <ul>
                <li><a href="../homepage/index.html" class="nav-link">Home</a></li>
                <li><a href="../aboutpage/about.html" class="nav-link">About Us</a></li>
                <li><a href="../news&articles/news&articles.html" class="nav-link">News & Articles</a></li>
                <li><a href="../facility_services/facility_services.html" class="nav-link">Services</a></li>
                <li><a href="../docs_services/docs.html" class="nav-link">Documents</a></li>
                <li><a href="../gallery/gallery.html" class="nav-link">Gallery</a></li>
                <li><a href="../contact/contact.html" class="nav-link">Contact Us</a></li>
                <li><a href="../business/business.html" class="nav-link">Businesses</a></li>
            </ul>
        </aside>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    

    const viewReqBtn = document.getElementById('view-req-btn');
    const reqModal = document.getElementById('req-modal');
    const closeReqModal = document.getElementById('close-req-modal');

    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');

    if (viewReqBtn && reqModal) {
        viewReqBtn.addEventListener('click', () => {
            reqModal.classList.remove('hidden');
        });
    }

    if (closeReqModal && reqModal) {
        closeReqModal.addEventListener('click', () => {
            reqModal.classList.add('hidden');
        });
    }

    if (bookingForm && successModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            successModal.classList.remove('hidden');
        });
    }

    if (closeSuccessModal && successModal) {
        closeSuccessModal.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }


        
        const kagawads = [
            'Febe D. Javier',
            'Segundo H. Gonzales, Jr.',
            'Maria Guia Maree R. David',
            'Ryan V. Medina',
            'Rodrigo L. Binay, Jr.',
            'Jonathan D. Alvarez',
            'Susana DL. Arceta',
        ];

        const kagawadGrid = document.getElementById('kagawad-grid');
        if (kagawadGrid) {
            kagawads.forEach(name => {
                
                const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
                const initials = (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();

                const card = document.createElement('div');
                card.className = 'kagawad-card fade-up';
                card.innerHTML = `
                    <div class="kagawad-avatar">${initials}</div>
                    <div class="kagawad-role-label">Kagawad</div>
                    <div class="kagawad-name">${name}</div>
                `;
                kagawadGrid.appendChild(card);
            });
        }

        
        const ngoLeft = [
            { name: 'Rotary Club of Makati',                                                location: 'MRCFI Building, 80001 Camia, Guadalupe Viejo, Makati' },
            { name: 'SAMAVEA - Sacramento Market Vendor Association',                       location: 'Sacramento St.' },
            { name: 'Red Cross Makati',                                                     location: 'Johnny Air Building, 55B Dian St, corner Senator Gil Puyat Avenue' },
            { name: 'Olympia Barangay Business Association',                                location: 'Barangay Hall' },
            { name: 'Bagong Ina ng Bayan-Olympia Chapter',                                 location: 'Barangay Hall' },
            { name: 'Empowerment and Reaffirmation of Paternal Abilities Training (ERPAT)',location: 'Barangay Hall' },
            { name: 'Person with Disabilities (PWD) Olympia Chapter',                      location: 'Barangay Hall' },
            { name: 'Senior Citizens - Olympia Chapter',                                    location: 'Barangay Hall' },
        ];

        const ngoRight = [
            { name: 'Makati Active Youth Association - MAYA',                               location: 'Barangay Hall' },
            { name: 'Batang Makati Movement (BMM)',                                         location: 'Barangay Hall' },
            { name: 'CMTCOA - Constancia Makati Tricycle Operator Driver Associations',     location: 'Constancia St.' },
            { name: 'ECOTCOA - Economia Tricycle Operator Driver Associations',             location: 'Economia St.' },
            { name: 'TRATCOA - Trabajo Tricycle Operator Driver Associations',              location: 'Trabajo St.' },
            { name: "Women's Watch",                                                        location: 'Barangay Hall' },
            { name: 'CFYO - Colmena Fortuna Youth Association',                            location: 'Colmena St.' },
            { name: 'Samahan ng mga Kabataan sa San Maximo',                                location: 'San Maximo St.' },
            { name: 'Diabetes and Hypertension Club',                                       location: 'Health Center' },
        ];

        function buildNgoTable(data) {
            const table = document.createElement('table');
            table.className = 'ngo-table fade-up';
            table.innerHTML = `
                <thead>
                    <tr><th>Name</th><th>Location</th></tr>
                </thead>
                <tbody>
                    ${data.map(org => `<tr><td>${org.name}</td><td>${org.location}</td></tr>`).join('')}
                </tbody>
            `;
            return table;
        }

        const ngoWrapper = document.getElementById('ngo-table-wrapper');
        if (ngoWrapper) {
            ngoWrapper.appendChild(buildNgoTable(ngoLeft));
            ngoWrapper.appendChild(buildNgoTable(ngoRight));
        }

    
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

});


window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
};

window.closeModalOutside = function(event, modalId) {
    if (event.target.id === modalId) {
        window.closeModal(modalId);
    }
};




const galleryData = {
    "2026": [
        {
            id: "2026-officers",
            title: "104th Plt Off First Day",
            cover: "../assets/images/gallery1.png",
            photos: [
                { url: "../assets/images/gallery1.png", caption: "104th Plt Off First Day - Opening Ceremony" },
                { url: "../assets/images/gallery2.png", caption: "104th Plt Off First Day - Community Presentation" },
                { url: "../assets/images/gallery3.png", caption: "104th Plt Off First Day - Group Photo with Barangay Officials" },
                { url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80", caption: "104th Plt Off First Day - Briefing Session" }
            ]
        }
    ],
    "2025": [
        {
            id: "2025-officers",
            title: "104th Plt Off First Day",
            cover: "../assets/images/gallery2.png",
            photos: [
                { url: "../assets/images/gallery2.png", caption: "104th Plt Off First Day 2025" },
                { url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80", caption: "Working together on Barangay projects" },
                { url: "https://images.unsplash.com/photo-1577416412292-747c6607f055?w=1200&q=80", caption: "Planning new community facilities" }
            ]
        },
        {
            id: "2025-family",
            title: "Family Day 2025",
            cover: "../assets/images/gallery3.png",
            photos: [
                { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80", caption: "Family Day - Picnic at the Covered Court" },
                { url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80", caption: "Outdoor games for families" },
                { url: "https://images.unsplash.com/photo-1476900543704-4312b78631f6?w=1200&q=80", caption: "Children running and playing outdoors" },
                { url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80", caption: "Happy family capturing memories" }
            ]
        },
        {
            id: "2025-giveaway",
            title: "Kapitana Giveaway 2025",
            cover: "../assets/images/gallery1.png",
            photos: [
                { url: "../assets/images/gallery1.png", caption: "Kapitana Giveaway - Preparing relief goods" },
                { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80", caption: "Community charity and food distribution" },
                { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80", caption: "Volunteer team helping Barangay residents" },
                { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80", caption: "Distributing hygiene packs" }
            ]
        }
    ],
    "2024": [
        {
            id: "2024-children",
            title: "Children's Month 2024",
            cover: "../assets/images/gallery3.png",
            photos: [
                { url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1200&q=80", caption: "Children's Month Celebration - Games and fun" },
                { url: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=1200&q=80", caption: "Art and drawing contest for kids" },
                { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80", caption: "Group photo of active children" },
                { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80", caption: "Barangay playground fun" }
            ]
        },
        {
            id: "2024-treat",
            title: "Trick or Treat 2024",
            cover: "../assets/images/gallery2.png",
            photos: [
                { url: "https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?w=1200&q=80", caption: "Trick or Treat - Beautiful pumpkin lanterns" },
                { url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1200&q=80", caption: "Children showing off creative costumes" },
                { url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&q=80", caption: "Fun decorations around the Barangay hall" }
            ]
        },
        {
            id: "2024-giveaway",
            title: "Kapitana Giveaway 2024",
            cover: "../assets/images/gallery1.png",
            photos: [
                { url: "../assets/images/gallery1.png", caption: "Kapitana Giveaway 2024 - Distribution Drive" },
                { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80", caption: "Food packs distribution to Barangay families" },
                { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80", caption: "Active volunteers during Kapitana Giveaway" }
            ]
        }
    ]
};


let currentYear = "2026";

let currentPhotos = [];
let currentImageIndex = 0;


let touchStartX = 0;
let touchEndX = 0;


const contentGrid = document.getElementById("gallery-content-grid");
const viewTitle = document.getElementById("gallery-view-title");
const yearButtons = document.querySelectorAll(".year-btn");
const galleryNavBar = document.getElementById("gallery-nav-bar");
const backBtn = document.getElementById("btn-back-to-albums");
const activeAlbumTitle = document.getElementById("active-album-title");


const lightbox = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxIndex = document.getElementById("lightbox-index");
const closeBtn = document.getElementById("lightbox-close-btn");
const prevBtn = document.getElementById("lightbox-prev-btn");
const nextBtn = document.getElementById("lightbox-next-btn");
const dotsContainer = document.getElementById("lightbox-dots-container");


document.addEventListener("DOMContentLoaded", () => {
    
    renderAlbums();

    
    yearButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            yearButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentYear = e.target.getAttribute("data-year");

            
            
            galleryNavBar.style.display = "none";
            viewTitle.textContent = "ALBUMS";
            
            renderAlbums();
        });
    });

    
    backBtn.addEventListener("click", () => {

        galleryNavBar.style.display = "none";
        viewTitle.textContent = "ALBUMS";
        renderAlbums();
    });

    
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("show")) return;
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "Escape") closeLightbox();
    });

    
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    
    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
});


function renderAlbums() {
    contentGrid.innerHTML = "";
    const albums = galleryData[currentYear] || [];

    if (albums.length === 0) {
        contentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #777; padding: 40px 0;">No albums found for this year.</div>`;
        return;
    }

    albums.forEach(album => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
            <div class="album-thumbnail-wrapper">
                <img class="album-thumbnail" src="${album.cover}" alt="${album.title}" loading="lazy">
                <span class="album-badge">${currentYear}</span>
            </div>
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <span class="album-photo-count">${album.photos.length} Photo${album.photos.length > 1 ? 's' : ''}</span>
            </div>
        `;
        
        
        card.addEventListener("click", () => {
            loadAlbum(album);
        });

        contentGrid.appendChild(card);
    });
}


function loadAlbum(album) {

    viewTitle.textContent = album.title;
    activeAlbumTitle.textContent = album.title;
    galleryNavBar.style.display = "flex";

    contentGrid.innerHTML = "";
    
    album.photos.forEach((photo, index) => {
        const photoCard = document.createElement("div");
        photoCard.className = "photo-thumbnail-card";
        photoCard.innerHTML = `
            <img class="photo-img" src="${photo.url}" alt="${photo.caption}" loading="lazy">
            <div class="photo-overlay">
                <span class="zoom-icon">🔍</span>
            </div>
        `;

        
        photoCard.addEventListener("click", () => {
            openLightbox(album.photos, index);
        });

        contentGrid.appendChild(photoCard);
    });
}


function openLightbox(photos, index) {
    currentPhotos = photos;
    currentImageIndex = index;
    
    
    dotsContainer.innerHTML = "";
    photos.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = `lightbox-dot ${idx === index ? 'active' : ''}`;
        dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        dot.addEventListener("click", () => {
            changeSlide(idx);
        });
        dotsContainer.appendChild(dot);
    });

    
    lightboxImg.classList.remove("loaded");
    lightboxImg.src = photos[index].url;
    lightboxImg.alt = photos[index].caption;
    lightboxCaption.textContent = photos[index].caption;
    lightboxIndex.textContent = `Slide ${index + 1} of ${photos.length}`;
    
    
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; 

    
    setTimeout(() => {
        lightboxImg.classList.add("loaded");
    }, 50);
}


function changeSlide(index) {
    if (index === currentImageIndex) return;
    
    lightboxImg.classList.remove("loaded");
    
    
    setTimeout(() => {
        currentImageIndex = index;
        lightboxImg.src = currentPhotos[index].url;
        lightboxImg.alt = currentPhotos[index].caption;
        lightboxCaption.textContent = currentPhotos[index].caption;
        lightboxIndex.textContent = `Slide ${index + 1} of ${currentPhotos.length}`;

        
        const dots = dotsContainer.querySelectorAll(".lightbox-dot");
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        
        lightboxImg.onload = () => {
            lightboxImg.classList.add("loaded");
        };
    }, 150);
}


function nextSlide() {
    const nextIdx = (currentImageIndex + 1) % currentPhotos.length;
    changeSlide(nextIdx);
}


function prevSlide() {
    const prevIdx = (currentImageIndex - 1 + currentPhotos.length) % currentPhotos.length;
    changeSlide(prevIdx);
}


function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; 
    lightboxImg.classList.remove("loaded");
}


function handleSwipeGesture() {
    const threshold = 50; 
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < threshold) return;
    
    if (diff > 0) {
        
        nextSlide();
    } else {
        
        prevSlide();
    }
}



document.addEventListener('DOMContentLoaded', () => {
    
    const calendarGrid = document.getElementById('calendar-grid');
    if (calendarGrid) {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');
        const selectedDateEl = document.getElementById('selected-date');

        let currentDate = new Date(); 
        let selectedDate = new Date();
        
        
        const cutoffDate = new Date(2026, 4, 31); 

        
        if (selectedDate <= cutoffDate) {
            selectedDate = new Date(2026, 5, 1); 
            currentDate = new Date(2026, 5, 1);
        }

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (monthSelect) {
            months.forEach((m, i) => {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = m;
                monthSelect.appendChild(option);
            });
        }

        if (yearSelect) {
            const currentYear = new Date().getFullYear();
            for(let y = currentYear; y <= currentYear + 5; y++) {
                const option = document.createElement('option');
                option.value = y;
                option.textContent = y;
                yearSelect.appendChild(option);
            }
        }

        function renderCalendar() {
            if (!calendarGrid) return;
            calendarGrid.innerHTML = '';
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            if (monthSelect) monthSelect.value = month;
            if (yearSelect) yearSelect.value = year;

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                calendarGrid.appendChild(empty);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dayEl = document.createElement('button');
                dayEl.type = 'button';
                
                const thisDayDate = new Date(year, month, i);
                const isPast = thisDayDate <= cutoffDate;

                if (isPast) {
                    dayEl.className = 'w-8 h-8 rounded-full mx-auto flex items-center justify-center text-gray-300 cursor-not-allowed font-medium';
                    dayEl.disabled = true;
                } else {
                    dayEl.className = 'w-8 h-8 rounded-full mx-auto flex items-center justify-center hover:bg-blue-100 hover:text-customBlue transition-colors font-medium cursor-pointer';
                    
                    if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && i === selectedDate.getDate()) {
                        dayEl.classList.add('bg-customBlue', 'text-white');
                        dayEl.classList.remove('hover:bg-blue-100', 'hover:text-customBlue');
                    } else {
                        dayEl.classList.add('text-gray-700');
                    }

                    dayEl.addEventListener('click', () => {
                        selectedDate = new Date(year, month, i);
                        updateSelectedText();
                        renderCalendar();
                    });
                }
                dayEl.textContent = i;
                calendarGrid.appendChild(dayEl);
            }
        }

        function updateSelectedText() {
            if (!selectedDateEl) return;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            selectedDateEl.textContent = 'Selected: ' + selectedDate.toLocaleDateString('en-US', options);
        }
        
        function handleMonthChange() {
            
            let firstValidDay = 1;
            const testDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            if (testDate <= cutoffDate) {
                
                if (currentDate.getFullYear() === cutoffDate.getFullYear() && currentDate.getMonth() === cutoffDate.getMonth()) {
                    firstValidDay = cutoffDate.getDate() + 1; 
                }
            }
            
            
            if (new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) > cutoffDate) {
               selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstValidDay);
            }
            
            updateSelectedText();
            renderCalendar();
        }

        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); handleMonthChange(); });
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); handleMonthChange(); });
        if (monthSelect) monthSelect.addEventListener('change', (e) => { currentDate.setMonth(parseInt(e.target.value)); handleMonthChange(); });
        if (yearSelect) yearSelect.addEventListener('change', (e) => { currentDate.setFullYear(parseInt(e.target.value)); handleMonthChange(); });

        renderCalendar();
        updateSelectedText();
    }

    
    const submitBtn = document.getElementById('submit-request-btn');
    const successModal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    if (submitBtn && successModal && closeBtn) {
        submitBtn.addEventListener('click', () => {
            successModal.classList.remove('hidden');
        });
        closeBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    
    
    const tabs = document.querySelectorAll('.sidebar-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            
            tabs.forEach(t => {
                t.classList.remove('bg-customBlue', 'text-white', 'shadow-sm');
                t.classList.add('text-blue-100', 'hover:bg-white/10');
            });

            
            tab.classList.remove('text-blue-100', 'hover:bg-white/10');
            tab.classList.add('bg-customBlue', 'text-white', 'shadow-sm');

            const target = tab.getAttribute('data-tab');

            
            sections.forEach(sec => {
                if(target === 'all' || sec.getAttribute('data-section') === target) {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = 'none';
                }
            });
        });
    });

    
    const docFilters = document.querySelectorAll('.doc-filter');
    const docRows = document.querySelectorAll('.doc-row');

    docFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.preventDefault();
            
            
            docFilters.forEach(f => {
                f.classList.remove('bg-customBlue', 'text-white');
                f.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-300');
            });

            
            filter.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-300');
            filter.classList.add('bg-customBlue', 'text-white');

            const targetType = filter.getAttribute('data-doc-filter');

            
            docRows.forEach(row => {
                if(targetType === 'all' || row.getAttribute('data-doc-type') === targetType) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const row = btn.closest('tr');
            
            let statusText = '';
            let statusClass = '';
            let toastMsg = '';

            if(action === 'approve') {
                statusText = 'Approved';
                statusClass = 'bg-green-100 text-green-700 border-green-200';
                toastMsg = 'Request approved and SMS sent to resident.';
            } else if(action === 'reject') {
                statusText = 'Rejected';
                statusClass = 'bg-red-100 text-red-700 border-red-200';
                toastMsg = 'Request has been rejected.';
            } else if(action === 'process') {
                statusText = 'Processed';
                statusClass = 'bg-green-100 text-green-700 border-green-200';
                toastMsg = 'PhilHealth request processed successfully.';
            } else if(action === 'print') {
                statusText = 'Ready for Pick-up';
                statusClass = 'bg-blue-100 text-blue-700 border-blue-200';
                toastMsg = 'Document printed and marked ready for pick-up.';
            } else if(action === 'claim') {
                statusText = 'Claimed';
                statusClass = 'bg-gray-100 text-gray-700 border-gray-200';
                toastMsg = 'Document claimed by resident.';
            }

            
            const statusCell = row.cells[3]; 
            statusCell.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold border ${statusClass}">${statusText}</span>`;

            
            const buttons = row.cells[4].querySelectorAll('button');
            buttons.forEach(b => {
                b.disabled = true;
                b.className = 'bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-bold text-xs cursor-not-allowed border border-gray-200';
                b.innerText = 'Completed';
            });

            showToast(toastMsg);
        });
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-message');
        msgEl.innerText = message;
        
        toast.classList.remove('translate-y-24', 'opacity-0');
        
        setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3000);
    }
});

const loginForm = document.getElementById('loginForm');
if(loginForm) { loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            if (user === 'admin123' && pass === 'admin123') {
                
                window.location.href = 'admin.html';
            } else {
                
                errorMsg.classList.remove('hidden');
                
                
                const formCard = this.parentElement;
                formCard.style.transform = 'translateX(5px)';
                setTimeout(() => formCard.style.transform = 'translateX(-5px)', 100);
                setTimeout(() => formCard.style.transform = 'translateX(5px)', 200);
                setTimeout(() => formCard.style.transform = 'translateX(0)', 300);
            }
        });
    
}

document.addEventListener('DOMContentLoaded', () => {
        const sendBtn = document.getElementById('send-btn');
        const modal = document.getElementById('success-modal');
        const closeX = document.getElementById('close-modal-x');
        const closeBtn = document.getElementById('close-modal-btn');
        const modalContent = modal.querySelector('div'); 

        function showModal() {
            modal.classList.remove('hidden');
            
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
        }

        function hideModal() {
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            
            
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal();
            });
        }
        if (closeX) closeX.addEventListener('click', hideModal);
        if (closeBtn) closeBtn.addEventListener('click', hideModal);
        
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
    });

document.addEventListener('DOMContentLoaded', () => {
    const filterLinks = document.querySelectorAll('.filter-link');
    
    const gridContainer = document.querySelector('.grid');
    const cards = Array.from(gridContainer.children);

    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');

            
            filterLinks.forEach(l => {
                l.className = 'filter-link block hover:text-customBlue hover:pl-2 transition-all text-gray-700 font-medium';
            });
            link.className = 'filter-link block text-customBlue font-bold pl-2 transition-all';

            
            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = '';
                } else {
                    if (card.id === filter) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const socialItems = document.querySelectorAll('.social-item');
    socialItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'transform 0.2s';
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
        
        if (item.innerHTML.includes('Facebook')) {
            item.addEventListener('click', () => {
                window.open('https://www.facebook.com/p/Barangay-Olympia-61553382107668/', '_blank');
            });
        } else if (item.innerHTML.includes('Email')) {
            item.addEventListener('click', () => {
                window.location.href = 'mailto:barangayolympiamakati@gmail.com';
            });
        } else if (item.innerHTML.includes('Call')) {
            item.addEventListener('click', () => {
                window.location.href = 'tel:0288975830';
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btnFirst = document.getElementById('btn-first');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnLast = document.getElementById('btn-last');
    const pageNumSpan = document.getElementById('page-num');
    
    
    const newsGrid = document.querySelector('.text-cards-grid');
    const featuredColumn = document.querySelector('.featured-column');

    let currentPage = 1;
    const totalPages = 1790;

    function updatePagination(newPage) {
        if (newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;
        
        if (currentPage === newPage) return; 
        
        currentPage = newPage;
        pageNumSpan.textContent = currentPage + ' / ' + totalPages;

        
        if (newsGrid) {
            newsGrid.style.transition = 'opacity 0.2s ease-in-out';
            newsGrid.style.opacity = '0.3';
            
            setTimeout(() => {
                newsGrid.style.opacity = '1';
                
            }, 300);
        }
        
        if (featuredColumn) {
            featuredColumn.style.transition = 'opacity 0.2s ease-in-out';
            featuredColumn.style.opacity = '0.3';
            
            setTimeout(() => {
                featuredColumn.style.opacity = '1';
            }, 300);
        }
    }

    if (btnFirst) btnFirst.addEventListener('click', () => updatePagination(1));
    if (btnPrev) btnPrev.addEventListener('click', () => updatePagination(currentPage - 1));
    if (btnNext) btnNext.addEventListener('click', () => updatePagination(currentPage + 1));
    if (btnLast) btnLast.addEventListener('click', () => updatePagination(totalPages));
});

