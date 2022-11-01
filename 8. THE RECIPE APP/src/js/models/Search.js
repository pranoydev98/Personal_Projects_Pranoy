//jshint esversion: 8
import axios from 'axios';

export default class Search{
  constructor(query){
    this.query = query;
    }

    async getResults(){
      try{
      const url = 'https://forkify-api.herokuapp.com/api/search?q='+this.query;
      const res = await axios(url);
      this.result = res.data.recipes;
      //console.log(this.result);
    }
      catch(error){
        alert(error);
      }
    }
}
