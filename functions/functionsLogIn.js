import * as consts from '../consts.js'
import * as functions from '../functions.js'
export function logInAccount() {
    consts.queryDatabase(consts.prefix + 'user').then(res => {
        return res.find(user => user.login === consts.logInLogin.value)
    })
        .then(res => {
            if (res) {
                if (res.password === consts.logInPassword.value) {
                    consts.queryDatabase(consts.prefix + 'user/login', {
                        //залогинить пользователя
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            login: consts.logInLogin.value,
                            password: consts.logInPassword.value,
                        }),
                    }).then(res => {
                        let currentUser = {}
                        currentUser.login = res.login
                        consts.vars.currentUserLogin = res.login
                        currentUser.id = res.id
                        consts.vars.currentUserId = res.id
                        currentUser.isAdmin = res.isAdmin
                        consts.vars.isAdmin = res.isAdmin
                        localStorage.setItem('lastUser', JSON.stringify(currentUser))
                        consts.vars.isLoggedIn = true
                    }).then(() => {
                        consts.logInLogin.value = ''
                        consts.logInPassword.value = ''
                        consts.loginValidationLogin.textContent = ''
                        consts.loginValidationPassword.textContent = ''
                        functions.tryAutorize()
                        functions.goMain()
                    })
                } else {
                    consts.loginValidationLogin.textContent = ''
                    consts.loginValidationPassword.textContent = 'wrong password'
                }
            }
            else {
                consts.loginValidationLogin.textContent = 'there is no such user'
                consts.loginValidationPassword.textContent = 'wrong password'
            }
        })
}
