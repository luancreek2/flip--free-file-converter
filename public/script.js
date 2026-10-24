const webroot = document.querySelector("meta[name='webroot']").content;
const fileInput = document.querySelector('input[type="file"]');
const dropZone = document.getElementById("dropzone");
const convertButton = document.querySelector("input[type='submit']");
const fileNames = [];
let fileType;
let pendingFiles = 0;
let formatSelected = false;
let formatsLoading = false;
const preset = new URLSearchParams(window.location.search);
const normalizeInput = (value) =>
  ({ jpg: "jpeg", jfif: "jpeg", md: "markdown", tex: "latex", htm: "html" })[value.toLowerCase()] ||
  value.toLowerCase();
const updateWorkspace = () => {
  const count = fileNames.length;
  document.getElementById("file-empty")?.classList.toggle("hidden", count > 0);
  const counter = document.getElementById("file-count");
  if (counter) counter.textContent = `${count} ${count === 1 ? "file" : "files"}`;
  const failed = document.querySelector('#file-list tr[data-state="failed"]');
  convertButton.disabled =
    pendingFiles > 0 || formatsLoading || !formatSelected || count === 0 || Boolean(failed);
  convertButton.value = pendingFiles > 0 ? "Uploading…" : "Convert Files";
  const status = document.getElementById("upload-status");
  if (status)
    status.textContent =
      pendingFiles > 0
        ? "Uploading files to this server…"
        : failed
          ? "An upload failed. Remove that file and try uploading it again."
          : count > 0
            ? "Files uploaded. Choose a format to continue."
            : "Choose files above to get started.";
};

const help = document.getElementById("format-help");
if (help && preset.get("from") && preset.get("to")) {
  help.textContent = `Suggested conversion: ${preset.get("from").toUpperCase()} to ${preset.get("to").toUpperCase()}. Upload a matching input file to confirm available formats.`;
}

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const files = e.dataTransfer.files;

  if (files.length === 0) {
    console.warn("No files dropped — likely a URL or unsupported source.");
    return;
  }

  for (const file of files) {
    console.log("Handling dropped file:", file.name);
    handleFile(file);
  }
});

// Extracted handleFile function for reusability in drag-and-drop and file input
function handleFile(file) {
  const fileList = document.querySelector("#file-list");

  if (fileNames.includes(file.name)) {
    document.getElementById("upload-status").textContent =
      "That filename is already in this batch. Remove it first or rename the new file.";
    return;
  }
  const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
  if (
    fileType !== undefined &&
    fileType !== null &&
    normalizeInput(extension) !== normalizeInput(fileType)
  ) {
    document.getElementById("upload-status").textContent =
      "Please use one input format per batch. Remove the existing files to change formats.";
    return;
  }

  const row = document.createElement("tr");
  row.innerHTML = `
    <td></td>
    <td><progress max="100" class="inline-block h-2 appearance-none overflow-hidden rounded-full border-0 bg-neutral-700 bg-none text-accent-500 accent-accent-500 [&::-moz-progress-bar]:bg-accent-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:[background:none] [&[value]::-webkit-progress-value]:bg-accent-500 [&[value]::-webkit-progress-value]:transition-[inline-size]"></progress></td>
    <td></td>
    <td><button type="button" disabled>Remove</button></td>
  `;
  // Filenames are untrusted: never interpolate them into HTML.
  row.children[0].textContent = file.name;
  row.children[2].textContent = `${(file.size / 1024).toFixed(2)} kB`;
  row.querySelector("progress").setAttribute("aria-label", `Upload progress for ${file.name}`);
  row.querySelector("button").addEventListener("click", (event) => deleteRow(event.currentTarget));
  row.dataset.state = "uploading";

  if (!fileType) {
    fileType = extension;
    formatSelected = false;
    formatsLoading = true;
    document.querySelector("input[name='convert_to_search']").disabled = true;
    const requestedType = fileType;
    fileInput.setAttribute("accept", `.${fileType}`);
    setTitle();

    fetch(`${webroot}/conversions`, {
      method: "POST",
      body: JSON.stringify({ fileType }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Format lookup failed");
        return res.text();
      })
      .then((html) => {
        if (fileType !== requestedType) return;
        formatSelected = false;
        selectContainer.innerHTML = html;
        formatsLoading = false;
        document.querySelector("input[name='convert_to_search']").disabled = false;
        updateSearchBar();
        updateWorkspace();
        if (!selectContainer.querySelector(".target") && help) {
          help.textContent =
            "No output formats are registered for this file type. Remove the files and try another input format.";
        }
        const desiredInput = preset.get("from");
        const desiredTarget = preset.get("to");
        if (
          desiredInput &&
          desiredTarget &&
          normalizeInput(fileType) === normalizeInput(desiredInput)
        ) {
          const target = Array.from(selectContainer.querySelectorAll(".target")).find(
            (button) => button.dataset.target === desiredTarget,
          );
          target?.click();
        }
      })
      .catch(() => {
        if (help && fileType === requestedType)
          help.textContent = "Could not load supported formats. Please reload and try again.";
      });
  }

  fileList.appendChild(row);
  file.htmlRow = row;
  fileNames.push(file.name);
  uploadFile(file);
}

const selectContainer = document.querySelector("form .select_container");

const updateSearchBar = () => {
  const convertToInput = document.querySelector("input[name='convert_to_search']");
  const convertToPopup = document.querySelector(".convert_to_popup");
  const convertToGroupElements = document.querySelectorAll(".convert_to_group");
  const convertToGroups = {};
  const convertToElement = document.querySelector("select[name='convert_to']");

  const showMatching = (search) => {
    for (const [targets, groupElement] of Object.values(convertToGroups)) {
      let matchingTargetsFound = 0;
      for (const target of targets) {
        if (target.dataset.target.includes(search)) {
          matchingTargetsFound++;
          target.classList.remove("hidden");
          target.classList.add("flex");
        } else {
          target.classList.add("hidden");
          target.classList.remove("flex");
        }
      }

      if (matchingTargetsFound === 0) {
        groupElement.classList.add("hidden");
        groupElement.classList.remove("flex");
      } else {
        groupElement.classList.remove("hidden");
        groupElement.classList.add("flex");
      }
    }
  };

  for (const groupElement of convertToGroupElements) {
    const groupName = groupElement.dataset.converter;

    const targetElements = groupElement.querySelectorAll(".target");
    const targets = Array.from(targetElements);

    for (const target of targets) {
      target.onmousedown = (event) => event.preventDefault();
      target.onclick = () => {
        if (formatsLoading) return;
        convertToElement.value = target.dataset.value;
        convertToInput.value = `${target.dataset.target} using ${target.dataset.converter}`;
        formatSelected = true;
        updateWorkspace();
        showMatching("");
        convertToInput.focus();
        convertToPopup.classList.add("hidden");
        convertToPopup.classList.remove("flex");
      };
    }

    convertToGroups[groupName] = [targets, groupElement];
  }

  convertToInput.oninput = (e) => {
    formatSelected = false;
    convertToElement.value = "";
    updateWorkspace();
    showMatching(e.target.value.toLowerCase());
  };

  convertToInput.onsearch = () => {
    // when the user clears the search bar using the 'x' button
    convertButton.disabled = true;
    formatSelected = false;
  };

  convertToInput.onblur = (e) => {
    // Keep the popup open even when clicking on a target button
    // for a split second to allow the click to go through
    if (e?.relatedTarget?.classList?.contains("target")) {
      return;
    }

    convertToPopup.classList.add("hidden");
    convertToPopup.classList.remove("flex");
  };

  convertToInput.onfocus = () => {
    convertToPopup.classList.remove("hidden");
    convertToPopup.classList.add("flex");
  };
  convertToPopup.onkeydown = (event) => {
    if (event.key === "Escape") {
      convertToInput.focus();
      convertToPopup.classList.add("hidden");
      convertToPopup.classList.remove("flex");
    }
  };
};

// Add a 'change' event listener to the file input element
fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  for (const file of files) {
    handleFile(file);
  }
});

