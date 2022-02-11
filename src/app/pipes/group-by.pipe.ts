import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(value: any, groupByKey: string) {
    const events: any[] = [];
    const groupedElements: any = {};
    let sortEvents: any[] = [];

    value.forEach((obj: any) => {
      if (!(obj[groupByKey] in groupedElements)) {
        groupedElements[obj[groupByKey]] = [];
      }
      groupedElements[obj[groupByKey]].push(obj);
    });

    for (const prop in groupedElements) {
      if (groupedElements.hasOwnProperty(prop)) {
        events.push({
          key: prop,
          list: groupedElements[prop]
        });
        console.log(events);
      }
    }

   sortEvents = events.sort((a,b) => {
    if (a.key < b.key) {return 1;}
    if (a.key > b.key) {return -1;}
   });
   return sortEvents;
  }
}
