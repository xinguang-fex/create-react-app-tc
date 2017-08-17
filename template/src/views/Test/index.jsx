import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TopBar from 'components/TopBar'

import './index.scss'

import ReactLogo from './img/react.logo.svg'

class MyComponent extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                Hello World!
                <TopBar/>
                <img className="react-logo" src={ReactLogo} alt=""/>
            </div>
        )
    }
}

function doRender() {
    ReactDOM.render(<MyComponent />, document.getElementById("app"));
}

setTimeout(doRender, 16);