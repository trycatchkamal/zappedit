import { Component,Input, ViewChild, ElementRef, HostListener, } from '@angular/core';
import { TopicService } from '../../service/topic.service';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent {

  @Input()
  isMobileScreen:boolean = false;

  @Input()
  topic:string;

  constructor(private topicService:TopicService){
  }


  onTopicDelete(){
    this.topicService.unfollowTopic(this.topic);
  }
}
