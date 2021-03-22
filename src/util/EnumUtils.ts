import { EventType } from "../classifier/EventType";

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}


export function getEventUnitName(eventType: EventType): string {
    if([
        "HundredMeterRun", 
        "FourHundredMeterRun", 
        "Hurdles", 
        "FifteenHundredMeterRun"
    ].indexOf(eventType) > -1) return "sekundit";

    if([
        "LongJump", 
        "HighJump", 
        "PoleVault", 
        "FifteenHundredMeterRun"
    ].indexOf(eventType) > -1) return "sentimeetrit";



    return "meetrit";
}