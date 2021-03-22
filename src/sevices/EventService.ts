import Api from './Api';

export default {

    getCompetitors(query: string) {
        return Api().get('event/competitors', { params: { competitor: query } });
    },

    getEventResults() {
       return Api().get('event');
    },

    saveEventResult(eventResult: any) {
        return Api().post('event', eventResult);
     }
}