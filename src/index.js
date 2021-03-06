import introJs from 'intro.js'
import utils from './libs/utils'

function plugin (Vue, options) {
    const defaultOptions = {
        scrollTo: 'tooltip',
        showStepNumbers: false,
        keyboardNavigation: true,
        nextLabel: 'Next',
        prevLabel: 'Back',
        skipLabel: 'Close',
        doneLabel: 'Okay',
        forceRun: false,
        baseURL: 'localhost:8000',
        tourTimeout: 500
    }

    options = utils.extend(defaultOptions, [options || {}])

    if (options.axios === undefined) {
        console.warn('[@deveodk/vue-core-tour]: axios must be set to use this package')
        return
    }
    Vue.prototype.$coreTour = function (slug, config) {
        config = utils.extend(options, [config || {}])
        const intro = introJs.introJs()

        if (config.forceRun) {
            intro.setOptions(config)
            setTimeout(() => {
                if(window.innerWidth < 768){
                    return
                }
                intro.start()
            }, config.tourTimeout)
            return
        }

        options.axios.get(options.baseURL + '/core/tours/' + slug).then(() => {
        }).catch(() => {
            options.axios.post(options.baseURL + '/core/tours', { slug: slug })
            intro.setOptions(config)
            setTimeout(() => {
                if(window.innerWidth < 768){
                    return
                }
                intro.start()
            }, config.tourTimeout)
        })
    }
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  version
}
