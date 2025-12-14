
const carsData = [
    {
        id: 1,
        name: "Toyota Camry",
        category: "sedan",
        type: "SEDAN",
        image: "new.jpg",
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "8,000.00",
        badge: "Popular",
    },
    {
        id: 2,
        name: "BMW M340i",
        category: "luxury",
        type: "LUXURY SEDAN",
        image: "bmw.webp",
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "14,500.00",
        badge: "Luxury",
    },
    {
        id: 3,
        name: "Honda Odyssey",
        category: "suv",
        type: "MINIVAN",
        image: "h1.avif",
        seats: 8,
        transmission: "Auto",
        ac: "Yes",
        price: "9,000.00",
        badge: "Family",
    },
    {
        id: 4,
        name: "BYD Seal",
        category: "luxury",
        type: "ELECTRIC LUXURY",
        image: "BYD-9.png",
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "9,500.00",
        badge: "Electric",
    },
    {
        id: 5,
        name: "Ford Mustang",
        category: "luxury",
        type: "SPORTS CAR",
        image: "2016-GT-Fastback-Ruby-Red.jpg",
        seats: 4,
        transmission: "Manual",
        ac: "Yes",
        price: "13,500.00",
        badge: "Sports",
        
    },
    {
        id: 6,
        name: "Chevrolet Spark",
        category: "economy",
        type: "ECONOMY",
        image: "chevolet.webp",
        seats: 4,
        transmission: "Manual",
        ac: "Yes",
        price: "5,000.00",
        badge: "Budget",
    },
    {
        id: 7,
        name: "Jeep Wrangler",
        category: "suv",
        type: "SUV",
        image: "jeep.webp",
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "16,500.00",
        badge: "Adventure",
    },
    {
        id: 8,
        name: "Honda Civic",
        category: "sedan",
        type: "SEDAN",
        image: "civic.png",
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "11,000.00",
        badge: "Reliable",
    },
    {
        id: 9,
        name: "Range Rover",
        category: "luxury",
        type: "LUXURY SUV",
        image: "reng.webp",
        seats: 7,
        transmission: "Auto",
        ac: "Yes",
        price: "20,000.00",
        badge: "Premium",
    },
    {
        id: 10,
        name: "Mercedes Benz Class C200",
        category: "luxury",
        type: "LUXURY ",
        image: "C200.jpg", 
        seats: 5,
        transmission: "Auto",
        ac: "Yes",
        price: "14,000.00",
        badge: "Premium"
    },
   
    {
        id: 11,
        name: "Toyota Land Cruiser",
        category: "suv",
        type: "PREMIUM SUV",
        image: "2014-Toyota-Land Cruiser-front_9132_032_2400x1800_6V2_nologo.avif", 
        seats: 7,
        transmission: "Auto",
        ac: "Yes",
        price: "15,000.00",
        badge: "Off-Road"
    },
  
    {
        id: 12,
        name: "Suzuki Swift RS",
        category: "economy",
        type: "SPORT HATCHBACK",
        image: "Suzuki.jpg",
        seats: 5,
        transmission: "Manual",  
        price: "6,500.00",
        badge: "Budget"}
];

// HEADER EFFECT
window.addEventListener('scroll', function() {
    const head = document.getElementById('head');
    
    if (window.scrollY > 650) {
        head.classList.add('scrolled');
    } else {
        head.classList.remove('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", function() {  
        const reveals = document.querySelectorAll(".reveal")
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");    
                }      
            });
        }, { 
            threshold: 0.1 
        }); 
        reveals.forEach(reveal => {
            observer.observe(reveal);
        });
    });  


// SELECTORS
const searchInput = document.getElementById('carSearchInput');
const suggestionBox = document.getElementById('suggestionBox');
const carsGrid = document.getElementById('carsGrid');
function triggerAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));
}

// RENDER CARS FUNCTION
function renderCars(filter = 'all', customList = null) {
    carsGrid.innerHTML = ''; 

    let filteredCars;

    if (customList) {
        filteredCars = customList;
    } else {
        if (filter === 'all') {
            filteredCars = carsData;
        } else {
            filteredCars = carsData.filter(car => car.category === filter);
        }
    }

    filteredCars.forEach(car => {
        let gearIcon = "transmission.png"; 
        if (car.transmission === 'Auto') {
            gearIcon = "automatic-transmission.png";
        }

        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        
        carCard.innerHTML = `
            <div class="reveal">
            <div class="car-image">
                <img src="${car.image}" class="carphoto" style="width: 100%; height: auto; border-radius: 8px;">
                <div class="car-badge">${car.badge}</div>
            </div>
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="car-category">${car.type}</div>
                
                <div class="car-specs">
                    <div class="spec">
                        <div class="spec-icon"><img src="car-seat.png" alt="Seats"></div>
                        <div class="spec-label">Seats</div>
                        <div class="spec-value">${car.seats}</div>
                    </div>
                    <div class="spec">
                        <div class="spec-icon"><img src="${gearIcon}" alt="Gear"></div>
                        <div class="spec-label">Transmission</div>
                        <div class="spec-value">${car.transmission}</div>
                    </div>
                    <div class="spec">
                        <div class="spec-icon"><img src="air-conditioner.png" alt="Ac"></div>
                        <div class="spec-label">AC</div>
                        <div class="spec-value">${car.ac}</div>
                    </div>
                </div>

                <div class="car-pricing">
                    <div class="price">RS.${car.price}<span>/day</span></div>
                    <a href="#contact" class="btn btn1">Book Now</a>
                </div>
            </div>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
   
    triggerAnimations();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCars('all');
});
if(searchInput) { 
    searchInput.addEventListener('keyup', function() {
        let input = searchInput.value.toLowerCase();
        suggestionBox.innerHTML = ''; 
        if (input.length > 0) {
            let matches = carsData.filter(car => car.name.toLowerCase().includes(input));
            if (matches.length > 0) {
                suggestionBox.style.display = 'block';
                    matches.forEach(car => {
                    let div = document.createElement('div');
                    div.innerHTML = car.name;
                    
                    div.onclick = function() {
                        searchInput.value = car.name;
                        suggestionBox.style.display = 'none';
                        renderCars('all', [car]); 
                    };                  
                    suggestionBox.appendChild(div);
                });
            } else {
                suggestionBox.style.display = 'none';
            }
        } else {
            suggestionBox.style.display = 'none';
            renderCars('all');
        }
    });
}

// FILTERS
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const activeBtn = document.querySelector('.filter-btn.active');
        if(activeBtn) activeBtn.classList.remove('active');       
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter'); 
        if(searchInput) searchInput.value = ''; 
        if(suggestionBox) suggestionBox.style.display = 'none';       
        renderCars(filterValue);
    });
});
 
const menuicon = document.getElementById('menuicon');
const menu = document.getElementById('menu'); 

menuicon.addEventListener('click', () => {
    menuicon.classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    formMessage.textContent = `Thanks ${name}! We'll contact you shortly.`;
    formMessage.className = 'form-message success';
    contactForm.reset();
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 4000);
});
renderCars();