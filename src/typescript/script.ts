const req_url: string = "https://api.dictionaryapi.dev/api/v2/entries";

interface Definition {
  definition: string;
  [key: string]: any;
}

interface RequestResult {
  word: string;
  definitions?: Definition[];
  phonetic?: string;
  audio_path?: string;
  error_title?: string;
  error_message?: string;
}

const form = document.getElementById("myForm") as HTMLFormElement | null;

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const search_word_field = document.getElementById(
      "inputField"
    ) as HTMLInputElement | null;
    const searchword = search_word_field ? search_word_field.value : "";
    if (searchword) {
      get_definition(req_url, "en", searchword);
    }
    if (search_word_field) search_word_field.value = "";
  });
} else {
  console.warn("Form with id 'myForm' not found in DOM.");
}

let request_result_object: RequestResult = {
  word: "",
};

async function get_definition(
  req_url: string,
  lang: string,
  word: string
): Promise<void> {
  request_result_object = {
    word: word,
  };

  try {
    const res = await fetch(`${req_url}/${lang}/${word}`);
    const data: any = await res.json();

    if (data && typeof data === "object") {
      if (data.title) {
        request_result_object.error_title = data.title;
        request_result_object.error_message =
          (data.message || "") + (data.resolution || "");
      }

      try {
        request_result_object.definitions = data[0].meanings[0].definitions;
      } catch (error) {
        // ignore
      }

      try {
        request_result_object.phonetic = data[0].phonetic;
      } catch (error) {
        // ignore
      }

      try {
        request_result_object.audio_path = data[0].phonetics[0].audio;
      } catch (error) {
        // ignore
      }
    }

    render_result(request_result_object);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function render_result(result_obj: RequestResult): void {
  const search_word_label = document.getElementById(
    "search_word_label"
  ) as HTMLElement | null;
  const definition_label = document.getElementById(
    "definition_label"
  ) as HTMLElement | null;

  if (!search_word_label || !definition_label) return;

  if (result_obj.error_title !== undefined) {
    search_word_label.innerHTML =
      result_obj.error_title + " >>" + result_obj.word + "<<";
    search_word_label.style.color = "red";

    definition_label.innerHTML = result_obj.error_message || "";
    definition_label.style.color = "red";
  } else {
    search_word_label.innerHTML =
      result_obj.word + (result_obj.phonetic ? " " + result_obj.phonetic : "");
    search_word_label.style.color = "black";

    const definition_Array = result_obj.definitions ?? [];
    definition_label.innerHTML = "";

    for (let i = 0; i < definition_Array.length; i++) {
      const def = definition_Array[i];
      const resultDiv = document.createElement("div");
      resultDiv.classList.add("rs-div");
      resultDiv.innerHTML = def.definition || "";
      definition_label.appendChild(resultDiv);
    }
    definition_label.style.color = "black";
  }
}
