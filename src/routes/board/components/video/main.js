/* eslint react/jsx-no-target-blank: 0 */
/* eslint react/no-unknown-property: 0 */
/* eslint jsx-a11y/iframe-has-title: 0 */
import React from 'react'

const Main = () => (
  <div className="iv-embed" style={{ margin: '0 auto', padding: 0, border: 0, width: 642 }}>
    <div className="iv-v" style={{ display: 'block', margin: 0, padding: 1, border: 0, background: '#000' }}>
      <iframe className="iv-i" style={{ display: 'block', margin: 0, padding: 0, border: 0 }} src="https://open.ivideon.com/embed/v2/?server=100-EBBc8x5nYs9oYyXO8E4wkt&amp;camera=0&amp;width=&amp;height=&amp;lang=ru" width="640" height="360" frameborder="0" allowfullscreen />
    </div>
    <div className="iv-b" style={{ display: 'block', margin: 0, padding: 0, border: 0 }}>
      <div style={{ float: 'right', textAlign: 'right', padding: '0 0 10px', lineHeight: 10 }}>
        <a className="iv-a" style={{ font: '10px Verdana,sans-serif', color: 'inherit', opacity: 0.6 }} href="https://www.ivideon.com/" target="_blank">
          Powered by Ivideon
        </a>
      </div>
      <div style={{ clear: 'both', height: 0, overflow: 'hidden' }}>&nbsp;</div>
      <script src="https://open.ivideon.com/embed/v2/embedded.js" />
    </div>
  </div>
)

export default Main
