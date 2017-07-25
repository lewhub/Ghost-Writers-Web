import { Component, OnInit } from '@angular/core';
import { WikiService } from './services/wiki.service'
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
// import {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";


declare var filestack: any;
declare var $: any;
// declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WikiService]
})


export class AppComponent implements OnInit {
  // @LocalStorage() public current_user:string = '';
  current_latitude: any;
  current_longitude: any;
  title: string;
  client: any;
  marker_url: any;
  marker_filename: any;
  added_art_url: any;
  added_art_filename: any;
  create_or_re_choose: any;
  choose_or_re_choose: any;
  marker_target_id: any;
  res_obj: any;


  constructor(private wikiService: WikiService, private http: HttpClient) {
    this.title = 'app';
    this.client = filestack.init('AxGm6Nb8rTPyGLzI0VcuEz')
    this.marker_url = 'assets/landscape_filler.jpg';
    this.added_art_url = 'assets/pancakes.jpg';
    this.create_or_re_choose = 'Create Marker';
    this.choose_or_re_choose = 'Choose a Photo';

  }

  createMarker() {
    this.client.pick({ fromSources: ['local_file_system', 'webcam'] }).then((result) => {
      console.log(result, 'success')
      console.log(result.filesUploaded[0].url)
      this.marker_url = result.filesUploaded[0].url;
      this.marker_filename = result.filesUploaded[0].filename;
      this.create_or_re_choose = 'Take Another Photo'

    })
    console.log('hello')
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('success getting position = ', position)
          this.current_latitude = position.coords.latitude;
          this.current_longitude = position.coords.longitude;
          console.log('lat: ' + this.current_latitude + ' long: ' + this.current_longitude);
        },
        (err) => console.log('fail getting position = ', err)
      )
    }



  }

  ngOnInit() {
    console.log('in ng on init');
    localStorage.setItem('test', 'test_true');
    // console.log(localStorage.getItem('test'), '<< test local storage item')
    alert(JSON.stringify(localStorage))
    // alert(localStorage.getItem('id'))
    
    // console.log(this.current_user, '<< localStorage current user')
    // navigator.geolocation.getCurrentPosition(
    //   function (position) {
    //     console.log('lat =' + position.coords.latitude)
    //     console.log('long =' + position.coords.longitude)
    //   })
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
      this.http
        .post('http://52.15.90.163:3002/api/marker/markers/59763273fc3f94fa9efa98f2', { image_url: this.marker_url })
        .subscribe((res) => {
          console.log(res, 'successfully created marker to mongo db...');
          // adding marker to wikitude manager
          this.res_obj = res;
          this.marker_target_id = this.res_obj.marker._id;
          this.wikiService.addTarget({ name: this.marker_target_id, imageUrl: this.marker_url }).subscribe(data => {
            console.log(data, '< data from server for marker in wikitude')

            // adding art
            let art_meta = {
              marker_id: this.marker_target_id,
              photo_url: this.added_art_url,
              title: this.added_art_filename
            };
            this.http
              .post('http://52.15.90.163:3002/api/art/59763273fc3f94fa9efa98f2', art_meta)
              .subscribe((res) => {
                console.log(res, 'successfully added art to marker...')
                swal({
                  title: 'Saved!!',
                  text: 'marker and art was uploaded and saved!',
                  timer: 5000
                })
                // regenerating the target collection
                this.wikiService.generateTargetCollection().subscribe(data => {
                  console.log(data, 'successful')
                }, err => {
                  console.log(err, 'error')
                })
              })

          }, err => {
            console.log(err, '< err happended')
          })

        }, (err) => {
          console.log(err, 'error happended')
          swal({
            title: 'Error:',
            text: JSON.stringify(err),
            timer: 20000
          })
        })
    }

  }


}
