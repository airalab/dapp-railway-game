import React from 'react'
import { connect } from 'react-redux'

const Container = () => (
  (
    <div>
      <h1>
        Market
      </h1>
    </div>
  )
)

function mapStateToProps(state) {
  console.log(state);
  return {
  }
}

export default connect(mapStateToProps)(Container)
