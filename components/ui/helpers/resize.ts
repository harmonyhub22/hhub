export const initResize = (resizeObjectId:string, minWidth:number, maxWidth: number,
  leftResizerClass:string, rightResizerClass:string,
  setDeltaXLeft:any, setDeltaXRight:any) => {

  // Query the element
  const ele: HTMLElement|null = document.getElementById(resizeObjectId);

  if (ele === null || ele === undefined) {
    console.log('resizeable div not found');
    return;
  }

  // The current position of mouse
  let x: number = 0;

  // The current position of the div
  let y: number = 0;
  let initialX: number = 0;

  // The dimension of the element
  let w: number = 0;

  // The overall change in X for either left of right (only one will move at a time)
  let deltaX: number = 0;

  let mouseDown: boolean = false;

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const rightMouseDownHandler = function (e:any) {

    if (!mouseDown) {
      mouseDown = true;

      // Get the current mouse position
      x = e.clientX;

      // Calculate the dimension of element
      w = parseInt(window.getComputedStyle(ele).width, 10);

      // reset deltaX
      deltaX = ele.getBoundingClientRect().width;

      // Attach the listeners to `document`
      document.addEventListener('mousemove', rightMouseMoveHandler);
      document.addEventListener('mouseup', rightMouseUpHandler);
    }
  };

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const leftMouseDownHandler = function (e:any) {

    if (!mouseDown) {
      // Get the current mouse position
      x = e.clientX;

      // Calculate the dimension of element
      w = parseInt(window.getComputedStyle(ele).width, 10);

      // reset deltaX
      deltaX = ele.getBoundingClientRect().width;

      // get y transform
      const transform = new WebKitCSSMatrix(ele.style.transform)
      initialX = transform.m41;
      y = transform.m42;

      // Attach the listeners to `document`
      document.addEventListener('mousemove', leftMouseMoveHandler);
      document.addEventListener('mouseup', leftMouseUpHandler);
    }
  };

  const rightMouseMoveHandler = function (e:any) {
    // How far the mouse has been moved
    const dx: number = e.clientX - x;

    if (w + dx > maxWidth) {
      ele.style.width = `${maxWidth}px`;
      return;
    }
    if (w + dx < minWidth) {
      ele.style.width = `${minWidth}px`;
      return;
    }

    // Adjust the dimension of element
    ele.style.width = `${w + dx}px`;
  };

  const leftMouseMoveHandler = function (e:any) {
    // How far the mouse has been moved
    const dx: number = e.clientX - x;

    if (w - dx > maxWidth) {
      ele.style.width = `${maxWidth}px`;
      return;
    }

    if (w - dx < minWidth) {
      ele.style.width = `${minWidth}px`;
      return;
    }

    // Adjust the position and dimension of the element on the x axis
    ele.style.cssText = `transform: translate(${initialX + dx}px, ${y}px); width: ${w-dx}px`;
  };

  const rightMouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', rightMouseMoveHandler);
    document.removeEventListener('mouseup', rightMouseUpHandler);
    mouseDown = false;
    deltaX -= ele.getBoundingClientRect().width;
    console.log('deltaX', deltaX);
    setDeltaXRight(deltaX);
  };

  const leftMouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', leftMouseMoveHandler);
    document.removeEventListener('mouseup', leftMouseUpHandler);
    mouseDown = false;
    deltaX -= ele.getBoundingClientRect().width;
    console.log('deltaX', deltaX);
    setDeltaXLeft(deltaX);
  };

  // Query right resizer
  let rightResizer: Element|null = null;
  try {
    rightResizer = ele.querySelector(`.${rightResizerClass}`);
  } catch (e:any) {
    console.log('right resizer id invalid');
  }

  if (rightResizer === null || rightResizer === undefined) {
    console.log('right resizor not found');
    return;
  }

  // Add listener
  rightResizer.addEventListener('mousedown', rightMouseDownHandler);

  // Query left resizer
  let leftResizer: Element|null = null;
  try {
    leftResizer = ele.querySelector(`.${leftResizerClass}`);
  } catch (e:any) {
    console.log('left resizer id invalid');
  }

  if (leftResizer === null || leftResizer === undefined) {
    console.log('left resizor not found');
    return;
  }

  // Add listener
  leftResizer.addEventListener('mousedown', leftMouseDownHandler);
};

export const initResizeTimeline = (updateTimelineWidth:any) => {
  window.addEventListener('resize', updateTimelineWidth);
};