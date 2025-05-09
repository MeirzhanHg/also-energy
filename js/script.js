"use strict"

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i)
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i)
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i)
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i)
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows())
    }
}

if (isMobile.any()) {
    document.body.classList.add('_touch')

    let menuArrows = document.querySelectorAll('.menu__arrow')
    if (menuArrows.length > 0) {
        for (let index = 0; index < menuArrows.length; index++) {
            const menuArrow = menuArrows[index]
            menuArrow.addEventListener("click", function (e) {
                menuArrow.parentElement.classList.toggle('_active')
            })
        }
    }

} else {
    document.body.classList.add('_pc')
}

// Меню бургер
const iconMenu = document.querySelector('.menu__icon')
const menuBody = document.querySelector('.menu__body')

if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
        document.body.classList.toggle('_lock')
        iconMenu.classList.toggle('_active')
        menuBody.classList.toggle('_active')

    })
}

// SLIDER

const sliders = (slides, dir, prev, next) => {
    let slideIndex = 1,
        paused = false

    const items = document.querySelectorAll(slides)

    function showSlides(n) {
        if (n > items.length) {
            slideIndex = 1
        }

        if (n < 1) {
            slideIndex = items.length
        }

        items.forEach(item => {
            item.classList.add("animated")
            item.style.display = "none"
        })

        items[slideIndex - 1].style.display = 'block'
    }

    showSlides(slideIndex)

    function plusSlides(n) {
        console.log('click')
        showSlides(slideIndex += n)
    }

    try {
        const prevBtn = document.querySelector(prev),
            nextBtn = document.querySelector(next)

        prevBtn.addEventListener('click', () => {
            console.log('click')
            plusSlides(-1)
            items[slideIndex - 1].classList.remove('slideInRight')
            items[slideIndex - 1].classList.add('slideInLeft')
        })

        nextBtn.addEventListener('click', () => {
            plusSlides(1)
            items[slideIndex - 1].classList.remove('slideInLeft')
            items[slideIndex - 1].classList.add('slideInRight')
        })
    } catch (e) { }

    function activateAnimation() {
        if (dir === 'vertical') {
            paused = setInterval(function () {
                plusSlides(1)
                items[slideIndex - 1].classList.add('slideInDown')
            }, 4000)
        } else {
            paused = setInterval(function () {
                plusSlides(1)
                items[slideIndex - 1].classList.remove('slideInLeft')
                items[slideIndex - 1].classList.add('slideInRight')
            }, 4000)
        }
    }
    activateAnimation()

    items[0].parentNode.addEventListener('mouseenter', () => {
        clearInterval(paused)
    })
    items[0].parentNode.addEventListener('mouseleave', () => {
        activateAnimation()
    })

}

sliders('.slider-item', '', '.main-prev-btn', '.main-next-btn')

// Много слайдера
function sliderMore(containerSlider, trackSlider, prevSlide, nextSlide, sliders) {

    let position = 0
    let slidesToShow = 3
    if (window.innerWidth <= 1100) {
        slidesToShow = 2
    }
    if (window.innerWidth <= 600) {
        slidesToShow = 1
    }

    const slidesToScroll = 1
    const container = document.querySelector(containerSlider)
    const track = document.querySelector(trackSlider)

    const btnPrev = document.querySelector(prevSlide)
    const btnNext = document.querySelector(nextSlide)
    const items = document.querySelectorAll(sliders)

    const itemsCount = items.length
    const itemWidth = container.clientWidth / slidesToShow
    const movePosition = slidesToScroll * itemWidth

    let touchStartX = 0
    let touchEndX = 0


    track.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX
    })

    track.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX
        handleSwipe()
    })

    function handleSwipe() {
        const swipeThreshold = Math.abs(touchStartX - touchEndX)

        if (swipeThreshold < 50) {
            // Consider it as a tap or negligible swipe
            return
        }

        if (touchStartX > touchEndX) {
            // Swipe left, move to next slide
            moveSlide('next')
        } else {
            // Swipe right, move to previous slide
            moveSlide('prev')
        }
    }

    function moveSlide(direction) {

        if (direction === 'next') {
            position -= movePosition
            position = Math.max(position, -(itemsCount - slidesToShow) * itemWidth)
        } else {
            position += movePosition
            position = Math.min(position, 0)
        }

        setPosition()
        checkBtns()
    }

    // ............................

    items.forEach((item) => {
        item.style.minWidth = `${itemWidth - 15}px`
    })

    btnNext.addEventListener('click', () => {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth

        position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth

        setPosition()
        checkBtns()

    })

    btnPrev.classList.add('disabled__btn')

    btnPrev.addEventListener('click', () => {

        const itemsLeft = Math.abs(position) / itemWidth

        position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth

        setPosition()
        checkBtns()

    })

    const setPosition = () => {
        track.style.transform = `translateX(${position}px)`
    }

    const checkBtns = () => {
        btnPrev.disabled = position === 0
        btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth
    }

    checkBtns()
}

sliderMore('.slider-container', '.slider-track', '.prev-btn', '.next-btn', '.box__item')


// СОКРАТИТЬ ТЕКСТ

function truncateText(selector, maxLength) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    const text = el.textContent.trim();
    if (text.length > maxLength) {
      el.textContent = text.slice(0, maxLength) + '...';
    }
  });
}


truncateText('.products__label', 95)