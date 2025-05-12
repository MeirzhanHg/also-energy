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

// Прокрутка при клике

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.toggle('_lock');
                iconMenu.classList.toggle('_active');
                menuBody.classList.toggle('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
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
        showSlides(slideIndex += n)
    }

    try {
        const prevBtn = document.querySelector(prev),
            nextBtn = document.querySelector(next)

        prevBtn.addEventListener('click', () => {
         
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
            }, 5000)
        } else {
            paused = setInterval(function () {
                plusSlides(1)
                items[slideIndex - 1].classList.remove('slideInLeft')
                items[slideIndex - 1].classList.add('slideInRight')
            }, 5000)
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

const images = () => {
    const imgPopup = document.createElement('div'),
        workSection = document.querySelector('.certificate-page'),
        bigImage = document.createElement('img')

    imgPopup.classList.add('popup')
    workSection.appendChild(imgPopup)

    imgPopup.style.justifyContent = 'center'
    imgPopup.style.alignItems = 'center'
    imgPopup.style.display = 'none'

    imgPopup.appendChild(bigImage)

    workSection.addEventListener('click', (e) => {
        e.preventDefault()

        let target = e.target
        console.log(target)

        if (target && target.classList.contains('preview')) {
            imgPopup.style.display = 'flex'
            const path = target.getAttribute('src')
            bigImage.setAttribute('src', path)
            document.body.style.overflow = 'hidden'
        }

        if (target && target.matches('div.popup')) {
            imgPopup.style.display = 'none'
            document.body.style.overflow = ''
        }
    })
}

images()

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

// Валидация формы

function validateForm(formSelector) {
    const form = document.querySelector(formSelector)
    if (!form) return

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const name = form.querySelector('input[name="name"]')
        const phone = form.querySelector('input[name="phone"]')

        let valid = true
        let errors = []

        // Очистка старых ошибок
        form.querySelectorAll('.error-message').forEach(el => el.remove())

        // Name
        if (!name.value || name.value.trim().length < 2) {
            valid = false
            showError(name, name.value ? 'Введите минимум 2 символа' : 'Пожалуйста, введите свое имя')
        }

        // Phone
        if (!phone.value || !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone.value)) {
            valid = false
            showError(phone, 'Пожалуйста, введите свой номер телефона')
        }


    })

    function showError(input, message) {
        const error = document.createElement('div')
        error.className = 'error-message'
        error.style.color = 'red'
        error.style.fontSize = '14px'
        error.style.marginTop = '5px'
        error.textContent = message
        input.parentNode.appendChild(error)
    }
}

// Подключаем к формам
validateForm('#consultation-form')
validateForm('#modal-form')

// Маска для телефона
function maskPhone(inputSelector) {
    const phoneInputs = document.querySelectorAll(inputSelector)

    phoneInputs.forEach(input => {
        input.addEventListener('input', onInput)
        input.addEventListener('focus', onInput)
        input.addEventListener('blur', onBlur)
        input.addEventListener('keydown', onKeyDown) // Обработчик для backspace
    })

    function onInput(e) {
        let input = e.target
        let value = input.value.replace(/\D/g, '') // Убираем все нецифровые символы

        if (value.startsWith('8')) value = '7' + value.slice(1) // Если начинается с 8, заменяем на 7
        if (!value.startsWith('7')) value = '7' + value // Если не начинается с 7, добавляем 7

        let result = '+7 (' // Маска
        if (value.length > 1) result += value.slice(1, 4)
        if (value.length >= 4) result += ') ' + value.slice(4, 7)
        if (value.length >= 7) result += '-' + value.slice(7, 9)
        if (value.length >= 9) result += '-' + value.slice(9, 11)

        input.value = result
    }

    function onBlur(e) {
        let input = e.target
        const digits = input.value.replace(/\D/g, '') // Получаем только цифры

        // Если длина меньше 10 символов (не полный номер), не очищаем поле
        if (digits.length < 10) {
            // Оставляем поле как есть, без очистки
        }
    }

    function onKeyDown(e) {
        let input = e.target
        if (e.key === "Backspace") {
            let value = input.value
            const cursorPosition = input.selectionStart

            // Убираем дефисы, пробелы и скобки при backspace
            if (value[cursorPosition - 1] === '-' || value[cursorPosition - 1] === ' ' || value[cursorPosition - 1] === '(' || value[cursorPosition - 1] === ')') {
                input.value = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition)
                input.setSelectionRange(cursorPosition - 1, cursorPosition - 1)
                e.preventDefault() // Предотвращаем стандартное поведение backspace
            }
        }
    }
}

maskPhone('input[name="phone"]')



// Обработка формы
const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так!'
}

document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const statusMessage = document.createElement('img')
        statusMessage.src = message.loading
        statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
    `
        form.insertAdjacentElement('afterend', statusMessage)

        const xhr = new XMLHttpRequest()
        const formData = new FormData(form)

        xhr.open('POST', 'mailer/smart.php', true)

        xhr.onload = function () {

            if (xhr.status === 200) {
                form.querySelectorAll('input').forEach(function (input) {
                    input.value = ''
                })

                showThanksModal(message.success)
                form.reset()
            } else {
                showThanksModal(message.failure)
            }

            console.timeEnd('formSend')

            statusMessage.remove()
        }

        xhr.onerror = function () {
            showThanksModal(message.failure)
            statusMessage.remove()
        }
        console.time('formSend')
        xhr.send(formData)
    })
})

function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog')

    prevModalDialog.classList.add('hide')
    openModal('.modal')

    const thanksModal = document.createElement('div')
    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `
    document.querySelector('.modal').append(thanksModal)
    setTimeout(() => {
        thanksModal.remove()
        prevModalDialog.classList.add('show')
        prevModalDialog.classList.remove('hide')
        closeModal('.modal')
    }, 4000)
}

// Modal window

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector)
    modal.classList.add('hide')
    modal.classList.remove('show')
    document.body.style.overflow = ''
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector)
    modal.classList.add('show')
    modal.classList.remove('hide')
    document.body.style.overflow = 'hidden'

}

function modal(triggerSelector, modalSelector) {
    // Modal

    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector)

    modalTrigger.forEach(item => {
        item.addEventListener('click', () => openModal(modalSelector))
    })

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector)
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector)
        }
    })

}

modal('[data-modal]', '.modal')