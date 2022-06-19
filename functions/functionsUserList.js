import * as consts from '../consts.js'
import * as functions from '../functions.js'
export function createUserTable(res) {
    functions.clearContainer(consts.tbody)
    res.forEach(user => {
        console.log(user)
        let newRow = document.createElement('tr')
        newRow.classList.add('newRow')
        function createField(field) {
            let cell = document.createElement('td')
            if (user[field] === true) {
                cell.textContent = 'admin'
            } else if (user[field] === false) {
                cell.textContent = 'user'
            }
            else { cell.textContent = user[field] }
            newRow.append(cell)
        }
        createField('id')
        createField('login')
        createField('email')
        createField('isAdmin')
        console.log(user.id)
        console.log(user.isAdmin)
        let addRemoveAdminButton = document.createElement('button')
        addRemoveAdminButton.classList.add('reviewButton')
        if (user.isAdmin) {
            addRemoveAdminButton.textContent = 'Remove admin'
        } else { addRemoveAdminButton.textContent = 'Add admin' }
        addRemoveAdminButton.addEventListener('click', function changeIsAdmin() {
            if (user.id !== '33') {
                consts.queryDatabase(consts.prefix + `user/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isAdmin: !user.isAdmin,
                    }),
                })
                    .then(() => consts.queryDatabase(consts.prefix + 'user'))
                    .then(res => createUserTable(res))
            }
        })
        newRow.append(addRemoveAdminButton)
        let deleteUserButton = document.createElement('button')
        deleteUserButton.classList.add('reviewButton')
        deleteUserButton.textContent = 'Delete user'
        deleteUserButton.addEventListener('click', function deleteUser() {
            if (user.id !== '33') {
                consts.queryDatabase(consts.prefix + `user/${user.id}`, {
                    method: 'DELETE',
                })
                    .then(() => consts.queryDatabase(consts.prefix + 'user'))
                    .then(res => createUserTable(res))
            }
        })
        newRow.append(deleteUserButton)
        consts.tbody.append(newRow)
    })
}