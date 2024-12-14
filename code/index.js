(function() {
  // Create error console box
  const errorBox = document.createElement("div");
  errorBox.id = "errorBox";
  errorBox.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; right: 20px; height: 300px;
        background-color: #1e1e1e; color: white; border: 2px solid aqua;
        font-family: monospace; padding: 10px; z-index: 10000; overflow: hidden;
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
      undefined: "It seems you're trying to use something that hasn't been defined. Make sure all variables or functions exist.",
      syntax: "There's a typo or error in how the code is written. Check for missing brackets, commas, or quotes.",
      null: "You're trying to access something that doesn't exist yet. A 'null' means it's intentionally empty.",
      "is not a function": "You're calling something as if it's a function, but it isn't. Double-check your code.",
      "type error": "A value is being used incorrectly. For example, adding numbers to strings may cause this.",
      "reference error": "You're using a variable that hasn't been declared or is outside your scope.",
      "range error": "A number or array is too big or out of range for the operation you're doing.",
    };
    for (let key in explanations) {
      if (message.toLowerCase().includes(key)) return explanations[key];
    }
    return "Oops! Something went wrong. Review your code and try again.";
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
      <p><strong>Explanation:</strong> ${explanation}</p>
      <p><strong>Location:</strong> ${source}:${lineno}:${colno}</p>
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
  }

  // Execute Code
  runButton.onclick = function() {
    const userCode = input.value.trim();
    if (!userCode) return;

    try {
      const result = eval(userCode);
      if (result !== undefined) {
        const resultItem = document.createElement("div");
        resultItem.style.cssText = `
                margin: 10px 0; padding: 10px; border-left: 4px solid #00ff00;
                background-color: #1e1e1e; color: white;
            `;
        resultItem.innerHTML = `<p><strong>Result:</strong> ${result}</p>`;
        errorContent.appendChild(resultItem);
      }
    } catch (error) {
      logError(error.message, "", "", "", error);
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

  document.body.appendChild(errorBox);
})();
