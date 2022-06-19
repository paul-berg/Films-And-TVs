import * as consts from '../consts.js'
export function createInputItem(data, placeToPaste) {
    let titleTypeInputContainer = document.createElement('div')
    let titleTypeInput = document.createElement('input')
    titleTypeInput.type = 'checkbox'
    titleTypeInput.classList.add = data.class
    titleTypeInput.name = data.name
    titleTypeInput.id = data.id
    titleTypeInput.value = data.value
    titleTypeInputContainer.append(titleTypeInput)
    let labelTitleTypeInput = document.createElement('label')
    labelTitleTypeInput.htmlFor = data.id
    labelTitleTypeInput.textContent = data.labelName
    titleTypeInputContainer.append(labelTitleTypeInput)
    placeToPaste.append(titleTypeInputContainer)
}
export function createOption(data, placeToPaste) {
    let optionItem = document.createElement('option')
    if ('value' in data) { optionItem.value = data.value }
    if ('selected' in data) { optionItem.selected = data.selected }
    optionItem.textContent = data.content
    placeToPaste.append(optionItem)
}
export function checkIsNumberDate(str) {
    return ((str.match(/\W/g) === str.match(/\D/g)) && !!new Date(str))
}
export function checkDate(date) {
    if (date.length === 4 && !date.includes('-')) {
        return `${date}-01-01`
    } else if (date.length === 7 && date.includes('-')) {
        return `${date}-01`
    } else if (date.length === 10 && date.includes('-') && date.includes('-', 5)) {
        return `${date}`
    }
}
function isAddToUrlEmpty() {
    if (consts.vars.addToSearchUrl) {
        consts.vars.addToSearchUrl += '&'
    }
}
export function addToUrl(variable) {
    if (variable) {
        isAddToUrlEmpty()
        consts.vars.addToSearchUrl += variable
    }
}
export function getVarFromText(field) {
    return `${field.name}=${encodeURI(field.value)}`
}
export function getVarFromCheckbox(fieldName) {
    let allInputs = document.querySelectorAll(`[name=${fieldName}]`)
    const arrCheckedInputs = []
    allInputs.forEach(input => {
        if (input.checked && !arrCheckedInputs.includes(input.value)) {
            arrCheckedInputs.push(input.value)
        }
    })
    return `${fieldName}=${arrCheckedInputs.join(',')}`
}
export function getVarFromRange(minValue, maxValue, name) {
    if (minValue && maxValue && (minValue < maxValue)) {
        return `${name}=${minValue},${maxValue}`
    }
}
export function getVarFromSelect(select) {
    let allOptions = select.childNodes
    const arrSelectedOptions = []
    allOptions.forEach(option => {
        if (option.selected && !arrSelectedOptions.includes(option.value)) {
            arrSelectedOptions.push(option.value)
        }
    })
    return `${select.name}=${arrSelectedOptions.join(',')}`
}
