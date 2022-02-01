import { Result } from '$lib/result'
import { isAuthenticated, api } from '$lib/store';
import { GATEWAY_URL } from '$lib/Env';
import { Service } from '$lib/service';
import Cookies from 'js-cookie'

export class AuthService {

  api:string;
  constructor(){
    this.api = GATEWAY_URL.toString();
  }

  headers = {
    'Content-Type': 'application/json',
  }

  public async login(user:string, pwd:string){
    let body = {UserName:user, Password:pwd, "grantType": "password"};
    let request = await fetch(this.api + '/Login', {
      method:'POST',
      body:JSON.stringify(body),
      headers:this.headers
    });

    if(request.ok){
      this.setup(await request.json())
      return Result.Succeed();
    }
    else{
      return Result.Error(await request.text());
    }
  }

  private setup(data){
    isAuthenticated.set(true);
    this.saveToken(data);
    api.set(new Service(data.token));
  }

  private saveToken(security){
    document.cookie = `JWT=${security.token}; path=/; secure;  SameSite=Strict`;
    document.cookie = `expiration=${security.expiration}; path=/; secure;  SameSite=Strict `;
    document.cookie = `refresh=${security.refreshToken}; path=/; secure;  SameSite=Strict`;
  }

  public logout(){
    isAuthenticated.set(false);
    document.cookie = `JWT=; path=/; secure;  SameSite=Strict`;
    document.cookie = `expiration=; path=/; secure;  SameSite=Strict `;
    document.cookie = `refresh=; path=/; secure;  SameSite=Strict`;
  }

  public reload(){
    if(!this.isValidExpiration()){
      //this.refreshToken();
      return false;
    }

    let token = Cookies.get('JWT');
    if(token){
      isAuthenticated.set(true);
      api.set(new Service(token));
      return true;
    }
    else{
      return false;
    }
  }

  private refreshToken(){

  }

  private getExpiration(){
    let ex = Cookies.get('expiration');
    if(ex){
      return new Date(ex);
    }
    else return null;
  }

  private isValidExpiration(){
    let exDate = this.getExpiration();
    return exDate && new Date() < exDate;
  }
}