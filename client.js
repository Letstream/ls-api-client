import Axios from 'axios';
import {
  AccessForbiddedError,
  UnauthorizedError,
  UnknownError,
  NetworkError
} from './errors';


export const REQUEST_POST = 'POST'
export const REQUEST_GET = 'GET'


function getAuthorizationHeader(token = null) {
  if (!token)
    token = localStorage.getItem('token')
  return ['Authorization', 'Token ' + token]
}

export function APIRequest(
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
    }, (err) => {
      if (!error.response) {
        throw new NetworkError()
      } else {
        let response = error.response

        if (response.status == 403) {
          throw new AccessForbiddedError()
        } else if (response.status == 401) {
          throw new UnauthorizedError()
        } else {
          reject(response)
        }
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
  request: APIRequest,
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