const setTitle = () => {
  const title = document.getElementById("workspace-title");
  if (title)
    title.textContent = fileType
      ? `Your ${fileType.toUpperCase()} files. A new possibility.`
      : "Ready when you are.";
};

// Add a onclick for the delete button
const deleteRow = (target) => {
  const filename = target.parentElement.parentElement.children[0].textContent;
  const row = target.parentElement.parentElement;
  row.remove();

  // remove from fileNames
  const index = fileNames.indexOf(filename);
  fileNames.splice(index, 1);

  // reset fileInput
  fileInput.value = "";

  // if fileNames is empty, reset fileType
  if (fileNames.length === 0) {
    fileType = null;
    formatSelected = false;
    formatsLoading = false;
    document.querySelector("input[name='convert_to_search']").disabled = false;
    document.querySelector("input[name='convert_to_search']").value = "";
    fileInput.removeAttribute("accept");
    convertButton.disabled = true;
    setTitle();
  }

  fetch(`${webroot}/delete`, {
    method: "POST",
    body: JSON.stringify({ filename: filename }),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  updateWorkspace();
};

const uploadFile = (file) => {
  convertButton.disabled = true;
  pendingFiles += 1;
  updateWorkspace();

  const formData = new FormData();
  formData.append("file", file, file.name);

  let xhr = new XMLHttpRequest();

  xhr.open("POST", `${webroot}/upload`, true);

  xhr.onload = () => {
    file.htmlRow.dataset.state = xhr.status >= 200 && xhr.status < 300 ? "ready" : "failed";
  };

  xhr.upload.onprogress = (e) => {
    let sent = e.loaded;
    let total = e.total;
    console.log(`upload progress (${file.name}):`, (100 * sent) / total);

    let progressbar = file.htmlRow.getElementsByTagName("progress");
    if (e.lengthComputable && total > 0 && progressbar[0])
      progressbar[0].value = (100 * sent) / total;
  };

  xhr.onerror = () => {
    file.htmlRow.dataset.state = "failed";
  };
  xhr.onabort = () => {
    file.htmlRow.dataset.state = "failed";
  };
  xhr.onloadend = () => {
    pendingFiles -= 1;
    file.htmlRow.children[1].textContent =
      file.htmlRow.dataset.state === "ready" ? "Uploaded" : "Failed";
    file.htmlRow.querySelector("button").disabled = false;
    updateWorkspace();
  };

  xhr.send(formData);
};

const formConvert = document.querySelector(`form[action='${webroot}/convert']`);

formConvert.addEventListener("submit", (event) => {
  updateWorkspace();
  if (convertButton.disabled) {
    event.preventDefault();
    return;
  }
  const hiddenInput = document.querySelector("input[name='file_names']");
  hiddenInput.value = JSON.stringify(fileNames);
});

updateSearchBar();
