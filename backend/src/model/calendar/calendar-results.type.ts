import { type CalendarComponent } from 'ical'

// This is the type definition for the CalendarComponent type from the ical package
//
// export type CalendarComponent = {
//     type: CalendarComponentType;
//     summary?: string;
//     description?: string;
//     url?: string;
//     uid?: string;
//     location?: string;
//     start?: Date;
//     end?: Date;
//     rrule?: RRule;
//     exdate?: { [datestr: string]: Date };
//     recurrences?: CalendarComponent[];
//     class?: string;
//     transparency?: string;
//     geo?: Geo;
//     completion?: string;
//     completed?: Date;
//     categories?: string[];
//     freebusy?: FreeBusy;
//     dtstamp?: Date;
//     created?: Date;
//     lastmodified?: Date;
//     recurrenceid?: Date;
// } & { [prop: string]: string | ParamList | undefined };

// this is a CalendarComponent as returned by the nextcloud
// {
//     "type":"VEVENT",
//     "params":[],
//     "created":"2024-05-16T14:49:57.000Z",
//     "dtstamp":"2024-05-16T15:06:11.000Z",
//     "lastmodified":"2024-05-16T15:06:11.000Z",
//     "sequence":"3",
//     "uid":"3a1783dd-ced7-4a07-b753-5256b418993d",
//     "start":"2024-05-16T00:00:00.000Z",
//     "end":"2024-05-17T00:00:00.000Z",
//     "status":"CONFIRMED",
//     "summary":"fd040@n5"
// }

export interface Calendar {
  name: string
  events: CalendarComponent[]
}

export interface CalendarResults {
  calendars: Calendar[]
}
