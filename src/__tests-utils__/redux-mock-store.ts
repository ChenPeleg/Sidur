import {applyMiddleware} from 'redux'

const isFunction = (arg: any) => typeof arg === 'function'
const isPlainObject = (value: any) => {
    return Object.getPrototypeOf(value) === null || Object === value.constructor;
}

export const configureStore = (middlewares = []) => {
    return function mockStore(getState: any = {}) {
        function mockStoreWithoutMiddleware(): any {
            let actions: any = []
            let listeners: any = []

            const self = {
                getState() {
                    return isFunction(getState) ? getState(actions) : getState
                },

                getActions() {
                    return actions
                },

                dispatch(action: any) {
                  
                    if (!isPlainObject(action)) {
                        throw new Error(
                            'Actions must be plain objects. ' +
                            'Use custom middleware for async actions.'
                        )
                    }

                    if (typeof action.type === 'undefined') {
                        throw new Error(
                            'Actions may not have an undefined "type" property. ' +
                            'Have you misspelled a constant? ' +
                            'Action: ' +
                            JSON.stringify(action)
                        )
                    }

                    actions.push(action)

                    for (let i = 0; i < listeners.length; i++) {
                        listeners[i]()
                    }

                    return action
                },

                clearActions() {
                    actions = []
                },

                subscribe(cb: any) {
                    if (isFunction(cb)) {
                        listeners.push(cb)
                    }

                    return () => {
                        const index = listeners.indexOf(cb)

                        if (index < 0) {
                            return
                        }
                        listeners.splice(index, 1)
                    }
                },

                replaceReducer(nextReducer: any) {
                    if (!isFunction(nextReducer)) {
                        throw new Error('Expected the nextReducer to be a function.')
                    }
                }
            }

            return self
        }

        const mockStoreWithMiddleware: any = applyMiddleware(
            ...middlewares
        )(mockStoreWithoutMiddleware)

        return mockStoreWithMiddleware()
    }
}

export default configureStore
