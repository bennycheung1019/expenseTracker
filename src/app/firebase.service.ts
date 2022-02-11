import { Injectable } from '@angular/core';
import { Record } from './record';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  recordListRef: AngularFireList<any>;
  recordRef: AngularFireObject<any>;

  constructor(
    private db: AngularFireDatabase) { }

  // Create
  createRecord(apt: Record){
    this.recordListRef = this.db.list('/records');
    if(apt){
      return this.recordListRef.push({
        type: apt.type,
        title: apt.title,
        subTitle: apt.subTitle,
        amount: apt.amount,
        date: apt.date
      });
    }
  }

  // Get Single
  getRecord(id: string){
    this.recordRef = this.db.object('/records/' + id);
    return this.recordRef;

  }

  //Get List
  getRecordList(){
     this.recordListRef = this.db.list('/records');
     return this.recordListRef;
  }

  //Update
  updateRecord(id, apt: Record){
    return this.recordRef.update({
      type: apt.type,
      title: apt.title,
      subTitle: apt.subTitle,
      amount: apt.amount,
      date: apt.date
    });
  }

  //Delete
  deleteRecord(id: string){
    this.recordRef = this.db.object('/records/' + id);
    this.recordRef.remove();
  }

  //Sum of Budget
  getSum(){
    this.recordListRef = this.db.list('/records');
    this.recordListRef.snapshotChanges().subscribe((items) => {
      let total = 0;
      items.forEach((item: any) => {
        total += Number(item.amount);
        console.log(total);
        return total;
      });
  });
}
}
