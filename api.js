import { APIRequest, REQUEST_POST, REQUEST_GET, REQUEST_DELETE } from "./client";
import { NetworkError, AccessForbiddenError, UnauthorizedError, ServerError, NotFoundError, UnknownError } from "./errors";

export class LetstreamAPI {

    constructor({
        base_url, 
        token=null, 
        error_handler=null, 
        default_handler_params=null
    } = {}) {
        this.base_url = base_url
        this.token = token
        this.error_handler = error_handler
        this.handler_params = default_handler_params
        this.urls = {
            login: '/accounts/login/',
            logout: '/accounts/logout/',
            user: '/accounts/user/',
            register: '/accounts/register/'
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

    _send_request({
        request_type, 
        url, 
        params=null, 
        body=null, 
        headers={}, 
        add_authorization=false, 
        token=null, 
        ignore_errors=[], 
        handler_params=null
    } = {}) {
        return new Promise( (resolve, reject) => {
            APIRequest(request_type, url, params, body, headers, add_authorization, token).then( (res) => {
                resolve(res.data)
            }).catch( (err) => {
                if(!this.error_handler)
                    this.check_known_errors(err, reject, ignore_errors)   
                else{
                    handler_params = (handler_params)?handler_params:this.handler_params
                    this.error_handler(err, reject, ignore_errors, handler_params)
                }

                if(err.status == 400) {
                    // Handle Field Errors
                    reject(err.data)
                } else{
                    reject( new UnknownError(err))
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

    is_data_error(err){
        if( !err instanceof AccessForbiddenError && 
            !err instanceof NotFoundError && 
            !err instanceof NetworkError &&
            !err instanceof ServerError &&
            !err instanceof UnauthorizedError &&
            !err instanceof UnknownError
        ) return true

        return false
    }

    set_instance_params(params){
        this.handler_params = params
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

    login({email, password, url=null, handler_params=null}={}) {

        if(!url)
            url = this._construct_url(this.urls.login)

        let payload = {
            'email': email,
            'password': password
        }
        
        return this._send_request({
            request_type: REQUEST_POST, 
            url:url, 
            body:payload,
            handler_params: handler_params
        })
    }

    logout({url=null, handler_params=null} = {}) {
        if(!this.token)
            return
        
        let token = this._get_token()
        if(!token)
            return
        
        if(!url)
            url = this._construct_url(this.urls.logout)
        
        return this._send_request({
            request_type: REQUEST_POST, 
            url: url,
            add_authorization: true, 
            token: token, 
            handler_params: handler_params
        })
    }

    register({
        data= {},
        authenticated= false,
        url=null,
        handler_params=null
    } = {}) {
        
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.register)

        return this._send_request({
            request_type: REQUEST_POST, 
            url: url, 
            body: data,
            add_authorization: add_authorization, 
            token: token, 
            handler_params: handler_params
        })
    }

    get_user({
        id, 
        authenticated=true, 
        url=null, 
        handler_params=null
    } = {}) {
        if(!id)
            return
        
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.user + id + '/')

        return this._send_request({
            request_type: REQUEST_GET, 
            url: url, 
            add_authorization: add_authorization, 
            token: token, 
            handler_params: handler_params
        })
    }

    create_user({
        data= {},
        authenticated= true,
        url=null,
        handler_params=null
    } = {}) {
        
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.user)

        return this._send_request({
            request_type: REQUEST_POST, 
            url: url, 
            body: data,
            add_authorization: add_authorization, 
            token: token, 
            handler_params: handler_params
        })
    }

    save_user({
        id,
        data= {},
        authenticated= true,
        url=null,
        handler_params=null
    } = {}) {
        if(!id)
            return
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.user + id + '/')

        return this._send_request({
            request_type: REQUEST_POST, 
            url: url, 
            body: data,
            add_authorization: add_authorization, 
            token: token, 
            handler_params: handler_params
        })
    }

    delete_user({
        id,
        authenticated = true,
        url = null,
        handler_params = null
    } = {}) {
        if(!id)
            return
        let token = null, add_authorization = false;
        if(authenticated){
            token = this._get_token()
            add_authorization = true
        }

        if(!url)
            url = this._construct_url(this.urls.user + id + '/')

        return this._send_request({
            request_type: REQUEST_DELETE, 
            url: url, 
            add_authorization: add_authorization, 
            token: token, 
            handler_params: handler_params
        })
    }
}
