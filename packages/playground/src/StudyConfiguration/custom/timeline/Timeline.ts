import { RtBoolean, RtObject } from '@freon4dsl/core';
import { ScheduledEvent, ScheduledEventState } from './ScheduledEvent';
import { Event } from '../../language/gen/index';
import { ScheduledPeriod } from './ScheduledPeriod';

/*
 * A Timeline records the events and the days they occur on.
 */
export class Timeline extends RtObject{

  days: TimelineDay[] = [];
  phaseOccurrences: PhaseOccurrence[] = [];
  currentDay: number = 0;

  constructor() {
    super();
  }

  equals(other: RtObject): RtBoolean {
    throw new Error('Timelines are not comparable. Method not implemented.');
  }

  newEventInstance(scheduledEvent: ScheduledEvent, dayEventWillOccurOn?: number, startDay?: number, endDay?: number) {
    return new EventInstance(scheduledEvent, dayEventWillOccurOn, startDay, endDay);
  }

  getDays() {
    return this.days;
  }

  moveToNextDay() {
    this.currentDay++;
  }

  setCurrentDay(day: number) { 
    this.currentDay = day;
  }

  // wrapper so Scheduler can set event statuses
  setCompleted(completedEvent) {
      completedEvent.state = TimelineInstanceState.Completed;
  }

  setScheduled(eventInstance) {
    eventInstance.state = TimelineInstanceState.Scheduled;
    eventInstance.scheduledEvent.setState(ScheduledEventState.Scheduled);
  }

  addEvent(event: TimelineInstance) {
    let day = this.days.find(d => d.day === event.startDay);
    if (!day) {
      day = new TimelineDay(event.startDay);
      this.days.push(day);
    }
    day.events.push(event);
  }

  getEvents(day: number) {
    let timelineDay = this.days.find(d => d.day === day);
    return timelineDay ? timelineDay.events : [];
  }

  getLastInstanceForThisEvent(eventToMatch: Event): EventInstance {
    let allEventInstances = this.days.flatMap(day => day.events.filter ( event => event instanceof EventInstance));
    let eventInstances = allEventInstances.filter(event => eventToMatch.name === event.name);
    return eventInstances[eventInstances.length - 1] as EventInstance; // TODO: sort by day and get the most recent
  }

  printTimeline() {
    console.log("Timeline:");
    this.days.forEach(day => {
      console.log("Day: " + day.day);
      day.events.forEach(event => {
        console.log("Event: " + event.name + " day: " + event.startDay + " status: " + event.getState() );
      });
    });
  }

  // Return true if the event has already been completed on a previous day at least once
  hasCompletedInstanceOf(scheduledEvent: ScheduledEvent) {
    for (const day of this.days) {
      for (const event of day.events as EventInstance[]) {
        if (event.scheduledEvent.name() === scheduledEvent.name() && event.state === TimelineInstanceState.Completed) {
          return true; // Exit nested loops early if we find a completed instance
        }
      }
    }    
    return false;
  }

  numberCompletedInstancesOf(scheduledEvent: ScheduledEvent) {
    let count = 0;
    for (const day of this.days) {
      for (const event of day.events as EventInstance[]) {
        if (event.scheduledEvent.name() === scheduledEvent.name() && event.state === TimelineInstanceState.Completed) {
          count++;
        }
      }
    }
    console.log("numberCompletedInstancesOf scheduledEvent: " + scheduledEvent.name() + " is: " + count);    
    return count;
  }

  noCompletedInstanceOf(scheduledEvent: ScheduledEvent) {
    return !this.hasCompletedInstanceOf(scheduledEvent);
  }

  currentPeriod() {
    throw new Error('Method not implemented.');
  }

}


export class TimelineInstance {
  startDay: number;      // The day the event occurred on
  name: string;          // The name of the event
  state: TimelineInstanceState = TimelineInstanceState.Active;

  setState(state: TimelineInstanceState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

}

export class PeriodInstance extends TimelineInstance {

  scheduledPeriod: ScheduledPeriod;

  
  constructor(scheduledPeriod: ScheduledPeriod, startDay: number) {
    super();
    this.scheduledPeriod = scheduledPeriod;
    this.startDay = startDay;
  } 
}

export enum TimelineInstanceState {
  Ready,
  Scheduled,
  Active,
  Completed
}

 /*
  * An EventInstance represents an instance of an event on a day on the timeline.
  */
export class EventInstance extends TimelineInstance {

  startDayOfWindow: number; // The day the window of the event was scheduled to start
  endDayOfWindow: number;   // The day the window of the event was scheduled to end
  scheduledEvent: ScheduledEvent; // The scheduled event that this instance was created from
  state : TimelineInstanceState = TimelineInstanceState.Ready;

  constructor(scheduledEvent: ScheduledEvent, startDay?: number, startDayOfWindow?: number, endDayOfWindow?: number) {
    super();
    this.name = scheduledEvent.name();
    this.startDay = startDay;
    this.startDayOfWindow = startDayOfWindow !== undefined ? startDay : (startDay !== undefined ? startDay - 1 : undefined);
    this.endDayOfWindow = endDayOfWindow !== undefined ? endDayOfWindow : (startDay !== undefined ? startDay + 1 : undefined);;
    this.scheduledEvent = scheduledEvent;
  }

}

/*
 * A Day represents a day on the timeline and the events that occurred on that day.
 */
export class TimelineDay {
  day: number;
  events: TimelineInstance[] = [];

  constructor(day: number) {
    this.day = day;
  }
}

/*
 * A PhaseOccurrence represents a phase of the study that occurred on the timeline.
 */
export class PhaseOccurrence {
  name: string;
  startDay: number;
  endDay: number;
  startEvent: EventInstance;

  constructor(name: string, startEvent: EventInstance, startDay: number, endDay: number) {
    this.name = name;
    this.startDay = startDay;
    this.endDay = endDay;
  }
}


