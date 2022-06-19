import * as consts from '../consts.js'
import * as functions from '../functions.js'
//functionsSignUp 
export function createAccount() {
    async function createAcc() {
        let doesLoginExist = await consts.queryDatabase(consts.prefix + 'user').then(res => {
            if (!res.some(el => el.login === consts.signInLogin.value)) {
                if (consts.signInLogin.value === '') {
                    consts.signUpValidationLogin.textContent = 'The field is empty'
                } else {
                    consts.signUpValidationLogin.textContent = ''
                }
            } else {

                consts.signUpValidationLogin.textContent = 'This login is already existed'
            }
            return res.some(el => el.login === consts.signInLogin.value)
        })
        let doesEmailExist = await consts.queryDatabase(consts.prefix + 'user').then(res => {
            if (!res.some(el => el.email === consts.signInEmail.value)) {
                if (consts.signInEmail.value === '') {
                    consts.signUpValidationEmail.textContent = 'The field is empty'
                } else {
                    consts.signUpValidationEmail.textContent = ''
                }
            } else {
                consts.signUpValidationEmail.textContent = 'This e-mail is already existed'
            }
            return res.some(el => el.email === consts.signInEmail.value)
        })
        if (consts.signInPassword.value.length >= 8) {
            consts.signUpValidationPassword.textContent = ''
        } else {
            consts.signUpValidationPassword.textContent = 'Password is too short'
        }

        if (!doesLoginExist && consts.signInPassword.value.length >= 8 && !doesEmailExist && functions.validateEmail(consts.signInEmail.value)) {
            console.log('create acc')
            //зарегестировать пользователя
            consts.queryDatabase(consts.prefix + 'user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: consts.signInEmail.value,
                    password: consts.signInPassword.value,
                    login: consts.signInLogin.value,
                }),
            }).then(res => {
                let currentUser = {}
                currentUser.login = res.login
                consts.vars.currentUserLogin = res.login
                currentUser.id = res.id
                consts.vars.currentUserId = res.id
                if (res.isAdmin) {
                    currentUser.isAdmin = true
                    isAdmin = true
                }
                localStorage.setItem('lastUser', JSON.stringify(currentUser))
                consts.vars.isLoggedIn = true
            }).then(() => {
                functions.tryAutorize()
                functions.goMain()
            })
        }
    } createAcc()

}