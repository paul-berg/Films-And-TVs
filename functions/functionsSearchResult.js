import * as consts from '../consts.js'
import * as functions from '../functions.js'
export function getResultData(id) {
    if (!localStorage.getItem(id)) {
        async function f(id) {
            try {
                let response = await fetch(`https://imdb-api.com/en/API/Title/k_ibyc30ko/${id}/Trailer`)
                let idResult = await response.json()
                localStorage.setItem(id, JSON.stringify(idResult))
                return idResult
            } catch (err) {
                console.log(err)
            }
        }
        return f(id).then(function (result) { return result })
    } else {
        return Promise.resolve(JSON.parse(localStorage.getItem(id)))
    }
}
export function renderSearchResultPage(response) {
    functions.createNewInfoDiv(response.title, consts.searchResult, 'filmPageTitle', 'searchResultTitle')
    let searchResultUnderTitle = functions.createNewContainer(response, consts.searchResult, 'searchResultUnderTitle', 'row')
    searchResultUnderTitle.classList.add('searchResultUnderTitle')
    let yearLengthRating = functions.createNewContainer(response, searchResultUnderTitle, 'yearLengthRating', 'row')
    yearLengthRating.classList.add('searchResultSelectedInfoTitle')
    yearLengthRating.innerHTML = `${response.year} · ${response.runtimeStr} · ${response.contentRating}`
    let imdbRating = functions.createNewInfoDiv(`${response.imDbRating}/10`, searchResultUnderTitle, 'filmPageIMDb', 'searchResultInfo')
    imdbRating.classList.add('imdbRating')
    let visualInfoContainer = document.createElement('div')
    visualInfoContainer.classList.add('row', 'visualInfoWrapper')
    let posterWrapper = document.createElement('div')
    posterWrapper.classList.add('posterWrapper', 'addToWatch')
    let poster = document.createElement('img')
    poster.classList.add('poster', 'mainPoster')
    poster.src = response.image
    posterWrapper.append(poster)
    visualInfoContainer.append(posterWrapper)
    functions.createAddToWatchButton(posterWrapper, response)
    let videoWrapper = document.createElement('div')
    visualInfoContainer.append(videoWrapper)
    consts.searchResult.append(visualInfoContainer)
    videoWrapper.classList.add('videoWrapper')
    functions.createTrailerFrame(response, videoWrapper, 'searchResultTrailer')
    function createButtonList(arrOfData, response) {
        let i = 0
        let keywordWrapper = functions.createNewContainer(response, consts.searchResult, 'keywordWrapper', 'row')
        arrOfData.forEach(el => {
            if (typeof el !== 'object') {
                functions.createNewInfoDiv(el, keywordWrapper, `keyword${i}`, 'tagWords')
            } else {
                functions.createNewInfoDiv(el.key, keywordWrapper, `keyword${i}`, 'tagWords')
            }
            i++
        })
    }
    createButtonList(response.genreList, response)
    let j = 0
    function createTitlePlotInfobox(title, plot, response, j) {
        let newField = functions.createNewContainer(response, consts.searchResult, `informationBox${j}`, 'row')
        newField.classList.add('searchResultSelectedInfo')
        functions.createNewInfoSpan(title, newField, 'searchResultSelectedInfoTitle')
        functions.createNewInfoSpan(plot, newField, 'searchResultSelectedInfoPlot')
        j++
    }
    createTitlePlotInfobox('director: ', response.directors, response, j)
    createTitlePlotInfobox('writers: ', response.writers, response, j)
    createTitlePlotInfobox('stars: ', response.stars, response, j)
    let topCastContainer = document.createElement('div')
    topCastContainer.classList.add('topCastContainer')
    function createActorInfoTab(actor, placeToPaste) {
        let newActorDiv = document.createElement('div')
        newActorDiv.classList.add('newActorDiv')
        placeToPaste.append(newActorDiv)
        let newImgWrapper = document.createElement('div')
        newImgWrapper.classList.add('newImgWrapper')
        newActorDiv.append(newImgWrapper)
        let newImg = document.createElement('img')
        newImg.classList.add('newImg')
        newImg.src = actor.image
        newImgWrapper.append(newImg)
        let newName = document.createElement('span')
        newName.classList.add('actorName')
        newName.textContent = actor.name
        newActorDiv.append(newName)
    }
    response.actorList.forEach(actor => {
        createActorInfoTab(actor, topCastContainer)
    })
    consts.searchResult.append(topCastContainer)
    if (response.similars.length) {
        functions.createNewInfoDiv('More like this', consts.searchResult, `filmPageSimilarsTitle`, 'mainTitle')
        let similarsContainer = functions.createNewContainer(response, consts.searchResult, `similarsContainerEss`, `similarsContainer`)
        functions.createChangingList(response.similars, similarsContainer, 20000)
    }
    functions.createNewInfoDiv('Storyline', consts.searchResult, `filmPagePlotTitle`, 'mainTitle')
    let plot = functions.createNewInfoDiv(response.plot, consts.searchResult, `filmPagePlotContent`, 'searchResultInfo')
    plot.classList.add('plot')
    response.tagline && createTitlePlotInfobox('Taglines: ', response.tagline, response, j)
    createButtonList(response.keywordList, response)
    let fieldForReview = functions.createNewContainer(response, consts.searchResult, `fieldForReview`)
    let reviewWindow = document.querySelector('.reviewWindow')
    if (consts.vars.isLoggedIn) {
        let buttonForReview = document.createElement('button')
        buttonForReview.classList.add('reviewButton')
        buttonForReview.textContent = '+ Review'
        buttonForReview.addEventListener('click', () => {
            reviewWindow.classList.add('makeVisible')
        })
        fieldForReview.append(buttonForReview)
    }
    functions.createNewInfoDiv('User reviews', consts.searchResult, `filmPageReviewTitle`, 'mainTitle')
    function closeReviewWindow() {
        if (reviewWindow.classList.contains('makeVisible')) {
            reviewWindow.classList.remove('makeVisible')
        }
    }
    document.querySelector('.reviewImageContainer .poster').src = response.image
    document.querySelector('.reviewHeaderTitle').textContent = response.title
    let containSpoilers
    consts.containSpoilersRadio.forEach(el => {
        el.addEventListener('change', () => {
            let radioValue = el.value
            if (radioValue === '1') {
                containSpoilers = !!radioValue
            } else containSpoilers = !radioValue
        })
    })
    function addOnFocus(field) {
        field.classList.remove('makeVisible')
    }
    function addOnBlur(field, validation) {
        if (!field.value) {
            validation.textContent = 'A required field is missing.'
            validation.classList.add('makeVisible')
        }
    }
    consts.titleForReview.addEventListener('blur', () => addOnBlur(consts.titleForReview, consts.validationTitle))
    consts.textareaForReview.addEventListener('blur', () => addOnBlur(consts.textareaForReview, consts.validationPlot))
    consts.titleForReview.addEventListener('focus', () => addOnFocus(consts.validationTitle))
    consts.textareaForReview.addEventListener('focus', () => addOnFocus(consts.validationPlot))
    consts.buttonToSubmitReview.addEventListener('click', function createReview(e) {
        e.preventDefault()
        // Создание комментария
        function createDate(dateValueMs) {
            let currentDate
            if (dateValueMs) {
                currentDate = new Date(dateValueMs)
            } else {
                currentDate = new Date()
            }
            let currentDay = currentDate.getDate()
            if (currentDay < 10) {
                currentDay = `0${currentDay}`
            }
            let currentMonth = currentDate.getMonth() + 1
            if (currentMonth < 10) {
                currentMonth = `0${currentMonth}`
            }
            let currentYear = currentDate.getFullYear()
            return `${currentYear}-${currentMonth}-${currentDay}`
        }
        let todayDate = createDate()
        function checkForReview(value, validation) {
            if (value || typeof value === 'boolean') {
                if (validation.classList.contains('makeVisible')) {
                    validation.classList.remove('makeVisible')
                }
                return true
            } else {
                validation.textContent = 'A required field is missing.'
                validation.classList.add('makeVisible')
                return false
            }
        }
        checkForReview(consts.titleForReview.value, consts.validationTitle)
        function checkPlotForReview() {
            if (!consts.textareaForReview.value) {
                console.log('outOfContent')
                consts.validationPlot.textContent = 'A required field is missing.'
                if (!consts.validationPlot.classList.contains('makeVisible')) {
                    consts.validationPlot.classList.add('makeVisible')
                }
                return false
            } else if (consts.textareaForReview.value.length < 15) {
                console.log('length')
                consts.validationPlot.textContent = 'Sorry, your review is too short. It needs to contain at least 150 characters.'
                if (!consts.validationPlot.classList.contains('makeVisible')) {
                    consts.validationPlot.classList.add('makeVisible')
                }
                return false
            }
            else return true
        }
        checkPlotForReview()
        console.log(checkForReview(containSpoilers, consts.validationSpoilers))
        checkForReview(containSpoilers, consts.validationSpoilers)
        if (checkForReview(consts.titleForReview.value, consts.validationTitle) && checkPlotForReview() && checkForReview(containSpoilers, consts.validationSpoilers)) {
            consts.queryDatabase(consts.prefix + 'comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: consts.titleForReview.value,
                    text: consts.textareaForReview.value,
                    containSpoilers: containSpoilers,
                    userName: consts.vars.currentUserLogin,
                    userId: consts.vars.currentUserId,
                    liked: 0,
                    disliked: 0,
                    isLikedBy: [],
                    isDislikedBy: [],
                    date: todayDate,
                    imDbId: consts.vars.searchResultId
                }),
            }).then(res => generateReview(res))
                .then(() => closeReviewWindow())
        }
    })
    document.querySelectorAll('.closeReviewContainer').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.reviewValidation').forEach(field => field.classList.remove('makeVisible'))
            closeReviewWindow()
        })
    })
    let userReviews = functions.createNewContainer(response, searchResult, `userReviewsWrapper`)
    let k = 0
    function generateReview(res) {
        let newReviewContainer = document.createElement('div')
        newReviewContainer.classList.add('newReviewContainer')
        userReviews.append(newReviewContainer)
        let newTitleLine = document.createElement('div')
        newTitleLine.classList.add('row', 'voteButtonLine')
        let newTitle = document.createElement('div')
        newTitle.classList.add('newTitle')
        newTitle.textContent = res.title
        newTitleLine.append(newTitle)
        if (consts.vars.isAdmin || res.userId === consts.vars.currentUserId) {
            let deleteButton = document.createElement('button')
            deleteButton.classList.add('reviewButton', 'deleteButton')
            deleteButton.addEventListener('click', function deleteReview() {
                consts.queryDatabase(consts.prefix + `comments/${res.id}`, { method: 'DELETE' })
                    .then(() => clearContainer(userReviews))
                    .then(() => consts.queryDatabase(consts.prefix + `comments?imDbId=${consts.vars.searchResultId}`))
                    .then(res => res.forEach(review => generateReview(review)))
            })
            newTitleLine.append(deleteButton)
        }
        newReviewContainer.append(newTitleLine)
        containSpoilers && functions.createNewInfoDiv('Warning: Spoilers!', newReviewContainer, `filmPageReviewSpoiler${k}`, 'spoiler')
        functions.createNewInfoDiv(res.text, newReviewContainer, `filmPageReviewText${k}`, `filmPageReviewSpoiler`)
        let voteButtonLine = functions.createNewContainer(response, newReviewContainer, `voteButtonLine${k}`, 'row')
        voteButtonLine.classList.add('voteButtonLine')
        let voteContainer = functions.createNewContainer(response, voteButtonLine, `voteContainerEssential${k}`, 'voteContainer')
        let likeButton = document.createElement('button')
        likeButton.classList.add('reviewButton', 'liked')
        likeButton.textContent = `helpful • ${res.liked}`
        let arrIsLikedBy = res.isLikedBy
        function checkIsCommentLiked(id) {
            if (arrIsLikedBy.includes(id)) {
                likeButton.classList.add('activated')
            }
        }
        checkIsCommentLiked(consts.vars.currentUserId)
        likeButton.addEventListener('click', () => {
            if (!likeButton.classList.contains('activated')) {
                async function f() {
                    arrIsLikedBy.push(consts.vars.currentUserId)
                    let result = await consts.queryDatabase(consts.prefix + `comments/${res.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            isLikedBy: arrIsLikedBy,
                            liked: ++res.liked
                        }),
                    })
                    likeButton.classList.toggle('activated')
                    likeButton.textContent = `helpful • ${result.liked}`
                } f()
            } else {
                async function f() {
                    arrIsLikedBy.splice(arrIsLikedBy.indexOf(consts.vars.currentUserId), 1)
                    let result = await consts.queryDatabase(consts.prefix + `comments/${res.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            liked: --res.liked,
                        }),
                    })
                    likeButton.classList.toggle('activated')
                    likeButton.textContent = `helpful • ${result.liked}`
                } f()
            }
        })
        voteContainer.append(likeButton)
        let dislikeButton = document.createElement('button')
        dislikeButton.classList.add('reviewButton', 'disliked')
        dislikeButton.textContent = `needless • ${res.disliked}`
        let arrIsDislikedBy = res.isDislikedBy
        function checkIsCommentDisliked(id) {
            if (arrIsDislikedBy.includes(id)) {
                dislikeButton.classList.add('activated')
            }
        }
        checkIsCommentDisliked(consts.vars.currentUserId)
        dislikeButton.addEventListener('click', () => {
            if (!dislikeButton.classList.contains('activated')) {
                async function f() {
                    arrIsDislikedBy.push(consts.vars.currentUserId)
                    let result = await consts.queryDatabase(consts.prefix + `comments/${res.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            isDislikedBy: arrIsDislikedBy,
                            disliked: ++res.disliked,
                        }),
                    })
                    console.log(result)
                    dislikeButton.classList.toggle('activated')
                    dislikeButton.textContent = `needless • ${result.disliked}`
                } f()
            } else {
                async function f() {
                    arrIsDislikedBy.splice(arrIsDislikedBy.indexOf(consts.vars.currentUserId), 1)
                    let result = await consts.queryDatabase(consts.prefix + `comments/${res.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            isDislikedBy: arrIsDislikedBy,
                            disliked: --res.disliked,
                        }),
                    })
                    console.log(result)
                    dislikeButton.classList.toggle('activated')
                    dislikeButton.textContent = `needless • ${result.disliked}`
                } f()
            }
        })
        voteContainer.append(dislikeButton)
        functions.createNewInfoDiv(`${res.userName} • ${res.date}`, voteButtonLine, `filmPageReviewInfo${k}`, 'newAuthor')

    }
    consts.queryDatabase(consts.prefix + `comments?imDbId=${consts.vars.searchResultId}`).then(res => res.forEach(review => generateReview(review)))
    functions.createNewInfoDiv('Details', consts.searchResult, `filmPageDetailsTitle`, 'mainTitle')
    createTitlePlotInfobox('Release date: ', response.releaseDate, response, j)
    createTitlePlotInfobox('Countries of origin: ', response.countries, response, j)
    createTitlePlotInfobox('Languages: ', response.languages, response, j)
    createTitlePlotInfobox('Production companies: ', response.companies, response, j)
    if (response.boxOffice.budget && response.boxOffice.grossUSA && response.boxOffice.cumulativeWorldwideGross) {
        functions.createNewInfoDiv('Box office', consts.searchResult, `filmPageBOTitle`, 'mainTitle')
        createTitlePlotInfobox('Budget: ', response.boxOffice.budget, response, j)
        createTitlePlotInfobox('Gross USA & Canada: ', response.boxOffice.grossUSA, response, j)
        createTitlePlotInfobox('Gross worldwide: ', response.boxOffice.cumulativeWorldwideGross, response, j)
    }
}