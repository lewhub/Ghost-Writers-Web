import { Component, OnInit } from '@angular/core';
import { WikiService } from './services/wiki.service'
import { HttpClient } from '@angular/common/http';
// import { ActivatedRoute, ParamMap } from '@angular/router';
import swal from 'sweetalert2';
// import 'rxjs/add/operator/switchMap';
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
  current_user: any;
  current_lat: any;
  current_lng: any;


  constructor(private wikiService: WikiService, private http: HttpClient) {
    this.title = 'app';
    this.client = filestack.init('AQqITGUBVQ6mumB5gvo95z')
    this.marker_url = 'assets/landscape_filler.jpg';
    this.added_art_url = 'assets/pancakes.jpg';
    this.create_or_re_choose = 'Create Marker';
    this.choose_or_re_choose = 'Choose a Photo';

  }

  createMarker() {
    // alert(this.current_user)
    this.client.pick({ fromSources: ['local_file_system', 'webcam'], accept: ['image/*', 'video/mp4'] }).then((result) => {
      console.log(result, 'success')
      console.log(result.filesUploaded[0].url)
      this.marker_url = result.filesUploaded[0].url;
      this.marker_filename = result.filesUploaded[0].filename;
      this.create_or_re_choose = 'Take Another Photo'

    })
    // console.log('hello')
    // if (navigator.geolocation) {

    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       console.log('success getting position = ', position)
    //       this.current_latitude = position.coords.latitude;
    //       this.current_longitude = position.coords.longitude;
    //       console.log('lat: ' + this.current_latitude + ' long: ' + this.current_longitude);
    //     },
    //     (err) => console.log('fail getting position = ', err)
    //   )
    // }



  }

  ngOnInit() {
    console.log('in ng on init');
    // this.current_user = this.route.paramMap.switchMap((params: ParamMap) => {
    //   return params.get('userid')
    // })

    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.current_user = getParameterByName('userid', undefined)
    this.current_lat = getParameterByName('currlat', undefined)
    this.current_lng = getParameterByName('currlong', undefined)
    // alert('lat: ' + this.current_lat + '---' + 'lng: ' + this.current_lng);
    localStorage.setItem('test', 'test_true');
    localStorage.removeItem('name')
    localStorage.removeItem('storage_test')
    localStorage.removeItem('storage_test_two')
    // localStorage.removeItem('test')

    console.log(document.getElementById('test-el'))

    // alert(JSON.stringify(document.getElementById('test-el')))

    // console.log(localStorage.getItem('test'), '<< test local storage item')
    // alert(JSON.stringify(localStorage))
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
        .post('http://52.15.90.163:3002/api/marker/markers/' + this.current_user, { image_url: this.marker_url, latitude: this.current_lat, longitude: this.current_lng })
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
              .post('http://52.15.90.163:3002/api/art/' + this.current_user, art_meta)
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
                // setTimeout(() => window.location.href = 'http://52.15.90.163:3002', 2000)
                // setTimeout(() => document.location.href = 'http://www.lewisbracey.com', 2000)
                setTimeout(() => window.location.href = 'http://www.lewisbracey.com', 2000)
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

  // goBack() {
  //   // setTimeout(() => window.location.href = 'http://52.15.90.163:3002', 2000)
  //   setTimeout(() => document.location.href = 'http://www.lewisbracey.com', 2000)
  // }


}
