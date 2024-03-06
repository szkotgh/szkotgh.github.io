let body = document.querySelector('body');

let menuTitle = document.getElementById("menu-title")
let menuSubTitle = document.getElementById("menu-sub-title")
let todayScheduleBtn = document.getElementById("todaySchedule")
let todayCafeteriaBtn = document.getElementById("todayFood")

const popupTime   = 300
const changeDelay = 700

const inAnimation  = 'animate__fadeInUp'
const outAnimation = 'animate__fadeOut'

// menu title
setTimeout(function () {
    menuTitle.style.display = 'block'
    menuTitle.classList.add("animate__animated", inAnimation)
    // sub menu title
    setTimeout(function () {
        menuSubTitle.style.display = 'block'
        menuSubTitle.classList.add("animate__animated", inAnimation)
        // schedule btn
        setTimeout(function () {
            todayScheduleBtn.style.display = 'block'
            todayScheduleBtn.classList.add("animate__animated", inAnimation)
            // cafeteria btn
            setTimeout(function () {
                todayCafeteriaBtn.style.display = 'block'
                todayCafeteriaBtn.classList.add("animate__animated", inAnimation)
            }, popupTime)
        }, popupTime)
    }, popupTime)
}, popupTime)

let animateDuration = '.7s'

todayScheduleBtn.addEventListener('click', () => {
    body.classList.add("animate__animated", outAnimation)
    body.style.setProperty('--animate-duration', animateDuration);

    setTimeout(function () {
        location.href = 'schedule.html'
    }, changeDelay)
})
todayCafeteriaBtn.addEventListener('click', () => {
    body.classList.add("animate__animated", outAnimation)
    body.style.setProperty('--animate-duration', animateDuration);

    setTimeout(function () {
        location.href = 'cafeteria.html'
    }, changeDelay)
})

