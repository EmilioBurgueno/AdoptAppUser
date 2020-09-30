import { Injectable } from '@angular/core';
import { AngularFirestore, associateQuery } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Dog } from 'src/models/dog.model';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class DogService {
  firestore: any;

  constructor(private afs: AngularFirestore,
    private afsStorage: AngularFireStorage,
    ) { }

  async createDog(dog: any, profilepic: File) {
    return new Promise(async (resolve, reject) => {
      try {
        const dogId = this.afs.createId();
        const filePath = `dogs/${dogId}/profilepic.jpeg`;

        dog.id = dogId;
        await this.uploadDogImage(dog,profilepic);
        await this.afs.firestore.runTransaction(async transaction => {
          const dogRef = this.afs.doc(`dogs/${dogId}`).ref;
          console.log(filePath)

         dog.profilepic = await this.afsStorage.ref(filePath).getDownloadURL().toPromise()

          transaction.set(dogRef,dog);
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  uploadDogImage(dog: any, profilepic: File) {
    const filePath = `dogs/${dog.id}/profilepic.jpeg`;
    const task = this.afsStorage.upload(filePath, profilepic);

    return task.snapshotChanges().toPromise();
  }

  async removeProfilePicture(dId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const filePath = `dogs/${dId}/profilepic.jpeg`;
        const task = this.afsStorage.ref(filePath).delete();
        await task.toPromise();
        await this.updateDog(dId, { pictureUrl: null });

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
    )
  }

  updateDog(dId: string, updatedDog: any) {
    return this.afs.doc(`dogs/${dId}`).update(updatedDog);
  }

  deleteDog(dId: string) {
    return this.afs.doc(`dogs/${dId}`).delete();
  }
}


