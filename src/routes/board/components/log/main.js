import React from 'react'

const Main = props => (
  <div style={{ border: '1px solid #eee', padding: 10, marginTop: 15 }}>
    {props.rows.map((row, index) =>
      <div key={index} style={{ borderBottom: '1px solid #eee', marginBottom: 15 }}>
        {row}
      </div>
    )}
  </div>
)

export default Main
