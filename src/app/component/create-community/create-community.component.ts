import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NdkproviderService } from '../../service/ndkprovider.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { ClrForm } from '@clr/angular';
import { Community } from '../../model/community';
import { CommunityService } from '../../service/community.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent implements OnInit{

  @Input()
  show:boolean = false;

  @Output()
  onClose = new EventEmitter<boolean>();

  @ViewChild("newCommunityForm")
  newCommunityForm:NgForm;
  createDisabled:boolean=true;

  displayNameChange = new BehaviorSubject('');
  newCommunity:Community={};

  constructor(private ndkproviderService:NdkproviderService, private communityService:CommunityService){
  }

  ngOnInit(): void {
    if(this.ndkproviderService.currentUser)
      this.newCommunity.creatorHexKey = this.ndkproviderService.currentUser.hexpubkey();

    this.displayNameChange
        .asObservable()
        .pipe(debounceTime(250))
        .subscribe(value => {
          if (value)
          {
            this.createDisabled=false;
            this.sanitizeDisplayName();
          }
            else
            this.createDisabled=true;
        });
  }

  onChange($event:any){
    this.onClose.emit(false);
  }

  displayNameUpdate($event:any){
    this.displayNameChange.next($event);
  }

  async onCreate(){
    await this.communityService.createCommunity(this.newCommunity);
    this.newCommunity={};
    this.onClose.emit(true);
  }

  sanitizeDisplayName(){
    this.newCommunity.name = this.newCommunity.displayName!.replace(/[:\s]/g,'');
  }
}
