import Axios from 'axios';
import {
  AccessForbiddenError,
  UnauthorizedError,
  UnknownError,
  NetworkError,
  ServerError,
  NotFoundError
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
      let h = null
      if (!token)
        h = getAuthorizationHeader()
      else if (typeof (token) == 'function')
        h = getAuthorizationHeader(token())
      else
        h = getAuthorizationHeader(token)

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
    }, (error) => {
      if (!error.response) {
        reject(new NetworkError())
      } else {
        let response = error.response

        if (response.status == 401){
          reject(new UnauthorizedError())
        } else if (response.status == 403) {
          reject(new AccessForbiddenError())
        } else if (response.status == 404) {
          reject(new NotFoundError())
        } else if (response.status == 500) {
          reject(new ServerError())
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

