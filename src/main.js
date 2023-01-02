import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import firebaseConfig from '@/config/firebase'
import FontAwesomeIcon from '@/plugins/FontAwesome'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrollDirective from '@/plugins/PageScrollDirective'

firebase.initializeApp(firebaseConfig)
const forumApp = createApp(App)
const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /App[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  // Register component globally
  forumApp.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
forumApp.use(ClickOutsideDirective)
forumApp.use(FontAwesomeIcon)
forumApp.use(PageScrollDirective)
forumApp.use(router)
forumApp.use(store)
forumApp.mount('#app')
export { firebase }
