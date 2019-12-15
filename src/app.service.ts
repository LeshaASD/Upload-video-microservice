import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { firebaseConfig } from './firebase.config';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import * as XMLHttpRequest from 'xhr2';

// initializing firebase with configuration
firebase.initializeApp(firebaseConfig);

// @ts-ignore
global.XMLHttpRequest = XMLHttpRequest;

@Injectable()
export class AppService {
    private logger = new Logger();
    private storageRef = firebase.storage().ref();
    private subject: BehaviorSubject<any> = new BehaviorSubject(0);

    public uploadVideo(file: any): Observable<any> {
        // Create the file metadata
        const metadata = {
            contentType: file.mimetype,
        };
        // Prepare filename
        const fileName = file.originalname.replace(/ /g, '');
        // Converting from buffer
        const bytes = new Uint8Array(file.buffer.data);
        // Upload file and metadata to the object 'videos/{name}'
        const uploadTask = this.storageRef.child(`videos/${fileName}`).put(bytes, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.logger.log(`Progress is ${progress}%`);
            this.subject.next(progress);
        }, (error) => {
            this.logger.error(error);
            this.subject.next(error);
        }, async () => {
            // Upload completed successfully, now we can get the download URL
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            this.logger.log('File available at', downloadURL);
            this.subject.next(downloadURL);
        });

        return this.subject;
    }
}
