import React, {Component} from 'react'
import ReactDOM from 'react-dom'
export class MyComponent extends Component {
    render() {
        return (
            <div>
                Hello
            </div>
        )
    }
}

function doRender() {
    ReactDOM.render(<MyComponent />, document.getElementById("app"));
}

setTimeout(doRender, 16);