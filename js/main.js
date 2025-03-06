// Inisialisasi AOS Animation
AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 100
});

// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active link based on scroll position
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        nav.classList.remove('active');
        burger.classList.remove('active');
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize Swiper
const testimonialSwiper = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    }
});

// Smooth Counter Animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = target / 100;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5
});

counters.forEach(counter => observer.observe(counter));

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Validasi form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Mohon isi semua field yang diperlukan', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Mohon masukkan email yang valid', 'error');
            return;
        }

        // Tampilkan loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;

        // Template parameters
        const templateParams = {
            to_name: "Lilik Ning Handayani",
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            reply_to: email
        };

        // Kirim email
        const response = await emailjs.send(
            "service_xb9y0e8", 
            "template_r2atv5r", 
            templateParams
        );

        console.log("SUCCESS!", response.status, response.text);
        showNotification('Pesan berhasil terkirim!', 'success');
        this.reset();

    } catch (error) {
        console.error("FAILED...", error);
        showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
    } finally {
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Kirim Pesan</span><i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
    }
});

// Notification Function
function showNotification(message, type = 'success') {
    const container = document.querySelector('.notification-container');
    
    // Buat element notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon berdasarkan type
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon} fa-lg"></i>
        <div class="notification-content">
            <p class="notification-message">${message}</p>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Tambahkan ke container
    container.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        timelineItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Smooth scroll for timeline items
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            timelineObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

timelineItems.forEach(item => timelineObserver.observe(item));

// Animate progress bars when they come into view
const progressBars = document.querySelectorAll('.progress-bar');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = `${progress}%`;
            progressObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Tambahkan fungsi ini setelah contact form handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

// Add touch scroll for statistics
const statsContainer = document.querySelector('.stats-container');
let isDown = false;
let startX;
let scrollLeft;

statsContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    statsContainer.classList.add('active');
    startX = e.pageX - statsContainer.offsetLeft;
    scrollLeft = statsContainer.scrollLeft;
});

statsContainer.addEventListener('mouseleave', () => {
    isDown = false;
    statsContainer.classList.remove('active');
});

statsContainer.addEventListener('mouseup', () => {
    isDown = false;
    statsContainer.classList.remove('active');
});

statsContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - statsContainer.offsetLeft;
    const walk = (x - startX) * 2;
    statsContainer.scrollLeft = scrollLeft - walk;
});

// Scroll Progress Indicator
const addScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalScroll) * 100;
        document.querySelector('.scroll-progress-bar').style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress);
};

// Section Visibility Observer
const observeSections = () => {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger AOS animations again when section becomes visible
                AOS.refresh();
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addScrollProgress();
    observeSections();
});

// Dark Mode Toggle
const toggleSwitch = document.querySelector('#darkmode-toggle');
const currentTheme = localStorage.getItem('theme');

// Check if dark mode was previously enabled
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme);

// Tambahkan active class saat link di klik
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        // Tutup mobile menu jika terbuka
        if (navLinks[0].parentElement.classList.contains('active')) {
            navLinks[0].parentElement.classList.remove('active');
            burger.classList.remove('active');
        }
    });
}); 