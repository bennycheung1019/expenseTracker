import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Record } from '../record';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit{
  fullList = [];
  budgetSum = 0;

  constructor(
    public firebaseService: FirebaseService
   ) {}

  ngOnInit(){
    this.fetchList();
    const listRes = this.firebaseService.getRecordList();
    listRes.snapshotChanges().subscribe(res => {
      this.fullList = [];
      //reset budgetSum everytimes the list is updated.
      this.budgetSum = 0;
      res.forEach((item: any)=> {
        const a = item.payload.toJSON();
        // eslint-disable-next-line @typescript-eslint/dot-notation
        a['$key'] = item.key;
        this.fullList.push(a as Record);
        if(a.type === 'income'){
          this.budgetSum += Number(a.amount);
        }else{
        this.budgetSum -= Number(a.amount);
      }
      });
    });
  }

  fetchList(){
    this.firebaseService.getRecordList().valueChanges().subscribe(res => {
      console.log('fetchList'+res);
    });
  }

  deleteRecord(id){
    console.log(id);
    if (window.confirm('Do you really want to delete?')) {
      this.firebaseService.deleteRecord(id);
    }
  }
}
