const { createStore, applyMiddleware } = Redux
const { Provider, useDispatch, useSelector } = ReactRedux
const { useEffect } = React

const { getID } = IDGenerator

// TODO: add todo editing
/* ###################################### Redux Actions & Reducers ####################################### */

const ADD_TODO = 'ADD-TODO'
const REMOVE_TODO = 'REMOVE-TODO'

const addTodo = (todo) => ({ type: ADD_TODO, payload: todo })
const removeTodo = (id) => ({ type: REMOVE_TODO, payload: { id } })

const initialState = {
    todos: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(({ id }) => id !== action.payload.id)
            }
        default:
            return state
    }
}

/* ###################################### Interceptors Middleware ####################################### */

/**
 * The middleware intercepts actions and calls the first corresponding handler with the action as a parameter.
 */
const getInterceptorsMiddleware = () => {
    const interceptors = [
        {
            type: ADD_TODO,
            /**
             * Add id prop to todo.
             */
            handler: (action, next) => next({
                ...action,
                payload: {
                    id: action.payload.id || getID(),
                    ...action.payload,
                }
            }),
        },
        {
            type: REMOVE_TODO,
            handler: (action, next) => {
                next(action)

                console.info(`Todo with ID ${action.payload.id} has been removed.`)
            },
        }
    ]

    return () => next => action => {
        try {
            const interceptor = interceptors.find(({type}) => type === action.type)

            return interceptor ? interceptor.handler(action, next) : next(action)
        } catch (error) {
            alert('Something went wrong. Please try again.')
        }
    }
}

/* ###################################### Redux Store ####################################### */

const store = createStore(reducer, applyMiddleware(getInterceptorsMiddleware()))

/* ###################################### Components ####################################### */

const App = () => {
    const dispatch = useDispatch()

    const todos = useSelector((state) => state.todos)

    useEffect(() => {
        // TODO: remove test data
        dispatch(addTodo({ title: 'todo 1', text: 'some todo text' }))
        dispatch(addTodo({ title: 'todo 2', text: 'some todo text', id: 120 }))
        dispatch(addTodo({ title: 'todo 3', text: 'some todo text', id: 125 }))
        dispatch(addTodo({ title: 'todo 4', text: 'some todo text' }))
        dispatch(addTodo({ title: 'todo 5', text: 'some todo text' }))
    }, [])

    if (!Array.isArray(todos)) return undefined

    const getRemoveTodoHandler = (todoId) => () => dispatch(removeTodo(todoId))

    const handleAddTodo = () => dispatch(addTodo({ title: 'todo title', text: 'some todo text' }))

    return (
        <main className="app">
            <div className="app__header">
                <h1>Todos App</h1>
                <button className="app__header-button round-button" onClick={handleAddTodo}>+</button>
            </div>
            <div className="app__content">
                <div className="todos-list">
                    {todos.map(({ id, title, text }) => <div key={id} className="todos-list__todo">
                        {title && <h3 className="todo__title">{title}</h3>}
                        {text && <p className="todo__description">{text}</p>}
                        <button className="todo__remove-button round-button" onClick={getRemoveTodoHandler(id)}>-</button>
                    </div>)}
                </div>
            </div>
        </main>
    )
}

const MainApp = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(<MainApp />, document.querySelector('#root'))
