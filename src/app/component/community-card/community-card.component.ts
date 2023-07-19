import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from 'src/app/model/community';
import { CommunityService } from 'src/app/service/community.service';
import { NdkproviderService } from 'src/app/service/ndkprovider.service';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent {

  @Input()
  community:Community;
  followingNow:boolean = false;
  showEditCommunity:boolean = false;
  currentUserHexKey?:string;

  @Output()
  onLeave:EventEmitter<Community> = new EventEmitter<Community>();

  constructor(private ndkProvider:NdkproviderService, private router:Router, private communityService: CommunityService){

  }

  ngOnInit(){
    this.currentUserHexKey = this.ndkProvider.currentUser?.hexpubkey();

    this.setIsFollowed();

    if(!this.community.creatorProfile){
      this.fetchCreatorProfile();
    }
    this.fetchFollowers();
  }

  setIsFollowed(){
    if(this.ndkProvider.appData.followedCommunities !== ''){
      const followedArr:string[] = this.ndkProvider.appData.followedCommunities.split(',')
      if(followedArr.findIndex(id => this.community.id === id)>-1){
        this.followingNow = true;
      }
    }
  }

  async fetchCreatorProfile(){
    const profile = await this.ndkProvider.getProfileFromHex(this.community.creatorHexKey!);
    if(profile){
      this.community.creatorProfile = profile;
    }
  }

  async fetchFollowers(){
    const followers = await this.ndkProvider.fetchFollowersForCommunity(this.community.id!)
    this.community.followersHexKeys = followers;
  }

  popupClosed(evt:any){
    this.showEditCommunity = false;
  }

  editFinished(edited:Community){
    this.community = edited;
    this.showEditCommunity = false;
  }

  openCommunityPage(){
      this.router.navigateByUrl('n/'+this.community.name+'/'+this.community.creatorHexKey)
  }

  openCommunityCreatorInSnort(){
    window.open('https://snort.social/p/'+this.community.creatorHexKey!,'_blank')
  }

  async joinCommunity(){
    await this.communityService.joinCommunityInteroperableList(this.community);

    this.followingNow = true;

    await this.communityService.clearCommunitiesFromAppData();
  }

  async leaveCommunity(){
    await this.communityService.leaveCommunityInteroperableList(this.community);

    this.followingNow = false;
    this.onLeave.emit(this.community);

    await this.communityService.clearCommunitiesFromAppData();
  }
}
