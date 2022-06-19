import * as consts from './consts.js'
import * as functions from './functions.js'
import * as functionsMain from './functions/functionsMain.js'
import * as functionsAS from './functions/functionsAdvancedSearch.js'
import * as functionsSR from './functions/functionsSearchResult.js'
import * as functionsUL from './functions/functionsUserList.js'
import * as functionsSU from './functions/functionsSignUp.js'
import * as functionsLI from './functions/functionsLogIn.js'
import * as functionsEP from './functions/functionsEditProfile.js'
import * as functionsGLOSR from './functions/functionsGetListOfSearchResults.js'
if (!consts.vars.searchResultId) {
    consts.vars.searchResultId = localStorage.getItem('lastRequest')
}
functions.tryAutorize()
functions.checkIsLoggedIn()
consts.yourWatchlistButton.addEventListener('click', () => functions.goWatchList())
consts.editProfileButton.addEventListener('click', () => functions.editProfile())
consts.logOutButton.addEventListener('click', () => functions.logOut())
document.querySelectorAll('#imdbLogo').forEach(button => button.addEventListener('click', functions.goMain))
if (consts.vars.isAdmin) {
    consts.userListButton.hidden = false
    consts.userListButton.addEventListener('click', () => {
        location.hash = '#userList'
    })
} else {
    consts.userListButton.hidden = true
}
consts.searchButton.addEventListener('click', () => functionsGLOSR.getSearchResults())
document.querySelectorAll('.hoverGray').forEach(el => {
    el.addEventListener('click', () => {
        consts.userMenuList.classList.remove('makeVisible')
    })
})
consts.userMenuButton.addEventListener('click', () => {
    if (!consts.userMenuList.classList.contains('makeVisible')) {
        consts.userMenuList.classList.add('makeVisible')
    } else {
        consts.userMenuList.classList.remove('makeVisible')
    }
})
function changeLocation() {
    consts.menuBar.hidden = false
    consts.main.hidden = true
    consts.advancedSearch.hidden = true
    consts.listOfSearchResults.hidden = true
    consts.login.hidden = true
    consts.signUp.hidden = true
    consts.searchResult.hidden = true
    consts.personalWatchlist.hidden = true
    consts.editProfile.hidden = true
    consts.userList.hidden = true
    // // // //получить список пользователей
    consts.queryDatabase(consts.prefix + 'user').then(res => console.log(res))
    functions.makeBodyCorrectColor()
    switch (location.hash) {
        case '#main':
        case '': {
            consts.main.hidden = false
            functionsMain.getFilmsData('InTheaters').then(response => {
                let i = 0
                let startPos = 0
                let finishPos = response.length - 1
                let newRightButton = document.createElement('button')
                newRightButton.classList.add('changeDisplayingFilms', 'rightPosition')
                let newLeftButton = document.createElement('button')
                newLeftButton.classList.add('changeDisplayingFilms', 'leftPosition')
                function createInTheatersContainer(data, placeToPaste, i) {
                    functions.clearContainer(placeToPaste)
                    let movie = data.find((el, ind) => ind === i)
                    console.log(movie)
                    let inTheatersContainer = document.createElement('div')
                    inTheatersContainer.classList.add('row', 'visualInfoWrapper')
                    let posterWrapper = document.createElement('div')
                    posterWrapper.classList.add('posterWrapper', 'addToWatch')
                    let poster = document.createElement('img')
                    poster.classList.add('poster', 'mainPoster')
                    poster.src = movie.image
                    posterWrapper.append(poster)
                    functions.createAddToWatchButton(posterWrapper, movie)
                    let videoWrapper = document.createElement('div')
                    placeToPaste.append(inTheatersContainer)
                    videoWrapper.classList.add('videoWrapper')
                    fetch(`https://imdb-api.com/en/API/Title/k_ibyc30ko/${movie.id}/Trailer`)
                        .then(response => response.json())
                        .then(response => {
                            functions.createTrailerFrame(response, videoWrapper, 'trailerconsts.main')
                            inTheatersContainer.append(posterWrapper)
                            inTheatersContainer.append(videoWrapper)
                        })
                    inTheatersContainer.append(videoWrapper)
                    inTheatersContainer.append(posterWrapper)
                    inTheatersContainer.append(newRightButton)
                    inTheatersContainer.append(newLeftButton)
                    if (finishPos === i) {
                        newRightButton.hidden = true
                    } else {
                        newRightButton.hidden = false
                    }
                    if (startPos === i) {
                        newLeftButton.hidden = true
                    } else {
                        newLeftButton.hidden = false
                    }
                }
                createInTheatersContainer(response, consts.inTheaters, i)
                newLeftButton.addEventListener('click', () => {
                    functions.clearContainer(consts.inTheaters)
                    i = --i
                    createInTheatersContainer(response, consts.inTheaters, i)
                })
                newRightButton.addEventListener('click', () => {
                    functions.clearContainer(consts.inTheaters)
                    if (i > finishPos) {
                        i = 0
                    }
                    i = ++i
                    createInTheatersContainer(response, consts.inTheaters, i)
                })
            })
            functions.clearContainer(consts.comingSoon)
            function funct() {
                let eArr = ['', '', '', '', '', '']
                let z = 0
                eArr.forEach(movie => {
                    functions.createPosterTab(movie, consts.comingSoon, z)
                    z++
                })
            } funct()
            setTimeout(() => functionsMain.getFilmsData('ComingSoon').then(res => {
                let z = 0
                res.forEach(movie => {
                    functions.createPosterTab(movie, consts.comingSoon, z)
                    z++
                })
            }), 3000)
            functions.clearContainer(consts.mostPopularMovies)
            functions.createChangingList('', consts.mostPopularMovies, 20000)
            functionsMain.getFilmsData('MostPopularMovies').then(response => functions.createChangingList(response, consts.mostPopularMovies, 20000))
            functions.clearContainer(consts.mostPopularTVs)
            functionsMain.getFilmsData('MostPopularTVs').then(response => functions.createChangingList(response, consts.mostPopularTVs, 20000))
            functions.clearContainer(consts.top250Movies)
            functionsMain.getFilmsData('Top250Movies').then(response => functions.createChangingList(response, consts.top250Movies, 20000))
            functions.clearContainer(consts.top250TVs)
            functionsMain.getFilmsData('Top250TVs').then(response => functions.createChangingList(response, consts.top250TVs, 20000))
        }
            break
        case '#listOfSearchResults': {
            functions.makeBodyCorrectColor()
            consts.listOfSearchResults.hidden = false
            functionsGLOSR.getListOfSearchResults(consts.listOfSearchResults)
        }
            break
        case '#advancedSearch': {
            functions.makeBodyCorrectColor()
            consts.advancedSearch.hidden = false

            consts.title.addEventListener('change', () => {
                consts.vars.titleValue = functionsAS.getVarFromText(consts.title)
            })
            consts.titleType.addEventListener('change', () => {
                consts.vars.titleTypeValue = functionsAS.getVarFromCheckbox("title_type")
            })

            consts.releaseDateMin.addEventListener('change', () => {
                if (functionsAS.checkIsNumberDate(consts.releaseDateMin.value)) {
                    consts.vars.releaseDateMinValue = functions.checkDate(consts.releaseDateMin.value)
                    consts.vars.releaseDateValue = functionsAS.getVarFromRange(consts.vars.releaseDateMinValue, consts.vars.releaseDateMaxValue, consts.releaseDateMin.name)
                }
            })
            consts.releaseDateMax.addEventListener('change', () => {
                if (functionsAS.checkIsNumberDate(consts.releaseDateMax.value)) {
                    consts.vars.releaseDateMaxValue = functions.checkDate(consts.releaseDateMax.value)
                    consts.vars.releaseDateValue = functionsAS.getVarFromRange(consts.vars.releaseDateMinValue, consts.vars.releaseDateMaxValue, consts.releaseDateMax.name)
                }
            })
            consts.userRatingMin.addEventListener('change', () => {
                consts.vars.userRatingMinValue = consts.userRatingMin.value
                consts.vars.userRatingValue = functionsAS.getVarFromRange(consts.vars.userRatingMinValue, consts.vars.userRatingMaxValue, consts.userRatingMin.name)
            })
            consts.userRatingMax.addEventListener('change', () => {
                consts.vars.userRatingMaxValue = consts.userRatingMax.value
                consts.vars.userRatingValue = functionsAS.getVarFromRange(consts.vars.userRatingMinValue, consts.vars.userRatingMaxValue, consts.userRatingMax.name)
            })
            consts.numVotesMin.addEventListener('change', () => {
                consts.vars.numVotesMinValue = consts.numVotesMin.value
                consts.vars.numVotesValue = functionsAS.getVarFromRange(consts.vars.numVotesMinValue, consts.vars.numVotesMaxValue, consts.numVotesMin.name)
            })
            consts.numVotesMax.addEventListener('change', () => {
                consts.vars.numVotesMaxValue = consts.numVotesMax.value
                consts.vars.numVotesValue = functionsAS.getVarFromRange(consts.vars.numVotesMinValue, consts.vars.numVotesMaxValue, consts.numVotesMax.name)
            })
            consts.genres.addEventListener('change', () => {
                consts.vars.genresValue = functionsAS.getVarFromCheckbox("genres")
            })
            consts.titleGroups.addEventListener('change', () => {
                consts.vars.titleGroupsValue = functionsAS.getVarFromCheckbox("groups")
            })
            consts.titleData.addEventListener('change', () => {
                consts.vars.titleDataValue = functionsAS.getVarFromSelect(consts.titleData)
            })
            consts.companies.addEventListener('change', () => {
                consts.vars.companiesValue = functionsAS.getVarFromCheckbox("companies")
            })
            consts.certificates.addEventListener('change', () => {
                consts.vars.certificatesValue = functionsAS.getVarFromCheckbox("certificates")
            })
            consts.colorInfo.addEventListener('change', () => {
                consts.vars.colorInfoValue = functionsAS.getVarFromCheckbox("colors")
            })
            consts.countries.addEventListener('change', () => {
                consts.vars.countriesValue = functionsAS.getVarFromSelect(consts.countries)
            })
            consts.keywords.addEventListener('change', () => {
                consts.vars.keywordsValue = functionsAS.getVarFromText(consts.keywords)
            })
            consts.languages.addEventListener('change', () => {
                consts.vars.languagesValue = functionsAS.getVarFromSelect(consts.languages)
            })
            consts.filmingLocations.addEventListener('change', () => {
                consts.vars.filmingLocationsValue = functionsAS.getVarFromText(consts.filmingLocations)
            })
            consts.popularityMin.addEventListener('change', () => {
                consts.vars.popularityMinValue = consts.popularityMin.value
                consts.vars.popularityValue = functionsAS.getVarFromRange(consts.vars.popularityMinValue, consts.vars.popularityMaxValue, consts.popularityMin.name)
            })
            consts.popularityMax.addEventListener('change', () => {
                consts.vars.popularityMaxValue = consts.popularityMax.value
                consts.vars.popularityValue = functionsAS.getVarFromRange(consts.vars.popularityMinValue, consts.vars.popularityMaxValue, consts.popularityMax.name)
            })
            consts.plot.addEventListener('change', () => {
                consts.vars.plotValue = functionsAS.getVarFromText(plot)
            })
            consts.runtimeMin.addEventListener('change', () => {
                consts.vars.runtimeMinValue = consts.runtimeMin.value
                consts.vars.runtimeValue = functionsAS.getVarFromRange(consts.vars.runtimeMinValue, consts.vars.runtimeMaxValue, consts.runtimeMin.name)
            })
            consts.runtimeMax.addEventListener('change', () => {
                consts.vars.runtimeMaxValue = consts.runtimeMax.value
                consts.vars.runtimeValue = functionsAS.getVarFromRange(consts.vars.runtimeMinValue, consts.vars.runtimeMaxValue, consts.runtimeMax.name)
            })
            consts.soundMix.addEventListener('change', () => {
                consts.vars.soundMixValue = functionsAS.getVarFromCheckbox("soundMixes")
            })
            consts.numberPerPage.addEventListener('change', () => {
                if (consts.numberPerPage.value !== '50') {
                    consts.vars.numberPerPageValue = `count=${consts.numberPerPage.value}`
                }
            })
            consts.sortBy.addEventListener('change', () => {
                if (consts.sortBy.value !== 'moviemeter,asc') {
                    consts.vars.sortByValue = `sort=${consts.sortBy.value}`
                }
            })
            consts.advancedSearchButton.addEventListener('click', (e) => {
                e.preventDefault()
                consts.vars.addToSearchUrl = ''
                functionsAS.addToUrl(consts.vars.titleValue)
                functionsAS.addToUrl(consts.vars.titleTypeValue)
                functionsAS.addToUrl(consts.vars.releaseDateValue)
                functionsAS.addToUrl(consts.vars.userRatingValue)
                functionsAS.addToUrl(consts.vars.numVotesValue)
                functionsAS.addToUrl(consts.vars.genresValue)
                functionsAS.addToUrl(consts.vars.titleGroupsValue)
                functionsAS.addToUrl(consts.vars.titleDataValue)
                functionsAS.addToUrl(consts.vars.companiesValue)
                functionsAS.addToUrl(consts.vars.certificatesValue)
                functionsAS.addToUrl(consts.vars.colorInfoValue)
                functionsAS.addToUrl(consts.vars.countriesValue)
                functionsAS.addToUrl(consts.vars.keywordsValue)
                functionsAS.addToUrl(consts.vars.languagesValue)
                functionsAS.addToUrl(consts.vars.filmingLocationsValue)
                functionsAS.addToUrl(consts.vars.popularityValue)
                functionsAS.addToUrl(consts.vars.plotValue)
                functionsAS.addToUrl(consts.vars.runtimeValue)
                functionsAS.addToUrl(consts.vars.soundMixValue)
                functionsAS.addToUrl(consts.vars.numberPerPageValue)
                functionsAS.addToUrl(consts.vars.sortByValue)

                if (consts.vars.addToSearchUrl) {
                    location.hash = '#listOfSearchResults'
                }
            })
            consts.titleTypeArray.forEach(cell => functionsAS.createInputItem(cell, consts.titleType))
            consts.userRatingArray.forEach(option => functionsAS.createOption(option, consts.userRatingMin))
            consts.userRatingArray.forEach(option => functionsAS.createOption(option, consts.userRatingMax))
            consts.genresArray.forEach(genre => functionsAS.createInputItem(genre, consts.genres))
            consts.titleGroupsArray.forEach(genre => functionsAS.createInputItem(genre, consts.titleGroups))
            consts.titleDataArray.forEach(info => functionsAS.createOption(info, consts.titleData))
            consts.companiesArray.forEach(company => functionsAS.createInputItem(company, consts.companies))
            consts.certificatesArray.forEach(cert => functionsAS.createInputItem(cert, consts.certificates))
            consts.colorInfoArray.forEach(color => functionsAS.createInputItem(color, consts.colorInfo))
            consts.soundMixArray.forEach(sound => functionsAS.createInputItem(sound, consts.soundMix))
            consts.sortByArray.forEach(criteria => functionsAS.createOption(criteria, consts.sortBy))
            consts.countriesArray.forEach(country => functionsAS.createOption(country, consts.countries))
            consts.languagesArray.forEach(language => functionsAS.createOption(language, consts.languages))
        }
            break
        case '#signUp': {
            functions.makeBodyCorrectColor()
            consts.signUp.hidden = false
            consts.login.hidden = true
            consts.menuBar.hidden = true
            consts.openPasswordButton.addEventListener('change', () => functions.showPassword(consts.openPasswordButton, consts.signInPassword))
            document.querySelector('#createAcc').addEventListener('click', () => functionsSU.createAccount())
            consts.queryDatabase(consts.prefix + 'user').then(console.log)
        }
            break
        case '#login': {
            functions.makeBodyCorrectColor()
            consts.login.hidden = false
            consts.menuBar.hidden = true
            document.querySelector('#logInAcc').addEventListener('click', () => functionsLI.logInAccount())
        }
            break
        case '#searchResult': {
            functions.makeBodyCorrectColor()
            functions.clearContainer(consts.searchResult)
            consts.searchResult.hidden = false
            functionsSR.getResultData(consts.vars.searchResultId).then(response => functionsSR.renderSearchResultPage(response))
        }
            break
        case '#personalWatchlist': {
            consts.personalWatchlist.hidden = false
            functions.makeBodyCorrectColor()
            functions.clearContainer(consts.personalWatchlist)
            //получить watchlist текущего пользователя и построить список
            consts.queryDatabase(consts.prefix + `watch-list/?userId=${consts.vars.currentUserId}`).then(response => {
                if (!response) { consts.personalWatchlist.textContent = 'Your personal watchlist is empty' }
                else {
                    functions.createVerticalList(response, consts.personalWatchlist)
                }
            })
        }
            break
        case '#editProfile': {
            consts.login.hidden = true
            consts.editProfile.hidden = false
            functions.makeBodyCorrectColor()
            consts.showDeleteWindow.addEventListener('click', () => {
                consts.deleteWindow.classList.add('makeVisible')
            })
            consts.closeDeleteWindow.addEventListener('click', () => {
                consts.deleteWindow.classList.remove('makeVisible')
            })
            consts.deleteAccButton.addEventListener('click', () => {
                console.log('deleted')
                consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                    method: 'DELETE',
                })
                    .then(() => {
                        consts.deleteWindow.classList.remove('makeVisible')
                        localStorage.removeItem('lastUser')
                        consts.vars.isLoggedIn = false
                        functions.tryAutorize()
                        functions.goMain()
                    })
            })
            consts.showOldPassword.addEventListener('change', () => functions.showPassword(consts.showOldPassword, consts.oldPasswordField))
            consts.showNewPassword.addEventListener('change', () => functions.showPassword(consts.showNewPassword, consts.newPasswordField))
            consts.editAccButton.addEventListener('click', () => {
                async function editAccount() {
                    let doesLoginExist = await consts.queryDatabase(consts.prefix + 'user').then(res => res.some(el => el.login === consts.newLoginField.value))
                    let doesEmailExist = await consts.queryDatabase(consts.prefix + 'user').then(res => res.some(el => el.email === consts.newEmailField.value))
                    let isCorrectOldPass = await consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`).then(res => {
                        if (res.password !== consts.oldPasswordField.value && consts.newPasswordField.value) {
                            consts.validationOldPass.textContent = 'Your old password is wrong'
                        }
                        return res.password === consts.oldPasswordField.value
                    })
                    function isLoginChanging() {
                        return !!(!doesLoginExist && consts.newLoginField.value)
                    }
                    function isEmailChanging() {
                        return !!(consts.newEmailField.value && !doesEmailExist && functions.validateEmail(consts.newEmailField.value))
                    }
                    function isPasswordChanging() {
                        if (consts.oldPasswordField.value === consts.newPasswordField.value && consts.oldPasswordField.value && consts.newPasswordField.value) {
                            consts.validationOldPass.textContent = ''
                            consts.validationNewPass.textContent = 'Your new password is equal to old'
                        } else if (!consts.oldPasswordField.value) {
                            consts.validationOldPass.textContent = 'Your field of old password is empty'
                        } else if (isCorrectOldPass && !consts.newPasswordField.value) {
                            consts.validationOldPass.textContent = ''
                            consts.validationNewPass.textContent = 'Your field of new password is empty'
                        } else if (isCorrectOldPass) {
                            consts.validationOldPass.textContent = ''
                        }
                        return !!(isCorrectOldPass && consts.oldPasswordField.value !== consts.newPasswordField.value && consts.newPasswordField.value && consts.newPasswordField.value.length > 8)
                    }
                    if (isEmailChanging()) {
                        //изменить пользователя
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: `${consts.newEmailField.value}`,
                            }),
                        }).then(() => functionsEP.clearDataFields())
                    } else if (isLoginChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                login: `${consts.newLoginField.value}`,
                            }),
                        }).then(res => {
                            functionsEP.changeCurrentUserLogin(res)
                            functionsEP.changeUserNameInReviews(res)
                            functionsEP.clearDataFields()
                        })
                            .then(res => functionsEP.changeUserNameInReviews(res))
                    } else if (isPasswordChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                password: `${consts.newPasswordField.value}`,
                            }),
                        }).then(() => functionsEP.clearDataFields())
                    } else if (isLoginChanging() && isEmailChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: `${consts.newEmailField.value}`,
                                login: `${consts.newLoginField.value}`,
                            }),
                        }).then(res => {
                            functionsEP.changeCurrentUserLogin(res)
                            functionsEP.changeUserNameInReviews(res)
                            functionsEP.clearDataFields()
                        })
                            .then(res => functionsEP.changeUserNameInReviews(res))
                    } else if (isPasswordChanging() && isEmailChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: `${consts.newEmailField.value}`,
                                password: `${consts.newPasswordField.value}`,
                            }),
                        }).then(() => functionsEP.clearDataFields())
                    } else if (isLoginChanging() && isPasswordChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                login: `${consts.newLoginField.value}`,
                                password: `${consts.newPasswordField.value}`,
                            }),
                        }).then(res => {
                            functionsEP.changeCurrentUserLogin(res)
                            functionsEP.changeUserNameInReviews(res)
                            functionsEP.clearDataFields()
                        }).then(res => functionsEP.changeUserNameInReviews(res))
                    } else if (isLoginChanging() && isPasswordChanging() && isEmailChanging()) {
                        consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: `${consts.newEmailField.value}`,
                                login: `${consts.newLoginField.value}`,
                                password: `${consts.newPasswordField.value}`,
                            }),
                        }).then(res => {
                            functionsEP.changeCurrentUserLogin(res)
                            functionsEP.changeUserNameInReviews(res)
                            functionsEP.clearDataFields()
                        })
                    }
                } editAccount()
            })
        }
            break
        case '#userList': {
            consts.userList.hidden = false
            functions.makeBodyCorrectColor()
            consts.queryDatabase(consts.prefix + 'user').then(res => functionsUL.createUserTable(res))
        }
            break
    }
}
window.addEventListener('hashchange', changeLocation)
changeLocation()



