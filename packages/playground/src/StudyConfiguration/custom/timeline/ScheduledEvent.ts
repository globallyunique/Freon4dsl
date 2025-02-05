import { Event, Day, RepeatCondition, RepeatUnit, Period } from "../../language/gen/index";
import { InterpreterContext, isRtError, RtNumber } from "@freon4dsl/core";
import { MainStudyConfigurationModelInterpreter } from "../../interpreter/MainStudyConfigurationModelInterpreter";
import { EventInstance, PeriodInstance, Timeline } from "./Timeline";
import { repeat } from "lodash";
import { ScheduledPeriod } from "./ScheduledPeriod";

export enum ScheduledEventState {
  Initial,
  Ready,
  Active,
  Scheduled,
  Completed
};

/*
 * A ScheduledEvent is a wrapper around an Event from the StudyConfiguration language.
 * It provides a simplified interface for the simulator and allows for the same Event to be scheduled multiple times.
 */
export class ScheduledEvent {
  configuredEvent: Event;
  state = ScheduledEventState.Initial;

  constructor(event: Event) {
    this.configuredEvent = event;
  }

  day(timeline: Timeline): number {
    let eventStart = this.configuredEvent.schedule.eventStart;
    const interpreter = new MainStudyConfigurationModelInterpreter()
    interpreter.setTracing(true);
    let ctx = InterpreterContext.EMPTY_CONTEXT;
    ctx.set("timeline", timeline);
    const value = interpreter.evaluateWithContext(eventStart, ctx);
    if (isRtError(value)) {
      console.log("interpreter isRtError, value: " + value.toString());
    } else {
      const trace = interpreter.getTrace().root.toStringRecursive();
      if (!timeline) {
        console.log("ScheduledEvent.day() timeline is null: " + trace);
      } else {        
      if (timeline.currentDay > 8) {
        console.log("ScheduledEvent.day() trace: " + trace);
        }
      }
    }
    // console.log("ScheduledEvent.day() for: " + this.name() + " is: " + (value as RtNumber).value);
    return (value as RtNumber).value
  }


  // If a specific day is specified for the event to start on then return that day
  // otherwise return the number of days to wait from the timeline's current day.
  daysToWait(completedEvent: EventInstance,timeline: Timeline, timeNow: number) {
    if (completedEvent.scheduledEvent.name() === this.name() && this.isRepeatingEvent() && this.anyRepeatsNotCompleted(timeline)) {
      let waitInDays = this.daysTillNextRepeat(completedEvent);
      console.log("ScheduledEvent.daysToWait() for: " + this.name() + " is to be repeated on timeline day: " + timeline.currentDay + " with scheduledDay of: " + waitInDays );
      return waitInDays;
    }
    if (this.configuredEvent.schedule.eventStart instanceof Day) {
      console.log("ScheduledEvent.daysToWait() for: " + this.name() + " timeline.currentDay: " + timeline.currentDay + " day: " + this.day(timeline) + " result: " + this.day(timeline));
      return this.day(timeline);
    } else {
      console.log("ScheduledEvent.daysToWait() for: " + this.name() + " timeline.currentDay: " + timeline.currentDay + " day: " + this.day(timeline) + " result: " + (this.day(timeline) - timeline.currentDay));
      return this.day(timeline) - timeline.currentDay;
    }
  }

  getState(): ScheduledEventState {
    return this.state;
  }

  setState(state: ScheduledEventState) {
    this.state = state;
  }

  name(): string {
    return this.configuredEvent.name;
  }

  dependency(): string {
    return null;
  }

  isRepeatingEvent(): boolean {
    return this.configuredEvent.schedule.eventRepeat instanceof RepeatCondition;
  }

