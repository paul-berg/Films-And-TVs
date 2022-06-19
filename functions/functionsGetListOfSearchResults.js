import * as consts from '../consts.js'
import * as functions from '../functions.js'
export function getListOfSearchResults(placeToPaste) {
    functions.clearContainer(placeToPaste)
    if (!consts.vars.addToSearchUrl) {
        if ((localStorage.getItem(`wordsForSearch`) && !consts.vars.wordsForSearch) ||
            (consts.vars.wordsForSearch === localStorage.getItem('wordsForSearch') && consts.vars.wordsForSearch)) {
            consts.vars.wordsForSearch = localStorage.getItem('wordsForSearch')
            let responseResult = JSON.parse(localStorage.getItem(`${consts.vars.wordsForSearch}`))
            functions.createVerticalList(responseResult, placeToPaste, consts.vars.wordsForSearch)
        }
        else {
            let encodedLink = `https://imdb-api.com/en/API/Search/k_ibyc30ko/${consts.vars.wordsForSearch}`
            fetch(decodeURI(encodedLink))
                .then(response => response.json())
                .then(response => {
                    localStorage.setItem('wordsForSearch', consts.vars.wordsForSearch)
                    functions.createVerticalList(response.results, placeToPaste, consts.vars.wordsForSearch)
                })
        }
    } else {
        fetch(`${consts.advancedSearchUrl}?${consts.vars.addToSearchUrl}`)
            .then(response => response.json())
            .then(response => {
                functions.createVerticalList(response.results, consts.listOfSearchResults)
            })
    }
}
export function getSearchResults() {
    consts.vars.wordsForSearch = consts.searchField.value
    if (location.hash !== '#listOfSearchResults') {
        functions.goToSearchPage()
    } else { getListOfSearchResults(consts.listOfSearchResults) }
    consts.searchField.value = ''
}
