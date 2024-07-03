/**
 * Configuration file for the frontend
 * handles the ENV variables
 */

// URL the serverside part of the frontend uses to communicate with the backend
const BACKEND_URL_SERVER = import.meta.env.BACKEND_URL_SERVER ?? process.env.BACKEND_URL_SERVER
if (!BACKEND_URL_SERVER) {
  throw new Error('BACKEND_URL_SERVER is not set')
}
if (!BACKEND_URL_SERVER.startsWith('http')) {
  throw new Error('BACKEND_URL_SERVER must start with http')
}

// URL the clientside part of the frontend uses to communicate with the backend
const BACKEND_URL_CLIENT = import.meta.env.BACKEND_URL_CLIENT ?? process.env.BACKEND_URL_CLIENT
if (!BACKEND_URL_CLIENT) {
  throw new Error('BACKEND_URL_CLIENT is not set')
}
if (!BACKEND_URL_CLIENT.startsWith('http')) {
  throw new Error('BACKEND_URL_CLIENT must start with http')
}

export default {
  BACKEND_URL_SERVER,
  BACKEND_URL_CLIENT,
}
