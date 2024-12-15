(function() {
  // Create error console box
  const errorBox = document.createElement("div");
  errorBox.id = "errorBox";
  errorBox.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; right: 20px; height: 300px;
        background-color: #1e1e1e; color: white; border: 2px solid aqua;
        font-family: monospace; padding: 10px; z-index: 10000; overflow-y: auto;
        display: flex; flex-direction: column; gap: 10px;
    `;

  // Header with title
  const header = document.createElement("h3");
  header.innerText = "CONSOLE";
  header.style.cssText = `
        margin: 0; padding: 5px; font-size: 16px; text-align: center;
        background-color: aqua; color: black;
    `;
  errorBox.appendChild(header);

  // Input and RUN button container
  const inputContainer = document.createElement("div");
  inputContainer.style.cssText = `
        display: flex; gap: 10px; align-items: center;
    `;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter JavaScript code here...";
  input.style.cssText = `
        flex: 1; padding: 5px; border: 1px solid aqua; background-color: #333;
        color: white; font-family: monospace;
    `;
  const runButton = document.createElement("button");
  runButton.innerText = "RUN";
  runButton.style.cssText = `
        padding: 5px 10px; border: 1px solid aqua; background-color: aqua;
        color: black; font-weight: bold; cursor: pointer;
    `;
  inputContainer.appendChild(input);
  inputContainer.appendChild(runButton);
  errorBox.appendChild(inputContainer);

  // Search bar
  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.placeholder = "Search logs...";
  searchBox.style.cssText = `
        padding: 5px; border: 1px solid aqua; background-color: #292929;
        color: white; font-family: monospace; margin-bottom: 5px;
    `;
  errorBox.appendChild(searchBox);

  // Error container
  const errorContent = document.createElement("div");
  errorContent.style.cssText = `
        flex: 1; overflow-y: auto; background-color: #292929; padding: 10px;
        border: 1px solid gray; word-wrap: break-word; color: white;
    `;
  errorBox.appendChild(errorContent);

  // Hide/Show Button
  const hideShowButton = document.createElement("button");
  hideShowButton.innerText = "Hide Console";
  hideShowButton.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; padding: 10px 15px;
        background-color: black; color: white; border: 1px solid gray;
        cursor: pointer; z-index: 10001;
    `;
  document.body.appendChild(hideShowButton);

  let isConsoleVisible = true;
  hideShowButton.onclick = function() {
    isConsoleVisible = !isConsoleVisible;
    errorBox.style.display = isConsoleVisible ? "flex" : "none";
    hideShowButton.innerText = isConsoleVisible ? "Hide Console" : "Show Console";
  };

  // Error explanations
  function getSimpleExplanation(message) {
    const explanations = {
      "undefined": "You attempted to use a variable or function that has not been declared or initialized.",
      "syntax": "There's a syntax error in your code. This means JavaScript can't interpret it.",
      "null": "A null value was used where an object or value was expected.",
      "is not a function": "You tried to call something as a function that is not callable.",
      "type error": "A value is being used in an unexpected way based on its type.",
      "reference error": "A variable or object is being used but hasn't been declared in scope.",
      "range error": "A number is out of its allowable range."
    };
    for (let key in explanations) {
      if (message.toLowerCase().includes(key)) return explanations[key];
    }
    return "An unknown error occurred. Review your code.";
  }

  // Scroll to latest message
  function scrollToLatest() {
    setTimeout(() => {
      errorContent.scrollTop = errorContent.scrollHeight;
    }, 0);
  }

  // Log Errors
  function logError(message, source, lineno, colno, error) {
    const errorItem = document.createElement("div");
    errorItem.style.cssText = `
            margin: 10px 0; padding: 10px; border-left: 4px solid red;
            background-color: #1e1e1e;
        `;
    const explanation = getSimpleExplanation(message);

    errorItem.innerHTML = `
      <p><strong>Error:</strong> ${message}</p>
      <p><strong>Location:</strong> ${source}:${lineno}:${colno}</p>
      <p><strong>Explanation:</strong> ${explanation}</p>
    `;

    if (error?.stack) {
      const stackTrace = document.createElement("details");
      const summary = document.createElement("summary");
      summary.innerText = "View Stack Trace";
      stackTrace.appendChild(summary);
      stackTrace.innerHTML += `<pre style="color: aqua; margin-top: 5px;">${error.stack}</pre>`;
      errorItem.appendChild(stackTrace);
    }
    errorContent.appendChild(errorItem);
    scrollToLatest();
  }

  // Override console.log to capture and display messages
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    const logItem = document.createElement("div");
    logItem.style.cssText = `
            margin: 10px 0; padding: 10px; border-left: 4px solid green;
            background-color: #1e1e1e; color: white;
        `;
    logItem.innerHTML = `<p><strong>Log:</strong> ${args.join(' ')}</p>`;
    errorContent.appendChild(logItem);
    scrollToLatest();
    originalConsoleLog.apply(console, args);
  };

  // Override console.error to capture and display errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorItem = document.createElement("div");
    errorItem.style.cssText = `
            margin: 10px 0; padding: 10px; border-left: 4px solid red;
            background-color: #1e1e1e; color: white;
        `;
    errorItem.innerHTML = `<p><strong>Error:</strong> ${args.join(' ')}</p>`;
    errorContent.appendChild(errorItem);
    scrollToLatest();
    originalConsoleError.apply(console, args);
  };

  // Execute Code
  runButton.onclick = function() {
    const userCode = input.value.trim();
    if (!userCode) return;

    try {
      const result = eval(userCode);
      if (result !== undefined) {
        const resultItem = document.createElement("div");
        resultItem.style.cssText = `
                margin: 10px 0; padding: 10px; border-left: 4px solid green;
                background-color: #1e1e1e; color: white;
            `;
        resultItem.innerHTML = `<p><strong>Result:</strong> ${result}</p>`;
        errorContent.appendChild(resultItem);
        scrollToLatest();
      }
    } catch (error) {
      logError(error.message, '', '', '', error);
    }
  };

  // Search Functionality
  searchBox.oninput = function() {
    const query = searchBox.value.toLowerCase();
    const logs = errorContent.children;
    for (let log of logs) {
      const text = log.textContent.toLowerCase();
      log.style.display = text.includes(query) ? "block" : "none";
    }
  };

  // Catch Uncaught Errors
  window.onerror = function(message, source, lineno, colno, error) {
    logError(message, source, lineno, colno, error);
  };

  // Append errorBox to body
  document.body.appendChild(errorBox);
})();