  anyRepeatsNotCompleted(timeline: Timeline): boolean {
    let numberCompletedInstances = timeline.numberCompletedInstancesOf(this);
    if (this.isRepeatingEvent) {
      let repeatCondition = this.configuredEvent.schedule.eventRepeat as RepeatCondition;
      if (numberCompletedInstances <= repeatCondition.maxRepeats) { // Less that or equal because the first instance is not counted as a repeat.
        console.log("anyRepeatsNotCompleted: " + this.name() + " timeline: " + timeline.currentDay + " maxRepeats: " + repeatCondition.maxRepeats + " numberCompletedInstances: " + numberCompletedInstances);
        return true;
      }
    }
    console.log("anyRepeatsNotCompleted: " + this.name() + " timeline: " + timeline.currentDay + " numberCompletedInstances: " + numberCompletedInstances + " result: false");
    return false;
  }

  notYetScheduled(timeline): boolean {
    try {
      console.log('notYetScheduled: ' + this.name() + ' timeline: ' + timeline.currentDay + ' day: ' + this.day(timeline) + ' result: ' + (this.anyRepeatsNotCompleted(timeline) || this.getState() === ScheduledEventState.Initial));
      // return this.anyRepeatsNotCompleted(timeline) || timeline.noCompletedInstanceOf(this);
      return this.anyRepeatsNotCompleted(timeline) || this.getState() === ScheduledEventState.Initial;
    }
    catch (e) {
      console.log("notYetScheduled caught exception: " + e.toString());
      // This exception is expected to happen when Event has dependency on another event that has not been completed so evaluation of FirstScheduled fails.
      return false;
    }
  }

  daysTillNextRepeat(completedEvent: EventInstance) {
    let repeatCondition = this.configuredEvent.schedule.eventRepeat as RepeatCondition;
    let repeatUnit = repeatCondition.repeatUnit.referred;
    let repeatDays = 0;
    switch (repeatUnit) {
      case RepeatUnit.daily:
        repeatDays = 1
        break;
      case RepeatUnit.weekly:
        repeatDays = 7
        break;
      case RepeatUnit.monthly:
        repeatDays = 30
        break;
      default:
        repeatDays = 0
    }
    return repeatDays;
  }

  /*
  * TODO: update this description...
  *
   * if this event has not been completed on a previous day and the timeline day is at or after the day this event is scheduled for then return a new EventInstance
   * otherwise return null.
   */
  getInstanceIfEventIsReadyToSchedule(completedEvent: EventInstance, timeline: Timeline): unknown {
    let repeatingEvent = this.isRepeatingEvent();
    if (this.configuredEvent.schedule.eventStart instanceof Day && !repeatingEvent) {
      console.log("getInstanceIfEventIsReady: Not ready to schedule because:" + this.name() + " is scheduled to start on a specific day");
      return null;
    } else if (completedEvent.scheduledEvent.name() === this.name() && repeatingEvent && this.anyRepeatsNotCompleted(timeline)) {
      console.log("getInstanceIfEventIsReady: " + this.name() + " is to be repeated on timeline day: " + timeline.currentDay + " with scheduledDay of: " + this.day(timeline) );
      return new EventInstance(this);
    } else {
      let scheduledDay = this.day(timeline);
      if (timeline.noCompletedInstanceOf(this) && scheduledDay != undefined && scheduledDay >= timeline.currentDay) {
        console.log("getInstanceIfEventIsReady: " + this.name() + " is to be scheduled on timeline day: " + timeline.currentDay + " with scheduledDay of: " + scheduledDay );
        return new EventInstance(this);
      } else {
        console.log("getInstanceIfEventIsReady: " + this.name() + " is NOT to be scheduled on timeline day: " + timeline.currentDay + " with scheduledDay of: " + scheduledDay );
        return null;
      }
    }
  }

  updatePeriodIfNeeded(timeline: Timeline) {
    let period = this.configuredEvent.freOwner() as Period;
    let scheduledPeriod = period.freOwner() as unknown as ScheduledPeriod;
    if (timeline.currentPeriod.name != period.name) {
      timeline.currentPeriod = new PeriodInstance(period, timeline.currentDay);
    }
  }

}

