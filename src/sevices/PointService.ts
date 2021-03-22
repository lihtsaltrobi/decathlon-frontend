import { EventType } from '../classifier/EventType';
import Api from './Api';

export default {
    calculatePoints(competitor: string, score: number, eventType: EventType) {
       return Api().get('points', { params: { competitor: competitor, score: score, eventType: eventType } });
    }
}