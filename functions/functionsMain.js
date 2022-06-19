export function getFilmsData(searchingFilms) {
    if (!localStorage.getItem(searchingFilms)) {
        async function f(searchingFilms) {
            try {
                let response = await fetch(`https://imdb-api.com/en/API/${searchingFilms}/k_ibyc30ko`)
                let searchingFilmsResult = await response.json()
                localStorage.setItem(searchingFilms, JSON.stringify(searchingFilmsResult.items))
                return searchingFilmsResult.items
            } catch (err) {
                console.log(err)
            }
        }
        return f(searchingFilms)
    } else {
        return Promise.resolve(JSON.parse(localStorage.getItem(searchingFilms)))
    }
}