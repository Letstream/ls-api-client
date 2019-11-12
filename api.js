import { APIRequest, REQUEST_POST } from "./client";
import { NetworkError, AccessForbiddenError, UnauthorizedError, ServerError, NotFoundError } from "./errors";

export class LetstreamAPI {

    constructor(base_url, token=null) {
        this.base_url = base_url
        this.token = token

        this.urls = {
            login: '/accounts/login/',
            logout: '/accounts/logout/',
            user: '/accounts/user/'
        }
    
        this.errors = {
            access_forbidden: AccessForbiddenError,
            network: NetworkError,
            unauthorized: UnauthorizedError
        }
    }

    _construct_url(url) {
        return (this.base_url)?(this.base_url + url):url
    }

    _send_request(request_type, url, params=null, body=null, headers={}, add_authorization=false, token=null, ignore_errors=[]) {
        return new Promise( (resolve, reject) => {
            APIRequest(request_type, url, params, body, headers, add_authorization, token).then( (res) => {
                resolve(res.data)
            }).catch( (err) => {
                this.check_known_errors(err, reject, ignore_errors)   

                if(err.status == 400) {
                    // Handle Field Errors
                    reject(err.data)
                }
            })
        })
    }

    _get_token() {
        let token = null
        if(typeof(this.token) == 'function')
            token = this.token()
        else
            token = this.token
        
        return token
    }

    check_known_errors(err, reject, ignore_errors=[]){
        let known_errors = [
            AccessForbiddenError,
            NotFoundError,
            NetworkError,
            ServerError,
            UnauthorizedError,
        ]

        let flag = true
        known_errors.forEach(function(value, index) {
            if(err instanceof value){
                let ignore = false
                ignore_errors.forEach(function(e, i) {
                    if(value == e) 
                        ignore = true
                })
                if (!ignore)
                    flag = false
            }
        })
        if(!flag)
            reject(err)
    }

    login(email, password, url=null) {

        if(!url)
            url = this._construct_url(this.urls.login)

        let payload = {
            'email': email,
            'password': password
        }
        
        return this._send_request(REQUEST_POST, url, null, payload)
    }

    logout(url=null) {
        if(!this.token)
            return
        
        token = this._get_token()
        if(!token)
            return
        
        if(!url)
            url = this._construct_url(this.urls.logout)
        
        return this._send_request(REQUEST_POST, url, null, null, {}, true, token)
    }

    get_user(id, authenticated=true, url=null) {
        if(!id)
            return
        
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.user)

        return this._send_request(REQUEST_GET, url, {'id': id}, null, {}, add_authorization, token)
    }
}
