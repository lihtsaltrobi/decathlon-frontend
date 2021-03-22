import Vue from "vue";
import 'bootstrap/dist/css/bootstrap.min.css';
import EventsComponent from "./components/Events.vue";
import VueCookies from 'vue-cookies';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'

library.add(faPlus, faPlusSquare, faFacebook, faTwitter, faInstagram);

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <events-component />
    </div>`,
    components: {
        EventsComponent
    }
});

Vue.use(VueCookies);
Vue.component('font-awesome-icon', FontAwesomeIcon)
