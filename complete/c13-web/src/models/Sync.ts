import axios, { type AxiosPromise } from "axios";

export const rootUrl = "http://localhost:3000/users";

interface HasId {
  id?: string;
}

// generic constraint
export class Sync<T extends HasId> {
  constructor(public baseUrl: string = rootUrl) {}

  fetch(id: string): AxiosPromise {
    console.log("=============fetch", id, this.baseUrl);
    return axios.get(`${this.baseUrl}/${id}`);
  }

  // save - if id put, else post

  save(data: T): AxiosPromise {
    const { id } = data;

    if (id) {
      //put

      return axios.put(`${this.baseUrl}/${id}`, data);
    } else {
      //post

      return axios.post(this.baseUrl, data);
    }
  }
}
