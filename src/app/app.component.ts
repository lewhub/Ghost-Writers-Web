import { Component } from '@angular/core';
import swal from 'sweetalert2';

declare var filestack: any;
declare var $: any;
// declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  client: any;
  marker_url: any;
  marker_filename: any;
  added_art_url: any;
  added_art_filename: any;
  create_or_re_choose: any;
  choose_or_re_choose: any;

  constructor() {
    this.title = 'app';
    this.client = filestack.init('AxGm6Nb8rTPyGLzI0VcuEz')
    this.marker_url = 'assets/landscape_filler.jpg';
    this.added_art_url = 'assets/pancakes.jpg';
    this.create_or_re_choose = 'Create Marker';
    this.choose_or_re_choose = 'Choose a Photo';
  }

  createMarker() {
    this.client.pick({fromSources: ['local_file_system', 'webcam']}).then((result) => {
      console.log(result, 'success')
      console.log(result.filesUploaded[0].url)
      this.marker_url = result.filesUploaded[0].url;
      this.marker_filename = result.filesUploaded[0].filename;
      this.create_or_re_choose = 'Take Another Photo'
    })
  }

  createArt() {
    this.client.pick().then((result) => {
      console.log(result, 'success')
      this.added_art_url = result.filesUploaded[0].url;
      this.added_art_filename = result.filesUploaded[0].filename;
      this.choose_or_re_choose = 'Choose a different photo';
    })
  }

  saveClicked() {
    if (this.marker_url === 'assets/landscape_filler.jpg' || this.added_art_url === 'assets/pancakes.jpg') {
      swal({
        title: 'Before you submit:',
        text: 'Make sure to upload both a marker and an image to put onto the marker before saving.',
        timer: 4000
      })
    } else {
      console.log('beginning upload...');
      console.log({ marker: this.marker_url, added_art: this.added_art_url });
    }

  }


}
