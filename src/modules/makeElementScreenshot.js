import debug from 'debug';
import _ from 'lodash';

import makeAreaScreenshot from './makeAreaScreenshot';
import beforeScreenshot from './beforeScreenshot';
import afterScreenshot from './afterScreenshot';

import groupBoundingRect from '../utils/groupBoundingRect';
import getBoundingRects from '../scripts/getBoundingRects';

const log = debug('wdio-screenshot:makeElementScreenshot');


export default async function makeElementScreenshot(browser, elementSelector, options = {}) {
  log('start element screenshot');

  // hide scrollbars, scroll to start, hide & remove elements, wait for render
  await beforeScreenshot(browser, options);

  // get bounding rect of elements

  let elements;
  if (_.isString(elementSelector)) {
    elements = await browser.$$(elementSelector);
  } else if (_.isArray(elementSelector)) {
    elements = elementSelector
  } else {
    elements = [elementSelector];
  }

  const boundingRects = await browser.execute(getBoundingRects, elements);

  const boundingRect = groupBoundingRect(boundingRects);

  // make screenshot of area
  const base64Image = await makeAreaScreenshot(browser, boundingRect.left, boundingRect.top, boundingRect.right, boundingRect.bottom);

  // show scrollbars, show & add elements
  await afterScreenshot(browser, options);

  log('end element screenshot');

  return base64Image;
}
