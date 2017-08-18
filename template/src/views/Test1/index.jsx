import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TopBar from 'components/TopBar'

import './index.scss'

class MyComponent extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                Hello ~
                <TopBar/>
            </div>
        )
    }
}

function doRender() {
    ReactDOM.render(<MyComponent />, document.getElementById("app"));
}

setTimeout(doRender, 16);