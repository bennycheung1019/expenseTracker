import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  recordForm: FormGroup;
  id: any;
  isEdit: boolean;
  public todayIs = new Date().toISOString().split('T')[0];
  loading: boolean;
  segmentValue: string;
  defaultIsExpense: string;

  constructor(
    private aptService: FirebaseService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
  ) {
    this.defaultIsExpense='expense';
    this.segmentValue='expense';
  }

  ngOnInit() {

    this.recordForm = this.fb.group({
      type: [''],
      title: [''],
      subTitle: [''],
      amount: [''],
      date: this.todayIs
    });

    this.actRoute.params.subscribe((data: any) => {
      if(data.type === 'add'){
        this.isEdit = false;
      }else{
        this.isEdit = true;
        this.id = data.type;
        this.aptService.getRecord(this.id).valueChanges().subscribe(res => {
        this.recordForm.setValue(res);
        //Set segmentValue from <type> in formgroup
        this.segmentValue = this.recordForm.value.type;
        });
      }
    });
  }

  formSubmit()
  {
    this.loading=true;

    if (!this.isEdit)
    {
      if (!this.recordForm.valid)
      {return false;}
      else
      {
        //SAVE POINT
        if (this.recordForm.value.type === 'income')
        {
          this.recordForm.value.title = 'Budget added';
          this.recordForm.value.subTitle ='';
        }
        this.aptService.createRecord(this.recordForm.value).then(res =>
          {
            console.log('formSubmit'+res);
            this.recordForm.reset();
            this.router.navigate(['/tabs']);
          })
          .catch(error => console.log(error));
      }
    }
    else
    {
      this.aptService.updateRecord(this.id, this.recordForm.value).then(() =>{
      this.router.navigate(['/tabs']);
      })
      .catch(error => console.log(error));
    }
    this.loading=false;
  }

  deleteRecord(id){
    if (window.confirm('Do you really want to delete?')) {
      this.loading=true;
      this.aptService.deleteRecord(id);
      this.loading=false;
      this.recordForm.reset();
      this.router.navigate(['/tabs']);
    }
  }

  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    this.segmentValue = ev.detail.value;
  }
}
