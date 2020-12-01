export const base_url = 'http://new.mysamaaj.com/api/'
export const base_url_1 = 'http://new.mysamaaj.com/'
// export const base_url = 'http://newsamaj.aelius.support/api/'
export const pic_url = 'https://mysamaaj.com/photos/'

export const checkempty = (value, lenght) => {
    if (value === '') {
    } else if (value === undefined) {
    } else if (value === null) {
    } else if (value === 'null') {
    } else if (value.lenght > 0) { } else {
        return true
    }
}
