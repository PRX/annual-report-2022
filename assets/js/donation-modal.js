(function (win) {
  win.egProps = {
    campaigns: [
      {
        campaignId: '529551',
    customDomain: 'give.prx.org',
        donation: {
          modal: {
            urlParams: { egfa: true },
            elementSelector: 'SELECTOR FROM YOUR WEBSITE'
          },
          // ADD ABANDON CART NUDGE CODE HERE TO ENABLE
        }
      }
    ]
  }
  win.document.body.appendChild(makeEGScript())

  /* Create the embed script */
  function makeEGScript() {
    var egScript = win.document.createElement('script')
    egScript.setAttribute('type', 'text/javascript')
    egScript.setAttribute('async', 'true')
    egScript.setAttribute('src', 'https://sdk.classy.org/embedded-giving.js')
    return egScript
  }

  /* Read URL Params from your website. This could potentially
    * be included in the embed snippet */
  function readURLParams() {
    const searchParams = new URLSearchParams(location.search)
    const validUrlParams = ['c_src', 'c_src2']
    return validUrlParams.reduce(function toURLParamsMap(urlParamsSoFar, validKey) {
      const value = searchParams.get(validKey)
      return value === null ? urlParamsSoFar : { ...urlParamsSoFar, [validKey]: value }
    }, {})
  }
})(window)
