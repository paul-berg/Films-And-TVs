import * as consts from '../consts.js'
import * as functions from '../functions.js'
export function clearDataFields() {
    consts.newLoginField.value = ''
    consts.newEmailField.value = ''
    consts.oldPasswordField.value = ''
    consts.newPasswordField.value = ''
}
export function changeUserNameInReviews() {
    consts.queryDatabase(consts.prefix + `user/${consts.vars.currentUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: `${consts.newLoginField.value}`,
        }),
    }).then(res => consts.queryDatabase(consts.prefix + `comments?userId=${res.id}`))
        .then(res => {
            res.forEach(review => {
                consts.queryDatabase(consts.prefix + `comments/${review.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: `${consts.newLoginField.value}`
                    }),
                })
            })
        })
}
export function changeCurrentUserLogin(res) {
    consts.vars.currentUserLogin = res.login
    let currentUser = JSON.parse(localStorage.getItem('lastUser'))
    currentUser.login = res.login
    localStorage.setItem('lastUser', JSON.stringify(currentUser))
    consts.userMenuButton.textContent = consts.vars.currentUserLogin
    return res
}

