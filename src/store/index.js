import { createStore } from 'vuex'
import jsonData from '@/data.json'
export default createStore({
  state: jsonData
})
