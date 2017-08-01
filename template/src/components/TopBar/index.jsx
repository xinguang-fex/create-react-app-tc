import React, {Component} from 'react'

import './index.scss'

export default class MyComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="top-bar">
                I am TopBar.
            </div>
        )
    }
}
