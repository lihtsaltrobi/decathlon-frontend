<!-- src/components/Events.vue -->

<template>
  <div>
    <div>
      <nav class="navbar navbar-expand-lg">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav app-list">
            <li>
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </li>
            <li>
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </li>
            <li>
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </li>
          </ul>

          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#"
                >Tulemused <span class="sr-only">(current)</span></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Võistlused</a>
            </li>
          </ul>
          <a
            href="#"
            class="navbar-brand"
            id="site-logo"
            style="background-image: url('assets/logo.png')"
          ></a>
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">Sportlased</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Uudised</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div>
      <h2 class="text-center">Sydney Olümpia 2000</h2>

      <div class="event" style="background-image: url('assets/em_2019.jpg')">
        <div class="container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Võistleja</th>
                <th scope="col" v-for="key in enumKeys()">
                  {{ EventType[key] }}
                </th>
                <th>Lõpptulemus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in groupedResults">
                <td class="font-weight-bold">{{ index + 1 }}</td>
                <td class="font-weight-bold">{{ result.competitor }}</td>
                <td v-for="eventTypeKey in enumKeys()">
                  <button
                    class="btn btn-link btn-add"
                    @click="
                      openModal({
                        competitor: result.competitor,
                        eventType: eventTypeKey,
                      })
                    "
                    v-if="result[eventTypeKey] == null"
                  >
                    <font-awesome-icon icon="plus" />
                  </button>
                  {{ result[eventTypeKey] }}
                </td>
                <td class="font-weight-bold">{{ result.sum }}</td>
              </tr>
            </tbody>
          </table>
          <div class="event-footer">
            <button class="btn btn-primary" id="open-modal-btn" @click="openModal()">
              Lisa tulemus
            </button>
          </div>
          
        </div>
        <event-result-modal
          v-if="showModal"
          v-on:dismiss="hideModal()"
          v-on:save="eventResultAdded"
          v-bind:initialValues="modalValues"
        ></event-result-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventType } from "../classifier/EventType";
import { enumKeys } from "../util/EnumUtils";
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import EventService from "../sevices/EventService";
import EventResultModal from "./EventResultModal.vue";
import { FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default Vue.extend({
  data(): {
    eventResults: any[];
    showModal: boolean;
    EventType: any;
    modalValues: any;
  } {
    return {
      eventResults: [],
      showModal: false,
      EventType: EventType,
      modalValues: null,
    };
  },
  created() {
    this.getEventResults();
  },
  methods: {
    async getEventResults() {
      let results = await EventService.getEventResults();
      this.eventResults = results.data;
    },

    eventResultAdded(result: any) {
      this.eventResults.push(result);
      this.hideModal();
    },

    enumKeys() {
      return enumKeys(EventType);
    },

    openModal(initialValues: any) {
      this.showModal = true;

      if (initialValues != null) {
        this.modalValues = {
          competitor: initialValues.competitor,
          eventType: initialValues.eventType,
        };
      }
    },

    hideModal() {
      this.showModal = false;
      this.modalValues = null;
    },
  },
  computed: {
    groupedResults(): any[] {

      let results: any = [];

      this.eventResults.forEach((eventResult) => {
        let competitor = results.find((result: any) => result.competitor == eventResult.competitor);
        if (competitor == null) {
          competitor = { competitor: eventResult.competitor, sum: 0 }
          results.push(competitor);
        }

        competitor[eventResult.eventType] = eventResult.points;
      });

      let eventTypeKeys = enumKeys(EventType);

      results.forEach((result: any) => {
        for (let eventTypeKey in eventTypeKeys) {
          let classifier: any = eventTypeKeys[eventTypeKey];
          result.sum += result[classifier] != null ? result[classifier] : 0;
        }
      });

      results.sort((a: any, b: any) => (a.sum < b.sum ? 1 : -1));

      return results;
    },
  },
  components: {
    VueBootstrapTypeahead,
    EventResultModal,
    FontAwesomeIcon
  },
});
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Quicksand');

body {
  font-family: 'Quicksand', sans-serif;
}

.navbar {
  background-color: #39485f !important;
}

.event {
  background-size: cover;
  padding-top: 80px;
  padding-bottom: 80px;
}

.btn-add {
  display: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

h2 { padding: 44px; }

#site-logo {
  width: 95px;
  height: 100px;
  background-size: cover;
}

.nav-item .nav-link {
  font-size: 18px;
  color: #a7a7a7;
}

.navbar-nav.ml-auto .nav-item { margin-right: 16px; }
.navbar-nav.mr-auto .nav-item {
  margin-right: 16px;
}

.nav-item.active > .nav-link,
.nav-item:hover > .nav-link {
  color: white;
}

.app-list {
  position: absolute;
  font-size: 24px;
}

.app-list li { margin-right: 10px; }

.event .container {
  max-width: 1400px;
  position: relative;
  min-height: 500px;
  background-color: rgba(255,255,255, 0.9);
  padding: 0px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom: 3px solid #39485f;
}

.app-list li:hover { color: white; }

.table {
  margin: none;
  margin-bottom: 64px;
}

.table th {
  border-top: none;
  border-bottom: none !important;
  background-color: #39485f;
  color: #FFF;
}

.table th:first-of-type {
  border-top-left-radius: 4px;
}

.table th:last-of-type {
  border-top-right-radius: 4px;
}

.table td {
  border-top: none;
  border-bottom: 1px solid #ccc;
}

td, th { text-align: center; }

.table td:hover > .btn-add { display: contents; }

.event-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 64px;
  text-align: right;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 24px;
  background-color: rgba(0,0,0, 0.04);

}

.btn-primary:hover,
.btn-primary:active,
.btn-primary:visited,
.btn-primary:focus,
.btn-primary {
  background-color: rgb(27, 134, 120) !important;
  border: 1px solid rgb(27, 134, 120) !important;
}

.btn-link { color:rgb(27, 134, 120) !important; }

.btn-primary:disabled {
  background-color: rgb(27, 134, 120, 0.8);
  border: 1px solid rgb(27, 134, 120, 0.8);
}

</style>
