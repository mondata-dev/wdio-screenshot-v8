import debug from 'debug';

import makeAreaScreenshot from './makeAreaScreenshot';
import beforeScreenshot from './beforeScreenshot';
import afterScreenshot from './afterScreenshot';

import getElements from '../utils/getElements';
import groupBoundingRect from '../utils/groupBoundingRect';
import getBoundingRect from '../scripts/getBoundingRect';

const log = debug('wdio-screenshot:makeElementScreenshot');


export default async function makeElementScreenshot(browser, elementSelector, options = {}) {
  log('start element screenshot');

  // hide scrollbars, scroll to start, hide & remove elements, wait for render
  await beforeScreenshot(browser, options);

  // get bounding rect of elements

  const elements = await getElements(elementSelector);

  const boundingRects = [];
  for (const elem of elements) {
    boundingRects.push(await browser.execute(getBoundingRect, elem))
  }

  const boundingRect = groupBoundingRect(boundingRects);

  // make screenshot of area
  const base64Image = await makeAreaScreenshot(browser, boundingRect.left, boundingRect.top, boundingRect.right, boundingRect.bottom);

  // show scrollbars, show & add elements
  await afterScreenshot(browser, options);

  log('end element screenshot');

  return base64Image;
}
