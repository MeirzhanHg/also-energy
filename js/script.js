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
function sliderMore(containerSlider, trackSlider, prevSlide, nextSlide, sliders, slideShowDefault, slidesShowWindow) {

    let position = 0
    let slidesToShow = slideShowDefault
    if (window.innerWidth <= 1100) {
        slidesToShow = slidesShowWindow
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

sliderMore('.slider-container', '.slider-track', '.prev-btn', '.next-btn', '.box__item', 3, 2)




function sliderCont(sliderContent, sliderListElem, trackSlider, slideItem, arrow, prevBtn, nextBtn) {

    let line = document.querySelector('.arrow_absolute')
    let curWidth = 0

    let slider = document.querySelector(sliderContent),
        sliderList = slider.querySelector(sliderListElem),
        
        sliderTrack = slider.querySelector(trackSlider),

        slides = slider.querySelectorAll(slideItem),
        slidesCount = slides.length,
        
        arrows = document.querySelector(arrow),
        prev = document.querySelector(prevBtn),
        next = document.querySelector(nextBtn),

        slideWidth = slides[0].offsetWidth,
        slideIndex = 0,
        posInit = 0,

        posX1 = 0,
        posX2 = 0,
        posY1 = 0,
        posY2 = 0,

        posFinal = 0,


        isSwipe = false,
        isScroll = false,
        allowSwipe = true,
        transition = true,

        nextTrf = 0,
        prevTrf = 0,
        lastTrf = (slidesCount - 1) * slideWidth,
        posThreshold = slides[0].offsetWidth * 0.35,

        trfRegExp = /([-0-9.]+(?=px))/,
        swipeStartTime,
        swipeEndTime,

        getEvent = function () {
            return (event.type.search('touch') !== -1) ? event.touches[0] : event
        },

        slide = function () {
            if (document.querySelector('.project_slide-arrow')) {


                curWidth = 100 / (slides.length - slideIndex)
                line.style.width = curWidth + '%'
            }

            if (transition) {
                sliderTrack.style.transition = 'transform .5s'
            }
            sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`

            prev.classList.toggle('disabled', slideIndex === 0)
            next.classList.toggle('disabled', slideIndex === (slidesCount - 1))


        },

        swipeStart = function () {
            let evt = getEvent()



            if (allowSwipe) {

                swipeStartTime = Date.now()

                transition = true

                nextTrf = (slideIndex + 1) * -slideWidth
                prevTrf = (slideIndex - 1) * -slideWidth

                posInit = posX1 = evt.clientX

                // console.log("swipeStart posInit = " +  posInit);
                // console.log("swipeStart posX1 = " + posX1);

                posY1 = evt.clientY

                // console.log("swipeStart posY1 = " + posY1);

                sliderTrack.style.transition = ''

                // при движении пальцем по экрану — touchmove (mousemove)
                document.addEventListener('touchmove', swipeAction)
                document.addEventListener('mousemove', swipeAction)

                // при отпускании пальца — touchend (mouseup)
                document.addEventListener('touchend', swipeEnd)
                document.addEventListener('mouseup', swipeEnd)

                sliderList.classList.remove('grab')
                sliderList.classList.add('grabbing')
            }
        },

        swipeAction = function () {

            let evt = getEvent(),
                style = sliderTrack.style.transform,
                transform = +style.match(trfRegExp)[0]

            posX2 = posX1 - evt.clientX
            posX1 = evt.clientX

            posY2 = posY1 - evt.clientY
            posY1 = evt.clientY

            if (!isSwipe && !isScroll) {
                let posY = Math.abs(posY2)
                if (posY > 7 || posX2 === 0) {
                    isScroll = true
                    allowSwipe = false
                } else if (posY < 7) {
                    isSwipe = true
                }
            }

            if (isSwipe) {
                if (slideIndex === 0) {
                    if (posInit < posX1) {
                        setTransform(transform, 0)
                        return
                    } else {
                        allowSwipe = true
                    }
                }

                // запрет ухода вправо на последнем слайде
                if (slideIndex === slidesCount - 1) {
                    if (posInit > posX1) {
                        setTransform(transform, lastTrf)
                        return
                    } else {
                        allowSwipe = true
                    }
                }

                if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                    reachEdge()
                    return
                }

                sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`
            }


        },

        swipeEnd = function () {
            posFinal = posInit - posX1

            isScroll = false
            isSwipe = false

            // при движении пальцем по экрану — touchmove (mousemove)
            document.removeEventListener('touchmove', swipeAction)
            document.removeEventListener('mousemove', swipeAction)


            // при отпускании пальца — touchend (mouseup)
            document.removeEventListener('touchend', swipeEnd)
            document.removeEventListener('mouseup', swipeEnd)


            sliderList.classList.add('grab')
            sliderList.classList.remove('grabbing')

            if (allowSwipe) {
                swipeEndTime = Date.now()
                if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
                    if (posInit < posX1) {
                        slideIndex--
                    } else if (posInit > posX1) {
                        slideIndex++
                    }
                }

                if (posInit !== posX1) {
                    allowSwipe = false
                    slide()
                } else {
                    allowSwipe = true
                }

            } else {
                allowSwipe = true
            }
        },

        setTransform = function (transform, comapreTransform) {
            if (transform >= comapreTransform) {
                if (transform > comapreTransform) {
                    sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`
                }
            }

            allowSwipe = false

        },

        reachEdge = function () {
            transition = false
            swipeEnd()
            allowSwipe = true
        }

    slide()

    console.log(slides)
    sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'
    sliderList.classList.add('grab')

    sliderTrack.addEventListener('transitionend', () => allowSwipe = true)

    // При касании пальцем срабатывает событие touchstart
    slider.addEventListener('touchstart', swipeStart)

    // при зажатии мыши mousedown
    slider.addEventListener('mousedown', swipeStart)

    arrows.addEventListener('click', function () {

        let target = event.target

        if (target.classList.contains(nextBtn.slice(1))) {
            slideIndex++
        } else if (target.classList.contains(prevBtn.slice(1))) {
            slideIndex--
        } else {
            return
        }

        slide()
    })
}

sliderCont('.certificate__wrapper', '.slider-certificate', '.slider-track-certificate', '.certificate-box', '.certificate__btns', '.prev-btn-certificate', '.next-btn-certificate')

// sliderCont('.slider-featured', '.featured-slider-list', '.featured-slider-track', '.featured-inner', '.featured-arrow', '.prev-featured', '.next-featured')

// СОКРАТИТЬ ТЕКСТ

function truncateText(selector, maxLength) {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
        const text = el.textContent.trim()
        if (text.length > maxLength) {
            el.textContent = text.slice(0, maxLength) + '...'
        }
    })
}


truncateText('.products__label', 95)