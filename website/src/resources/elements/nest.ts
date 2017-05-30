import { HttpClient } from "aurelia-fetch-client";
import { suggestItem } from "./intellisense";

export class Nest {
    constructor(private uri: string, private http: HttpClient) {                
        console.log("nest: ", uri, http);
    }

    async query(q: string = ""): Promise<any> {
        
        return this.http.fetch(this.uri + '/index1/_search?q=' + q)
            .then(response => response.json())
            .then(data => {
                console.log(data.description);

                if (data.hits.total > 0){
                    return data.hits.hits.map(h => {
                        return { "name": h._source.title };
                    })
                }

                return [];
            });
    }


}