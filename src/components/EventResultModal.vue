<!-- src/components/EventResultModal.vue -->

<template>
    <div class="modal-backdrop">
  <div class="modal" tabindex="-1" role="dialog" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tulemuse lisamine</h5>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="dismissModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="competitor">Võistleja</label>
              <vue-bootstrap-typeahead
                id="competitor"
                v-model="competitor"
                ref="typeahead"
                :data="competitors"
                @input="getCompetitors()"
              />
            </div>
            <div class="form-group">
              <label for="event-type">Ala</label>
              <select
                id="event-type"
                class="form-control"
                v-model="eventType"
                @change="calculatePoints"
              >
                <option v-for="key in enumKeys()" :value="key">
                  {{ EventType[key] }}
                </option>
              </select>
            </div>
            <div class="form-group" v-if="eventType != null && competitor != ''">
              <label for="score">Tulemus</label>
              <div class="input-group mb-3">
                <input
                  class="form-control"
                  type="text"
                  id="score"
                  v-model="score"
                  @keyup="calculatePoints"
                  autocomplete="off"
                  :required="true"
                  :min="1"
                />
                <div class="input-group-append">
                  <span class="input-group-text">{{getEventUnitName(eventType)}}</span>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="eventType != null && competitor != ''">
              <label>Punktid: {{ points }}</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="save" :disabled="score == null || score == '' || score < 0 || eventType == null || competitor == null">
            Salvesta
          </button>
          <button type="button" class="btn btn-secondary" @click="dismissModal">
            Sulge
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventType } from "../classifier/EventType";
import { enumKeys, getEventUnitName } from "../util/EnumUtils";

import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import EventService from "../sevices/EventService";
import PointService from "../sevices/PointService";

export default Vue.extend({
  data(): {
    eventType: EventType | null;
    points: number;
    score: string;
    competitor: string;
    EventType: any;
    competitors: string[];
  } {
    return {
      eventType: null,
      points: 0,
      score: "",
      competitor: "",
      EventType,
      competitors: [],
    };
  },
  props: ['initialValues'],
  mounted() {
      if(this.$props.initialValues == null) return;
      this.competitor = this.$props.initialValues.competitor;
      (this.$refs.typeahead as any).inputValue = this.competitor;
      this.eventType = this.$props.initialValues.eventType;
  },

  methods: {
    dismissModal() {
      this.clearForm();
      this.$emit("dismiss");
    },

    async calculatePoints() {
      if (
        this.competitor == null ||
        this.eventType == null ||
        this.score == null ||
        this.competitor == "" ||
        this.score == "" ||
        isNaN(+this.score)
      )
        {
            this.points = 0;
            return;
        }

      let result = await PointService.calculatePoints(
        this.competitor,
        +this.score,
        <EventType>this.eventType
      );
      this.points = result.data;
    },

    async save() {
        
      let data = {
        competitor: this.competitor,
        score: this.score,
        eventType: this.eventType,
      };

      let result = await EventService.saveEventResult(data);

      this.clearForm();
      this.$emit("save", result.data);
    },

    async getCompetitors() {
      const res = await EventService.getCompetitors(this.competitor);
      this.competitors = await res.data;
    },

    enumKeys() {
      return enumKeys(EventType);
    },

    clearForm() {
      this.competitor = "";
      this.points = 0;
      this.score = "";
      this.eventType = null;
      (this.$refs.typeahead as any).inputValue = "";
    },

    getEventUnitName(eventType: EventType) {
        return getEventUnitName(eventType);
    }
  },
  computed: {},
  components: {
    VueBootstrapTypeahead,
  },
});
</script>

<style>
    .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-header {
        background-color: #39485f;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        color: #FFF;
    }
    .modal {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .close {
        color: #FFF;
        text-shadow: none;
    }
</style>
