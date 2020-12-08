import { Injectable } from '@angular/core';
import { AngularFirestore, associateQuery } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Dog } from 'models/dog.model';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class DogService {
  firestore: any;

  constructor(private afs: AngularFirestore,
              private afsStorage: AngularFireStorage) { }

  async createDog(dog: any, profilepic: File) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.afs.firestore.runTransaction(async transaction => {
          const dogId = this.afs.createId();
          const dogRef = this.afs.doc(`dogs/${dogId}`).ref;
          dog.id = dogId;
          if (profilepic != null) {
            const filePath = `dogs/${dogId}/profilepic.jpeg`;

            await this.uploadDogImage(dog, profilepic);

            dog.profilepic = await this.afsStorage.ref(filePath).getDownloadURL().toPromise();

          }
          transaction.set(dogRef, dog);
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // async uploadDogImage(dog: any, profilepic: File) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       // ERROR POR EL PATH?
  //       const filePath = `dogs/${dog.id}/profilepic.jpeg`;
  //       const task = this.afsStorage.upload(filePath, profilepic);
  //       await task.snapshotChanges().toPromise();
  //       const pictureUrl = await this.afsStorage.ref(filePath).getDownloadURL().toPromise();
  //       console.log(pictureUrl);
  //       await this.updateDog(dog, { pictureUrl });

  //       resolve(true);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  uploadDogImage(dog: any, profilepic: File) {
    const filePath = `dogs/${dog.id}/profilepic.jpeg`;
    //console.log('1a');
    const task = this.afsStorage.upload(filePath, profilepic);
    //console.log('log del upload image');
    //console.log(filePath);
    //console.log(task);
    return task.snapshotChanges().toPromise();
  }

  async removeProfilePicture(dId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const filePath = `dogs/${dId}/profilepic.jpeg`;
        //console.log('5');
        const task = this.afsStorage.ref(filePath).delete();
        //console.log('6');
        await task.toPromise();
        //console.log('7');
        await this.updateDog(dId, { profilepic: null }, null);
        //console.log('8');

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDog(dId: string) {
    return this.afs.doc(`dogs/${dId}`).valueChanges();
  }

  getDogs() {
    return this.afs.collection('dogs').snapshotChanges().pipe(
      map(docs => docs.map(doc => {
        const dog = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;

        return { id, ...dog } as Dog;
      }))
    );
  }

  updateDog(dId: string, updatedDog: any, profilepic: File) {
    return new Promise(async (resolve, reject) => {
      try {
        if (profilepic != null) {
          const filePath = `dogs/${dId}/profilepic.jpeg`;

          updatedDog.id = dId;
          //console.log('9');
          await this.uploadDogImage(updatedDog, profilepic);
          //console.log('10');
          await this.afs.firestore.runTransaction(async transaction => {
            //console.log('11');
            const dogRef = this.afs.doc(`dogs/${dId}`).ref;
            //console.log(filePath);

            updatedDog.profilepic = await this.afsStorage.ref(filePath).getDownloadURL().toPromise();
            //console.log('12');

            transaction.set(dogRef, updatedDog);
            //console.log('13');
          });
        }
        this.afs.doc(`dogs/${dId}`).update(updatedDog);
        //console.log('14');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteDog(dId: string) {
    return this.afs.doc(`dogs/${dId}`).delete();
  }
}


