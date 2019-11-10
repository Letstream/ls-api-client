import Axios from 'axios';
import {
  AccessForbiddedError,
  UnauthorizedError,
  UnknownError,
  NetworkError
} from './errors';


const REQUEST_POST = 'POST'
const REQUEST_GET = 'GET'


function getAuthorizationHeader(token = null) {
  if (!token)
    token = localStorage.getItem('token')
  return ['Authorization', 'Token ' + token]
}

function Request(
  request_method,
  url,
  params = null,
  data = null,
  headers = {},
  add_authorization = true,
  token = null

) {
  return new Promise((resolve, reject) => {
    let final_headers = headers;

    if (add_authorization) {
      if (!token)
        let h = getAuthorizationHeader()
      else if (typeof (token) == 'function')
        let h = getAuthorizationHeader(token())
      else
        let h = getAuthorizationHeader(token)

      final_headers[h[0]] = h[1];
    }

    Axios({
      url: url,
      data: data,
      params: params,
      method: request_method,
      headers: final_headers
    }).then((response) => {
      if (response.status >= 200 && response.status <= 202) {
        let d = response.data;

        if (d.status) {
          resolve(d)
        } else {
          HandleAPIError(d.err_cd).then((res) => {
            resolve(d)
          }, (err) => {
            reject(res)
          })
        }
      } else {
        if (response.status == 403) {
          throw new AccessForbiddedError()
        } else if (response.status == 401) {
          throw new UnauthorizedError()
        } else {
          throw new UnknownError(response.status)
        }
      }
    }, (err) => {
      if (!error.response) {
        throw new NetworkError()
      } else {
        let e = error.response
        console.log(e)
        reject(err);
      }
    })
  })
}


export function HandleAPIError(err_cd) {
  // To be implemented 
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

module.exports = {
  request: Request,
  constants: {
    POST: REQUEST_POST,
    GET: REQUEST_GET
  },
  errors: {
    access_forbidden: AccessForbiddedError,
    network: NetworkError,
    unauthorized: UnauthorizedError,
    unknown: UnknownError
  }
}