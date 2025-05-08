// script.js

// Sahifa yuklanganda ishlaydigan funksiya
document.addEventListener('DOMContentLoaded', function() {
    // Logotip elementini olish
    const companyLogo = document.getElementById('companyLogo');

    // Logotip manzilini o'rnatish (bu yerga logotipingizning URL manzilini qo'ying)
    // Agar logotip manzili bo'lsa, uni ko'rsatish
    const logoUrl = 'https://placehold.co/150x80/ffffff/000000?text=TOJMAHAL+GROUP'; // Bu yerga logotip URL'ini qo'ying
    if (logoUrl) {
        companyLogo.src = logoUrl;
        companyLogo.style.display = 'block'; // Logotipni ko'rsatish
    }

    // Kartochkalarga animatsiya qo'shish (hover effekti CSSda berilgan)
    // Qo'shimcha JavaScript animatsiyalari uchun bu yerga kod yozishingiz mumkin
    const animatedCards = document.querySelectorAll('.animated-card');

    animatedCards.forEach(card => {
        // Misol: Kartochka bosilganda biron bir ish qilish
        card.addEventListener('click', function() {
            // console.log(this.querySelector('h2').innerText + ' bosildi');
            // Bu yerga navigatsiya logikasini qo'shishingiz mumkin,
            // lekin hozirda navigatsiya HTML a taglari orqali amalga oshiriladi.
        });
    });

    // Navbar toggler (mobil ko'rinishda menyuni ochish/yopish) Bootstrap JS tomonidan boshqariladi.
    // Agar qo'shimcha JavaScript funksiyalari kerak bo'lsa, shu yerga qo'shing.

    // Footer uchun joriy yilni o'rnatish HTML ichidagi script tagida amalga oshirildi.
    // Agar uni bu yerga ko'chirmoqchi bo'lsangiz, quyidagi kodni faollashtiring:
    /*
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    */

    // Boshqa interaktiv elementlar uchun JavaScript kodini shu yerga qo'shishingiz mumkin
});
