import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

class MyComponent extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log('PRODUCTION',PRODUCTION)
        return (
            <div>
                Hello World!
            </div>
        )
    }
}

function doRender() {
    ReactDOM.render(<MyComponent />, document.getElementById("app"));
}

setTimeout(doRender, 16);