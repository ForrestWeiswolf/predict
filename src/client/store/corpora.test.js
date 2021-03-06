import { expect } from 'chai'
import axios from 'axios'
import { spy } from 'sinon'
import MockAdapter from 'axios-mock-adapter'
import { selectCorpus, getCorpora, fetchCorpora } from './index'

describe('selectCorpus', () => {
  it('is a function', () => {
    expect(selectCorpus).to.be.a('function')
  })

  it('creates an action with type SELECT_CORPUS', () => {
    expect(selectCorpus('foo').type).to.equal('SELECT_CORPUS')
  })

  it('creates an action with passed argument as corpus prop', () => {
    expect(selectCorpus('foo').corpus).to.equal('foo')
  })
})

describe('getCorpora', () => {
  it('is a function', () => {
    expect(getCorpora).to.be.a('function')
  })

  it('creates an action with type GET_CORPORA', () => {
    expect(getCorpora([{ name: 'Foo', route: 'foo' }]).type).to.equal(
      'GET_CORPORA'
    )
  })

  it('creates an action with passed argument as corpora prop', () => {
    const testCorpus = { name: 'Foo', route: 'foo' }
    expect(getCorpora([testCorpus]).corpora).to.deep.equal([testCorpus])
  })
})

describe('fetchCorpora', () => {
  const testResponse = [
    { name: 'Foo', route: 'foo' },
    { name: 'bar, baz', route: 'bar_baz' },
  ]

  const replySpy = spy(config => {
    return [200, testResponse]
  })

  const mock = new MockAdapter(axios)
  mock.onGet('/api/corpora/').reply(replySpy)

  afterAll(() => {
    mock.restore()
  })

  it('is a function', () => {
    expect(fetchCorpora).to.be.a('function')
  })

  it('returns a function', () => {
    expect(fetchCorpora()).to.be.a('function')
  })

  describe('returned thunk', () => {
    let thunk
    beforeEach(() => {
      thunk = fetchCorpora()
    })

    it('calls /api/corpora', done => {
      thunk(() => {}).then(() => {
        expect(replySpy.called).to.be.true
        done()
      })
    })

    it('dispatches a GET_CORPORA with the response', done => {
      const dispatchSpy = spy()
      thunk(dispatchSpy).then(() => {
        expect(dispatchSpy.lastCall.args[0]).to.deep.equal(
          getCorpora(testResponse)
        )
        done()
      })
    })
  })
})
