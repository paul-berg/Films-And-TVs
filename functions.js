import * as consts from './consts.js'

export function tryAutorize() {
    if (!consts.vars.currentUserLogin && !consts.vars.currentUserId && localStorage.getItem('lastUser')) {
        consts.vars.currentUserLogin = JSON.parse(localStorage.getItem('lastUser')).login
        consts.vars.currentUserId = JSON.parse(localStorage.getItem('lastUser')).id
        consts.vars.isAdmin = JSON.parse(localStorage.getItem('lastUser')).isAdmin
        consts.vars.isLoggedIn = true
    }
    checkIsLoggedIn()
}
export function checkIsLoggedIn() {
    if (!consts.vars.isLoggedIn) {
        consts.loginButton.hidden = false
        consts.userMenuButton.hidden = true

    } else {
        consts.loginButton.hidden = true
        consts.userMenuButton.hidden = false
        consts.userMenuButton.textContent = consts.vars.currentUserLogin
    }
}
export function logOut() {
    // выйти из аккаунта
    localStorage.removeItem('lastUser')
    consts.vars.currentUserLogin = ''
    consts.vars.currentUserId = ''
    consts.vars.isAdmin = false
    consts.vars.isLoggedIn = false
    consts.userMenuList.classList.remove('makeVisible')
    tryAutorize()
    goMain()
}
export function showPassword(checkbox, passwordField) {
    if (checkbox.checked) {
        passwordField.type = 'text'
    } else { passwordField.type = 'password' }
}
export function goWatchList() {
    location.hash = '#personalWatchlist'
}
export function editProfile() {
    location.hash = '#editProfile'
}
export function goSearchResult() {
    location.hash = '#searchResult'
}
export function goMain() {
    location.hash = '#main'
}
export function goToSearchPage() {
    location.hash = '#listOfSearchResults'
}
export function createTrailerFrame(response, placeToPaste, classTrailer) {
    const container = document.createElement('div')
    container.style.width = '100%'
    placeToPaste.append(container)
    let trailerFrame = document.createElement('iframe')
    trailerFrame.classList.add(classTrailer)
    trailerFrame.src = response.trailer.linkEmbed + '?width=' + container.offsetWidth
    trailerFrame.allowfullscreen
    trailerFrame.frameborder = "0"
    trailerFrame.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    container.append(trailerFrame)
}
export function validateEmail(value) {
    return !!value.indexOf('@')
}
export function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}
export function createAddToWatchButton(placeToPaste, data) {
    let newaddToWatchButton = document.createElement('div')
    newaddToWatchButton.classList.add('addToWatchButton')
    checkAddToWLButton(data, newaddToWatchButton)
    newaddToWatchButton.addEventListener('click', () => addToWatchlist(data, newaddToWatchButton))
    placeToPaste?.append(newaddToWatchButton)
}
export function checkAddToWLButton(data, newAddToWatchButton) {
    if (consts.vars.currentUserId) {
        consts.queryDatabase(consts.prefix + `watch-list/?userId=${consts.vars.currentUserId}`).then(res => {
            if (res.some(el => el.imDbId === data.id)) {
                newAddToWatchButton.classList.add('added')
            }
        })
    }
}
export function addToWatchlist(data, newaddToWatchButton) {
    if (consts.vars.currentUserId) {
        consts.queryDatabase(consts.prefix + `watch-list/?userId=${consts.vars.currentUserId}`).then(res => {
            if (res.some(wList => wList.imDbId === data.id)) {
                let existingWList = res.find(wList => wList.imDbId === data.id)
                //удалить
                consts.queryDatabase(consts.prefix + `watch-list/${existingWList.id}`, { method: 'DELETE' })
            } else {
                //добавить в watch-list
                consts.queryDatabase(consts.prefix + 'watch-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: consts.vars.currentUserId,
                        wantToSee: true,
                        imDbId: data.id
                    }),
                })
            }
            newaddToWatchButton.classList.toggle('added')
        })
    } else {
        location.hash = '#login'
    }
}
export function createNewContainer(content, placeToPaste, classEssential, newClass) {
    let newContainer
    if (!content) {
        newContainer = document.createElement('div')
        newContainer.classList.add('skeleton', classEssential)
        placeToPaste.append(newContainer)
    } else {
        if (document.querySelector(`.${classEssential}`)) {
            newContainer = document.querySelector(`.${classEssential}`)
            newContainer.classList.remove('skeleton', classEssential)
        } else {
            newContainer = document.createElement('div')
            placeToPaste.append(newContainer)
        }
    }
    if (newClass) {
        newContainer.classList.add(newClass)
    }
    return newContainer
}
export function createNewInfoSpan(content, placeToPaste, newClass) {
    let newInfoSpan = document.createElement('span')
    if (newClass) {
        newInfoSpan.classList.add(newClass)
    }
    newInfoSpan.textContent = content
    placeToPaste.append(newInfoSpan)
    return newInfoSpan
}
export function createNewInfoDiv(content, placeToPaste, classEssential, newClass, name = '') {
    let newInfoDiv
    if (!content) {
        newInfoDiv = document.createElement('div')
        newInfoDiv.classList.add('skeleton', classEssential)
        placeToPaste.append(newInfoDiv)
    } else {
        if (document.querySelector(`.${classEssential}`)) {
            newInfoDiv = document.querySelector(`.${classEssential}`)
            newInfoDiv.classList.remove('skeleton', classEssential)
        } else {
            newInfoDiv = document.createElement('div')
            placeToPaste.append(newInfoDiv)

        }
        newInfoDiv.textContent = `${name}${content}`
    }
    if (newClass) {
        newInfoDiv.classList.add(newClass)
    }
    return newInfoDiv
}
export function createVericalTab(film, placeToPaste) {
    let newPosterTab = document.createElement('div')
    newPosterTab.classList.add('verticalList')
    let newPosterContainer = document.createElement('div')
    newPosterContainer.classList.add('newPosterContainer', 'addToWatch')
    let newPoster = document.createElement('img')
    newPoster.classList.add('poster', 'verticalListImg')
    newPoster.src = film.image
    newPoster.addEventListener('click', () => {
        consts.vars.searchResultId = film.id
        localStorage.setItem('lastRequest', consts.vars.searchResultId)
        location.hash = '#searchResult'
    })
    createAddToWatchButton(newPosterContainer, film)
    newPosterContainer.append(newPoster)
    newPosterTab.append(newPosterContainer)
    let newInfoContainer = document.createElement('div')
    newInfoContainer.classList.add('newInfoContainer')
    createNewInfoDiv(film.title, newInfoContainer, 'verticalTabInfoTitle', 'verticalTabTitle')
    film.year && createNewInfoDiv(film.year, newInfoContainer, 'verticalTabYear', 'verticalTabInfo')
    film.runtimeStr && createNewInfoDiv(film.runtimeStr, newInfoContainer, 'verticalTabRuntime', 'verticalTabInfo')
    film.directors && createNewInfoDiv(film.directors, newInfoContainer, 'verticalTabDirectors', 'verticalTabInfo', 'Dir.: ')
    if (film.genreList) {
        let newGenresList = film.genreList.map(el => el.key)
        if (newGenresList.length > 3) {
            newGenresList.splice(3, newGenresList.length - 1, '..')
        }
        createNewInfoDiv(`${newGenresList.join(', ')}`, newInfoContainer, 'verticalTabGenres', 'verticalTabInfo')
    }
    createNewInfoDiv(film.stars, newInfoContainer, 'verticalTabStars', 'verticalTabInfo', 'Stars: ')
    newPosterTab.append(newInfoContainer)
    placeToPaste.append(newPosterTab)
}
export function createVerticalList(response, placeToPaste, wordsForSearch = '') {
    if (placeToPaste === consts.listOfSearchResults && localStorage.getItem(`${wordsForSearch}`) && consts.vars.addToSearchUrl) {
        console.log(response)
        response.forEach(film => createVericalTab(film, consts.listOfSearchResults))
        console.log('gotFromLS')
    } else {
        let newArr = []
        newArr = response.map(film => {
            if (placeToPaste === consts.listOfSearchResults) {
                return fetch(`https://imdb-api.com/en/API/Title/k_ibyc30ko/${film.id}`).then((res) => res.json())
            } else {
                return fetch(`https://imdb-api.com/en/API/Title/k_ibyc30ko/${film.imDbId}`).then((res) => res.json())
            }
        })
        Promise.all(newArr).then(res => {
            if (placeToPaste === consts.listOfSearchResults && !consts.vars.addToSearchUrl) {
                localStorage.setItem(`${wordsForSearch}`, JSON.stringify(res))
            }
            res.forEach(film => createVericalTab(film, placeToPaste))
        })
    }
}
export function createPosterTab(data, pointToPaste, z) {
    let newPosterTab = createNewContainer(data, pointToPaste, `posterTab${z}`, 'posterTab')
    newPosterTab.classList.add('backgroundDarkGray')
    let newPosterContainer
    function createNewPoster(data, placeToPaste, classEssential, className) {
        if (!data) {
            newPosterContainer = createNewContainer(data, placeToPaste, classEssential, 'newPosterContainer')
            newPosterContainer.classList.add('addToWatch', 'skeleton')
            placeToPaste.append(newPosterContainer)
        } else {
            if (document.querySelector(`.${classEssential}`)) {
                newPosterContainer = document.querySelector(`.${classEssential}`)
                newPosterContainer.classList.remove('skeleton', classEssential)
            } else {
                newPosterContainer = createNewContainer(data, placeToPaste, classEssential, 'newPosterContainer')
                newPosterContainer.classList.remove('addToWatch', classEssential)
                newPosterContainer.classList.add('addToWatch')
                placeToPaste.append(newPosterContainer)
            }
            newPosterContainer.classList.remove('skeleton')
            let newPoster = document.createElement('img')
            newPosterContainer.append(newPoster)
            newPoster.classList.add(className)
            newPoster.src = data.image
            newPoster.addEventListener('click', () => {
                consts.vars.searchResultId = data.id
                localStorage.setItem('lastRequest', consts.vars.searchResultId)
                if (location.hash === '#searchResult') {
                    window.history.go()
                } else {
                    goSearchResult()
                }
            })
        }

    }
    createNewPoster(data, newPosterTab, `newPosterImage${z}`, 'poster')
    createNewInfoDiv(data.title, newPosterTab, `posterTabTitle${z}`, 'posterTabInfo')
    if (data.genreList) {
        createNewInfoDiv(data.genreList[1]?.key, newPosterTab, `posterTabGenres${z}`, 'posterTabInfo', `${data.genreList[0].key}, `)
    }
    if (pointToPaste === consts.inTheaters) {
        createNewInfoDiv(data.metacriticRating, newPosterTab, 'posterTabInfo', `posterTabMetaRate${z}`, 'Metacritic rating:')
    }
    if (data.imDbRating) { createNewInfoDiv(data.imDbRating, newPosterTab, `posterTabIMDb${z}`, 'posterTabInfo', 'IMDb rating:') }
    if (data.rank) { createNewInfoDiv(data.rank, newPosterTab, `posterTabRank${z}`, 'posterTabInfo', 'Rank:') }
    if (data.rankUpDown) { createNewInfoDiv(data.rankUpDown, newPosterTab, `posterTabMetaRankChange${z}`, 'posterTabInfo', 'Rank changing: ') }

    function createRectangleWLButton(data, placeToPaste, classEssential) {
        let newButton
        if (!data) {
            newButton = document.createElement('div')
            newButton.classList.add('skeleton', 'watchButton', classEssential)
            placeToPaste.append(newButton)
        } else {
            if (document.querySelector(`.${classEssential}`)) {
                {
                    newButton = document.querySelector(`.${classEssential}`)
                    newButton.classList.remove('skeleton', classEssential)
                    newButton.remove()
                    newButton = document.createElement('button')
                    newButton.classList.add('watchButton')
                    placeToPaste.append(newButton)
                }
            } else {
                newButton = document.createElement('button')
                newButton.classList.add('watchButton')
                placeToPaste.append(newButton)
            }
            newButton.textContent = 'Watchlist'
            checkAddToWLButton(data, newButton)
            newButton.addEventListener('click', () => addToWatchlist(data, newButton))
        }
    }
    createRectangleWLButton(data, newPosterTab, `watchButton${z}`)
    createAddToWatchButton(newPosterContainer, data)
    pointToPaste.classList.add('posterTabString')
}
export function createChangingList(response, placeToPaste, timeToChange) {
    let i = 0
    let startPos
    let finishPos
    let runningFunction
    let newRightButton = document.createElement('button')
    newRightButton.classList.add('changeDisplayingFilms', 'rightPosition')
    let newLeftButton = document.createElement('button')
    newLeftButton.classList.add('changeDisplayingFilms', 'leftPosition')
    function changePosterTab(data, placeToPaste, n, i) {
        startPos = n * i
        finishPos = startPos + n
        let displayedFilms
        if (data) {
            displayedFilms = data.slice(startPos, finishPos)
        } else {
            displayedFilms = []
            displayedFilms.fill('', startPos, finishPos)
        }
        let z = 100
        displayedFilms.forEach(movie => {
            createPosterTab(movie, placeToPaste, z)
            z++
        })
        placeToPaste.append(newRightButton)
        placeToPaste.append(newLeftButton)
        if (finishPos === response.length - 1) {
            newRightButton.hidden = true
        } else {
            newRightButton.hidden = false
        }
        if (startPos === 0) {
            newLeftButton.hidden = true
        } else {
            newLeftButton.hidden = false
        }
    }

    newLeftButton.addEventListener('click', function () {
        clearContainer(placeToPaste)

        stop()
        i = i - (1 / 6)
        changePosterTab(response, placeToPaste, 6, i)
        start()
    })
    newRightButton.addEventListener('click', function () {
        clearContainer(placeToPaste)
        if (finishPos >= response.length - 1) {
            i = 0
        }
        stop()
        i = i + (1 / 6)
        changePosterTab(response, placeToPaste, 6, i)
        start()
    })
    changePosterTab(response, placeToPaste, 6, i)
    function start() {
        runningFunction = setInterval(function () {
            clearContainer(placeToPaste)
            if (finishPos >= response.length - 1) {
                i = 0
            }
            changePosterTab(response, placeToPaste, 6, i++)
        }, timeToChange)
    }
    start()
    function stop() {
        clearInterval(runningFunction)
    }
    addEventListener('hashchange', () => {
        if (location.hash !== '#consts.main' || location.hash !== '') {
            stop()
        }
        else start()
    })
}
export function makeBodyCorrectColor() {
    if (location.hash === '#main' || location.hash === '') {
        consts.body.classList.remove('makeBodyWhite')
    } else {
        if (!consts.body.classList.contains('makeBodyWhite')) {
            consts.body.classList.add('makeBodyWhite')
        }
    }
}

