import React from 'react'
import { connect } from 'react-redux'

const Container = (props) => {
  const { children } = props
  return (<div>
    {children}
  </div>)
}

export default connect()(Container)
