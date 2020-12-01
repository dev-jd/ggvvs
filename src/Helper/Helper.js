import Axios from 'axios'
import { AsyncStorage } from 'react-native'
import Toast from 'react-native-simple-toast'
import { base_url } from '../Static'

var Helper = {
    POST: async function (url, body) {
        return Axios({
            url:base_url + url,
            method: 'POST',
            data: body,
        }).then(res => { return res.data }).catch((e) => {return e})
    },
    GET: async function (url) {
        return Axios({
            url:base_url + url,
            method: 'GET'
        }).then(res => { return res.data }).catch((e) => console.log('GET Method Error => ', e))
    },
    user_id: AsyncStorage.getItem('user_id'),
    showToast: function (msg) {
        if (msg) {
            Toast.show(msg, 3000)
        } else {
            Toast.show('Default Toast', 3000)
        }
    }


}

export { Helper }