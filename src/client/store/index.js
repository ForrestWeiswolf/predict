import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import logger from 'redux-logger'
import axios from 'axios'

const initialState = {
  text: '',
  suggestions: [],
  corpus: 'inexorability',
  corpora: [],
}

const UPDATE_TEXT = 'UPDATE_TEXT'
const ADD_TO_TEXT = 'ADD_TO_TEXT'
const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS'
const SWITCH_CORPUS = 'SWITCH_CORPUS'
const GET_CORPORA = 'GET_CORPORA'

export function updateText(newText) {
  return { type: UPDATE_TEXT, newText }
}

export function addToText(newText) {
  return { type: ADD_TO_TEXT, newText }
}

export function updateSuggestions(suggestions) {
  return { type: UPDATE_SUGGESTIONS, suggestions }
}

export function switchCorpus(corpus) {
  return { type: SWITCH_CORPUS, corpus }
}

export function getCorpora(corpora) {
  return { type: GET_CORPORA, corpora }
}

export function fetchCorpora() {
  return dispatch => {
    return axios
      .get('/api/corpora/')
      .then(res => {
        dispatch(getCorpora(res.data))
      })
  }
}

export function fetchSuggestions(lastWord) {
  return (dispatch, getState) => {
    const corpus = getState().corpus
    const wordRoute = lastWord ? lastWord : ''

    if (corpus) {
      return axios.get(`/api/corpus/${corpus}/` + wordRoute).then(res => {
        dispatch(updateSuggestions(res.data))
      })
    } else {
      // if there's no corpus selected, do nothing
      // but return a promise in case this is being .then chained
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}

export function reducer(prevState = initialState, action) {
  switch (action.type) {
    case UPDATE_TEXT:
      return Object.assign({}, prevState, { text: action.newText })
    case ADD_TO_TEXT:
      return Object.assign({}, prevState, {
        text: prevState.text + action.newText,
      })
    case UPDATE_SUGGESTIONS:
      return Object.assign({}, prevState, { suggestions: action.suggestions })
    case SWITCH_CORPUS:
      return Object.assign({}, prevState, { corpus: action.corpus })
    case GET_CORPORA:
      return Object.assign({}, prevState, { corpora: action.corpora })
    default:
      return prevState
  }
}

const store = createStore(reducer, applyMiddleware(thunk))
export default store
