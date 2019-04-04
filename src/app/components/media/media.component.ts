import { Injectable, Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { trigger, style, animate, transition} from '@angular/animations';
import {SnapcastService} from '../../services/snapcast.service';
import {forEach} from '@angular/router/src/utils/collection';
import { map, tap} from 'rxjs/operators';
import {arrayify} from 'tslint/lib/utils';
import { Observable, Subject, of } from 'rxjs';
import {startTimeRange} from '@angular/core/src/profile/wtf_impl';
import {MopidyService} from '../../services/mopidy.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']

})

@Injectable({
  providedIn: 'root'
})
export class MediaComponent implements OnInit {

  @Input() streams: any;
  @Input() group: any;
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() searchValue: string;
  @Input() playlist: any[];
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private selectedGroup: any;
  private mopidy: any;

  constructor(private snapcastService: SnapcastService, private mopidyService:MopidyService) {
    this.visible = true;

  }

  ngOnInit() {
     this.streams = this.snapcastService.getStreams();
  }

  public show(group: object, mopidy: any) {

    this.selectedGroup = group;
    this.mopidy = mopidy;
    this.filterStreamList();
  }

  public clearSearch() {
    this.playlist = [];
  }

  public search(searchValue) {
      this.clearSearch();
      this.mopidy = this.mopidyService.getStreamById(this.group.stream_id);
      this.mopidy.search(searchValue).then(result => {
        result.forEach((searchURI, index) => {
          if (result[index].tracks) {
            let _tracks = result[index].tracks;
            _tracks.forEach(track => {
              this.playlist.push(track);
            });
          }
        });
      });
  }

  private filterPlaylistByURI(uri) {
    if (this.playlist) {
      this.playlist = this.playlist.filter((item) => {
        console.log(item);
        return item.uri == uri;
      });
    }
  }

  filterStreamList() {
    if (this.streams) {
      this.streams = this.streams.filter((stream) => {
        return stream.id != this.selectedGroup.stream_id;
      });
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}