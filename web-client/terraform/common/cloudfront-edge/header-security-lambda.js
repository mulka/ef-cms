/**
 * adds headers
 *
 * @param {object} awsEvent the AWS event object
 * @param {object} handlerContext the context
 * @param {object} callback the callback
 */
exports.handler = (awsEvent, handlerContext, callback) => {
  //Get contents of response
  const { request, response } = awsEvent.Records[0].cf;
  const { headers } = response;
  const { headers: requestHeaders } = request;

  let allowedDomain;
  if (
    requestHeaders['x-allowed-domain'] &&
    requestHeaders['x-allowed-domain'][0] &&
    requestHeaders['x-allowed-domain'][0].value
  ) {
    allowedDomain = requestHeaders['x-allowed-domain'][0].value;
  }
  const allowedDomainString = allowedDomain || '';

  //Set new headers
  headers['strict-transport-security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubdomains; preload',
    },
  ];
  const applicationUrl = `https://${allowedDomainString}`;
  const subdomainsUrl = `https://*.${allowedDomainString}`;
  const cognitoUrl = 'https://*.auth.us-east-1.amazoncognito.com';
  const dynamsoftUrlStaging = 'https://dynamsoft-lib.stg.ef-cms.ustaxcourt.gov';
  const dynamsoftUrlProd = 'https://dynamsoft-lib.dawson.ustaxcourt.gov';
  const websocketUrl = `wss://*.${allowedDomainString}`;
  const localUrl = 'https://127.0.0.1:*';
  const localWebsocketUrl = 'ws://127.0.0.1:*';
  const s3Url = 'https://s3.us-east-1.amazonaws.com';
  const statuspageUrl = 'https://lynmjtcq5px1.statuspage.io';
  const contentSecurityPolicy = [
    'base-uri resource://pdf.js',
    `connect-src ${subdomainsUrl} ${applicationUrl} ${cognitoUrl} ${s3Url} ${dynamsoftUrlProd} ${dynamsoftUrlStaging} ${localUrl} ${websocketUrl} ${localWebsocketUrl}`,
    "default-src 'none'",
    "manifest-src 'self'",
    `form-action ${applicationUrl} ${subdomainsUrl}`,
    `object-src ${subdomainsUrl} ${applicationUrl} ${s3Url}`,
    `script-src 'self' 'unsafe-inline' ${dynamsoftUrlProd} ${dynamsoftUrlStaging} ${statuspageUrl} resource://pdf.js`,
    'worker-src blob:',
    `style-src 'self' 'unsafe-inline' ${dynamsoftUrlProd} ${dynamsoftUrlStaging}`,
    `img-src ${applicationUrl} ${subdomainsUrl} blob: data:`,
    `font-src ${applicationUrl} ${subdomainsUrl}`,
    `frame-src ${s3Url} ${subdomainsUrl} ${statuspageUrl} blob: data:`,
    "frame-ancestors 'none'",
  ];
  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value: contentSecurityPolicy.join('; '),
    },
  ];
  headers['x-content-type-options'] = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
  ];
  headers['x-frame-options'] = [{ key: 'X-Frame-Options', value: 'DENY' }];
  headers['x-xss-protection'] = [
    { key: 'X-XSS-Protection', value: '1; mode=block' },
  ];
  headers['referrer-policy'] = [
    { key: 'Referrer-Policy', value: 'same-origin' },
  ];

  //Return modified response
  callback(null, response);
};
